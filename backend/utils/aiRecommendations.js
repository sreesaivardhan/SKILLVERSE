const User = require('../models/User');
const Session = require('../models/Session');

// Calculate skill similarity using cosine similarity
const calculateSkillSimilarity = (skillsA, skillsB) => {
  const allSkills = new Set([...skillsA.map(s => s.name), ...skillsB.map(s => s.name)]);
  const vectorA = Array.from(allSkills).map(skill => 
    skillsA.find(s => s.name === skill)?.level ? 1 : 0
  );
  const vectorB = Array.from(allSkills).map(skill => 
    skillsB.find(s => s.name === skill)?.level ? 1 : 0
  );
  
  // Calculate cosine similarity
  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
  
  return dotProduct / (magnitudeA * magnitudeB) || 0;
};

// Get skill recommendations based on user's current skills and interests
exports.getSkillRecommendations = async (userId) => {
  try {
    // Get user's current skills
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    // Get all completed sessions for learning patterns
    const completedSessions = await Session.find({
      learner: userId,
      status: 'completed'
    }).populate('instructor');
    
    // Get similar users based on skill overlap
    const similarUsers = await User.find({
      _id: { $ne: userId },
      role: 'learner'
    });
    
    // Calculate similarity scores
    const userSimilarities = similarUsers.map(similarUser => ({
      user: similarUser,
      similarity: calculateSkillSimilarity(user.skills, similarUser.skills)
    })).sort((a, b) => b.similarity - a.similarity);
    
    // Get skills from similar users that the current user doesn't have
    const recommendedSkills = new Map();
    userSimilarities.forEach(({ user, similarity }) => {
      user.skills.forEach(skill => {
        if (!user.skills.find(s => s.name === skill.name)) {
          const currentScore = recommendedSkills.get(skill.name)?.score || 0;
          recommendedSkills.set(skill.name, {
            name: skill.name,
            score: currentScore + similarity,
            level: skill.level
          });
        }
      });
    });
    
    // Sort recommendations by score
    return Array.from(recommendedSkills.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  } catch (err) {
    console.error('Error in skill recommendations:', err);
    return [];
  }
};

// Get instructor recommendations for a specific skill
exports.getInstructorRecommendations = async (userId, skillName) => {
  try {
    // Get all instructors teaching the skill
    const instructors = await User.find({
      role: 'instructor',
      'skills.name': skillName
    });
    
    // Get completed sessions for the skill
    const completedSessions = await Session.find({
      skill: skillName,
      status: 'completed'
    }).populate('instructor');
    
    // Calculate instructor scores based on multiple factors
    const instructorScores = instructors.map(instructor => {
      // Get instructor's sessions for this skill
      const instructorSessions = completedSessions.filter(
        session => session.instructor._id.toString() === instructor._id.toString()
      );
      
      // Calculate average rating
      const avgRating = instructorSessions.length > 0
        ? instructorSessions.reduce((sum, session) => sum + (session.rating || 0), 0) / instructorSessions.length
        : 0;
      
      // Calculate success rate
      const successRate = instructorSessions.length > 0
        ? instructorSessions.filter(session => session.rating >= 4).length / instructorSessions.length
        : 0;
      
      // Calculate experience score
      const experienceScore = Math.min(instructorSessions.length / 10, 1);
      
      // Calculate availability score (number of available hours per week)
      const availabilityScore = Object.values(instructor.availability)
        .reduce((sum, day) => sum + day.length, 0) / 168;
      
      // Calculate final score
      const score = (
        avgRating * 0.4 +
        successRate * 0.3 +
        experienceScore * 0.2 +
        availabilityScore * 0.1
      );
      
      return {
        instructor,
        score,
        metrics: {
          avgRating,
          successRate,
          experienceScore,
          availabilityScore
        }
      };
    });
    
    // Sort and return top instructors
    return instructorScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ instructor, score, metrics }) => ({
        id: instructor._id,
        name: instructor.name,
        rating: instructor.rating,
        ratingCount: instructor.ratingCount,
        availability: instructor.availability,
        matchScore: Math.round(score * 100),
        metrics
      }));
  } catch (err) {
    console.error('Error in instructor recommendations:', err);
    return [];
  }
};

// Get personalized learning path
exports.getLearningPath = async (userId, targetSkill) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    // Get user's current skill level for the target skill
    const currentSkillLevel = user.skills.find(s => s.name === targetSkill)?.level || 'beginner';
    
    // Define skill levels and their order
    const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentLevelIndex = skillLevels.indexOf(currentSkillLevel);
    
    // Get successful learning paths from other users
    const successfulPaths = await Session.aggregate([
      {
        $match: {
          skill: targetSkill,
          status: 'completed',
          rating: { $gte: 4 }
        }
      },
      {
        $group: {
          _id: '$learner',
          sessions: { $push: '$$ROOT' },
          avgRating: { $avg: '$rating' }
        }
      },
      {
        $sort: { avgRating: -1 }
      }
    ]);
    
    // Analyze common patterns in successful paths
    const recommendedPath = [];
    for (let i = currentLevelIndex; i < skillLevels.length; i++) {
      const level = skillLevels[i];
      
      // Get top instructors for this level
      const instructors = await exports.getInstructorRecommendations(userId, targetSkill);
      
      // Estimate number of sessions needed based on successful paths
      const avgSessionsPerLevel = Math.ceil(
        successfulPaths.reduce((sum, path) => 
          sum + path.sessions.filter(s => s.level === level).length, 0
        ) / Math.max(successfulPaths.length, 1)
      );
      
      recommendedPath.push({
        level,
        estimatedSessions: avgSessionsPerLevel,
        recommendedInstructors: instructors.slice(0, 2),
        topics: await getRecommendedTopics(targetSkill, level)
      });
    }
    
    return recommendedPath;
  } catch (err) {
    console.error('Error in learning path generation:', err);
    return [];
  }
};

// Helper function to get recommended topics for a skill level
async function getRecommendedTopics(skill, level) {
  // This would ideally come from a curriculum database
  // For now, returning placeholder topics
  const topics = {
    beginner: ['Fundamentals', 'Basic Concepts', 'Getting Started'],
    intermediate: ['Advanced Concepts', 'Practical Applications', 'Best Practices'],
    advanced: ['Expert Techniques', 'Complex Problems', 'Industry Standards'],
    expert: ['Mastery', 'Innovation', 'Leadership']
  };
  
  return topics[level] || [];
}
