const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  addSkill, 
  updateSkill, 
  deleteSkill, 
  verifySkill 
} = require('../controllers/skillController');

// @route   POST /api/skills
// @desc    Add a new skill
// @access  Private
router.post('/', auth, addSkill);

// @route   PUT /api/skills
// @desc    Update a skill
// @access  Private
router.put('/', auth, updateSkill);

// @route   DELETE /api/skills/:name
// @desc    Delete a skill
// @access  Private
router.delete('/:name', auth, deleteSkill);

// @route   PUT /api/skills/verify/:userId/:skillName
// @desc    Verify a user's skill (moderator/admin only)
// @access  Private
router.put('/verify/:userId/:skillName', auth, verifySkill);

module.exports = router;
