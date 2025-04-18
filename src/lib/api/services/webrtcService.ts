import io, { Socket } from 'socket.io-client';

interface PeerConnection {
  peerConnection: RTCPeerConnection;
  iceCandidates: RTCIceCandidate[];
}

class WebRTCService {
  private socket: Socket | null = null;
  private peerConnections: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private onRemoteStreamCallbacks: Map<string, (stream: MediaStream) => void> = new Map();
  private sessionId: string | null = null;
  private userId: string | null = null;

  // Initialize the WebRTC service
  initialize(sessionId: string, userId: string) {
    this.sessionId = sessionId;
    this.userId = userId;
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    this.socket = io(API_URL, {
      query: {
        sessionId,
        userId
      }
    });

    this.setupSocketListeners();
  }

  // Set up socket event listeners
  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebRTC signaling server');
    });

    this.socket.on('user-joined', (userId: string) => {
      console.log(`User ${userId} joined the session`);
      this.createPeerConnection(userId);
      this.sendOffer(userId);
    });

    this.socket.on('offer', async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
      console.log(`Received offer from ${data.from}`);
      await this.handleOffer(data.from, data.offer);
    });

    this.socket.on('answer', (data: { from: string; answer: RTCSessionDescriptionInit }) => {
      console.log(`Received answer from ${data.from}`);
      this.handleAnswer(data.from, data.answer);
    });

    this.socket.on('ice-candidate', (data: { from: string; candidate: RTCIceCandidateInit }) => {
      console.log(`Received ICE candidate from ${data.from}`);
      this.handleIceCandidate(data.from, data.candidate);
    });

    this.socket.on('user-left', (userId: string) => {
      console.log(`User ${userId} left the session`);
      this.closePeerConnection(userId);
    });
  }

  // Start the local video stream
  async startLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  // Create a peer connection for a specific user
  private createPeerConnection(userId: string) {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const peerConnection = new RTCPeerConnection(configuration);
    
    // Add local stream tracks to the peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket?.emit('ice-candidate', {
          to: userId,
          candidate: event.candidate
        });
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const callback = this.onRemoteStreamCallbacks.get(userId);
      if (callback && event.streams[0]) {
        callback(event.streams[0]);
      }
    };

    this.peerConnections.set(userId, {
      peerConnection,
      iceCandidates: []
    });

    return peerConnection;
  }

  // Send an offer to a specific user
  private async sendOffer(userId: string) {
    const peerData = this.peerConnections.get(userId);
    if (!peerData) return;

    try {
      const offer = await peerData.peerConnection.createOffer();
      await peerData.peerConnection.setLocalDescription(offer);
      
      this.socket?.emit('offer', {
        to: userId,
        offer
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  // Handle an offer from a specific user
  private async handleOffer(userId: string, offer: RTCSessionDescriptionInit) {
    let peerData = this.peerConnections.get(userId);
    
    if (!peerData) {
      const peerConnection = this.createPeerConnection(userId);
      peerData = this.peerConnections.get(userId);
    }

    if (!peerData) return;

    try {
      await peerData.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerData.peerConnection.createAnswer();
      await peerData.peerConnection.setLocalDescription(answer);
      
      this.socket?.emit('answer', {
        to: userId,
        answer
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  // Handle an answer from a specific user
  private async handleAnswer(userId: string, answer: RTCSessionDescriptionInit) {
    const peerData = this.peerConnections.get(userId);
    if (!peerData) return;

    try {
      await peerData.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      
      // Add any stored ICE candidates
      peerData.iceCandidates.forEach(candidate => {
        peerData.peerConnection.addIceCandidate(candidate);
      });
      
      // Clear stored candidates
      peerData.iceCandidates = [];
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }

  // Handle an ICE candidate from a specific user
  private async handleIceCandidate(userId: string, candidateInit: RTCIceCandidateInit) {
    const peerData = this.peerConnections.get(userId);
    if (!peerData) return;

    const candidate = new RTCIceCandidate(candidateInit);

    if (peerData.peerConnection.remoteDescription) {
      await peerData.peerConnection.addIceCandidate(candidate);
    } else {
      // Store the candidate until the remote description is set
      peerData.iceCandidates.push(candidate);
    }
  }

  // Close a peer connection with a specific user
  private closePeerConnection(userId: string) {
    const peerData = this.peerConnections.get(userId);
    if (!peerData) return;

    peerData.peerConnection.close();
    this.peerConnections.delete(userId);
    this.onRemoteStreamCallbacks.delete(userId);
  }

  // Register a callback for when a remote stream is received
  onRemoteStream(userId: string, callback: (stream: MediaStream) => void) {
    this.onRemoteStreamCallbacks.set(userId, callback);
  }

  // Stop all media streams and close all connections
  stop() {
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Close all peer connections
    this.peerConnections.forEach((peerData, userId) => {
      this.closePeerConnection(userId);
    });

    // Disconnect socket
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.sessionId = null;
    this.userId = null;
  }
}

export const webrtcService = new WebRTCService();
export default webrtcService;
