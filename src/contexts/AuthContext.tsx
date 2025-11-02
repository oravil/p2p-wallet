import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { User } from '@/lib/types'
import { useKV } from '@github/spark/hooks'
import { generateId } from '@/lib/utils'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, fullName: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useKV<User | null>('currentUser', null)
  const [users, setUsers] = useKV<User[]>('users', [])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users?.find(u => u.email === email)
    if (foundUser) {
      setUser(foundUser)
      return true
    }
    return false
  }

  const register = async (email: string, password: string, fullName: string): Promise<boolean> => {
    const existingUser = users?.find(u => u.email === email)
    if (existingUser) {
      return false
    }

    const newUser: User = {
      id: generateId(),
      email,
      fullName,
      role: 'trader',
      status: 'active',
      subscription: 'free',
      createdAt: new Date().toISOString()
    }

    setUsers(current => [...(current || []), newUser])
    setUser(newUser)
    return true
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user: user || null, login, register, logout, isLoading }}>
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
