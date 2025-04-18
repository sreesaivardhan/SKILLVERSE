import axiosInstance from '../axios';

export interface Session {
  _id: string;
  instructor: string;
  learner: string;
  skill: string;
  startTime: string;
  duration: number;
  credits: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  rating?: number;
  review?: string;
}

export const sessionService = {
  // Book a new session
  bookSession: async (sessionData: { 
    instructorId: string; 
    skill: string; 
    startTime: string; 
    duration: number; 
  }) => {
    const response = await axiosInstance.post('/api/sessions/book', sessionData);
    return response.data;
  },

  // Confirm a session (instructor only)
  confirmSession: async (sessionId: string) => {
    const response = await axiosInstance.put(`/api/sessions/${sessionId}/confirm`);
    return response.data;
  },

  // Complete a session (instructor only)
  completeSession: async (sessionId: string) => {
    const response = await axiosInstance.post(`/api/sessions/complete/${sessionId}`);
    return response.data;
  },

  // Cancel a session
  cancelSession: async (sessionId: string) => {
    const response = await axiosInstance.post(`/api/sessions/cancel/${sessionId}`);
    return response.data;
  },

  // Rate and review a session (learner only)
  rateSession: async (sessionId: string, ratingData: { rating: number; review?: string }) => {
    const response = await axiosInstance.post(`/api/sessions/rate/${sessionId}`, ratingData);
    return response.data;
  },

  // Get upcoming sessions
  getUpcomingSessions: async () => {
    const response = await axiosInstance.get('/api/sessions/upcoming');
    return response.data;
  }
};

export default sessionService;
