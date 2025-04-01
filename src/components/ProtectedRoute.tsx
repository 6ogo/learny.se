import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { NavBar } from '@/components/NavBar';

export const ProtectedRoute: React.FC = () => {
  const { user, isLoading: authIsLoading } = useAuth();
  const { isContextLoading: isLocalStorageLoading, initializeContext } = useLocalStorage();
  const location = useLocation();
  const [initStarted, setInitStarted] = useState(false);
  const [timeoutExpired, setTimeoutExpired] = useState(false);

  // Set up timeout to prevent infinite loading state
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log("ProtectedRoute: Loading timeout reached");
      setTimeoutExpired(true);
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeoutId);
  }, []);

  // Only initialize storage context once when we have a user and haven't started init
  useEffect(() => {
    if (user && !initStarted) {
      console.log("ProtectedRoute: Initializing LocalStorage context for user", user.id);
      setInitStarted(true);
      initializeContext(user.id).catch(err => {
        console.error("Error initializing context:", err);
      });
    }
  }, [user, initStarted, initializeContext]);

  // Show loading only for a reasonable amount of time
  const isLoading = (authIsLoading || (initStarted && isLocalStorageLoading)) && !timeoutExpired;

  console.log("ProtectedRoute: AuthLoading:", authIsLoading, 
              "LocalStorageLoading:", isLocalStorageLoading,
              "InitStarted:", initStarted,
              "TimeoutExpired:", timeoutExpired,
              "User:", user ? user.id : null);

  if (isLoading) {
    console.log("ProtectedRoute: Rendering Loading Spinner");
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-learny-purple"></div>
      </div>
    );
  }

  // Force redirect if no user (after loading is finished or timeout expired)
  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Render the common layout for authenticated users
  console.log("ProtectedRoute: User authenticated, rendering Outlet");
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
    const [timeoutExpired, setTimeoutExpired] = useState(false);

    // Setup timeout to prevent infinite loading
    useEffect(() => {
      const timeout = setTimeout(() => {
        setTimeoutExpired(true);
      }, 10000); // 10s timeout
      
      return () => clearTimeout(timeout);
    }, []);

    // Only show loading for a reasonable time
    const isLoading = authIsLoading && !timeoutExpired;

    console.log("PublicRoute: AuthLoading:", authIsLoading, "TimeoutExpired:", timeoutExpired, "User:", user ? user.id : null);

    if (isLoading) {
        console.log("PublicRoute: Rendering Loading Spinner");
        return <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-learny-purple"></div>
        </div>;
    }

    if (user && location.pathname === '/auth') {
        console.log("PublicRoute: User logged in, redirecting from /auth to", from);
        return <Navigate to={from} replace />;
    }

    console.log("PublicRoute: Rendering Outlet");
    return <Outlet />;
};