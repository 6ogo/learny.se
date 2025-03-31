
import React, { createContext, useContext, useEffect } from 'react';

interface ThemeContextType {
  toggleTheme: () => void;
  setTheme: (theme: string | ((currentTheme: string) => string)) => void;
  theme: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always use dark theme
  const theme = 'dark';

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.setItem('learny-theme', 'dark');
  }, []);

  // These functions don't change the theme, they keep it dark
  const toggleTheme = () => {
    // Do nothing - keep dark mode
  };

  const setTheme = () => {
    // Do nothing - keep dark mode
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
