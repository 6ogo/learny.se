
import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Calendar, Clock } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Flashcard App</title>
        <meta name="description" content="Lär dig genom flashcards" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="font-bold text-xl">
              FlashcardApp
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1">{children}</main>
      
      <nav className="sticky bottom-0 border-t bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-around">
          <Link to="/">
            <Button
              variant={isActive('/') ? "default" : "ghost"}
              size="sm"
              className="flex flex-col h-full rounded-none px-3"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Hem</span>
            </Button>
          </Link>
          
          <Link to="/explore">
            <Button
              variant={isActive('/explore') ? "default" : "ghost"}
              size="sm"
              className="flex flex-col h-full rounded-none px-3"
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-xs mt-1">Utforska</span>
            </Button>
          </Link>
          
          <Link to="/daily">
            <Button
              variant={isActive('/daily') ? "default" : "ghost"}
              size="sm"
              className="flex flex-col h-full rounded-none px-3"
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs mt-1">Daglig</span>
            </Button>
          </Link>
          
          <Link to="/review">
            <Button
              variant={isActive('/review') ? "default" : "ghost"}
              size="sm"
              className="flex flex-col h-full rounded-none px-3"
            >
              <Clock className="h-5 w-5" />
              <span className="text-xs mt-1">Repetition</span>
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
};
