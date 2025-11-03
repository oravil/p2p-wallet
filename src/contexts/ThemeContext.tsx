import { createContext, ReactNode, useEffect, useCallback } from 'react';
import { useKV } from '@github/spark/hooks';
import { availableThemes, type ThemeId } from '@/lib/theme-constants';

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  getThemeData: () => typeof availableThemes[ThemeId];
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeInternal] = useKV<ThemeId>('currentTheme', 'modernGlass');
  const [isDarkMode, setIsDarkMode] = useKV<boolean>('isDarkMode', false);

  const setTheme = useCallback((newTheme: ThemeId) => {
    setThemeInternal(newTheme);
  }, [setThemeInternal]);

  const applyTheme = useCallback((themeId: ThemeId, isDark: boolean) => {
    const selectedTheme = availableThemes[themeId];
    if (!selectedTheme) return;

    const root = document.documentElement;
    const colors = isDark ? selectedTheme.darkColors : selectedTheme.colors;
    
    // Apply CSS custom properties
    Object.entries(colors).forEach(([property, value]) => {
      root.style.setProperty(property, String(value));
    });

    // Apply theme class to body
    document.body.className = isDark ? 'dark' : '';
    
    // Apply theme ID as data attribute for additional styling
    document.body.setAttribute('data-theme', themeId);
  }, []);

  useEffect(() => {
    if (theme && isDarkMode !== undefined) {
      applyTheme(theme, isDarkMode);
    }
  }, [theme, isDarkMode, applyTheme]);

  const resetTheme = useCallback(() => {
    setThemeInternal('modernGlass');
    setIsDarkMode(false);
  }, [setThemeInternal, setIsDarkMode]);

  const getThemeData = useCallback(() => {
    return availableThemes[theme || 'modernGlass'];
  }, [theme]);

  const value: ThemeContextType = {
    theme: theme || 'modernGlass',
    setTheme,
    isDarkMode: isDarkMode || false,
    setIsDarkMode,
    getThemeData,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
