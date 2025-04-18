'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/api/axios';
import Image from 'next/image';
import { FiSend, FiSearch, FiMoreVertical, FiPaperclip, FiSmile, FiImage, FiMessageSquare } from 'react-icons/fi';

interface Message {
  _id: string;
  sender: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  _id: string;
  user: {
    _id: string;
    name: string;
    role: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    sender: string;
  };
  unreadCount: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<{_id: string, name: string} | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    const fetchData = async () => {
      try {
        // Get user data
        const userRes = await axiosInstance.get('/api/auth/me');
        setCurrentUser({
          _id: userRes.data._id,
          name: userRes.data.name
        });
        
        // Mock conversations
        const mockConversations: Conversation[] = [
          {
            _id: 'conv1',
            user: {
              _id: 'user1',
              name: 'Alex Johnson',
              role: 'instructor'
            },
            lastMessage: {
              content: 'Looking forward to our session tomorrow!',
              timestamp: '2025-04-18T14:30:00Z',
              sender: 'user1'
            },
            unreadCount: 2
          },
          {
            _id: 'conv2',
            user: {
              _id: 'user2',
              name: 'Sophia Chen',
              role: 'instructor'
            },
            lastMessage: {
              content: 'Can we reschedule our React session?',
              timestamp: '2025-04-17T10:15:00Z',
              sender: 'currentUser'
            },
            unreadCount: 0
          },
          {
            _id: 'conv3',
            user: {
              _id: 'user3',
              name: 'Michael Brown',
              role: 'learner'
            },
            lastMessage: {
              content: 'Thanks for the great CSS Grid lesson!',
              timestamp: '2025-04-15T16:45:00Z',
              sender: 'user3'
            },
            unreadCount: 0
          }
        ];
        
        setConversations(mockConversations);
        
        // Set first conversation as active by default
        if (mockConversations.length > 0 && !activeConversation) {
          setActiveConversation(mockConversations[0]._id);
          
          // Load messages for first conversation
          const mockMessages: Message[] = [
            {
              _id: 'msg1',
              sender: 'user1',
              content: "Hi there! I saw you're available for a JavaScript tutoring session tomorrow.",
              timestamp: '2025-04-18T14:15:00Z',
              read: true
            },
            {
              _id: 'msg2',
              sender: 'currentUser',
              content: "Yes, I'm available at 2pm. What specific topics would you like to cover?",
              timestamp: '2025-04-18T14:20:00Z',
              read: true
            },
            {
              _id: 'msg3',
              sender: 'user1',
              content: "I'd like to focus on async/await and Promises. I'm having trouble understanding how to handle errors properly.",
              timestamp: '2025-04-18T14:25:00Z',
              read: true
            },
            {
              _id: 'msg4',
              sender: 'user1',
              content: 'Looking forward to our session tomorrow!',
              timestamp: '2025-04-18T14:30:00Z',
              read: false
            }
          ];
          
          setMessages(mockMessages);
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load messages');
        
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
  }, [router, activeConversation]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversation(conversationId);
    
    // Mock loading messages for selected conversation
    const mockMessages: Message[] = [
      {
        _id: 'msg1',
        sender: conversationId === 'conv1' ? 'user1' : (conversationId === 'conv2' ? 'user2' : 'user3'),
        content: 'Hello! How can I help you today?',
        timestamp: '2025-04-18T14:15:00Z',
        read: true
      },
      {
        _id: 'msg2',
        sender: 'currentUser',
        content: 'I have some questions about our upcoming session.',
        timestamp: '2025-04-18T14:20:00Z',
        read: true
      },
      {
        _id: 'msg3',
        sender: conversationId === 'conv1' ? 'user1' : (conversationId === 'conv2' ? 'user2' : 'user3'),
        content: 'Sure, what would you like to know?',
        timestamp: '2025-04-18T14:25:00Z',
        read: true
      }
    ];
    
    // Add conversation-specific messages
    if (conversationId === 'conv1') {
      mockMessages.push({
        _id: 'msg4',
        sender: 'user1',
        content: 'Looking forward to our session tomorrow!',
        timestamp: '2025-04-18T14:30:00Z',
        read: false
      });
    } else if (conversationId === 'conv2') {
      mockMessages.push({
        _id: 'msg4',
        sender: 'currentUser',
        content: 'Can we reschedule our React session?',
        timestamp: '2025-04-17T10:15:00Z',
        read: true
      });
    } else if (conversationId === 'conv3') {
      mockMessages.push({
        _id: 'msg4',
        sender: 'user3',
        content: 'Thanks for the great CSS Grid lesson!',
        timestamp: '2025-04-15T16:45:00Z',
        read: true
      });
    }
    
    setMessages(mockMessages);
    
    // Mark conversation as read
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv._id === conversationId 
          ? { ...conv, unreadCount: 0 } 
          : conv
      )
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;
    
    // Create new message
    const newMsg: Message = {
      _id: `msg${Date.now()}`,
      sender: 'currentUser',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Add to messages
    setMessages(prev => [...prev, newMsg]);
    
    // Update conversation last message
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv._id === activeConversation 
          ? { 
              ...conv, 
              lastMessage: {
                content: newMessage,
                timestamp: new Date().toISOString(),
                sender: 'currentUser'
              } 
            } 
          : conv
      )
    );
    
    // Clear input
    setNewMessage('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getActiveConversation = () => {
    return conversations.find(conv => conv._id === activeConversation);
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
      <h1 className="text-3xl font-bold mb-8">Messages</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversations sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search messages"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {conversations.map((conversation) => (
                    <li 
                      key={conversation._id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        activeConversation === conversation._id ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => handleConversationSelect(conversation._id)}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                              {conversation.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{conversation.user.name}</p>
                              <p className="text-xs text-gray-500 capitalize">{conversation.user.role}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-xs text-gray-500">
                              {formatDate(conversation.lastMessage.timestamp)}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full mt-1">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className={`text-sm ${
                              conversation.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'
                            } truncate`}>
                              {conversation.lastMessage.sender === 'currentUser' ? 'You: ' : ''}
                              {conversation.lastMessage.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Message area */}
          <div className="w-2/3 flex flex-col">
            {activeConversation ? (
              <>
                {/* Conversation header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                      {getActiveConversation()?.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{getActiveConversation()?.user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{getActiveConversation()?.user.role}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <FiMoreVertical className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.map((message, index) => (
                    <div key={message._id} className={`mb-4 flex ${
                      message.sender === 'currentUser' ? 'justify-end' : 'justify-start'
                    }`}>
                      {message.sender !== 'currentUser' && (
                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white mr-2 flex-shrink-0">
                          {getActiveConversation()?.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'currentUser'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 text-right ${
                          message.sender === 'currentUser' ? 'text-indigo-200' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-center">
                    <button
                      type="button"
                      className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <FiPaperclip className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 mx-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <FiSmile className="h-5 w-5" />
                    </button>
                    <button
                      type="submit"
                      className="ml-2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FiSend className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <FiMessageSquare className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-500">
                    Select a conversation from the sidebar or start a new one
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
