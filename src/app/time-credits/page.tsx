'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/api/axios';
import Image from 'next/image';
import { FiClock, FiArrowUp, FiArrowDown, FiCalendar, FiUser } from 'react-icons/fi';

interface Transaction {
  _id: string;
  type: 'earned' | 'spent';
  amount: number;
  description: string;
  date: string;
  otherUser?: {
    _id: string;
    name: string;
  };
}

interface User {
  _id: string;
  name: string;
  timeCredits: number;
}

export default function TimeCreditsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
    const fetchUserData = async () => {
      try {
        // Get user data
        const userRes = await axiosInstance.get('/api/auth/me');
        
        // For demo purposes, add timeCredits if not present
        const userData = {
          ...userRes.data,
          timeCredits: userRes.data.timeCredits || 5
        };
        
        setUser(userData);
        
        // Mock transaction data
        // In a real implementation, this would be fetched from the backend
        const mockTransactions: Transaction[] = [
          {
            _id: '1',
            type: 'earned',
            amount: 2,
            description: 'Teaching JavaScript basics',
            date: '2025-04-15T14:30:00Z',
            otherUser: {
              _id: 'user1',
              name: 'Alex Johnson'
            }
          },
          {
            _id: '2',
            type: 'spent',
            amount: 1,
            description: 'Learning UI/UX Design principles',
            date: '2025-04-10T10:00:00Z',
            otherUser: {
              _id: 'user2',
              name: 'Sophia Chen'
            }
          },
          {
            _id: '3',
            type: 'earned',
            amount: 1.5,
            description: 'Teaching React Hooks',
            date: '2025-04-05T16:00:00Z',
            otherUser: {
              _id: 'user3',
              name: 'Michael Brown'
            }
          },
          {
            _id: '4',
            type: 'spent',
            amount: 2,
            description: 'Learning Data Visualization',
            date: '2025-04-01T11:30:00Z',
            otherUser: {
              _id: 'user4',
              name: 'Emily Wilson'
            }
          }
        ];
        
        setTransactions(mockTransactions);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load user data');
        
        // Redirect to login if unauthorized
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <h1 className="text-3xl font-bold mb-8">Time Credit System</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Credit Balance */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Your Balance</h2>
                <FiClock className="h-6 w-6 text-white" />
              </div>
              <div className="mt-4 flex items-end">
                <span className="text-4xl font-bold text-white">{user?.timeCredits}</span>
                <span className="ml-2 text-white opacity-90">time credits</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <FiArrowUp className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Earned</span>
                  </div>
                  <span className="font-medium">
                    {transactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.amount, 0)} credits
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <FiArrowDown className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="text-gray-700">Spent</span>
                  </div>
                  <span className="font-medium">
                    {transactions.filter(t => t.type === 'spent').reduce((sum, t) => sum + t.amount, 0)} credits
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">How It Works</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Time credits are the currency of SkillVerse. Earn credits by teaching others and spend them to learn new skills.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>1 hour of teaching = 1 time credit earned</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>1 time credit = 1 hour of learning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>New users receive 2 credits to start</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Transaction History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Transaction History</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No transactions yet
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction._id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 
                          ${transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {transaction.type === 'earned' ? (
                            <FiArrowUp className="h-5 w-5 text-green-600" />
                          ) : (
                            <FiArrowDown className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{transaction.description}</h4>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <FiCalendar className="mr-1 h-4 w-4" />
                            <span>{formatDate(transaction.date)}</span>
                          </div>
                          {transaction.otherUser && (
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <FiUser className="mr-1 h-4 w-4" />
                              <span>{transaction.otherUser.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`font-medium ${
                        transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'earned' ? '+' : '-'}{transaction.amount} credits
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
