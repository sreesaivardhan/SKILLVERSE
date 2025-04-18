// Authentication utility functions for SkillVerse
import axiosInstance from './api/axios';
import { jwtDecode } from 'jwt-decode';

// Create a global auth state that can be accessed from anywhere
let globalAuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true
};

// Auth state change listeners
const authListeners = [];

// Subscribe to auth state changes
export const subscribeToAuth = (callback) => {
  authListeners.push(callback);
  // Immediately call with current state
  callback(globalAuthState);
  
  // Return unsubscribe function
  return () => {
    const index = authListeners.indexOf(callback);
    if (index > -1) {
      authListeners.splice(index, 1);
    }
  };
};

// Notify all listeners of auth state change
const notifyAuthChange = () => {
  authListeners.forEach(listener => listener(globalAuthState));
};

// Check if token is valid (not expired)
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

// Get user from token
export const getUserFromToken = (token) => {
  if (!token) return null;
  
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Set auth token in all storage locations
const setAuthToken = (token) => {
  // Store in global state
  globalAuthState.token = token;
  globalAuthState.isAuthenticated = true;
  globalAuthState.user = getUserFromToken(token);
  
  // Store token in localStorage for persistence
  localStorage.setItem('token', token);
  
  // Set session cookie for additional persistence (works across tabs)
  document.cookie = `auth_token=${token}; path=/; max-age=${60*60*24*7}`; // 7 days
  
  // Set axios default header
  axiosInstance.defaults.headers.common['x-auth-token'] = token;
  
  // Notify subscribers
  notifyAuthChange();
};

// Clear auth token from all storage locations
const clearAuthToken = () => {
  // Clear from global state
  globalAuthState.token = null;
  globalAuthState.isAuthenticated = false;
  globalAuthState.user = null;
  
  // Remove token from localStorage
  localStorage.removeItem('token');
  
  // Clear session cookie
  document.cookie = 'auth_token=; path=/; max-age=0';
  
  // Remove axios default header
  delete axiosInstance.defaults.headers.common['x-auth-token'];
  
  // Notify subscribers
  notifyAuthChange();
};

// Login user with persistent session
export const loginUser = async (credentials) => {
  try {
    globalAuthState.loading = true;
    notifyAuthChange();
    
    const res = await axiosInstance.post('/api/auth/login', credentials);
    const { token } = res.data;
    
    setAuthToken(token);
    
    globalAuthState.loading = false;
    notifyAuthChange();
    
    return res.data;
  } catch (error) {
    globalAuthState.loading = false;
    notifyAuthChange();
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  clearAuthToken();
};

// Check if user is authenticated with multiple fallbacks
export const isAuthenticated = () => {
  // If we already have a valid token in global state, use it
  if (globalAuthState.token && isTokenValid(globalAuthState.token)) {
    return true;
  }
  
  // First check localStorage
  const token = localStorage.getItem('token');
  if (token && isTokenValid(token)) {
    setAuthToken(token);
    return true;
  }
  
  // Then check cookies as fallback
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
  if (authCookie) {
    const cookieToken = authCookie.split('=')[1];
    if (isTokenValid(cookieToken)) {
      setAuthToken(cookieToken);
      return true;
    }
  }
  
  return false;
};

// Get current auth state
export const getAuthState = () => {
  return { ...globalAuthState };
};

// Initialize auth state on app startup or page change
export const initAuth = () => {
  globalAuthState.loading = true;
  notifyAuthChange();
  
  const isAuth = isAuthenticated();
  
  globalAuthState.loading = false;
  notifyAuthChange();
  
  return isAuth;
};

// Initialize on load
if (typeof window !== 'undefined') {
  initAuth();
  
  // Set up event listener for storage changes (for cross-tab synchronization)
  window.addEventListener('storage', (event) => {
    if (event.key === 'token') {
      if (event.newValue) {
        // Another tab logged in
        if (isTokenValid(event.newValue)) {
          setAuthToken(event.newValue);
        }
      } else {
        // Another tab logged out
        clearAuthToken();
      }
    }
  });
}
