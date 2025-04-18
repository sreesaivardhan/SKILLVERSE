const { 
  getSkillRecommendations, 
  getInstructorRecommendations,
  getLearningPath
} = require('../utils/aiRecommendations');

// Get skill recommendations for a user
exports.getRecommendedSkills = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendations = await getSkillRecommendations(userId);
    
    res.json({
      success: true,
      recommendations
    });
  } catch (err) {
    console.error('Error in getRecommendedSkills:', err);
    res.status(500).json({
      success: false,
      message: 'Error getting skill recommendations'
    });
  }
};

// Get instructor recommendations for a skill
exports.getRecommendedInstructors = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skill } = req.params;
    
    if (!skill) {
      return res.status(400).json({
        success: false,
        message: 'Skill parameter is required'
      });
    }
    
    const recommendations = await getInstructorRecommendations(userId, skill);
    
    res.json({
      success: true,
      recommendations
    });
  } catch (err) {
    console.error('Error in getRecommendedInstructors:', err);
    res.status(500).json({
      success: false,
      message: 'Error getting instructor recommendations'
    });
  }
};

// Get personalized learning path
exports.getPersonalizedPath = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skill } = req.params;
    
    if (!skill) {
      return res.status(400).json({
        success: false,
        message: 'Skill parameter is required'
      });
    }
    
    const learningPath = await getLearningPath(userId, skill);
    
    res.json({
      success: true,
      learningPath
    });
  } catch (err) {
    console.error('Error in getPersonalizedPath:', err);
    res.status(500).json({
      success: false,
      message: 'Error generating learning path'
    });
  }
};
