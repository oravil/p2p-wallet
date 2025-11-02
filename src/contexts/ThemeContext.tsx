import { createContext, useContext, ReactNode, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

<<<<<<< Updated upstream
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeKV, setThemeKV] = useKV<Theme>('theme', 'light')
  const theme = themeKV || 'light'

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeKV(newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
=======
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useKV<Theme>('theme', 'light')

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])
>>>>>>> Stashed changes

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

<<<<<<< Updated upstream
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
















=======
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
>>>>>>> Stashed changes
