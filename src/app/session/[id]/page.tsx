'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff, FiMessageSquare, FiX } from 'react-icons/fi';
import { RootState } from '@/lib/redux/store';
import sessionService, { Session } from '@/lib/api/services/sessionService';
import webrtcService from '@/lib/api/services/webrtcService';
import { Button } from '@/components/ui/shadcn/button';

export default function SessionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Video call states
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  // Chat states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string; time: Date }[]>([]);
  const [messageText, setMessageText] = useState('');
  
  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch session data
    const fetchSessionData = async () => {
      setLoading(true);
      try {
        // This is a placeholder - in a real app, you would fetch the session from your API
        // For now, we'll use the upcoming sessions endpoint and filter
        const sessions = await sessionService.getUpcomingSessions();
        const currentSession = sessions.find(s => s._id === params.id);
        
        if (!currentSession) {
          setError('Session not found');
          return;
        }
        
        setSession(currentSession);
        
        // Initialize WebRTC if session is confirmed
        if (currentSession.status === 'confirmed') {
          initializeVideoCall(currentSession._id);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load session data');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
    
    // Cleanup function
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      webrtcService.stop();
    };
  }, [isAuthenticated, params.id, router]);

  const initializeVideoCall = async (sessionId: string) => {
    try {
      if (!user) return;
      
      // Initialize WebRTC service
      webrtcService.initialize(sessionId, user.id);
      
      // Start local stream
      const stream = await webrtcService.startLocalStream();
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Set up remote stream handler
      const otherUserId = user.id === session?.instructor ? session?.learner : session?.instructor;
      if (otherUserId) {
        webrtcService.onRemoteStream(otherUserId, (stream) => {
          setRemoteStream(stream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        });
      }
    } catch (err) {
      console.error('Failed to initialize video call:', err);
      setError('Failed to start video call. Please check your camera and microphone permissions.');
    }
  };

  const toggleMicrophone = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted(!isMicMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = async () => {
    // Stop all media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    // Stop WebRTC service
    webrtcService.stop();
    
    // If the session is confirmed, mark it as completed (for instructor)
    if (session && session.status === 'confirmed' && user?.id === session.instructor) {
      try {
        await sessionService.completeSession(session._id);
      } catch (err) {
        console.error('Failed to complete session:', err);
      }
    }
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !user) return;
    
    const newMessage = {
      sender: user.id,
      text: messageText.trim(),
      time: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
    
    // In a real app, you would send this message through your WebRTC data channel
    // or through a separate WebSocket connection
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                {error || 'Session not found'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Unable to load the session. Please try again later.
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="container mx-auto p-4">
        <div className="flex flex-col h-[calc(100vh-6rem)]">
          {/* Session info bar */}
          <div className="bg-gray-800 rounded-t-lg p-4 flex justify-between items-center">
            <div>
              <h1 className="text-white text-xl font-semibold">{session.skill} Session</h1>
              <p className="text-gray-300">
                {new Date(session.startTime).toLocaleString()} • {session.duration} minutes
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsChatOpen(!isChatOpen)}
                variant="outline"
                size="sm"
                className="text-white border-gray-600"
              >
                <FiMessageSquare className="mr-2" />
                Chat
              </Button>
              <Button
                onClick={endCall}
                variant="destructive"
                size="sm"
              >
                <FiPhoneOff className="mr-2" />
                End Call
              </Button>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex flex-1 bg-gray-900">
            {/* Video area */}
            <div className={`flex-1 flex flex-col ${isChatOpen ? 'lg:w-3/4' : 'w-full'}`}>
              {/* Remote video (large) */}
              <div className="flex-1 bg-black relative">
                {remoteStream ? (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl text-gray-300">
                          {session.instructor === user?.id ? 'L' : 'I'}
                        </span>
                      </div>
                      <p className="text-gray-300">
                        Waiting for {session.instructor === user?.id ? 'learner' : 'instructor'} to join...
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Local video (small overlay) */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
                  {localStream ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-xl text-gray-300">
                          {user?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Video controls */}
              <div className="bg-gray-800 p-4 flex justify-center space-x-4">
                <Button
                  onClick={toggleMicrophone}
                  variant="outline"
                  className={`rounded-full p-3 ${isMicMuted ? 'bg-red-600 text-white' : 'bg-gray-700 text-white'}`}
                  aria-label={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMicMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
                </Button>
                <Button
                  onClick={toggleVideo}
                  variant="outline"
                  className={`rounded-full p-3 ${isVideoOff ? 'bg-red-600 text-white' : 'bg-gray-700 text-white'}`}
                  aria-label={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                >
                  {isVideoOff ? <FiVideoOff size={20} /> : <FiVideo size={20} />}
                </Button>
                <Button
                  onClick={endCall}
                  variant="destructive"
                  className="rounded-full p-3"
                  aria-label="End call"
                >
                  <FiPhoneOff size={20} />
                </Button>
              </div>
            </div>
            
            {/* Chat sidebar */}
            {isChatOpen && (
              <div className="w-full lg:w-1/4 bg-gray-800 border-l border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="text-white font-medium">Chat</h2>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-gray-400 hover:text-white"
                    aria-label="Close chat"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      No messages yet. Start the conversation!
                    </p>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.sender === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs rounded-lg px-4 py-2 ${
                            message.sender === user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-white'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Message input */}
                <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
                  <div className="flex">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-700 text-white rounded-l-lg px-4 py-2 focus:outline-none"
                    />
                    <Button
                      type="submit"
                      className="rounded-l-none"
                      disabled={!messageText.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
