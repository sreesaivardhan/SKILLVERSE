const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Session = require('../models/Session');

/**
 * @route   GET api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', auth, async (req, res) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user.id;

    // Find all sessions where the user is either instructor or learner
    const sessions = await Session.find({
      $or: [
        { instructor: userId },
        { learner: userId }
      ]
    });

    // Calculate statistics
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(session => session.status === 'completed').length;
    const upcomingSessions = sessions.filter(session => session.status === 'scheduled').length;
    
    // Calculate credits earned (as instructor) and spent (as learner)
    let totalCreditsEarned = 0;
    let totalCreditsSpent = 0;

    sessions.forEach(session => {
      if (session.status === 'completed') {
        if (session.instructor.toString() === userId) {
          totalCreditsEarned += session.creditCost || 0;
        }
        if (session.learner.toString() === userId) {
          totalCreditsSpent += session.creditCost || 0;
        }
      }
    });

    // Return statistics
    res.json({
      totalSessions,
      completedSessions,
      upcomingSessions,
      totalCreditsEarned,
      totalCreditsSpent
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET api/users/instructors
 * @desc    Get all instructors
 * @access  Public
 */
router.get('/instructors', async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' })
      .select('-password')
      .populate('skills');
    
    res.json(instructors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET api/users/time-credits
 * @desc    Get user time credits history
 * @access  Private
 */
router.get('/time-credits', auth, async (req, res) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user.id;

    // Find the user
    const user = await User.findById(userId).select('credits');
    
    // Find all completed sessions where the user is either instructor or learner
    const sessions = await Session.find({
      status: 'completed',
      $or: [
        { instructor: userId },
        { learner: userId }
      ]
    }).sort({ startTime: -1 }); // Sort by date, newest first
    
    // Format transactions
    const transactions = sessions.map(session => {
      const isInstructor = session.instructor.toString() === userId;
      return {
        id: session._id,
        date: session.startTime,
        description: `${isInstructor ? 'Earned from' : 'Spent on'} ${session.skill} session`,
        amount: isInstructor ? session.creditCost : -session.creditCost,
        sessionId: session._id,
        type: isInstructor ? 'earned' : 'spent'
      };
    });

    // Return credits and transactions
    res.json({
      currentCredits: user.credits,
      transactions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
