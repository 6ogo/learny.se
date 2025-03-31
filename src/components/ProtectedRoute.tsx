
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { NavBar } from '@/components/NavBar';

export const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-learny-purple"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export const PublicRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-learny-purple"></div>
    </div>;
  }

  // If already logged in and trying to access auth page, redirect to home
  if (user && location.pathname === '/auth') {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
