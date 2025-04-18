// Load environment variables
require('dotenv').config();

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const rateLimit = require('./middleware/rateLimit');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { swaggerUi, swaggerDocs } = require('./config/swagger');

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
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "blob:"],
    },
  },
}));
app.use(rateLimit);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SkillVerse API' });
});

// Test MongoDB connection
app.get('/api/test-db', async (req, res) => {
  try {
    // Check if we can access the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({ 
      success: true, 
      message: 'Connected to MongoDB successfully',
      collections: collections.map(c => c.name)
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to connect to MongoDB',
      error: err.message
    });
  }
});

// Define routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/webrtc', require('./routes/webrtcRoutes'));

// Setup WebRTC socket handlers
require('./controllers/webrtcController').setupSocketHandlers(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

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
