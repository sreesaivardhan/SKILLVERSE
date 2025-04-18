'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/api/axios';
import Link from 'next/link';

// Types
interface Skill {
  name: string;
  level: string;
  verified?: boolean;
}

interface User {
  _id: string;
  name: string;
  role: string;
  skills: Skill[];
  rating: number;
  ratingCount: number;
  availability: {
    [key: string]: number[];
  };
}

export default function MarketplacePage() {
  const router = useRouter();
  const [instructors, setInstructors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search filters
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  
  // Available skills for filtering (will be populated from API)
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  
  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Set default auth header
    axiosInstance.defaults.headers.common['x-auth-token'] = token;

    // Fetch instructors
    const fetchInstructors = async () => {
      try {
        const res = await axiosInstance.get('/api/search');
        setInstructors(res.data);
        
        // Extract unique skills for filter dropdown
        const skills = new Set<string>();
        res.data.forEach((instructor: User) => {
          instructor.skills.forEach(skill => {
            skills.add(skill.name);
          });
        });
        
        setAvailableSkills(Array.from(skills).sort());
      } catch (err: any) {
        console.error('Error fetching instructors:', err);
        setError(err.response?.data?.message || 'Failed to load instructors');
        
        // Redirect to login if unauthorized
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [router]);

  // Filter instructors based on search query and filters
  const filteredInstructors = instructors.filter(instructor => {
    // Name search
    const nameMatch = instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Skill filter
    const skillMatch = skillFilter 
      ? instructor.skills.some(skill => skill.name.toLowerCase() === skillFilter.toLowerCase())
      : true;
    
    // Level filter
    const levelMatch = levelFilter && skillFilter
      ? instructor.skills.some(
          skill => 
            skill.name.toLowerCase() === skillFilter.toLowerCase() && 
            skill.level.toLowerCase() === levelFilter.toLowerCase()
        )
      : true;
    
    return nameMatch && skillMatch && levelMatch;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled reactively
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSkillFilter('');
    setLevelFilter('');
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
      <h1 className="text-3xl font-bold mb-8">Find an Instructor</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Name
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search instructors..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Skill
              </label>
              <select
                value={skillFilter}
                onChange={(e) => {
                  setSkillFilter(e.target.value);
                  // Reset level filter when skill changes
                  if (!e.target.value) {
                    setLevelFilter('');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Skills</option>
                {availableSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Level
              </label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                disabled={!skillFilter}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">Any Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Filters
            </button>
          </div>
        </form>
      </div>
      
      {/* Results */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {filteredInstructors.length} Instructors Found
          </h2>
        </div>
        
        {filteredInstructors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 mb-4">No instructors match your search criteria</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstructors.map(instructor => (
              <div key={instructor._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{instructor.name}</h3>
                      {instructor.rating > 0 && (
                        <div className="flex items-center mt-1">
                          <div className="flex items-center text-yellow-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${i < Math.round(instructor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-1 text-sm text-gray-600">
                            ({instructor.ratingCount} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {instructor.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${skillFilter === skill.name ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}
                          `}
                        >
                          {skill.name}
                          <span className="ml-1 text-gray-500">({skill.level})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Availability</h4>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(instructor.availability || {}).map(([day, hours]) => 
                        hours && hours.length > 0 ? (
                          <span
                            key={day}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
                          >
                            {day.slice(0, 3)}
                          </span>
                        ) : null
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link
                      href={`/book/${instructor._id}`}
                      className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Book Session
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
