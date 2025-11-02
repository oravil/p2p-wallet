import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { User, EnvelopeSimple, Password, Iden
import { Label } from '@/components/ui/label'
export function UserProfile() {
  const { user, changePassword } = useAuth()
  const [isEditingProfile, set
  
  const [phone, setPhone] = useState(user?.
  

export function UserProfile() {
    if (!user) return
  const { user, changePassword } = useAuth()
      fullName,
      address

  

    setIsEditingProfile(false)

  
    if (currentPassword !== user.password) {
      return


    }
    if (!user) return

    const updatedUser = {
    toast.succ
      fullName,
    setConfi
      address
    i

      emailVerification

     

  }
    setIsEditingProfile(false)
   


    if (user?.emailVe

    if (currentPassword !== user.password) {
      )
      return
    }

  }
  if (!user) return null
  return (
     

          <CardHeader>
              <div>
            
     

                <Button onClick
                </Button>
                <div className="
                    {t('co
                  <But
                  </Button
  }

            <div className="grid grid-co
                <Labe

                <Input
              
                  disabled={!isEditingProfile}
     

                  <Enve
                </Label>
     

                  />
   

                <Label htmlFor="phone"
                  {t('profile.phone')}
                <Input
     
                  disabled={!isEditingProfile}
   

                <Label htmlFor="addres
                  {t('profile.
              
                  value={address}
                  disabled={!isEditingProfi
          {t('profile.verified')}
            </di
      )
     
    return (
                    <p className="text-sm text-muted-
                    </p>
                      size="sm"
              
     
  }

  if (!user) return null

  return (
            <div className="flex items-center justify-betwe
                <CardTitle className="flex items-center gap-2">

                <CardDescription>
              
          <CardHeader>
              )}
              <div>
            <CardContent className="space-y-4">
                <Label htmlFor="currentPassword">{
                  id="currentPassword"
                  value={cur
                />

                <Label htmlFor="newP
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

                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}

              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <Input

                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}

              </div>

              <div className="flex gap-2 justify-end">
                <Button onClick={() => setIsChangingPassword(false)} variant="outline">
                  {t('common.cancel')}

                <Button onClick={handleChangePassword}>
                  {t('profile.changePassword')}
                </Button>
              </div>
            </CardContent>

        </Card>

        <Card>

            <CardTitle>{t('profile.subscription')}</CardTitle>
            <CardDescription>{t('profile.subscriptionDescription')}</CardDescription>
          </CardHeader>

            <div className="flex items-center justify-between">

                <p className="text-sm text-muted-foreground">{t('subscription.current')}</p>
                <div className="mt-1">{getSubscriptionBadge()}</div>
              </div>
              {user.subscription === 'free' && (
                <Button>{t('subscription.upgrade')}</Button>

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

                ) : (
                  <>
                    <li className="list-disc">{t('subscription.free.features.0')}</li>
                    <li className="list-disc">{t('subscription.free.features.1')}</li>
                    <li className="list-disc">{t('subscription.free.features.2')}</li>
                    <li className="list-disc">{t('subscription.free.features.3')}</li>
                  </>
                )}

            </div>

        </Card>

    </div>

}
