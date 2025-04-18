'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/api/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  skills: Skill[];
  rating: number;
  ratingCount: number;
  credits: number;
  availability?: {
    [key: string]: number[];
  };
}

interface Session {
  _id: string;
  instructor: User;
  learner: User;
  skill: string;
  startTime: string;
  duration: number;
  status: string;
  meetingLink?: string;
  meetingRoom?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Set default auth header
    axiosInstance.defaults.headers.common['x-auth-token'] = token;

    // Fetch user data and sessions
    const fetchData = async () => {
      try {
        const [userResponse, sessionsResponse] = await Promise.all([
          axiosInstance.get('/api/auth/me'),
          axiosInstance.get('/api/sessions/upcoming')
        ]);
        
        setUser(userResponse.data);
        setSessions(sessionsResponse.data);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        
        // Redirect to login if unauthorized
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="mt-2">{error}</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                {user.role}
              </span>
              {user.rating > 0 && (
                <span className="ml-2 inline-flex items-center text-sm text-yellow-500">
                  ★ {user.rating.toFixed(1)} ({user.ratingCount})
                </span>
              )}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-xl font-semibold">
              {user.credits} Credits
            </div>
            <Link 
              href="/profile" 
              className="mt-2 inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Skills</h2>
            <Link 
              href="/profile#skills" 
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Edit
            </Link>
          </div>
          
          {user.skills && user.skills.length > 0 ? (
            <ul className="space-y-2">
              {user.skills.map((skill, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="font-medium">{skill.name}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                    {skill.level}
                    {skill.verified && (
                      <svg className="ml-1 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No skills added yet</p>
          )}
          
          {user.role === 'learner' && (
            <Link 
              href="/marketplace" 
              className="mt-4 block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Find Instructors
            </Link>
          )}
        </div>

        {/* Availability Section (for instructors) */}
        {user.role === 'instructor' && user.availability && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Availability</h2>
              <Link 
                href="/profile#availability" 
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Edit
              </Link>
            </div>
            
            <div className="space-y-3">
              {Object.entries(user.availability).map(([day, hours]) => 
                hours && hours.length > 0 ? (
                  <div key={day} className="flex flex-col">
                    <span className="font-medium capitalize">{day}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {hours.map((hour) => (
                        <span 
                          key={`${day}-${hour}`}
                          className="px-2 py-1 text-xs bg-gray-100 rounded"
                        >
                          {hour}:00
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
            
            {Object.values(user.availability).every(hours => !hours || hours.length === 0) && (
              <p className="text-gray-500">No availability set</p>
            )}
          </div>
        )}

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
          
          {sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.slice(0, 3).map((session) => {
                const sessionDate = new Date(session.startTime);
                const isInstructor = user._id === session.instructor._id;
                const otherPerson = isInstructor ? session.learner : session.instructor;
                
                return (
                  <div key={session._id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{session.skill}</h3>
                        <p className="text-sm text-gray-600">
                          with {otherPerson.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {sessionDate.toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {sessionDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {session.status}
                      </span>
                      
                      {session.status === 'confirmed' && (
                        <Link 
                          href={`/session/${session._id}`}
                          className="px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
                        >
                          Join
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {sessions.length > 3 && (
                <Link 
                  href="/sessions" 
                  className="block text-center text-indigo-600 hover:text-indigo-800 mt-2"
                >
                  View all ({sessions.length}) sessions
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">No upcoming sessions</p>
              {user.role === 'learner' ? (
                <Link 
                  href="/marketplace" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Find Instructors
                </Link>
              ) : (
                <p className="text-sm text-gray-500">
                  Learners will book sessions once they find your profile
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
