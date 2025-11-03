import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { AppTheme } from '@/lib/types';

// Professional Financial Theme - Primary default
const professionalBlueTheme: AppTheme = {
  name: 'Professional Blue',
  colors: {
    background: 'oklch(0.99 0.002 240)',
    foreground: 'oklch(0.12 0.015 240)',
    card: 'oklch(1.00 0 0)',
    cardForeground: 'oklch(0.12 0.015 240)',
    popover: 'oklch(1.00 0 0)',
    popoverForeground: 'oklch(0.12 0.015 240)',
    primary: 'oklch(0.45 0.15 250)',
    primaryForeground: 'oklch(0.98 0.002 240)',
    secondary: 'oklch(0.92 0.012 240)',
    secondaryForeground: 'oklch(0.25 0.03 240)',
    accent: 'oklch(0.60 0.12 200)',
    accentForeground: 'oklch(0.98 0.002 240)',
    muted: 'oklch(0.96 0.008 240)',
    mutedForeground: 'oklch(0.50 0.02 240)',
    destructive: 'oklch(0.55 0.22 25)',
    destructiveForeground: 'oklch(0.98 0.002 240)',
    success: 'oklch(0.55 0.15 145)',
    successForeground: 'oklch(0.98 0.002 240)',
    warning: 'oklch(0.70 0.15 65)',
    warningForeground: 'oklch(0.20 0.03 65)',
    border: 'oklch(0.90 0.005 240)',
    input: 'oklch(0.94 0.008 240)',
    ring: 'oklch(0.45 0.15 250)',
  },
  radius: '0.5rem'
};

// Modern Emerald Theme
const modernEmeraldTheme: AppTheme = {
  name: 'Modern Emerald',
  colors: {
    background: 'oklch(0.99 0.003 160)',
    foreground: 'oklch(0.15 0.02 160)',
    card: 'oklch(1.00 0 0)',
    cardForeground: 'oklch(0.15 0.02 160)',
    popover: 'oklch(1.00 0 0)',
    popoverForeground: 'oklch(0.15 0.02 160)',
    primary: 'oklch(0.52 0.18 160)',
    primaryForeground: 'oklch(0.98 0.003 160)',
    secondary: 'oklch(0.94 0.01 160)',
    secondaryForeground: 'oklch(0.25 0.03 160)',
    accent: 'oklch(0.65 0.14 180)',
    accentForeground: 'oklch(0.98 0.003 160)',
    muted: 'oklch(0.96 0.006 160)',
    mutedForeground: 'oklch(0.48 0.02 160)',
    destructive: 'oklch(0.58 0.20 25)',
    destructiveForeground: 'oklch(0.98 0.003 160)',
    success: 'oklch(0.55 0.16 145)',
    successForeground: 'oklch(0.98 0.003 160)',
    warning: 'oklch(0.68 0.16 70)',
    warningForeground: 'oklch(0.18 0.03 70)',
    border: 'oklch(0.91 0.005 160)',
    input: 'oklch(0.94 0.006 160)',
    ring: 'oklch(0.52 0.18 160)',
  },
  radius: '0.75rem'
};

// Dark Professional Theme
const darkProfessionalTheme: AppTheme = {
  name: 'Dark Professional',
  colors: {
    background: 'oklch(0.08 0.006 240)',
    foreground: 'oklch(0.95 0.004 240)',
    card: 'oklch(0.12 0.008 240)',
    cardForeground: 'oklch(0.95 0.004 240)',
    popover: 'oklch(0.12 0.008 240)',
    popoverForeground: 'oklch(0.95 0.004 240)',
    primary: 'oklch(0.60 0.16 250)',
    primaryForeground: 'oklch(0.08 0.006 240)',
    secondary: 'oklch(0.18 0.01 240)',
    secondaryForeground: 'oklch(0.85 0.006 240)',
    accent: 'oklch(0.65 0.14 200)',
    accentForeground: 'oklch(0.08 0.006 240)',
    muted: 'oklch(0.15 0.008 240)',
    mutedForeground: 'oklch(0.60 0.008 240)',
    destructive: 'oklch(0.65 0.20 25)',
    destructiveForeground: 'oklch(0.95 0.004 240)',
    success: 'oklch(0.60 0.16 145)',
    successForeground: 'oklch(0.08 0.006 240)',
    warning: 'oklch(0.75 0.16 65)',
    warningForeground: 'oklch(0.08 0.006 240)',
    border: 'oklch(0.20 0.01 240)',
    input: 'oklch(0.18 0.01 240)',
    ring: 'oklch(0.60 0.16 250)',
  },
  radius: '0.5rem'
};

