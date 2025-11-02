import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { User } from '@/lib/types'
import { useKV } from '@github/spark/hooks'
import { generateId } from '@/lib/utils'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; mustChangePassword?: boolean }>
  changePassword: (newPassword: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEFAULT_ADMIN_EMAIL = 'eng.ay88@gmail.com'
const DEFAULT_ADMIN_PASSWORD = 'adminadmin'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useKV<User | null>('currentUser', null)
  const [users, setUsers] = useKV<User[]>('users', [])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAdmin = async () => {
      if (!users || users.length === 0) {
        const adminUser: User = {
          id: generateId(),
          email: DEFAULT_ADMIN_EMAIL,
          password: DEFAULT_ADMIN_PASSWORD,
          fullName: 'Administrator',
          role: 'admin',
          status: 'active',
          subscription: 'pro',
          mustChangePassword: true,
          createdAt: new Date().toISOString()
        }
        setUsers([adminUser])
      }
      setIsLoading(false)
    }

    initializeAdmin()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; mustChangePassword?: boolean }> => {
    const foundUser = users?.find(u => u.email === email && u.password === password)
    if (foundUser) {
      setUser(foundUser)
      return { success: true, mustChangePassword: foundUser.mustChangePassword }
    }
    return { success: false }
  }

  const changePassword = (newPassword: string) => {
    if (!user) return
    
    const updatedUser = { ...user, password: newPassword, mustChangePassword: false }
    setUser(updatedUser)
    setUsers(current => 
      (current || []).map(u => u.id === user.id ? updatedUser : u)
    )
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user: user || null, login, changePassword, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
