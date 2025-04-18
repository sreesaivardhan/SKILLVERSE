'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FiCalendar, FiClock, FiUser, FiEdit, FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { RootState } from '@/lib/redux/store';
import sessionService, { Session } from '@/lib/api/services/sessionService';
import skillsService, { Skill } from '@/lib/api/services/skillsService';
import { formatDate, formatDuration } from '@/src/utils/validation';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // New skill form state
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' });
  const [skillFormError, setSkillFormError] = useState<string | null>(null);

  // Session action state
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch user data
    fetchDashboardData();
  }, [isAuthenticated, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch upcoming sessions
      const sessions = await sessionService.getUpcomingSessions();
      setUpcomingSessions(sessions);
      
      // Set user skills from user object
      if (user && user.skills) {
        setUserSkills(user.skills);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error('Dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSkillFormError(null);
    setActionLoading(true);
    
    try {
      if (!newSkill.name.trim()) {
        setSkillFormError('Skill name is required');
        return;
      }
      
      const updatedSkills = await skillsService.addSkill(newSkill);
      setUserSkills(updatedSkills);
      setNewSkill({ name: '', level: 'Beginner' });
      setShowSkillForm(false);
    } catch (err: any) {
      setSkillFormError(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateSkill = async (name: string, level: string) => {
    setActionLoading(true);
    
    try {
      const updatedSkills = await skillsService.updateSkill({ name, level });
      setUserSkills(updatedSkills);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update skill');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSkill = async (name: string) => {
    setActionLoading(true);
    
    try {
      const updatedSkills = await skillsService.deleteSkill(name);
      setUserSkills(updatedSkills);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete skill');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSessionAction = async (sessionId: string, action: 'confirm' | 'complete' | 'cancel') => {
    setActionLoading(true);
    
    try {
      let updatedSession;
      
      switch (action) {
        case 'confirm':
          updatedSession = await sessionService.confirmSession(sessionId);
          break;
        case 'complete':
          updatedSession = await sessionService.completeSession(sessionId);
          break;
        case 'cancel':
          updatedSession = await sessionService.cancelSession(sessionId);
          break;
      }
      
      // Refresh sessions after action
      const sessions = await sessionService.getUpcomingSessions();
      setUpcomingSessions(sessions);
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${action} session`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4">
      <div className="container mx-auto max-w-6xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button 
              className="float-right" 
              onClick={() => setError(null)}
              aria-label="Dismiss"
            >
              <FiX />
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - User info and skills */}
          <div className="md:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl mr-4">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.name} 
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    user?.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{user?.role}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Credits</h3>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{user?.credits || 0}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full" 
                    style={{ width: `${Math.min((user?.credits || 0) * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Skills section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Skills</h3>
                <Button 
                  onClick={() => setShowSkillForm(!showSkillForm)}
                  variant="outline"
                  size="sm"
                >
                  {showSkillForm ? <FiX className="mr-1" /> : <FiPlus className="mr-1" />}
                  {showSkillForm ? 'Cancel' : 'Add Skill'}
                </Button>
              </div>

              {showSkillForm && (
                <form onSubmit={handleAddSkill} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Skill Name
                    </label>
                    <Input
                      type="text"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="e.g. JavaScript, Photography, etc."
                      className="w-full"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Skill Level
                    </label>
                    <select
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  
                  {skillFormError && (
                    <p className="text-red-600 text-sm mb-3">{skillFormError}</p>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Adding...' : 'Add Skill'}
                    </Button>
                  </div>
                </form>
              )}

              {userSkills.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  You haven't added any skills yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {userSkills.map((skill, index) => (
                    <li 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {skill.name}
                          {skill.verified && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {skill.level}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteSkill(skill.name)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                          disabled={actionLoading}
                          aria-label="Delete skill"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right column - Sessions */}
          <div className="md:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upcoming Sessions
              </h3>

              {upcomingSessions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FiCalendar size={48} className="mx-auto" />
                  </div>
                  <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    No upcoming sessions
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {user?.role === 'instructor' 
                      ? "You don't have any upcoming teaching sessions."
                      : "You haven't booked any learning sessions yet."}
                  </p>
                  <Button
                    onClick={() => router.push('/marketplace')}
                  >
                    {user?.role === 'instructor' 
                      ? "View Teaching Opportunities"
                      : "Browse Skills Marketplace"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div 
                      key={session._id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex flex-col md:flex-row justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            {session.skill}
                          </h4>
                          <p className="text-gray-500 dark:text-gray-400">
                            {formatDate(session.startTime)} • {formatDuration(session.duration)}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                            ${session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${session.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                            ${session.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                            ${session.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                        <FiUser className="mr-2" />
                        <span>
                          {user?.id === session.learner 
                            ? `Instructor: [Instructor Name]` // Replace with actual instructor name
                            : `Learner: [Learner Name]`} // Replace with actual learner name
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* Session actions based on role and status */}
                        {user?.role === 'instructor' && session.status === 'pending' && (
                          <Button
                            onClick={() => handleSessionAction(session._id, 'confirm')}
                            disabled={actionLoading}
                            variant="default"
                            size="sm"
                          >
                            <FiCheck className="mr-1" /> Confirm
                          </Button>
                        )}
                        
                        {user?.role === 'instructor' && session.status === 'confirmed' && (
                          <Button
                            onClick={() => handleSessionAction(session._id, 'complete')}
                            disabled={actionLoading}
                            variant="default"
                            size="sm"
                          >
                            <FiCheck className="mr-1" /> Complete
                          </Button>
                        )}
                        
                        {session.status !== 'completed' && session.status !== 'cancelled' && (
                          <Button
                            onClick={() => handleSessionAction(session._id, 'cancel')}
                            disabled={actionLoading}
                            variant="destructive"
                            size="sm"
                          >
                            <FiX className="mr-1" /> Cancel
                          </Button>
                        )}
                        
                        {session.status === 'confirmed' && session.meetingLink && (
                          <Button
                            onClick={() => router.push(`/session/${session._id}`)}
                            variant="secondary"
                            size="sm"
                          >
                            Join Session
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
