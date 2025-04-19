const { 
  getSkillRecommendations, 
  getInstructorRecommendations,
  getLearningPath
} = require('../utils/aiRecommendations');
const embeddingService = require('../services/embeddingService');

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

// Semantic search for skills
exports.semanticSearchSkills = async (req, res) => {
  try {
    const { query } = req.query;
    const limit = parseInt(req.query.limit) || 5;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required'
      });
    }
    
    const results = await embeddingService.findSimilarSkills(query, limit);
    
    res.json({
      success: true,
      results
    });
  } catch (err) {
    console.error('Error in semanticSearchSkills:', err);
    res.status(500).json({
      success: false,
      message: 'Error performing semantic search for skills'
    });
  }
};

// Semantic search for instructors
exports.semanticSearchInstructors = async (req, res) => {
  try {
    const { query } = req.query;
    const limit = parseInt(req.query.limit) || 5;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required'
      });
    }
    
    const results = await embeddingService.findSimilarInstructors(query, limit);
    
    res.json({
      success: true,
      results
    });
  } catch (err) {
    console.error('Error in semanticSearchInstructors:', err);
    res.status(500).json({
      success: false,
      message: 'Error performing semantic search for instructors'
    });
  }
};

// Get similarity between two skills
exports.getSkillSimilarity = async (req, res) => {
  try {
    const { skill1, skill2 } = req.body;
    
    if (!skill1 || !skill2) {
      return res.status(400).json({
        success: false,
        message: 'Both skill1 and skill2 are required'
      });
    }
    
    // Generate embeddings for both skills
    const embeddings = await embeddingService.generateEmbeddings([skill1, skill2]);
    
    // Calculate similarity
    const similarity = embeddingService.cosineSimilarity(embeddings[0], embeddings[1]);
    
    res.json({
      success: true,
      skill1,
      skill2,
      similarity
    });
  } catch (err) {
    console.error('Error in getSkillSimilarity:', err);
    res.status(500).json({
      success: false,
      message: 'Error calculating skill similarity'
    });
  }
};
