'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiLogIn, FiLogOut, FiUser, FiSettings, FiHome } from 'react-icons/fi';
import { useAuth } from '@/lib/contexts/AuthContext';

interface AuthButtonProps {
  variant?: 'header' | 'sidebar' | 'mobile';
  className?: string;
}

export const AuthButton = ({ variant = 'header', className = '' }: AuthButtonProps) => {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="animate-pulse flex items-center space-x-2">
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        {variant !== 'mobile' && (
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
        )}
      </div>
    );
  }

  if (!isAuthenticated) {
    if (variant === 'mobile') {
      return (
        <div className="space-y-1">
          <Link
            href="/login"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="flex items-center">
              <FiLogIn className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Log in
            </div>
          </Link>
          <Link
            href="/register"
            className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
          >
            <div className="flex items-center">
              <FiUser className="mr-3 h-5 w-5" />
              Create Account
            </div>
          </Link>
        </div>
      );
    }

    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Link
          href="/login"
          className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
        >
          <FiLogIn className="mr-2 h-4 w-4" />
          Log in
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <FiUser className="mr-2 h-4 w-4" />
          Create Account
        </Link>
      </div>
    );
  }

  // User is authenticated
  if (variant === 'mobile') {
    return (
      <div className="space-y-1">
        <Link
          href="/dashboard"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center">
            <FiHome className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Dashboard
          </div>
        </Link>
        <Link
          href="/profile"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center">
            <FiUser className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Profile
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center">
            <FiLogOut className="mr-3 h-5 w-5" />
            Log out
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center focus:outline-none"
        aria-label="Open user menu"
      >
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <FiUser className="h-5 w-5" />
          )}
        </div>
        {variant === 'header' && (
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        )}
      </button>

      {/* Profile dropdown menu */}
      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-xl z-50 animate-fadeIn">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsProfileOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsProfileOpen(false)}
          >
            Your Profile
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsProfileOpen(false)}
          >
            <div className="flex items-center">
              <FiSettings className="mr-2 h-4 w-4" />
              Settings
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center">
              <FiLogOut className="mr-2 h-4 w-4" />
              Log out
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButton;
