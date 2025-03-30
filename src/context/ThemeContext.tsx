
import React, { createContext, useContext, useEffect } from 'react';

interface ThemeContextType {
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Always use dark mode
    document.documentElement.classList.add('dark');
    localStorage.setItem('learny-theme', 'dark');
  }, []);

  const toggleTheme = () => {
    // Function kept for API compatibility, but it doesn't change the theme
    console.log('Dark mode is always enabled');
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
