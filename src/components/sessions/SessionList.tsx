'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import SessionCard from './SessionCard';
import { SkeletonCardGrid } from '@/components/ui/SkeletonLoader';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface Session {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  instructorImage?: string;
  instructorRating?: number;
  skillName: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  creditCost: number;
  attendees: string[];
  maxAttendees: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

interface SessionListProps {
  sessions: Session[];
  isLoading?: boolean;
  onBook?: (sessionId: string) => void;
  onBookmark?: (sessionId: string) => void;
  bookmarkedSessions?: string[];
  useWindowingForLargeLists?: boolean;
  itemHeight?: number;
  maxHeight?: number;
}

export const SessionList = ({
  sessions,
  isLoading = false,
  onBook,
  onBookmark,
  bookmarkedSessions = [],
  useWindowingForLargeLists = true,
  itemHeight = 350,
  maxHeight = 800,
}: SessionListProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    skillLevel: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Prefetch session details for better UX
  useEffect(() => {
    if (sessions && sessions.length > 0) {
      // Prefetch the first 5 sessions
      sessions.slice(0, 5).forEach(session => {
        router.prefetch(`/sessions/${session.id}`);
      });
    }
  }, [sessions, router]);

  const filteredSessions = useMemo(() => {
    if (!sessions) return [];

    return sessions.filter(session => {
      // Apply search filter
      const matchesSearch = searchQuery === '' || 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.skillName.toLowerCase().includes(searchQuery.toLowerCase());

      // Apply status filter
      const matchesStatus = filters.status === 'all' || session.status === filters.status;

      // Apply skill level filter
      const matchesSkillLevel = filters.skillLevel === 'all' || session.skillLevel === filters.skillLevel;

      return matchesSearch && matchesStatus && matchesSkillLevel;
    });
  }, [sessions, searchQuery, filters]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      status: 'all',
      skillLevel: 'all',
    });
  };

  const hasActiveFilters = searchQuery !== '' || filters.status !== 'all' || filters.skillLevel !== 'all';

  if (isLoading) {
    return <SkeletonCardGrid count={6} />;
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">No sessions found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          There are no sessions available at the moment. Please check back later.
        </p>
      </div>
    );
  }

  // Render a grid for small lists or when windowing is disabled
  if (!useWindowingForLargeLists || sessions.length < 20) {
    return (
      <div>
        {/* Search and filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions, instructors, skills..."
                className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <FiX />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FiFilter />
                <span>Filters</span>
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skill Level
                </label>
                <select
                  value={filters.skillLevel}
                  onChange={(e) => setFilters({ ...filters, skillLevel: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'}
        </div>

        {/* Session grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onBook={onBook}
              onBookmark={onBookmark}
              isBookmarked={bookmarkedSessions.includes(session.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Use windowing for large lists
  return (
    <div>
      {/* Search and filters (same as above) */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions, instructors, skills..."
              className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FiX />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FiFilter />
              <span>Filters</span>
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Skill Level
              </label>
              <select
                value={filters.skillLevel}
                onChange={(e) => setFilters({ ...filters, skillLevel: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'}
      </div>

      {/* Windowed list */}
      <div style={{ height: Math.min(maxHeight, filteredSessions.length * (itemHeight + 24)) }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              itemCount={filteredSessions.length}
              itemSize={itemHeight + 24} // Add some spacing
              itemData={{
                sessions: filteredSessions,
                onBook,
                onBookmark,
                bookmarkedSessions,
              }}
            >
              {({ index, style, data }) => (
                <div style={{ ...style, padding: '12px' }}>
                  <SessionCard
                    session={data.sessions[index]}
                    onBook={data.onBook}
                    onBookmark={data.onBookmark}
                    isBookmarked={data.bookmarkedSessions.includes(data.sessions[index].id)}
                  />
                </div>
              )}
            </List>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default SessionList;
