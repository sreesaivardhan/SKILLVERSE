'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/api/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiClock, FiSearch, FiCalendar, FiAward, FiMessageSquare, FiFileText } from 'react-icons/fi';

// Full User interface based on backend model
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
        // Use Promise.all to fetch multiple resources in parallel
        const [userResponse, sessionsResponse] = await Promise.all([
          axiosInstance.get('/api/auth/me'),
          axiosInstance.get('/api/sessions/upcoming')
        ]);
        
        setUser(userResponse.data);
        setSessions(sessionsResponse.data || []);
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
            <div className="text-xl font-semibold flex items-center">
              <FiClock className="mr-2 text-indigo-600" />
              {user.credits} Time Credits
            </div>
            <Link 
              href="/time-credits" 
              className="mt-2 inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Manage Credits
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/marketplace" className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50">
              <FiSearch className="h-6 w-6 text-indigo-600 mb-2" />
              <span className="text-sm font-medium">Find Instructors</span>
            </Link>
            <Link href="/my-sessions" className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50">
              <FiCalendar className="h-6 w-6 text-indigo-600 mb-2" />
              <span className="text-sm font-medium">My Sessions</span>
            </Link>
            <Link href="/my-skills" className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50">
              <FiAward className="h-6 w-6 text-indigo-600 mb-2" />
              <span className="text-sm font-medium">My Skills</span>
            </Link>
            <Link href="/messages" className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50">
              <FiMessageSquare className="h-6 w-6 text-indigo-600 mb-2" />
              <span className="text-sm font-medium">Messages</span>
            </Link>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Skills</h2>
            <Link 
              href="/my-skills" 
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View All
            </Link>
          </div>
          
          {user.skills && user.skills.length > 0 ? (
            <ul className="space-y-2">
              {user.skills.slice(0, 3).map((skill, index) => (
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
              {user.skills.length > 3 && (
                <li className="text-center text-sm text-indigo-600 mt-2">
                  + {user.skills.length - 3} more skills
                </li>
              )}
            </ul>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-4">No skills added yet</p>
              <Link 
                href="/my-skills" 
                className="inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Skills
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
            <Link 
              href="/my-sessions" 
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View All
            </Link>
          </div>
          
          {sessions && sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.slice(0, 2).map((session) => (
                <Link 
                  key={session._id} 
                  href={`/sessions/${session._id}`}
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{session.skill}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(session.startTime).toLocaleDateString()} • {session.duration} min
                      </p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {session.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-4">No upcoming sessions</p>
              <Link 
                href="/marketplace" 
                className="inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Find Instructors
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
