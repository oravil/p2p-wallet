import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { User, EnvelopeSimple, Password, IdentificationBadge, MapPin, Phone, Check, X } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import type { User as UserType } from '@/lib/types'

export function UserProfile() {
  const { t } = useTranslation()
  const { user, changePassword } = useAuth()
  const [users, setUsers] = useKV<UserType[]>('users', [])
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [address, setAddress] = useState(user?.address || '')
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSaveProfile = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      fullName,
      phone,
      address
    }

    setUsers(current =>
      (current || []).map(u => u.id === user.id ? updatedUser : u)
    )

    toast.success(t('profile.updateSuccess'))
    setIsEditingProfile(false)
  }

  const handleChangePassword = () => {
    if (!user) return

    if (currentPassword !== user.password) {
      toast.error(t('profile.currentPasswordIncorrect'))
      return
    }

    if (newPassword.length < 6) {
      toast.error(t('profile.passwordTooShort'))
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error(t('profile.passwordMismatch'))
      return
    }

    changePassword(newPassword)
    toast.success(t('profile.passwordChangeSuccess'))
    setIsChangingPassword(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleSendVerification = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      emailVerificationSentAt: new Date().toISOString()
    }

    setUsers(current =>
      (current || []).map(u => u.id === user.id ? updatedUser : u)
    )

    toast.success(t('profile.verificationEmailSent'))
  }

  const getSubscriptionBadge = () => {
    if (user?.subscription === 'pro') {
      return <Badge className="bg-primary text-primary-foreground">{t('subscription.pro.name')}</Badge>
    }
    return <Badge variant="secondary">{t('subscription.free.name')}</Badge>
  }

  const getVerificationBadge = () => {
    if (user?.emailVerified) {
      return (
        <Badge className="gap-1 bg-success text-success-foreground">
          <Check size={14} weight="bold" />
          {t('profile.verified')}
        </Badge>
      )
    }
    return (
      <Badge variant="destructive" className="gap-1">
        <X size={14} weight="bold" />
        {t('profile.notVerified')}
      </Badge>
    )
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{t('profile.title')}</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User size={24} weight="bold" />
                  {t('profile.personalInfo')}
                </CardTitle>
                <CardDescription>{t('profile.personalInfoDescription')}</CardDescription>
              </div>
              {!isEditingProfile ? (
                <Button onClick={() => setIsEditingProfile(true)} variant="outline">
                  {t('common.edit')}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditingProfile(false)} variant="outline">
                    {t('common.cancel')}
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    {t('common.save')}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <IdentificationBadge size={16} />
                  {t('auth.fullName')}
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditingProfile}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <EnvelopeSimple size={16} />
                  {t('auth.email')}
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                  />
                  {getVerificationBadge()}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone size={16} />
                  {t('profile.phone')}
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditingProfile}
                  placeholder={t('profile.phonePlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin size={16} />
                  {t('profile.address')}
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!isEditingProfile}
                  placeholder={t('profile.addressPlaceholder')}
                />
              </div>
            </div>

            {!user.emailVerified && (
              <div className="p-4 bg-warning/10 border border-warning/30 rounded-md">
                <div className="flex items-start gap-3">
                  <X size={20} className="text-warning shrink-0 mt-0.5" weight="bold" />
                  <div className="flex-1">
                    <p className="font-semibold text-warning">{t('profile.verificationRequired')}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('profile.verificationMessage')}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={handleSendVerification}
                    >
                      {t('profile.sendVerification')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Password size={24} weight="bold" />
                  {t('profile.security')}
                </CardTitle>
                <CardDescription>{t('profile.securityDescription')}</CardDescription>
              </div>
              {!isChangingPassword && (
                <Button onClick={() => setIsChangingPassword(true)} variant="outline">
                  {t('profile.changePassword')}
                </Button>
              )}
            </div>
          </CardHeader>
          {isChangingPassword && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button onClick={() => setIsChangingPassword(false)} variant="outline">
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleChangePassword}>
                  {t('profile.changePassword')}
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('profile.subscription')}</CardTitle>
            <CardDescription>{t('profile.subscriptionDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('subscription.current')}</p>
                <div className="mt-1">{getSubscriptionBadge()}</div>
              </div>
              {user.subscription === 'free' && (
                <Button>{t('subscription.upgrade')}</Button>
              )}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <p className="text-sm font-semibold">{t('subscription.features')}</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                {user.subscription === 'pro' ? (
                  <>
                    <li className="list-disc">{t('subscription.pro.features.0')}</li>
                    <li className="list-disc">{t('subscription.pro.features.1')}</li>
                    <li className="list-disc">{t('subscription.pro.features.2')}</li>
                    <li className="list-disc">{t('subscription.pro.features.3')}</li>
                    <li className="list-disc">{t('subscription.pro.features.4')}</li>
                    <li className="list-disc">{t('subscription.pro.features.5')}</li>
                    <li className="list-disc">{t('subscription.pro.features.6')}</li>
                  </>
                ) : (
                  <>
                    <li className="list-disc">{t('subscription.free.features.0')}</li>
                    <li className="list-disc">{t('subscription.free.features.1')}</li>
                    <li className="list-disc">{t('subscription.free.features.2')}</li>
                    <li className="list-disc">{t('subscription.free.features.3')}</li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
