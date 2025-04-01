import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { NavBar } from '@/components/NavBar';

export const ProtectedRoute: React.FC = () => {
  const { user, isLoading: authIsLoading } = useAuth();
  const { initializeContext } = useLocalStorage();
  const location = useLocation();
  const [initializing, setInitializing] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Handle initial context setup
  useEffect(() => {
    const setupContext = async () => {
      // Only initialize once and only if we have a user
      if (!user || initializing || initialized) return;
      
      try {
        setInitializing(true);
        console.log("ProtectedRoute: Setting up local storage context for user", user.id);
        await initializeContext(user.id);
        setInitialized(true);
      } catch (error) {
        console.error("ProtectedRoute: Error initializing context:", error);
      } finally {
        setInitializing(false);
      }
    };
    
    setupContext();
  }, [user?.id, initialized, initializing]);

  // Handle loading state
  if (authIsLoading || (user && initializing && !initialized)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-learny-purple"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Render the authenticated layout
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 bg-gradient-to-b from-gray-900 to-gray-800 text-foreground">
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// PublicRoute for auth pages
export const PublicRoute: React.FC = () => {
    const { user, isLoading: authIsLoading } = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/home';

    // Simple loading indicator while auth loads
    if (authIsLoading) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-learny-purple"></div>
          </div>
        );
    }

    // Redirect to home if already authenticated
    if (user && location.pathname === '/auth') {
        return <Navigate to={from} replace />;
    }

    return <Outlet />;
};