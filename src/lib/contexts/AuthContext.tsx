'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subscribeToAuth, getAuthState, isAuthenticated, logoutUser } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuth((state: { isAuthenticated: boolean; user: any; loading: boolean }) => {
      setAuthState({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
      });
    });
    
    // Initial auth check
    const currentState = getAuthState();
    setAuthState({
      isAuthenticated: currentState.isAuthenticated,
      user: currentState.user,
      loading: currentState.loading,
    });
    
    // Check authentication status
    isAuthenticated();
    
    return () => {
      // Cleanup subscription on unmount
      unsubscribe();
    };
  }, []);

  const logout = () => {
    logoutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        loading: authState.loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
