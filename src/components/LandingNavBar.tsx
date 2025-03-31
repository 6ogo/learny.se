
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const LandingNavBar: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="w-full bg-gray-900 shadow-md z-10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Learny.se" 
                className="h-10 w-auto mr-2" 
              />
              <span className="text-xl font-bold text-learny-purple-dark ml-2">Learny</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Button size="sm" className="bg-learny-purple hover:bg-learny-purple-dark text-white">
                <Link to="/home">Till Dashbord</Link>
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-300 hover:text-learny-purple"
                >
                  <Link to="/pricing">Priser</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-300 hover:text-learny-purple"
                >
                  <Link to="/auth" className="flex items-center gap-1">Logga in</Link>
                </Button>
                <Button 
                  size="sm" 
                  className="bg-learny-purple hover:bg-learny-purple-dark text-white"
                >
                  <Link to="/auth">Kom igång</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
