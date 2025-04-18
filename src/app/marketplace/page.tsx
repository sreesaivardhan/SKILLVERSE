'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FiSearch, FiFilter, FiStar, FiUser, FiClock, FiCalendar } from 'react-icons/fi';
import { RootState } from '@/lib/redux/store';
import axiosInstance from '@/lib/api/axios';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';

interface Instructor {
  _id: string;
  name: string;
  profileImage?: string;
  bio?: string;
  skills: Array<{
    name: string;
    level: string;
    verified: boolean;
  }>;
  rating: number;
  sessionCount: number;
}

export default function Marketplace() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Booking modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [bookingData, setBookingData] = useState({
    skill: '',
    date: '',
    time: '',
    duration: 30
  });
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Get all available skills from instructors
  const allSkills = Array.from(
    new Set(
      instructors.flatMap(instructor => 
        instructor.skills.map(skill => skill.name)
      )
    )
  ).sort();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchInstructors();
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Filter instructors based on search query and selected skill
    if (instructors.length > 0) {
      let filtered = [...instructors];
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          instructor => 
            instructor.name.toLowerCase().includes(query) ||
            instructor.skills.some(skill => 
              skill.name.toLowerCase().includes(query)
            )
        );
      }
      
      if (selectedSkill) {
        filtered = filtered.filter(
          instructor => 
            instructor.skills.some(skill => 
              skill.name === selectedSkill
            )
        );
      }
      
      setFilteredInstructors(filtered);
    }
  }, [instructors, searchQuery, selectedSkill]);

  const fetchInstructors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, you would fetch from your API
      // For now, we'll create mock data
      const mockInstructors: Instructor[] = [
        {
          _id: '1',
          name: 'John Doe',
          profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
          bio: 'Experienced web developer with 10+ years in React and Node.js',
          skills: [
            { name: 'JavaScript', level: 'Expert', verified: true },
            { name: 'React', level: 'Expert', verified: true },
            { name: 'Node.js', level: 'Advanced', verified: true }
          ],
          rating: 4.9,
          sessionCount: 42
        },
        {
          _id: '2',
          name: 'Jane Smith',
          profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
          bio: 'Digital marketing specialist with focus on SEO and content strategy',
          skills: [
            { name: 'Digital Marketing', level: 'Expert', verified: true },
            { name: 'SEO', level: 'Expert', verified: true },
            { name: 'Content Creation', level: 'Advanced', verified: true }
          ],
          rating: 4.8,
          sessionCount: 38
        },
        {
          _id: '3',
          name: 'Alex Johnson',
          profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
          bio: 'Data scientist specializing in machine learning and AI',
          skills: [
            { name: 'Python', level: 'Expert', verified: true },
            { name: 'Machine Learning', level: 'Expert', verified: true },
            { name: 'Data Analysis', level: 'Advanced', verified: true }
          ],
          rating: 4.9,
          sessionCount: 27
        },
        {
          _id: '4',
          name: 'Emily Chen',
          profileImage: 'https://randomuser.me/api/portraits/women/4.jpg',
          bio: 'Graphic designer with expertise in UI/UX design',
          skills: [
            { name: 'UI/UX Design', level: 'Expert', verified: true },
            { name: 'Adobe Photoshop', level: 'Expert', verified: true },
            { name: 'Figma', level: 'Advanced', verified: true }
          ],
          rating: 4.7,
          sessionCount: 35
        }
      ];
      
      setInstructors(mockInstructors);
      setFilteredInstructors(mockInstructors);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setBookingData({
      skill: instructor.skills[0]?.name || '',
      date: '',
      time: '',
      duration: 30
    });
    setBookingError(null);
    setBookingSuccess(null);
    setShowBookingModal(true);
  };

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSuccess(null);
    
    if (!selectedInstructor) return;
    
    // Validate form
    if (!bookingData.skill || !bookingData.date || !bookingData.time) {
      setBookingError('Please fill in all required fields');
      return;
    }
    
    try {
      // In a real app, you would call your API
      // For now, we'll simulate a successful booking
      
      // Create ISO date string from date and time
      const startTime = new Date(`${bookingData.date}T${bookingData.time}`);
      
      // Simulate API call
      // await sessionService.bookSession({
      //   instructorId: selectedInstructor._id,
      //   skill: bookingData.skill,
      //   startTime: startTime.toISOString(),
      //   duration: Number(bookingData.duration)
      // });
      
      setBookingSuccess('Session booked successfully! The instructor will confirm shortly.');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowBookingModal(false);
      }, 2000);
    } catch (err: any) {
      setBookingError(err.response?.data?.message || 'Failed to book session');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Find Instructors
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect with skilled instructors and book sessions to learn new skills
          </p>
        </div>

        {/* Search and filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search by name or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
              >
                <FiFilter className="mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Skill
                  </label>
                  <select
                    value={selectedSkill || ''}
                    onChange={(e) => setSelectedSkill(e.target.value || null)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
                  >
                    <option value="">All Skills</option>
                    {allSkills.map(skill => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructors grid */}
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        ) : filteredInstructors.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FiUser size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No instructors found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search or filters to find instructors.
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedSkill(null);
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstructors.map(instructor => (
              <div 
                key={instructor._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                      {instructor.profileImage ? (
                        <img
                          src={instructor.profileImage}
                          alt={instructor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiUser size={32} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {instructor.name}
                      </h3>
                      <div className="flex items-center text-yellow-500">
                        <FiStar className="fill-current" />
                        <span className="ml-1 text-gray-700 dark:text-gray-300">
                          {instructor.rating} ({instructor.sessionCount} sessions)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {instructor.bio}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {instructor.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium"
                        >
                          {skill.name}
                          {skill.verified && <span className="ml-1">✓</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => openBookingModal(instructor)}
                    className="w-full"
                  >
                    Book Session
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Book a Session
                </h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-200 dark:bg-gray-700">
                    {selectedInstructor.profileImage ? (
                      <img
                        src={selectedInstructor.profileImage}
                        alt={selectedInstructor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiUser size={24} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {selectedInstructor.name}
                    </h4>
                    <div className="flex items-center text-yellow-500 text-sm">
                      <FiStar className="fill-current" />
                      <span className="ml-1 text-gray-700 dark:text-gray-300">
                        {selectedInstructor.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleBookSession}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Skill
                    </label>
                    <select
                      name="skill"
                      value={bookingData.skill}
                      onChange={handleBookingChange}
                      required
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
                    >
                      {selectedInstructor.skills.map(skill => (
                        <option key={skill.name} value={skill.name}>
                          {skill.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <Input
                        type="date"
                        name="date"
                        value={bookingData.date}
                        onChange={handleBookingChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiClock className="text-gray-400" />
                      </div>
                      <Input
                        type="time"
                        name="time"
                        value={bookingData.time}
                        onChange={handleBookingChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (minutes)
                    </label>
                    <select
                      name="duration"
                      value={bookingData.duration}
                      onChange={handleBookingChange}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
                    >
                      <option value={30}>30 minutes (1 credit)</option>
                      <option value={60}>60 minutes (2 credits)</option>
                      <option value={90}>90 minutes (3 credits)</option>
                      <option value={120}>120 minutes (4 credits)</option>
                    </select>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">
                        Your credits
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user?.credits || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">
                        Session cost
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {Math.ceil(Number(bookingData.duration) / 30)} credits
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Remaining after booking
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {Math.max(0, (user?.credits || 0) - Math.ceil(Number(bookingData.duration) / 30))} credits
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {bookingError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p>{bookingError}</p>
                    </div>
                  )}
                  
                  {bookingSuccess && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
                      <p>{bookingSuccess}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      onClick={() => setShowBookingModal(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        !bookingData.skill || 
                        !bookingData.date || 
                        !bookingData.time ||
                        (user?.credits || 0) < Math.ceil(Number(bookingData.duration) / 30)
                      }
                    >
                      Book Session
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
