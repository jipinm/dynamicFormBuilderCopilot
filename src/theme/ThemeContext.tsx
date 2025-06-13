// src/theme/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Define available themes and color modes
export type ThemeType = 'simple' | 'modern';
export type ColorMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  colorMode: ColorMode;
  setTheme: (theme: ThemeType) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}

// Create context with default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize theme from localStorage or default to 'simple'
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('dfb-theme');
    return (savedTheme as ThemeType) || 'simple';
  });
  
  // Initialize color mode from localStorage, system preference, or default to 'light'
  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    const savedMode = localStorage.getItem('dfb-color-mode');
    if (savedMode === 'light' || savedMode === 'dark') return savedMode;
    
    // Check system preference if no saved preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default to light mode
    return 'light';
  });

  // Update theme and color mode in localStorage when they change
  useEffect(() => {
    localStorage.setItem('dfb-theme', theme);
    localStorage.setItem('dfb-color-mode', colorMode);
    
    // Apply theme and color mode classes to the root element
    document.documentElement.className = `theme-${theme} mode-${colorMode}`;
  }, [theme, colorMode]);

  // Listen for system color scheme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Only apply system preference if user hasn't manually selected a preference
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('dfb-color-mode')) {
        setColorModeState(e.matches ? 'dark' : 'light');
      }
    };
    
    // Add event listener for system preference changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    return undefined;
  }, []);

  // Theme setter function
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  // Color mode setter function
  const setColorMode = (newMode: ColorMode) => {
    setColorModeState(newMode);
  };
  
  // Toggle between light and dark mode
  const toggleColorMode = () => {
    setColorModeState(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      colorMode, 
      setTheme, 
      setColorMode,
      toggleColorMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
