'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiHome, FiUser, FiSearch, FiClock, FiSettings, 
  FiBook, FiAward, FiMessageSquare, FiHelpCircle, FiMenu, FiX,
  FiCalendar, FiFileText
} from 'react-icons/fi';
import axiosInstance from '@/lib/api/axios';
import { isAuthenticated, initAuth, logoutUser } from '@/lib/auth';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize authentication and check if user is logged in
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    // Make sure auth headers are set
    initAuth();

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/api/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Full menu items based on backend features
  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Find Instructor', href: '/marketplace', icon: FiSearch },
    { name: 'Time Credit System', href: '/time-credits', icon: FiClock },
    { name: 'My Sessions', href: '/my-sessions', icon: FiCalendar },
    { name: 'My Skills', href: '/my-skills', icon: FiAward },
    { name: 'Assessments', href: '/assessments', icon: FiFileText },
    { name: 'Messages', href: '/messages', icon: FiMessageSquare },
    { name: 'Settings', href: '/settings', icon: FiSettings },
    { name: 'Help & Support', href: '/help', icon: FiHelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top navigation bar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex-shrink-0 flex items-center">
                <Image
                  src="/logo.png"
                  alt="SkillVerse Logo"
                  width={120}
                  height={48}
                  className="object-contain"
                />
              </Link>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link href="/marketplace" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                Find Instructors
              </Link>
              <Link href="/how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                How It Works
              </Link>
              <div className="relative">
                <div className="flex items-center">
                  <button 
                    onClick={handleLogout}
                    className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                  >
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                  </button>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                <FiMenu className="block h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top navigation menu for mobile */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-10 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-2 flex overflow-x-auto space-x-4 scrollbar-hide">
          {menuItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex-shrink-0 flex flex-col items-center p-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleMobileMenu}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={toggleMobileMenu}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Close sidebar</span>
                <FiX className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-center flex-shrink-0 px-4 mb-5">
                <Image
                  src="/logo.png"
                  alt="SkillVerse Logo"
                  width={150}
                  height={60}
                  className="object-contain"
                />
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={toggleMobileMenu}
                  >
                    <item.icon className="mr-4 h-5 w-5 text-gray-500 dark:text-gray-400" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex flex-col border-t border-gray-200 dark:border-gray-700 p-4">
              <Link href="/profile" className="flex-shrink-0 w-full group block mb-4" onClick={toggleMobileMenu}>
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.name}
                    </p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center"
              >
                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log Out
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
        </div>
      )}

      {/* Main content - no sidebar padding */}
      <div className="flex flex-col flex-1">
        <div className="pt-16">
          <main className="flex-1 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
