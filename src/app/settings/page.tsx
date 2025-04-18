'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/api/axios';
import { isAuthenticated, initAuth } from '@/lib/auth';
import { FiSave, FiLock, FiMail, FiGlobe, FiClock, FiBell, FiShield, FiUser } from 'react-icons/fi';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('account');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Availability settings
  const [availability, setAvailability] = useState({
    monday: [false, false, false, false],
    tuesday: [false, false, false, false],
    wednesday: [false, false, false, false],
    thursday: [false, false, false, false],
    friday: [false, false, false, false],
    saturday: [false, false, false, false],
    sunday: [false, false, false, false]
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    // Make sure auth headers are set
    initAuth();

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get('/api/auth/me');
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
        
        // Mock availability data
        // In a real implementation, this would come from the backend
        setAvailability({
          monday: [true, true, false, false],
          tuesday: [false, true, true, false],
          wednesday: [false, false, true, true],
          thursday: [true, false, false, true],
          friday: [true, true, false, false],
          saturday: [false, false, false, false],
          sunday: [false, false, false, false]
        });
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

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('Account information updated successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setError('');
    setSuccess('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('Notification preferences updated successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleAvailabilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('Availability settings updated successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const toggleAvailability = (day: string, timeSlot: number) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day as keyof typeof prev].map((slot, idx) => 
        idx === timeSlot ? !slot : slot
      )
    }));
  };

  const timeSlots = ['Morning (8-12)', 'Afternoon (12-4)', 'Evening (4-8)', 'Night (8-12)'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
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
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'account'
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiUser className="mr-3 h-5 w-5" />
                Account Information
              </button>
              
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'password'
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiLock className="mr-3 h-5 w-5" />
                Change Password
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'notifications'
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiBell className="mr-3 h-5 w-5" />
                Notifications
              </button>
              
              <button
                onClick={() => setActiveTab('availability')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'availability'
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiClock className="mr-3 h-5 w-5" />
                Availability
              </button>
              
              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'privacy'
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiShield className="mr-3 h-5 w-5" />
                Privacy & Security
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Account Information */}
            {activeTab === 'account' && (
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Account Information</h2>
                <form onSubmit={handleAccountSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Type
                      </label>
                      <div className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm text-gray-700 capitalize">
                        {user?.role || 'User'}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Your account type determines your permissions on the platform
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FiSave className="mr-2 -ml-1 h-5 w-5" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            {/* Change Password */}
            {activeTab === 'password' && (
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Change Password</h2>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FiLock className="mr-2 -ml-1 h-5 w-5" />
                        Update Password
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Notification Preferences</h2>
                <form onSubmit={handleNotificationSubmit}>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="emailNotifications"
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                          Email Notifications
                        </label>
                        <p className="text-gray-500">Receive important updates about your account via email</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="sessionReminders"
                          type="checkbox"
                          checked={sessionReminders}
                          onChange={() => setSessionReminders(!sessionReminders)}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="sessionReminders" className="font-medium text-gray-700">
                          Session Reminders
                        </label>
                        <p className="text-gray-500">Receive reminders before your scheduled sessions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketingEmails"
                          type="checkbox"
                          checked={marketingEmails}
                          onChange={() => setMarketingEmails(!marketingEmails)}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="marketingEmails" className="font-medium text-gray-700">
                          Marketing Emails
                        </label>
                        <p className="text-gray-500">Receive updates about new features and promotions</p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FiBell className="mr-2 -ml-1 h-5 w-5" />
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            {/* Availability */}
            {activeTab === 'availability' && (
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Set Your Availability</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Select the time slots when you're available to teach or learn. This helps us match you with sessions that fit your schedule.
                </p>
                <form onSubmit={handleAvailabilitySubmit}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Day
                          </th>
                          {timeSlots.map((slot, index) => (
                            <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {slot}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(availability).map(([day, slots]) => (
                          <tr key={day}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                              {day}
                            </td>
                            {slots.map((isAvailable, index) => (
                              <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                  type="button"
                                  onClick={() => toggleAvailability(day, index)}
                                  className={`h-6 w-6 rounded ${
                                    isAvailable ? 'bg-green-500' : 'bg-gray-200'
                                  }`}
                                  aria-label={`Toggle ${day} ${timeSlots[index]} availability`}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FiClock className="mr-2 -ml-1 h-5 w-5" />
                      Save Availability
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Privacy & Security */}
            {activeTab === 'privacy' && (
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Privacy & Security</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium mb-2">Profile Visibility</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      Control who can see your profile and contact you on the platform
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="visibility-public"
                          name="visibility"
                          type="radio"
                          defaultChecked
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label htmlFor="visibility-public" className="ml-3 block text-sm font-medium text-gray-700">
                          Public - Anyone can view my profile and skills
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="visibility-members"
                          name="visibility"
                          type="radio"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label htmlFor="visibility-members" className="ml-3 block text-sm font-medium text-gray-700">
                          Members Only - Only registered users can view my profile
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="visibility-private"
                          name="visibility"
                          type="radio"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label htmlFor="visibility-private" className="ml-3 block text-sm font-medium text-gray-700">
                          Private - Only show my profile to users I've connected with
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      Add an extra layer of security to your account
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Enable Two-Factor Authentication
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Session History</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      View and manage your account login sessions
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Active Sessions
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-red-600 mb-2">Danger Zone</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      Permanent actions that cannot be undone
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
