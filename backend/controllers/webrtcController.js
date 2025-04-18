const Session = require('../models/Session');
const { io } = require('../server');

// Join a session room
exports.joinSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    
    // Verify session exists and user is part of it
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.instructor.toString() !== userId && 
        session.learner.toString() !== userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if session is confirmed
    if (session.status !== 'confirmed') {
      return res.status(400).json({ message: 'Session must be confirmed before joining' });
    }
    
    // Generate unique room ID if not exists
    if (!session.meetingRoom) {
      session.meetingRoom = `session-${sessionId}-${Date.now()}`;
      await session.save();
    }
    
    // Return session room details
    res.json({
      roomId: session.meetingRoom,
      userId,
      isInstructor: session.instructor.toString() === userId,
      sessionDetails: {
        skill: session.skill,
        duration: session.duration,
        startTime: session.startTime
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Setup WebRTC socket handlers
exports.setupSocketHandlers = (io) => {
  const rooms = new Map(); // Track participants in rooms
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Handle joining room
    socket.on('join-room', async (data) => {
      const { roomId, userId, username } = data;
      
      // Add user to room
      socket.join(roomId);
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      rooms.get(roomId).add({ userId, socketId: socket.id, username });
      
      // Notify others in room
      socket.to(roomId).emit('user-connected', { userId, username });
      
      // Send list of connected users to the new participant
      const participants = Array.from(rooms.get(roomId));
      socket.emit('room-users', participants);
      
      // Handle disconnection
      socket.on('disconnect', () => {
        if (rooms.has(roomId)) {
          rooms.get(roomId).delete({ userId, socketId: socket.id, username });
          if (rooms.get(roomId).size === 0) {
            rooms.delete(roomId);
          }
        }
        socket.to(roomId).emit('user-disconnected', { userId, username });
      });
      
      // Handle WebRTC signaling
      socket.on('signal', ({ to, from, signal }) => {
        io.to(to).emit('signal', {
          from,
          signal
        });
      });
      
      // Handle chat messages
      socket.on('send-message', (message) => {
        socket.to(roomId).emit('chat-message', {
          userId,
          username,
          message,
          timestamp: Date.now()
        });
      });
      
      // Handle session control (start/stop screen share, mute/unmute)
      socket.on('session-control', (action) => {
        socket.to(roomId).emit('session-control', {
          userId,
          action
        });
      });
    });
  });
};
