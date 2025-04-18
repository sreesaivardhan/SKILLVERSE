import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Session {
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
  rating?: number;
  reviews?: Array<{
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

interface SessionState {
  sessions: Session[];
  userSessions: Session[];
  currentSession: Session | null;
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  sessions: [],
  userSessions: [],
  currentSession: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllSessions = createAsyncThunk('sessions/fetchAll', async (_, { rejectWithValue, getState }) => {
  try {
    const token = (getState() as any).auth.token;
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    const response = await axios.get('/api/sessions', config);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch sessions');
  }
});

export const fetchUserSessions = createAsyncThunk(
  'sessions/fetchUserSessions',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth.token;
      if (!token) {
        throw new Error('No token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('/api/sessions/user', config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user sessions');
    }
  }
);

export const fetchSessionById = createAsyncThunk(
  'sessions/fetchById',
  async (sessionId: string, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth.token;
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      const response = await axios.get(`/api/sessions/${sessionId}`, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch session');
    }
  }
);

export const createSession = createAsyncThunk(
  'sessions/create',
  async (sessionData: Partial<Session>, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth.token;
      if (!token) {
        throw new Error('No token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post('/api/sessions', sessionData, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create session');
    }
  }
);

export const bookSession = createAsyncThunk(
  'sessions/book',
  async (sessionId: string, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth.token;
      if (!token) {
        throw new Error('No token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`/api/sessions/${sessionId}/book`, {}, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to book session');
    }
  }
);

export const cancelSession = createAsyncThunk(
  'sessions/cancel',
  async (sessionId: string, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth.token;
      if (!token) {
        throw new Error('No token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`/api/sessions/${sessionId}/cancel`, {}, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel session');
    }
  }
);

export const rateSession = createAsyncThunk(
  'sessions/rate',
  async (
    { sessionId, rating, comment }: { sessionId: string; rating: number; comment: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = (getState() as any).auth.token;
      if (!token) {
        throw new Error('No token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `/api/sessions/${sessionId}/review`,
        { rating, comment },
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to rate session');
    }
  }
);

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    clearSessionError: (state) => {
      state.error = null;
    },
    clearCurrentSession: (state) => {
      state.currentSession = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Sessions
      .addCase(fetchAllSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSessions.fulfilled, (state, action: PayloadAction<Session[]>) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchAllSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Sessions
      .addCase(fetchUserSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSessions.fulfilled, (state, action: PayloadAction<Session[]>) => {
        state.loading = false;
        state.userSessions = action.payload;
      })
      .addCase(fetchUserSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Session By Id
      .addCase(fetchSessionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionById.fulfilled, (state, action: PayloadAction<Session>) => {
        state.loading = false;
        state.currentSession = action.payload;
      })
      .addCase(fetchSessionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Session
      .addCase(createSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSession.fulfilled, (state, action: PayloadAction<Session>) => {
        state.loading = false;
        state.sessions = [...state.sessions, action.payload];
        state.userSessions = [...state.userSessions, action.payload];
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Book Session
      .addCase(bookSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookSession.fulfilled, (state, action: PayloadAction<Session>) => {
        state.loading = false;
        state.userSessions = [...state.userSessions, action.payload];
        state.sessions = state.sessions.map((session) =>
          session.id === action.payload.id ? action.payload : session
        );
        if (state.currentSession && state.currentSession.id === action.payload.id) {
          state.currentSession = action.payload;
        }
      })
      .addCase(bookSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cancel Session
      .addCase(cancelSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSession.fulfilled, (state, action: PayloadAction<Session>) => {
        state.loading = false;
        state.userSessions = state.userSessions.filter((session) => session.id !== action.payload.id);
        state.sessions = state.sessions.map((session) =>
          session.id === action.payload.id ? action.payload : session
        );
        if (state.currentSession && state.currentSession.id === action.payload.id) {
          state.currentSession = action.payload;
        }
      })
      .addCase(cancelSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Rate Session
      .addCase(rateSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rateSession.fulfilled, (state, action: PayloadAction<Session>) => {
        state.loading = false;
        state.userSessions = state.userSessions.map((session) =>
          session.id === action.payload.id ? action.payload : session
        );
        state.sessions = state.sessions.map((session) =>
          session.id === action.payload.id ? action.payload : session
        );
        if (state.currentSession && state.currentSession.id === action.payload.id) {
          state.currentSession = action.payload;
        }
      })
      .addCase(rateSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSessionError, clearCurrentSession } = sessionSlice.actions;
export default sessionSlice.reducer;
