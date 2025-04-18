'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/api/axios';
import { isAuthenticated, initAuth } from '@/lib/auth';
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiAward, FiInfo } from 'react-icons/fi';

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified: boolean;
  description?: string;
}

interface User {
  _id: string;
  name: string;
  role: string;
  skills: Skill[];
}

export default function MySkillsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isEditingSkill, setIsEditingSkill] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  
  // Form state
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('beginner');
  const [skillDescription, setSkillDescription] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    // Make sure auth headers are set
    initAuth();

    // Fetch user data and skills from the backend
    const fetchUserData = async () => {
      try {
        // Get user data
        const userRes = await axiosInstance.get('/api/auth/me');
        
        // Get user skills from the skills API
        const skillsRes = await axiosInstance.get('/api/skills');
        
        // Combine user data with skills
        const userData = {
          ...userRes.data,
          skills: skillsRes.data || []
        };
        
        setUser(userData);
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.message || 'Failed to load user data');
        
        // Redirect to login if unauthorized
        if (err.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleAddSkill = () => {
    setIsAddingSkill(true);
    setIsEditingSkill(null);
    setEditingIndex(-1);
    setSkillName('');
    setSkillLevel('beginner');
    setSkillDescription('');
  };

  const handleSaveSkill = async () => {
    if (!skillName.trim()) {
      alert('Please enter a skill name');
      return;
    }

    try {
      setLoading(true);
      
      const newSkill = {
        name: skillName.trim(),
        level: skillLevel,
        verified: false,
        description: skillDescription.trim()
      };

      // Send to backend API
      await axiosInstance.post('/api/skills', newSkill);
      
      // Update local state
      if (user) {
        setUser({
          ...user,
          skills: [...user.skills, newSkill]
        });
      }
      
      // Reset form
      setIsAddingSkill(false);
      setSkillName('');
      setSkillLevel('beginner');
      setSkillDescription('');
    } catch (err: any) {
      console.error('Error adding skill:', err);
      alert(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSkill = async () => {
    if (!skillName.trim() || !user || editingIndex < 0) return;

    try {
      setLoading(true);
      
      const updatedSkill = {
        name: skillName.trim(),
        level: skillLevel,
        verified: user.skills[editingIndex].verified,
        description: skillDescription.trim()
      };

      // Send to backend API
      await axiosInstance.put(`/api/skills/${editingIndex}`, updatedSkill);
      
      // Update local state
      const updatedSkills = [...user.skills];
      updatedSkills[editingIndex] = updatedSkill;
      
      setUser({
        ...user,
        skills: updatedSkills
      });
      
      // Reset form
      setIsEditingSkill(null);
      setEditingIndex(-1);
      setSkillName('');
      setSkillLevel('beginner');
      setSkillDescription('');
    } catch (err: any) {
      console.error('Error updating skill:', err);
      alert(err.response?.data?.message || 'Failed to update skill');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (index: number) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      setLoading(true);
      
      // Send to backend API
      await axiosInstance.delete(`/api/skills/${index}`);
      
      // Update local state
      const updatedSkills = user.skills.filter((_, i) => i !== index);
      
      setUser({
        ...user,
        skills: updatedSkills
      });
    } catch (err: any) {
      console.error('Error deleting skill:', err);
      alert(err.response?.data?.message || 'Failed to delete skill');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSkill = (skill: Skill, index: number) => {
    setIsEditingSkill(skill.name);
    setEditingIndex(index);
    setIsAddingSkill(false);
    setSkillName(skill.name);
    setSkillLevel(skill.level);
    setSkillDescription(skill.description || '');
  };

  const handleCancelEdit = () => {
    setIsEditingSkill(null);
    setEditingIndex(-1);
    setIsAddingSkill(false);
    setSkillName('');
    setSkillLevel('beginner');
    setSkillDescription('');
  };
    setUser({
      ...user,
      skills: updatedSkills
    });
  };

  const handleSubmitSkill = () => {
    if (!user) return;
    
    if (isAddingSkill) {
      // Check if skill already exists
      if (user.skills.some(skill => skill.name.toLowerCase() === skillName.toLowerCase())) {
        setError('This skill already exists in your profile');
        return;
      }
      
      // Add new skill
      const newSkill: Skill = {
        name: skillName,
        level: skillLevel,
        verified: false,
        description: skillDescription
      };
      
      setUser({
        ...user,
        skills: [...user.skills, newSkill]
      });
      
      setIsAddingSkill(false);
    } else if (isEditingSkill) {
      // Update existing skill
      const updatedSkills = user.skills.map(skill => 
        skill.name === isEditingSkill 
          ? { ...skill, name: skillName, level: skillLevel, description: skillDescription }
          : skill
      );
      
      setUser({
        ...user,
        skills: updatedSkills
      });
      

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Skills</h1>
        <button
          onClick={handleAddSkill}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiPlus className="mr-2 -ml-1 h-5 w-5" />
          Add Skill
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Skill form */}
      {(isAddingSkill || isEditingSkill) && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">
              {isAddingSkill ? 'Add New Skill' : 'Edit Skill'}
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="skillName" className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  id="skillName"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., JavaScript, Python, UI Design"
                />
              </div>

              <div>
                <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Proficiency Level
                </label>
                <select
                  id="skillLevel"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as any)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label htmlFor="skillDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="skillDescription"
                  value={skillDescription}
                  onChange={(e) => setSkillDescription(e.target.value)}
                  rows={3}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Describe your experience and expertise with this skill"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={isAddingSkill ? handleSaveSkill : handleUpdateSkill}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isAddingSkill ? 'Add Skill' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Skills list */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {user?.skills.length === 0 ? (
            <li className="p-6 text-center text-gray-500">
              <div className="flex justify-center mb-4">
                <FiAward className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h3>
              <p className="text-gray-500 mb-4">Add your first skill to start teaching or learning on SkillVerse.</p>
              <button
                onClick={handleAddSkill}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                Add Skill
              </button>
            </li>
          ) : (
            user?.skills.map((skill, index) => (
              <li key={skill.name} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">{skill.name}</h3>
                      {skill.verified && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <FiCheckCircle className="mr-1 h-3 w-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                    {skill.description && (
                      <p className="mt-2 text-sm text-gray-500">{skill.description}</p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={() => handleEditSkill(skill, index)}
                      className="mr-2 inline-flex items-center p-1.5 border border-gray-300 rounded-full text-gray-500 hover:text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(index)}
                      className="inline-flex items-center p-1.5 border border-gray-300 rounded-full text-gray-500 hover:text-red-700 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      
      {/* Verification info */}
      {user?.skills.some(skill => !skill.verified) && (
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiInfo className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Skill Verification</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  To teach a skill on SkillVerse, it needs to be verified by our team. 
                  Submit your skills for verification to start earning time credits by teaching others.
                </p>
                <button
                  className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Request Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
