// Authentication utility functions for SkillVerse
import axiosInstance from './api/axios';
import { jwtDecode } from 'jwt-decode';

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

// Login user with persistent session
export const loginUser = async (credentials) => {
  const res = await axiosInstance.post('/api/auth/login', credentials);
  const { token } = res.data;
  
  // Store token in localStorage for persistence
  localStorage.setItem('token', token);
  
  // Set session cookie for additional persistence
  document.cookie = `auth_token=${token}; path=/; max-age=${60*60*24*7}`; // 7 days
  
  // Set axios default header
  axiosInstance.defaults.headers.common['x-auth-token'] = token;
  
  return res.data;
};

// Logout user
export const logoutUser = () => {
  // Remove token from localStorage
  localStorage.removeItem('token');
  
  // Clear session cookie
  document.cookie = 'auth_token=; path=/; max-age=0';
  
  // Remove axios default header
  delete axiosInstance.defaults.headers.common['x-auth-token'];
};

// Check if user is authenticated with multiple fallbacks
export const isAuthenticated = () => {
  // First check localStorage
  const token = localStorage.getItem('token');
  if (token && isTokenValid(token)) {
    return true;
  }
  
  // Then check cookies as fallback
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
  if (authCookie) {
    const cookieToken = authCookie.split('=')[1];
    if (isTokenValid(cookieToken)) {
      // Restore localStorage if cookie is valid but localStorage is missing
      localStorage.setItem('token', cookieToken);
      axiosInstance.defaults.headers.common['x-auth-token'] = cookieToken;
      return true;
    }
  }
  
  return false;
};

// Initialize auth state on app startup or page change
export const initAuth = () => {
  // First try localStorage
  const token = localStorage.getItem('token');
  
  if (token && isTokenValid(token)) {
    axiosInstance.defaults.headers.common['x-auth-token'] = token;
    return true;
  }
  
  // Try cookie as fallback
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
  if (authCookie) {
    const cookieToken = authCookie.split('=')[1];
    if (isTokenValid(cookieToken)) {
      localStorage.setItem('token', cookieToken);
      axiosInstance.defaults.headers.common['x-auth-token'] = cookieToken;
      return true;
    }
  }
  
  // Clear invalid tokens
  localStorage.removeItem('token');
  document.cookie = 'auth_token=; path=/; max-age=0';
  return false;
};
