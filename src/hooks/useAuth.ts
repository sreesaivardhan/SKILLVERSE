import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/lib/redux/store';
import { login, logout, register, loadUser } from '@/lib/redux/slices/authSlice';
import { useState } from 'react';
import axiosInstance from '@/lib/api/axios';

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(login({ email, password }) as any);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData: { name: string; email: string; password: string; role?: string }) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(register(userData) as any);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const checkAuthStatus = async () => {
    if (localStorage.getItem('token') && !auth.user) {
      try {
        await dispatch(loadUser() as any);
      } catch (err) {
        console.error('Failed to load user', err);
      }
    }
  };

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    authLoading: auth.loading || loading,
    error: auth.error || error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    checkAuthStatus
  };
};

export default useAuth;
