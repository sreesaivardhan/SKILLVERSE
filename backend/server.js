const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const rateLimit = require('./middleware/rateLimit');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Export io for use in controllers
exports.io = io;

// Connect to database
connectDB();

// Init middleware
app.use(express.json({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(rateLimit);

// Define routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/webrtc', require('./routes/webrtcRoutes'));

// Setup WebRTC socket handlers
require('./controllers/webrtcController').setupSocketHandlers(io);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Port configuration
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
