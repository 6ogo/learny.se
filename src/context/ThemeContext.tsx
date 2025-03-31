
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  toggleTheme: () => void;
  setTheme: (theme: string | ((currentTheme: string) => string)) => void;
  theme: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<string>(() => {
    // Always default to dark
    const savedTheme = localStorage.getItem('learny-theme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    // Apply the theme when it changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('learny-theme', theme);
  }, [theme]);

  // Force dark mode on initial load
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setThemeState('dark'); // Force dark mode on toggle
  };

  const setTheme = (value: string | ((currentTheme: string) => string)) => {
    if (typeof value === 'function') {
      setThemeState(value);
    } else {
      setThemeState(value);
    }
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, setTheme, theme }}>
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
