import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/context/LocalStorageContext'; // Import useLocalStorage
import { NavBar } from '@/components/NavBar';

export const ProtectedRoute: React.FC = () => {
  const { user, isLoading: authIsLoading } = useAuth(); // Auth loading state
  const { isContextLoading: isLocalStorageLoading } = useLocalStorage(); // LocalStorage loading state
  const location = useLocation();

  // Check combined loading state
  const isLoading = authIsLoading || isLocalStorageLoading;

  console.log("ProtectedRoute: AuthLoading:", authIsLoading, "LocalStorageLoading:", isLocalStorageLoading, "CombinedLoading:", isLoading, "User:", user ? user.id : null);

  if (isLoading) {
    console.log("ProtectedRoute: Rendering Loading Spinner");
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-learny-purple"></div>
      </div>
    );
  }

  if (!user) {
    // User is not logged in (and loading is finished)
    console.log("ProtectedRoute: No user, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Render the common layout for authenticated users
  console.log("ProtectedRoute: User authenticated and contexts loaded, rendering Outlet");
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 bg-gradient-to-b from-gray-900 to-gray-800 text-foreground">
        <div className="container mx-auto px-4 py-8">
          {/* Render page only when BOTH contexts are loaded and user exists */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// PublicRoute checks only auth loading state
export const PublicRoute: React.FC = () => {
    const { user, isLoading: authIsLoading } = useAuth();
    const location = useLocation();

     console.log("PublicRoute: AuthLoading:", authIsLoading, "User:", user ? user.id : null);


    if (authIsLoading) {
        console.log("PublicRoute: Rendering Loading Spinner");
        return <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-learny-purple"></div>
        </div>;
    }

    if (user && location.pathname === '/auth') {
         console.log("PublicRoute: User logged in, redirecting from /auth to /home");
        return <Navigate to="/home" replace />;
    }

    console.log("PublicRoute: Rendering Outlet");
    return <Outlet />;
};