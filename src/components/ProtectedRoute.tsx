import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { NavBar } from '@/components/NavBar';

export const ProtectedRoute: React.FC = () => {
  const { user, isLoading: authIsLoading } = useAuth();
  const { isContextLoading: isLocalStorageLoading, initializeContext } = useLocalStorage();
  const location = useLocation();

  // Only initialize storage context once when we have a user
  useEffect(() => {
    if (user && !isLocalStorageLoading) {
      // Initialize context with userId
      initializeContext(user.id);
    }
  }, [user, isLocalStorageLoading, initializeContext]);

  // Check combined loading state - only show loading while auth is verifying
  const isLoading = authIsLoading;

  console.log("ProtectedRoute: AuthLoading:", authIsLoading, 
              "LocalStorageLoading:", isLocalStorageLoading, 
              "User:", user ? user.id : null);

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

    console.log("PublicRoute: AuthLoading:", authIsLoading, "User:", user ? user.id : null);

    if (authIsLoading) {
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