'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/api/axios';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiClock, FiVideo, FiUser, FiCheckCircle, FiXCircle, FiMessageSquare } from 'react-icons/fi';

interface Session {
  _id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  otherUser: {
    _id: string;
    name: string;
    role: string;
  };
  isInstructor: boolean;
}

export default function MySessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
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

    // Mock data for now - this would be replaced with actual API calls
    const fetchSessions = async () => {
      try {
        // In a real implementation, this would fetch from the backend
        // For now, using mock data
        const mockSessions: Session[] = [
          {
            _id: '1',
            title: 'JavaScript Fundamentals',
            description: 'Introduction to JavaScript variables, functions, and basic concepts',
            date: '2025-04-25T14:30:00Z',
            duration: 60,
            status: 'confirmed',
            otherUser: {
              _id: 'user1',
              name: 'Alex Johnson',
              role: 'instructor'
            },
            isInstructor: false
          },
          {
            _id: '2',
            title: 'React Hooks Deep Dive',
            description: 'Advanced usage of React hooks and custom hook patterns',
            date: '2025-04-27T10:00:00Z',
            duration: 90,
            status: 'pending',
            otherUser: {
              _id: 'user2',
              name: 'Sophia Chen',
              role: 'instructor'
            },
            isInstructor: false
          },
          {
            _id: '3',
            title: 'CSS Grid Layout',
            description: 'Teaching the fundamentals of CSS Grid for modern layouts',
            date: '2025-04-20T16:00:00Z',
            duration: 60,
            status: 'completed',
            otherUser: {
              _id: 'user3',
              name: 'Michael Brown',
              role: 'learner'
            },
            isInstructor: true
          },
          {
            _id: '4',
            title: 'TypeScript Basics',
            description: 'Introduction to TypeScript types and interfaces',
            date: '2025-04-18T11:30:00Z',
            duration: 60,
            status: 'cancelled',
            otherUser: {
              _id: 'user4',
              name: 'Emily Wilson',
              role: 'learner'
            },
            isInstructor: true
          }
        ];
        
        setSessions(mockSessions);
      } catch (err: any) {
        console.error('Error fetching sessions:', err);
        setError(err.response?.data?.message || 'Failed to load sessions');
        
        // Redirect to login if unauthorized
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (session: Session) => {
    return new Date(session.date) > new Date() && session.status !== 'cancelled';
  };

  const isPast = (session: Session) => {
    return new Date(session.date) <= new Date() || session.status === 'cancelled';
  };

  const upcomingSessions = sessions.filter(isUpcoming);
  const pastSessions = sessions.filter(isPast);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'confirmed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Confirmed</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Cancelled</span>;
      default:
        return null;
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
      <h1 className="text-3xl font-bold mb-8">My Sessions</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
            activeTab === 'upcoming'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({upcomingSessions.length})
        </button>
        <button
          className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
            activeTab === 'past'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('past')}
        >
          Past ({pastSessions.length})
        </button>
      </div>
      
      {/* Session cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === 'upcoming' ? (
          upcomingSessions.length === 0 ? (
            <div className="md:col-span-2 bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <FiCalendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
              <p className="text-gray-500 mb-4">You don't have any upcoming sessions scheduled.</p>
              <Link
                href="/marketplace"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Find an Instructor
              </Link>
            </div>
          ) : (
            upcomingSessions.map((session) => (
              <div key={session._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{session.description}</p>
                    </div>
                    <div>{getStatusBadge(session.status)}</div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                      {formatDate(session.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-2 h-4 w-4 text-gray-400" />
                      {session.duration} minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUser className="mr-2 h-4 w-4 text-gray-400" />
                      {session.otherUser.name} ({session.isInstructor ? 'Learner' : 'Instructor'})
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    {session.status === 'confirmed' && (
                      <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <FiVideo className="mr-2 h-4 w-4" />
                        Join Session
                      </button>
                    )}
                    
                    {session.status === 'pending' && session.isInstructor && (
                      <>
                        <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <FiCheckCircle className="mr-2 h-4 w-4" />
                          Confirm
                        </button>
                        <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <FiXCircle className="mr-2 h-4 w-4" />
                          Decline
                        </button>
                      </>
                    )}
                    
                    {session.status === 'pending' && !session.isInstructor && (
                      <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <FiXCircle className="mr-2 h-4 w-4" />
                        Cancel Request
                      </button>
                    )}
                    
                    <button className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <FiMessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          pastSessions.length === 0 ? (
            <div className="md:col-span-2 bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <FiCalendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No past sessions</h3>
              <p className="text-gray-500">You haven't completed any sessions yet.</p>
            </div>
          ) : (
            pastSessions.map((session) => (
              <div key={session._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{session.description}</p>
                    </div>
                    <div>{getStatusBadge(session.status)}</div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                      {formatDate(session.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-2 h-4 w-4 text-gray-400" />
                      {session.duration} minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUser className="mr-2 h-4 w-4 text-gray-400" />
                      {session.otherUser.name} ({session.isInstructor ? 'Learner' : 'Instructor'})
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    {session.status === 'completed' && !session.isInstructor && (
                      <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Rate & Review
                      </button>
                    )}
                    
                    <button className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <FiMessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
