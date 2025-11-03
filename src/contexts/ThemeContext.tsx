import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { AppTheme } from '@/lib/types';

const defaultTheme: AppTheme = {
  name: 'Modern Green',
  colors: {
    background: 'oklch(0.98 0.01 180)',
    foreground: 'oklch(0.15 0.02 240)',
    card: 'oklch(0.99 0.005 180)',
    cardForeground: 'oklch(0.15 0.02 240)',
    popover: 'oklch(1.00 0 0)',
    popoverForeground: 'oklch(0.15 0.02 240)',
    primary: 'oklch(0.65 0.20 160)',
    primaryForeground: 'oklch(0.98 0.01 180)',
    secondary: 'oklch(0.92 0.08 200)',
    secondaryForeground: 'oklch(0.20 0.05 240)',
    accent: 'oklch(0.75 0.15 280)',
    accentForeground: 'oklch(0.15 0.02 240)',
    muted: 'oklch(0.94 0.02 180)',
    mutedForeground: 'oklch(0.45 0.02 240)',
    destructive: 'oklch(0.65 0.20 25)',
    destructiveForeground: 'oklch(0.98 0.01 180)',
    success: 'oklch(0.55 0.15 145)',
    successForeground: 'oklch(1 0 0)',
    warning: 'oklch(0.70 0.15 65)',
    warningForeground: 'oklch(0.20 0.03 65)',
    border: 'oklch(0.88 0.02 180)',
    input: 'oklch(0.88 0.02 180)',
    ring: 'oklch(0.65 0.20 160)',
  },
  radius: '0.75rem'
};

interface ThemeContextType {
  theme: AppTheme;
  updateTheme: (theme: Partial<AppTheme>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useKV<AppTheme>('app-theme', defaultTheme);

  useEffect(() => {
    if (!theme) {
      setTheme(defaultTheme);
      return;
    }

    const root = document.documentElement;
    const colors = theme.colors;

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
  }, [theme]);

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
  };

  return (
    <ThemeContext.Provider value={{ theme: theme || defaultTheme, updateTheme, resetTheme }}>
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
