
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { NavBar } from '@/components/NavBar';

export const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900"> {/* Loading background */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-learny-purple"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Render the common layout for authenticated users
  return (
    // Use flex column to make main content fill remaining space if needed
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {/* Apply the consistent background and padding to the main content area */}
      <main className="flex-1 bg-gradient-to-b from-gray-900 to-gray-800 text-foreground">
        {/* Container and padding for the content rendered by Outlet */}
        <div className="container mx-auto px-4 py-8">
          <Outlet /> {/* Specific page components render here */}
        </div>
      </main>
      {/* Optional: Add a consistent footer for logged-in users here if desired */}
      {/* <Footer /> */}
    </div>
  );
};

// PublicRoute remains the same
export const PublicRoute: React.FC = () => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-learny-purple"></div>
        </div>;
    }

    if (user && location.pathname === '/auth') {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};