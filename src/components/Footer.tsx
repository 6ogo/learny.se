
import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t py-6">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Learny.se - Lär dig snabbare med flashcards
            </p>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-600 flex items-center">
              Skapad med <Heart className="h-4 w-4 text-learny-red mx-1" /> för lärande
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
