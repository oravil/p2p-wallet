import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { sanitizeEmail, sanitizeInput } from '@/lib/sanitize'
import { loginSchema, passwordChangeSchema, type LoginFormData, type PasswordChangeFormData } from '@/lib/validation'

// Rate limiting configuration
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

interface LoginAttempt {
  email: string
  timestamp: number
  attempts: number
}

export function AuthPage() {
  const { t } = useTranslation()
  const { login, changePassword } = useAuth()
  const loginAttemptsRef = useRef<Map<string, LoginAttempt>>(new Map())
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Check if user is rate limited
  const isRateLimited = (email: string): boolean => {
    const attempt = loginAttemptsRef.current.get(email)
    if (!attempt) return false

    const now = Date.now()
    if (now - attempt.timestamp > LOCKOUT_DURATION) {
      // Reset attempts after lockout period
      loginAttemptsRef.current.delete(email)
      return false
    }

    return attempt.attempts >= MAX_LOGIN_ATTEMPTS
  }

  // Record login attempt
  const recordLoginAttempt = (email: string, success: boolean) => {
    const now = Date.now()
    const existing = loginAttemptsRef.current.get(email)

    if (success) {
      // Clear attempts on successful login
      loginAttemptsRef.current.delete(email)
      return
    }

    if (!existing || now - existing.timestamp > LOCKOUT_DURATION) {
      loginAttemptsRef.current.set(email, { email, timestamp: now, attempts: 1 })
    } else {
      loginAttemptsRef.current.set(email, { 
        ...existing, 
        attempts: existing.attempts + 1,
        timestamp: now 
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Sanitize inputs
      const sanitizedData = {
        email: sanitizeEmail(formData.email),
        password: sanitizeInput(formData.password)
      }

      // Validate with Zod
      const validationResult = loginSchema.safeParse(sanitizedData)
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => err.message).join(', ')
        toast.error(`Validation error: ${errors}`)
        return
      }

      const { email, password } = validationResult.data

      // Check rate limiting
      if (isRateLimited(email)) {
        const attempt = loginAttemptsRef.current.get(email)
        const timeLeft = Math.ceil((LOCKOUT_DURATION - (Date.now() - (attempt?.timestamp || 0))) / 60000)
        toast.error(`Too many failed attempts. Please try again in ${timeLeft} minutes.`)
        return
      }

      const result = await login(email, password)
      recordLoginAttempt(email, result.success)

      if (result.success) {
        if (result.mustChangePassword) {
          setShowPasswordChange(true)
        } else {
          toast.success(t('auth.loginSuccess'))
        }
      } else {
        const attempt = loginAttemptsRef.current.get(email)
        const remainingAttempts = MAX_LOGIN_ATTEMPTS - (attempt?.attempts || 0)
        toast.error(`${t('auth.loginError')} (${remainingAttempts} attempts remaining)`)
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    try {
      // Sanitize password inputs
      const sanitizedData = {
        newPassword: sanitizeInput(newPassword),
        confirmPassword: sanitizeInput(confirmPassword)
      }

      // Validate with Zod
      const validationResult = passwordChangeSchema.safeParse(sanitizedData)
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => err.message).join(', ')
        toast.error(`Validation error: ${errors}`)
        return
      }

      const { newPassword: validatedPassword } = validationResult.data

      await changePassword(validatedPassword)
      setShowPasswordChange(false)
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password changed successfully')
    } catch (error) {
      toast.error('Failed to change password')
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{t('app.title')}</CardTitle>
            <CardDescription>{t('app.tagline')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : t('auth.login')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showPasswordChange} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password Required</DialogTitle>
            <DialogDescription>
              You must change your password before continuing. Please enter a new password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handlePasswordChange} className="w-full">
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
