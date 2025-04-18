const express = require('express');
const router = express.Router();
const {
  bookSession,
  confirmSession,
  completeSession,
  cancelSession,
  rateSession,
  getUpcomingSessions
} = require('../controllers/sessionController');
const auth = require('../middleware/auth');

// @route   POST /api/sessions/book
// @desc    Book a new session
// @access  Private (learners only)
router.post('/book', auth, bookSession);

// @route   PUT /api/sessions/:id/confirm
// @desc    Confirm a session booking
// @access  Private (instructors only)
router.put('/:id/confirm', auth, confirmSession);

// @route   POST /api/sessions/complete/:id
// @desc    Complete a session
// @access  Private (instructors only)
router.post('/complete/:id', auth, completeSession);

// @route   POST /api/sessions/cancel/:id
// @desc    Cancel a session
// @access  Private
router.post('/cancel/:id', auth, cancelSession);

// @route   POST /api/sessions/rate/:id
// @desc    Rate and review a completed session
// @access  Private (learners only)
router.post('/rate/:id', auth, rateSession);

// @route   GET /api/sessions/upcoming
// @desc    Get upcoming sessions
// @access  Private
router.get('/upcoming', auth, getUpcomingSessions);

module.exports = router;