// Sophisticated Purple Theme
const sophisticatedPurpleTheme: AppTheme = {
  name: 'Sophisticated Purple',
  colors: {
    background: 'oklch(0.99 0.003 300)',
    foreground: 'oklch(0.13 0.02 300)',
    card: 'oklch(1.00 0 0)',
    cardForeground: 'oklch(0.13 0.02 300)',
    popover: 'oklch(1.00 0 0)',
    popoverForeground: 'oklch(0.13 0.02 300)',
    primary: 'oklch(0.48 0.16 280)',
    primaryForeground: 'oklch(0.98 0.003 300)',
    secondary: 'oklch(0.93 0.01 300)',
    secondaryForeground: 'oklch(0.25 0.03 300)',
    accent: 'oklch(0.62 0.14 320)',
    accentForeground: 'oklch(0.98 0.003 300)',
    muted: 'oklch(0.96 0.006 300)',
    mutedForeground: 'oklch(0.50 0.02 300)',
    destructive: 'oklch(0.56 0.21 25)',
    destructiveForeground: 'oklch(0.98 0.003 300)',
    success: 'oklch(0.54 0.16 145)',
    successForeground: 'oklch(0.98 0.003 300)',
    warning: 'oklch(0.69 0.16 65)',
    warningForeground: 'oklch(0.19 0.03 65)',
    border: 'oklch(0.91 0.005 300)',
    input: 'oklch(0.94 0.006 300)',
    ring: 'oklch(0.48 0.16 280)',
  },
  radius: '0.625rem'
};

// Available themes for selection
export const availableThemes = {
  'professional-blue': professionalBlueTheme,
  'modern-emerald': modernEmeraldTheme,
  'dark-professional': darkProfessionalTheme,
  'sophisticated-purple': sophisticatedPurpleTheme,
};

const defaultTheme = professionalBlueTheme;

interface ThemeContextType {
  theme: AppTheme;
  updateTheme: (theme: Partial<AppTheme>) => void;
  resetTheme: () => void;
  setThemeByKey: (themeKey: keyof typeof availableThemes) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useKV<AppTheme>('app-theme', defaultTheme);
  const [isDarkMode, setIsDarkMode] = useKV<boolean>('dark-mode', false);

  useEffect(() => {
    if (!theme) {
      setTheme(defaultTheme);
      return;
    }

    const root = document.documentElement;
    const colors = theme.colors;

    // Apply theme colors
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.foreground);
    root.style.setProperty('--card', colors.card);
    root.style.setProperty('--card-foreground', colors.cardForeground);
    root.style.setProperty('--popover', colors.popover);
    root.style.setProperty('--popover-foreground', colors.popoverForeground);
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-foreground', colors.primaryForeground);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--secondary-foreground', colors.secondaryForeground);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-foreground', colors.accentForeground);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--muted-foreground', colors.mutedForeground);
    root.style.setProperty('--destructive', colors.destructive);
    root.style.setProperty('--destructive-foreground', colors.destructiveForeground);
    root.style.setProperty('--success', colors.success);
    root.style.setProperty('--success-foreground', colors.successForeground);
    root.style.setProperty('--warning', colors.warning);
    root.style.setProperty('--warning-foreground', colors.warningForeground);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--input', colors.input);
    root.style.setProperty('--ring', colors.ring);
    root.style.setProperty('--radius', theme.radius);

    // Apply dark mode class
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, isDarkMode]);

  const updateTheme = (updates: Partial<AppTheme>) => {
    setTheme(current => {
      const currentTheme = current || defaultTheme;
      return {
        name: updates.name || currentTheme.name,
        radius: updates.radius || currentTheme.radius,
        colors: {
          ...currentTheme.colors,
          ...(updates.colors || {})
        }
      };
    });
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    setIsDarkMode(false);
  };

  const setThemeByKey = (themeKey: keyof typeof availableThemes) => {
    setTheme(availableThemes[themeKey]);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      setTheme(professionalBlueTheme);
    } else {
      setTheme(darkProfessionalTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: theme || defaultTheme, 
      updateTheme, 
      resetTheme, 
      setThemeByKey, 
      isDarkMode: isDarkMode || false,
      toggleDarkMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
