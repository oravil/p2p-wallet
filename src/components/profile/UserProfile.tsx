import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, EnvelopeSimple, Password, IdentificationBadge, Phone, MapPin, Check, X } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function UserProfile() {
  const { user, changePassword } = useAuth()
  const { t } = useTranslation()
  
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
    
    toast.success(t('profile.updated'))
    setIsEditingProfile(false)
  }

  const handleChangePassword = () => {
    if (!user) return
    
    if (currentPassword !== user.password) {
      toast.error(t('profile.incorrectPassword'))
      return
    }
    
    if (newPassword !== confirmPassword) {
      toast.error(t('profile.passwordMismatch'))
      return
    }
    
    if (newPassword.length < 6) {
      toast.error(t('auth.passwordMin'))
      return
    }
    
    changePassword(newPassword)
    toast.success(t('profile.passwordChanged'))
    setIsChangingPassword(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleSendVerification = () => {
    toast.success(t('profile.verificationSent'))
  }

  const getVerificationBadge = () => {
    if (user?.emailVerified) {
      return (
        <Badge variant="outline" className="bg-success/10 text-success border-success/30">
          <Check size={14} className="mr-1" weight="bold" />
          {t('profile.verified')}
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
        <X size={14} className="mr-1" weight="bold" />
        {t('profile.unverified')}
      </Badge>
    )
  }

  const getSubscriptionBadge = () => {
    if (user?.subscription === 'pro') {
      return (
        <Badge className="bg-primary text-primary-foreground">
          {t('subscription.pro.title')}
        </Badge>
      )
    }
    return (
      <Badge variant="outline">
        {t('subscription.free.title')}
      </Badge>
    )
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User size={24} weight="bold" />
                  {t('profile.title')}
                </CardTitle>
                <CardDescription>{t('profile.description')}</CardDescription>
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
                <div className="flex gap-2 items-center flex-wrap">
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="flex-1 min-w-0"
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
            <div className="flex items-center justify-between flex-wrap gap-4">
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

              <div className="flex gap-2 justify-end flex-wrap">
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
            <div className="flex items-center justify-between flex-wrap gap-4">
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
