import axiosInstance from '../axios';

export interface Skill {
  name: string;
  level: string;
  verified?: boolean;
}

export const skillsService = {
  // Add a new skill to user profile
  addSkill: async (skillData: { name: string; level: string }) => {
    const response = await axiosInstance.post('/api/skills', skillData);
    return response.data;
  },

  // Update an existing skill
  updateSkill: async (skillData: { name: string; level: string }) => {
    const response = await axiosInstance.put('/api/skills', skillData);
    return response.data;
  },

  // Delete a skill
  deleteSkill: async (skillName: string) => {
    const response = await axiosInstance.delete(`/api/skills/${skillName}`);
    return response.data;
  },

  // Verify a user's skill (admin/moderator only)
  verifySkill: async (userId: string, skillName: string) => {
    const response = await axiosInstance.put(`/api/skills/verify/${userId}/${skillName}`);
    return response.data;
  },

  // Get all skills categories (from frontend data)
  getSkillCategories: () => {
    return [
      { name: "Technology", color: "blue" },
      { name: "Business", color: "purple" },
      { name: "Creative", color: "pink" },
      { name: "Lifestyle", color: "green" },
      { name: "Academic", color: "amber" },
      { name: "Languages", color: "indigo" },
      { name: "Professional", color: "rose" },
      { name: "Personal Development", color: "teal" },
    ];
  },

  // Get trending skills (from frontend data for now)
  getTrendingSkills: () => {
    return [
      {
        id: 1,
        title: "Web Development with React",
        category: "Technology",
        image: "/coding-workshop.jpg",
        instructors: 12,
        rating: 4.8,
        timeCredits: 5,
        level: "Intermediate",
        trending: true,
        featured: true,
      },
      {
        id: 2,
        title: "Digital Marketing Fundamentals",
        category: "Business",
        image: "/skill-teaching.jpg",
        instructors: 8,
        rating: 4.7,
        timeCredits: 4,
        level: "Beginner",
        trending: true,
        featured: false,
      },
      // More skills can be added here
    ];
  }
};

export default skillsService;
