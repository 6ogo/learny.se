
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { Trophy, PlusCircle, Home, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const NavBar: React.FC = () => {
  const location = useLocation();
  const { userStats } = useLocalStorage();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-learny-dark shadow-sm z-10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/3977d71f-39ec-4118-af1f-b71f31832d06.png" 
                alt="Learny" 
                className="h-10 w-auto mr-2" 
              />
              <span className="text-xl font-bold text-learny-purple-dark ml-2">Learny.se</span>
            </Link>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Link to="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  "flex flex-col items-center justify-center h-14 px-2 md:px-3",
                  isActive('/') ? 'bg-learny-purple-dark text-white' : 'text-gray-300 hover:text-learny-purple-dark'
                )}
              >
                <Home className="h-5 w-5 mb-1" />
                <span className="text-xs">Hem</span>
              </Button>
            </Link>
            
            <Link to="/create">
              <Button
                variant={isActive('/create') ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  "flex flex-col items-center justify-center h-14 px-2 md:px-3",
                  isActive('/create') ? 'bg-learny-purple-dark text-white' : 'text-gray-300 hover:text-learny-purple-dark'
                )}
              >
                <PlusCircle className="h-5 w-5 mb-1" />
                <span className="text-xs">Skapa</span>
              </Button>
            </Link>
            
            <Link to="/achievements">
              <Button
                variant={isActive('/achievements') ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  "flex flex-col items-center justify-center h-14 px-2 md:px-3 relative",
                  isActive('/achievements') ? 'bg-learny-purple-dark text-white' : 'text-gray-100 hover:text-learny-purple-dark'
                )}
                aria-label="Prestationer"
              >
                <Trophy className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Prestationer</span>
                {userStats.achievements.some(a => !a.displayed) && (
                  <span className="absolute top-2 right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-learny-red opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-learny-red"></span>
                  </span>
                )}
              </Button>
            </Link>

            <div className="flex items-center bg-gray-800 rounded-full px-3 py-1 ml-2">
              <BookOpen className="h-4 w-4 text-learny-purple-dark mr-1" />
              <span className="text-sm font-medium text-gray-100">{userStats.streak} dagars streak</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
