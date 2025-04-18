const express = require('express');
const router = express.Router();
const {
  getRecommendedSkills,
  getRecommendedInstructors,
  getPersonalizedPath
} = require('../controllers/aiController');
const auth = require('../middleware/auth');

// @route   GET /api/ai/skills/recommended
// @desc    Get skill recommendations for a user
// @access  Private
router.get('/skills/recommended', auth, getRecommendedSkills);

// @route   GET /api/ai/instructors/recommended/:skill
// @desc    Get instructor recommendations for a skill
// @access  Private
router.get('/instructors/recommended/:skill', auth, getRecommendedInstructors);

// @route   GET /api/ai/path/:skill
// @desc    Get personalized learning path for a skill
// @access  Private
router.get('/path/:skill', auth, getPersonalizedPath);

module.exports = router;
