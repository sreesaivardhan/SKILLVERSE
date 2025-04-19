'use client';

import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { RootState } from '@/lib/redux/store';
import { loadUser } from '@/lib/redux/slices/authSlice';
import { AppDispatch } from '@/lib/redux/store';
import { AuthProvider } from '@/lib/contexts/AuthContext';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const { token } = useSelector((state: RootState) => state.auth);
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  
  const isDashboardPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  // Load user data if token exists
  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Header />
        
        <div className="flex flex-1 pt-16">
          {/* Sidebar for dashboard pages */}
          {isDashboardPage && (
            <div className={`fixed inset-y-0 left-0 z-30 w-64 pt-16 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <Sidebar />
            </div>
          )}
          
          {/* Main content */}
          <main 
            className={`flex-1 transition-all duration-300 ${isDashboardPage ? 'lg:pl-64' : ''}`}
          >
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
        
        {/* Only show footer on non-dashboard pages */}
        {!isDashboardPage && <Footer />}
      </div>
    </AuthProvider>
  );
};

export default MainLayout;
