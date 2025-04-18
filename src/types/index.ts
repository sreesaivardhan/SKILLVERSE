// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'learner' | 'instructor' | 'admin';
  profileImage?: string;
  bio?: string;
  skills?: string[];
  credits: number;
  createdAt: string;
  updatedAt: string;
}

// Session Types
export interface Session {
  _id: string;
  instructor: User | string;
  learner: User | string;
  skill: string;
  startTime: string;
  duration: number;
  credits: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  error: string | null;
}

// UI Types
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  read: boolean;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
