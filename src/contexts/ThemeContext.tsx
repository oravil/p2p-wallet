import { createContext, useContext, ReactNode, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

  theme: Theme


  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

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
  }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )



  const context = useContext(ThemeContext)

    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
