const express = require('express');
const router = express.Router();
const {
  getRecommendedSkills,
  getRecommendedInstructors,
  getPersonalizedPath,
  semanticSearchSkills,
  semanticSearchInstructors,
  getSkillSimilarity
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

// @route   GET /api/ai/search/skills
// @desc    Semantic search for skills
// @access  Public
router.get('/search/skills', semanticSearchSkills);

// @route   GET /api/ai/search/instructors
// @desc    Semantic search for instructors
// @access  Public
router.get('/search/instructors', semanticSearchInstructors);

// @route   POST /api/ai/skills/similarity
// @desc    Get similarity between two skills
// @access  Private
router.post('/skills/similarity', auth, getSkillSimilarity);

module.exports = router;
