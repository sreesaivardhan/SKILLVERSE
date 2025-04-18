const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/search
// @desc    Search for instructors
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { skill, level, name } = req.query;
    
    // Base query to find instructors
    let query = { role: 'instructor' };
    
    // Add name filter if provided
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    // Add skill filter if provided
    if (skill) {
      query['skills.name'] = { $regex: skill, $options: 'i' };
      
      // Add level filter if both skill and level are provided
      if (level) {
        query['skills.level'] = level;
      }
    }
    
    const instructors = await User.find(query)
      .select('name role skills rating ratingCount availability')
      .sort({ rating: -1 });
    
    res.json(instructors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/search/skills
// @desc    Get all available skills
// @access  Private
router.get('/skills', auth, async (req, res) => {
  try {
    // Aggregate all unique skills from users
    const skills = await User.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills.name' } },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(skills.map(skill => skill._id));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
