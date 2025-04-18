import Link from 'next/link';
import { FiClock, FiCalendar, FiUser, FiAward } from 'react-icons/fi';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge, badgeVariants } from '@/components/ui/Badge';
import { Button, buttonVariants } from '@/components/ui/Button';
import { formatDate, formatTime, getSkillLevelColor, getStatusColor, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SessionCardProps {
  session: {
    id: string;
    title: string;
    description: string;
    instructorId: string;
    instructorName: string;
    instructorImage?: string;
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
  isLoading?: boolean;
}

const SessionCard = ({ session, onBook, isLoading = false }: SessionCardProps) => {
  const {
    id,
    title,
    description,
    instructorName,
    instructorImage,
    skillName,
    skillLevel,
    date,
    startTime,
    endTime,
    creditCost,
    attendees,
    maxAttendees,
    status,
  } = session;

  const isFullyBooked = attendees.length >= maxAttendees;
  const spotsLeft = maxAttendees - attendees.length;

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <CardContent className="flex-1 pt-6">
        <div className="flex justify-between items-start mb-4">
          <span className={cn(badgeVariants({ variant: "primary" }), "mb-2")}>
            {skillName}
          </span>
          <span className={cn(badgeVariants(), getStatusColor(status))}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
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
            <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <FiUser className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isFullyBooked ? 'Fully booked' : `${spotsLeft} spots left`}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {creditCost} credits
            </span>
            {onBook && status === 'scheduled' && (
              <button
                className={cn(buttonVariants({ size: "sm" }))}
                onClick={() => onBook(id)}
                disabled={isFullyBooked || isLoading}
              >
                {isLoading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                {isFullyBooked ? 'Full' : 'Book Now'}
              </button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SessionCard;
