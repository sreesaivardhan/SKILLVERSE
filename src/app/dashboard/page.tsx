'use client';

import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/lib/api/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiClock, FiSearch, FiCalendar, FiAward, FiMessageSquare, FiFileText, FiActivity, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { SkeletonCard, SkeletonText, SkeletonCircle } from '@/components/ui/SkeletonLoader';
import { useAuth } from '@/lib/contexts/AuthContext';

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
  const { isAuthenticated, user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    totalCreditsEarned: 0,
    totalCreditsSpent: 0
  });

  // Prefetch likely navigation targets
  useEffect(() => {
    router.prefetch('/my-sessions');
    router.prefetch('/marketplace');
    router.prefetch('/my-skills');
    router.prefetch('/profile');
  }, [router]);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
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
  }, [router]);

  // Fetch dashboard statistics
  const fetchDashboardStats = useCallback(async () => {
    try {
      const statsResponse = await axiosInstance.get('/api/users/stats');
      setStats(statsResponse.data || {
        totalSessions: 0,
        completedSessions: 0,
        upcomingSessions: 0,
        totalCreditsEarned: 0,
        totalCreditsSpent: 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Provide fallback data if API fails
      setStats({
        totalSessions: sessions.length || 0,
        completedSessions: sessions.filter(s => s.status === 'completed').length || 0,
        upcomingSessions: sessions.filter(s => s.status === 'scheduled').length || 0,
        totalCreditsEarned: 0,
        totalCreditsSpent: 0
      });
    } finally {
      setLoadingStats(false);
    }
  }, [sessions]);

  useEffect(() => {
    // Check authentication status
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch data
    fetchDashboardData();
    fetchDashboardStats();

    // Set up real-time updates (simulated)
    const updateInterval = setInterval(() => {
      fetchDashboardData();
    }, 60000); // Update every minute

    return () => clearInterval(updateInterval);
  }, [router, isAuthenticated, fetchDashboardData, fetchDashboardStats]);

  // Render skeleton loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 animate-pulse">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <SkeletonText width="200px" className="h-8" />
              <SkeletonText width="150px" className="mt-2" />
            </div>
            <div className="mt-4 md:mt-0">
              <SkeletonText width="120px" className="h-6" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
              <SkeletonText width="100px" className="h-6 mb-4" />
              <SkeletonText width="80px" className="h-8" />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
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

  // Calculate session progress percentage
  const calculateSessionProgress = (startTimeStr: string, currentTimeStr: string) => {
    const startTime = new Date(startTimeStr).getTime();
    const currentTime = new Date(currentTimeStr).getTime();
    const now = new Date().getTime();
    
    // If the session is in the past, show 100%
    if (startTime <= now) return 100;
    
    // Calculate time difference in milliseconds
    const totalDuration = startTime - currentTime;
    const elapsed = now - currentTime;
    
    // Calculate percentage
    const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    return percentage;
  };
  
  // Status icons for sessions
  const statusIcons = {
    scheduled: <FiCalendar className="text-blue-500" />,
    ongoing: <FiActivity className="text-green-500" />,
    completed: <FiCheckCircle className="text-purple-500" />,
    cancelled: <FiXCircle className="text-red-500" />
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            <p className="mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 capitalize">
                {user?.role}
              </span>
              {user?.rating > 0 && (
                <span className="ml-2 inline-flex items-center text-sm text-yellow-500">
                  ★ {user?.rating.toFixed(1)} ({user?.ratingCount})
                </span>
              )}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-xl font-semibold flex items-center text-gray-900 dark:text-white">
              <FiClock className="mr-2 text-indigo-600 dark:text-indigo-400" />
              {user?.credits} Time Credits
            </div>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-green-600 dark:text-green-400">+{stats.totalCreditsEarned}</span> earned · 
              <span className="text-red-600 dark:text-red-400">-{stats.totalCreditsSpent}</span> spent
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Sessions</h3>
          {loadingStats ? (
            <SkeletonText width="80px" className="h-8" />
          ) : (
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSessions}</div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Upcoming Sessions</h3>
          {loadingStats ? (
            <SkeletonText width="80px" className="h-8" />
          ) : (
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.upcomingSessions}</div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Skills Offered</h3>
          {loading ? (
            <SkeletonText width="80px" className="h-8" />
          ) : (
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{user?.skills?.length || 0}</div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Completion Rate</h3>
          {loadingStats ? (
            <SkeletonText width="80px" className="h-8" />
          ) : (
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalSessions > 0 
                  ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
                  : 0}%
              </div>
              <div className="ml-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${stats.totalSessions > 0 ? (stats.completedSessions / stats.totalSessions) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          )}
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
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <SkeletonText width="120px" />
                  <SkeletonText width="80px" />
                </div>
              ))}
            </div>
          ) : user?.skills && user.skills.length > 0 ? (
            <ul className="space-y-3">
              {user.skills.slice(0, 3).map((skill, index) => (
                <li key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                  <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 capitalize">
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
                <li className="text-center text-sm text-indigo-600 dark:text-indigo-400 mt-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer">
                  + {user.skills.length - 3} more skills
                </li>
              )}
            </ul>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No skills added yet</p>
              <Link 
                href="/my-skills" 
                className="inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Add Skills
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Sessions</h2>
            <Link 
              href="/my-sessions" 
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <SkeletonText width="150px" className="mb-2" />
                      <SkeletonText width="120px" />
                    </div>
                    <SkeletonText width="60px" />
                  </div>
                </div>
              ))}
            </div>
          ) : sessions && sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.slice(0, 2).map((session) => (
                <Link 
                  key={session._id} 
                  href={`/sessions/${session._id}`}
                  className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{session.skill}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(session.startTime).toLocaleDateString()} • {session.duration} min
                      </p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 capitalize">
                        {statusIcons[session.status as keyof typeof statusIcons]}
                        <span className="ml-1">{session.status}</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* Countdown timer for upcoming sessions */}
                  {session.status === 'scheduled' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full" 
                          style={{ 
                            width: `${calculateSessionProgress(session.startTime, new Date().toISOString())}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No upcoming sessions</p>
              <Link 
                href="/marketplace" 
                className="inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
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
