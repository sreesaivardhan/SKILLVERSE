'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FiMenu, FiX, FiSun, FiMoon, FiSearch, FiBell, FiUser } from 'react-icons/fi';
import { RootState } from '@/lib/redux/store';
import { toggleTheme } from '@/lib/redux/slices/uiSlice';
import { logout } from '@/lib/redux/slices/authSlice';
import AuthButton from '@/components/ui/AuthButton';
import { useAuth } from '@/lib/contexts/AuthContext';

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { theme } = useSelector((state: RootState) => state.ui);
  const { isAuthenticated: reduxIsAuthenticated, user: reduxUser } = useSelector((state: RootState) => state.auth);
  const { isAuthenticated, user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || isAuthenticated ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
              <Image 
                src="/skillverse-logo.png" 
                alt="SkillVerse Logo" 
                width={36} 
                height={36} 
                className="h-8 w-auto"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SKILLVERSE
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/marketplace"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Skill Marketplace
            </Link>
            <Link
              href="/instructors"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Find Instructors
            </Link>
            <Link
              href="/how-it-works"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              How It Works
            </Link>
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="absolute right-0 top-0 w-64 flex">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Search skills, instructors..."
                  />
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                  >
                    <FiSearch className="h-5 w-5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Search"
                >
                  <FiSearch className="h-5 w-5" />
                </button>
              )}
            </div>
            
            {/* Theme toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            {isAuthenticated && (
              <button
                className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                aria-label="Notifications"
              >
                <FiBell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            )}
            
            {/* Auth Button - handles both logged in and logged out states */}
            <div className="hidden md:block">
              <AuthButton variant="header" />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          
          {/* Menu panel */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out mobile-menu-container">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <Image 
                  src="/skillverse-logo.png" 
                  alt="SkillVerse Logo" 
                  width={32} 
                  height={32} 
                  className="h-7 w-auto"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SKILLVERSE
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="px-4 py-6 space-y-6 overflow-y-auto">
              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Search skills, instructors..."
                  />
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                  >
                    <FiSearch className="h-5 w-5" />
                  </button>
                </div>
              </form>
              
              {/* Navigation */}
              <nav className="space-y-4">
                <Link
                  href="/marketplace"
                  className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Skill Marketplace
                </Link>
                <Link
                  href="/instructors"
                  className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Instructors
                </Link>
                <Link
                  href="/how-it-works"
                  className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </Link>
                {isAuthenticated && (
                  <Link
                    href="/dashboard"
                    className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
              </nav>
              
              {/* Auth section */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                <AuthButton variant="mobile" />
              </div>
              
              {/* Theme toggle */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => dispatch(toggleTheme())}
                  className="flex items-center py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {theme === 'dark' ? (
                    <>
                      <FiSun className="mr-3 h-5 w-5" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <FiMoon className="mr-3 h-5 w-5" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
