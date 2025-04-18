'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/api/axios';
import Image from 'next/image';
import { FiCheckCircle, FiClock, FiAward, FiPlay, FiFileText, FiLock } from 'react-icons/fi';

interface Assessment {
  _id: string;
  title: string;
  skill: string;
  level: string;
  duration: number;
  questions: number;
  status: 'available' | 'completed' | 'locked';
  score?: number;
  completedDate?: string;
}

export default function AssessmentsPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Set default auth header
    axiosInstance.defaults.headers.common['x-auth-token'] = token;

    // Mock data for now - this would be replaced with actual API calls
    const fetchAssessments = async () => {
      try {
        // In a real implementation, this would fetch from the backend
        // For now, using mock data
        const mockAssessments: Assessment[] = [
          {
            _id: '1',
            title: 'JavaScript Fundamentals',
            skill: 'JavaScript',
            level: 'beginner',
            duration: 30,
            questions: 20,
            status: 'available'
          },
          {
            _id: '2',
            title: 'React Components & Hooks',
            skill: 'React',
            level: 'intermediate',
            duration: 45,
            questions: 25,
            status: 'completed',
            score: 85,
            completedDate: '2025-04-10T14:30:00Z'
          },
          {
            _id: '3',
            title: 'Advanced JavaScript Patterns',
            skill: 'JavaScript',
            level: 'advanced',
            duration: 60,
            questions: 30,
            status: 'locked'
          },
          {
            _id: '4',
            title: 'CSS Grid & Flexbox',
            skill: 'CSS',
            level: 'intermediate',
            duration: 40,
            questions: 22,
            status: 'completed',
            score: 92,
            completedDate: '2025-04-05T10:15:00Z'
          },
          {
            _id: '5',
            title: 'Node.js Basics',
            skill: 'Node.js',
            level: 'beginner',
            duration: 35,
            questions: 20,
            status: 'available'
          }
        ];
        
        setAssessments(mockAssessments);
      } catch (err: any) {
        console.error('Error fetching assessments:', err);
        setError(err.response?.data?.message || 'Failed to load assessments');
        
        // Redirect to login if unauthorized
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const availableAssessments = assessments.filter(a => a.status === 'available');
  const completedAssessments = assessments.filter(a => a.status === 'completed');
  const lockedAssessments = assessments.filter(a => a.status === 'locked');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Skill Assessments</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-3">Why Take Assessments?</h2>
          <p className="text-gray-600 mb-4">
            Skill assessments help verify your expertise and allow you to teach on the SkillVerse platform. 
            Completing assessments also helps us match you with the right learning opportunities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <FiCheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium">Verify Your Skills</h3>
              </div>
              <p className="text-sm text-gray-600">
                Demonstrate your expertise and gain verified skill badges on your profile
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <FiAward className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-medium">Unlock Teaching</h3>
              </div>
              <p className="text-sm text-gray-600">
                Passing assessments allows you to teach skills and earn time credits
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <FiFileText className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium">Identify Gaps</h3>
              </div>
              <p className="text-sm text-gray-600">
                Discover areas for improvement and targeted learning opportunities
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
            activeTab === 'available'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('available')}
        >
          Available ({availableAssessments.length})
        </button>
        <button
          className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
            activeTab === 'completed'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({completedAssessments.length})
        </button>
      </div>
      
      {/* Assessment cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'available' ? (
          <>
            {availableAssessments.map((assessment) => (
              <div key={assessment._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{assessment.title}</h3>
                  
                  <div className="flex items-center mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getLevelColor(assessment.level)}`}>
                      {assessment.level}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">{assessment.skill}</span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-2 h-4 w-4 text-gray-400" />
                      {assessment.duration} minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiFileText className="mr-2 h-4 w-4 text-gray-400" />
                      {assessment.questions} questions
                    </div>
                  </div>
                  
                  <button
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiPlay className="mr-2 h-4 w-4" />
                    Start Assessment
                  </button>
                </div>
              </div>
            ))}
            
            {lockedAssessments.map((assessment) => (
              <div key={assessment._id} className="bg-white rounded-lg shadow-md overflow-hidden opacity-75">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{assessment.title}</h3>
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getLevelColor(assessment.level)}`}>
                      {assessment.level}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">{assessment.skill}</span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-2 h-4 w-4 text-gray-400" />
                      {assessment.duration} minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiFileText className="mr-2 h-4 w-4 text-gray-400" />
                      {assessment.questions} questions
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    Complete lower level assessments to unlock this advanced assessment.
                  </div>
                  
                  <button
                    disabled
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-gray-100 cursor-not-allowed"
                  >
                    <FiLock className="mr-2 h-4 w-4" />
                    Locked
                  </button>
                </div>
              </div>
            ))}
            
            {availableAssessments.length === 0 && lockedAssessments.length === 0 && (
              <div className="md:col-span-3 bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <FiFileText className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No available assessments</h3>
                <p className="text-gray-500">
                  You've completed all available assessments for your skills.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {completedAssessments.length === 0 ? (
              <div className="md:col-span-3 bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <FiAward className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No completed assessments</h3>
                <p className="text-gray-500 mb-4">
                  You haven't completed any skill assessments yet. Take an assessment to verify your skills.
                </p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Available Assessments
                </button>
              </div>
            ) : (
              completedAssessments.map((assessment) => (
                <div key={assessment._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{assessment.title}</h3>
                    
                    <div className="flex items-center mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getLevelColor(assessment.level)}`}>
                        {assessment.level}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">{assessment.skill}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FiCheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-sm text-gray-500">Completed</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {assessment.completedDate && formatDate(assessment.completedDate)}
                      </span>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Score</span>
                        <span className={`text-sm font-medium ${getScoreColor(assessment.score || 0)}`}>
                          {assessment.score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            assessment.score && assessment.score >= 70 ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${assessment.score}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500 text-right">
                        {assessment.score && assessment.score >= 70 ? 'Passed' : 'Failed'}
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Results
                      </button>
                      <button
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Retake
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
