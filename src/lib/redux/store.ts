import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/lib/redux/slices/authSlice';
import sessionReducer from '@/lib/redux/slices/sessionSlice';
import uiReducer from '@/lib/redux/slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sessions: sessionReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
