const express = require('express');
const router = express.Router();
const { joinSession } = require('../controllers/webrtcController');
const auth = require('../middleware/auth');

// @route   GET /api/webrtc/join/:sessionId
// @desc    Join a WebRTC session room
// @access  Private (session participants only)
router.get('/join/:sessionId', auth, joinSession);

module.exports = router;
