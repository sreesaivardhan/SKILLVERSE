import { useState, useEffect, useCallback, memo } from 'react';
import Link from 'next/link';
import { FiClock, FiCalendar, FiUser, FiAward, FiBookmark, FiStar, FiActivity, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge, badgeVariants } from '@/components/ui/Badge';
import { Button, buttonVariants } from '@/components/ui/Button';
import { formatDate, formatTime, getSkillLevelColor, getStatusColor, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/Tooltip';

// Helper function to calculate time left until session starts
const calculateTimeLeft = (date: string, startTime: string): { days: number; hours: number; minutes: number; seconds: number } | null => {
  const sessionDate = new Date(`${date}T${startTime}`);
  const now = new Date();
  
  const difference = sessionDate.getTime() - now.getTime();
  
  if (difference <= 0) {
    return null; // Session has started
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
};

// Status icons mapping
const statusIcons = {
  scheduled: <FiClock className="text-blue-500" />,
  ongoing: <FiActivity className="text-green-500" />,
  completed: <FiCheckCircle className="text-purple-500" />,
  cancelled: <FiXCircle className="text-red-500" />
};

interface SessionCardProps {
  session: {
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
  };
  onBook?: (sessionId: string) => void;
  onBookmark?: (sessionId: string) => void;
  isLoading?: boolean;
  isBookmarked?: boolean;
}

const SessionCard = ({ 
  session, 
  onBook, 
  onBookmark,
  isLoading = false,
  isBookmarked = false 
}: SessionCardProps) => {
  const {
    id,
    title,
    description,
    instructorName,
    instructorImage,
    instructorRating = 4.5, // Default rating if not provided
    skillName,
    skillLevel,
    date,
    startTime,
    endTime,
    creditCost,
    attendees,
    maxAttendees,
    status,
    duration
  } = session;

  // State for real-time updates
  const [spotsLeft, setSpotsLeft] = useState(maxAttendees - attendees.length);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(date, startTime));
  const [isHovered, setIsHovered] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  
  const isFullyBooked = spotsLeft <= 0;
  
  // Calculate session progress for ongoing sessions
  const calculateProgress = useCallback(() => {
    if (status !== 'ongoing') return 0;
    
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);
    const now = new Date();
    
    const totalDuration = endDateTime.getTime() - startDateTime.getTime();
    const elapsed = now.getTime() - startDateTime.getTime();
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }, [date, startTime, endTime, status]);
  
  const [progress, setProgress] = useState(calculateProgress());
  
  // Update time left countdown
  useEffect(() => {
    if (status !== 'scheduled') return;
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(date, startTime));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [date, startTime, status]);
  
  // Update progress for ongoing sessions
  useEffect(() => {
    if (status !== 'ongoing') return;
    
    const timer = setInterval(() => {
      setProgress(calculateProgress());
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(timer);
  }, [status, calculateProgress]);
  
  // Simulate real-time updates for spots left
  useEffect(() => {
    if (status !== 'scheduled' || isFullyBooked) return;
    
    const interval = setInterval(() => {
      // Simulate real-time updates (replace with actual API call in production)
      setSpotsLeft(prev => {
        const newValue = Math.max(0, prev - (Math.random() > 0.9 ? 1 : 0));
        return newValue;
      });
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [status, isFullyBooked]);
  
  // Handle bookmark toggle
  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    if (onBookmark) {
      onBookmark(id);
    }
  };

  // Format countdown display
  const formatCountdown = () => {
    if (!timeLeft) return 'Starting soon';
    
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h remaining`;
    } else if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m remaining`;
    } else {
      return `${timeLeft.minutes}m ${timeLeft.seconds}s remaining`;
    }
  };

  // Render star rating
  const renderRating = () => {
    const fullStars = Math.floor(instructorRating);
    const hasHalfStar = instructorRating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400">
            {i < fullStars ? (
              <FiStar className="h-3 w-3 fill-current" />
            ) : i === fullStars && hasHalfStar ? (
              <FiStar className="h-3 w-3 fill-current" style={{ clipPath: 'inset(0 50% 0 0)' }} />
            ) : (
              <FiStar className="h-3 w-3" />
            )}
          </span>
        ))}
        <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">{instructorRating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Card 
      className={`h-full flex flex-col transition-all duration-300 ${isHovered ? 'shadow-xl transform -translate-y-1' : 'hover:shadow-lg'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="flex-1 pt-6">
        <div className="flex justify-between items-start mb-4">
          <span className={cn(badgeVariants({ variant: "primary" }), "mb-2")}>
            {skillName}
          </span>
          <div className="flex items-center space-x-2">
            {onBookmark && (
              <button 
                onClick={handleBookmark}
                aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <FiBookmark className={`h-5 w-5 ${bookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
              </button>
            )}
            <Tooltip content={status.charAt(0).toUpperCase() + status.slice(1)}>
              <span className={cn(badgeVariants(), getStatusColor(status), "flex items-center")}>
                {statusIcons[status as keyof typeof statusIcons]}
                <span className="ml-1">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              </span>
            </Tooltip>
          </div>
        </div>

        <Link href={`/sessions/${id}`} className="block group">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
            {title}
          </h3>
        </Link>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FiCalendar className="mr-2 h-4 w-4" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FiClock className="mr-2 h-4 w-4" />
            <span>
              {formatTime(startTime)} - {formatTime(endTime)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FiAward className="mr-2 h-4 w-4" />
            <span>Level: </span>
            <span className={cn(badgeVariants(), `ml-1 ${getSkillLevelColor(skillLevel)}`)}>  
              {skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)}
            </span>
          </div>
          
          {/* Countdown timer for scheduled sessions */}
          {status === 'scheduled' && timeLeft && (
            <div className="mt-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-blue-600 dark:text-blue-400 font-medium">{formatCountdown()}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 mt-1 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full" 
                  style={{ width: `${100 - (timeLeft.days * 24 + timeLeft.hours) / (duration / 60) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Progress bar for ongoing sessions */}
          {status === 'ongoing' && (
            <div className="mt-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-green-600 dark:text-green-400 font-medium">In progress</span>
                <span className="text-gray-600 dark:text-gray-400">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 mt-1 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center mt-4">
          <div className="flex-shrink-0">
            {instructorImage ? (
              <img
                src={instructorImage}
                alt={instructorName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {getInitials(instructorName)}
              </div>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {instructorName}
            </p>
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
              {renderRating()}
            </div>
          </div>
        </div>
        
        {/* Preview content that shows on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 p-6 flex flex-col justify-between opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FiCalendar className="mr-2 h-4 w-4" />
                  <span>{formatDate(date)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FiClock className="mr-2 h-4 w-4" />
                  <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FiUser className="mr-2 h-4 w-4" />
                  <span>{isFullyBooked ? 'Fully booked' : `${spotsLeft} spots left`}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-auto">
              {onBook && status === 'scheduled' && (
                <Link 
                  href={`/sessions/${id}`}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center mt-4")}
                >
                  View Details
                </Link>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <FiUser className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span 
              className={`text-sm ${spotsLeft <= 3 && !isFullyBooked ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}
            >
              {isFullyBooked ? (
                <span className="text-red-500 font-medium">Fully booked</span>
              ) : spotsLeft === 1 ? (
                <span>Last spot!</span>
              ) : (
                `${spotsLeft} spots left`
              )}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {creditCost} credits
            </span>
            {onBook && status === 'scheduled' && (
              <button
                aria-label={`Book session: ${title}`}
                className={cn(buttonVariants({ size: "sm" }))}
                onClick={() => onBook(id)}
                disabled={isFullyBooked || isLoading}
                onKeyDown={(e) => e.key === 'Enter' && !isFullyBooked && !isLoading && onBook(id)}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="sr-only">Processing booking...</span>
                    Processing
                  </>
                ) : isFullyBooked ? 'Full' : 'Book Now'}
              </button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

// Error boundary for SessionCard
class SessionErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  
  static getDerivedStateFromError() { 
    return { hasError: true }; 
  }
  
  render() {
    return this.state.hasError ? (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-red-800 dark:text-red-300">Failed to load session. Please try again.</p>
      </div>
    ) : this.props.children;
  }
}

// Wrap the SessionCard with error boundary and memo for performance
const MemoizedSessionCard = memo(SessionCard);

// Export the component with error boundary
const SessionCardWithErrorBoundary = (props: SessionCardProps) => (
  <SessionErrorBoundary>
    <MemoizedSessionCard {...props} />
  </SessionErrorBoundary>
);

export default SessionCardWithErrorBoundary;
