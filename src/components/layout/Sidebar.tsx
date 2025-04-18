'use client';

import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiCalendar, FiClock, FiBook, FiAward, FiSettings, FiUsers, FiMessageSquare, FiHelpCircle } from 'react-icons/fi';
import { RootState } from '@/lib/redux/store';
import { toggleSidebar } from '@/lib/redux/slices/uiSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'My Sessions', href: '/dashboard/sessions', icon: FiCalendar },
    { name: 'Time Credits', href: '/dashboard/credits', icon: FiClock },
    { name: 'My Skills', href: '/dashboard/skills', icon: FiBook },
    { name: 'Assessments', href: '/dashboard/assessments', icon: FiAward },
    ...(isInstructor
      ? [
          { name: 'My Students', href: '/dashboard/students', icon: FiUsers },
          { name: 'Create Session', href: '/dashboard/sessions/create', icon: FiCalendar },
        ]
      : []),
    { name: 'Messages', href: '/dashboard/messages', icon: FiMessageSquare },
    { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
    { name: 'Help & Support', href: '/dashboard/support', icon: FiHelpCircle },
    ...(isAdmin
      ? [
          { name: 'Admin Panel', href: '/admin', icon: FiSettings },
        ]
      : []),
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="h-full flex flex-col">
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SKILLVERSE
            </span>
          </Link>
          <button
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => dispatch(toggleSidebar())}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : 'User'}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Time Credits</span>
              <span className="font-medium text-gray-900 dark:text-white">{user?.timeCredits || 0}</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (((user?.timeCredits !== undefined ? user.timeCredits : 0) / 100) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive
                        ? 'text-blue-500 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <Link
              href="/marketplace"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Browse Skills
            </Link>
            <Link
              href="/dashboard/sessions/create"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Create Session
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
