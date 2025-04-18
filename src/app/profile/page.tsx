'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/api/axios';

// Types
interface Skill {
  name: string;
  level: string;
  verified?: boolean;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  skills: Skill[];
  credits: number;
  availability: {
    [key: string]: number[];
  };
  rating: number;
  ratingCount: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: [] as Skill[],
    availability: {} as { [key: string]: number[] }
  });
  
  // New skill state
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 'beginner'
  });

  // Days of the week for availability
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0-23 hours
  
  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Set default auth header
    axiosInstance.defaults.headers.common['x-auth-token'] = token;

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/api/users/me');
        setUser(res.data);
        
        // Initialize form data
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          skills: res.data.skills || [],
          availability: res.data.availability || {}
        });
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
        
        // Redirect to login if unauthorized
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewSkillChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    
    // Check if skill already exists
    const exists = formData.skills.some(
      skill => skill.name.toLowerCase() === newSkill.name.toLowerCase()
    );
    
    if (exists) {
      setError('This skill already exists in your profile');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { ...newSkill }]
    }));
    
    // Reset new skill form
    setNewSkill({
      name: '',
      level: 'beginner'
    });
    
    setError('');
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const toggleAvailability = (day: string, hour: number) => {
    setFormData(prev => {
      const currentAvailability = { ...prev.availability };
      
      // Initialize day array if it doesn't exist
      if (!currentAvailability[day]) {
        currentAvailability[day] = [];
      }
      
      // Toggle hour
      if (currentAvailability[day].includes(hour)) {
        currentAvailability[day] = currentAvailability[day].filter(h => h !== hour);
      } else {
        currentAvailability[day] = [...currentAvailability[day], hour].sort((a, b) => a - b);
      }
      
      return {
        ...prev,
        availability: currentAvailability
      };
    });
  };

  const saveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await axiosInstance.put('/api/users/me', formData);
      setUser(res.data);
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
            {success}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8" id="skills">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newSkill.name}
                  onChange={handleNewSkillChange}
                  placeholder="e.g. JavaScript, Photography, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Level
                </label>
                <select
                  name="level"
                  value={newSkill.level}
                  onChange={handleNewSkillChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>
            
            <button
              type="button"
              onClick={addSkill}
              disabled={!newSkill.name.trim()}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Add Skill
            </button>
          </div>
          
          {formData.skills.length > 0 ? (
            <div className="space-y-2">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <span className="font-medium">{skill.name}</span>
                    <span className="ml-2 text-sm text-gray-500 capitalize">{skill.level}</span>
                    {skill.verified && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-red-600 hover:text-red-800"
                    disabled={skill.verified}
                  >
                    {skill.verified ? (
                      <span className="text-xs text-gray-500">Cannot remove verified skills</span>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills added yet</p>
          )}
        </div>
        
        {user.role === 'instructor' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8" id="availability">
            <h2 className="text-xl font-semibold mb-4">Availability</h2>
            <p className="text-gray-600 mb-4">
              Select the hours you're available to teach. Click on a time slot to toggle availability.
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Day</th>
                    {hours.map(hour => (
                      <th key={hour} className="py-2 px-1 border-b text-center text-xs">
                        {hour}:00
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map(day => (
                    <tr key={day}>
                      <td className="py-2 px-4 border-b capitalize">{day}</td>
                      {hours.map(hour => (
                        <td key={`${day}-${hour}`} className="py-2 px-1 border-b text-center">
                          <button
                            type="button"
                            onClick={() => toggleAvailability(day, hour)}
                            className={`w-6 h-6 rounded-full ${
                              formData.availability[day]?.includes(hour)
                                ? 'bg-indigo-600'
                                : 'bg-gray-200'
                            }`}
                            aria-label={`Toggle ${day} at ${hour}:00`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={saveProfile}
            disabled={saving}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
