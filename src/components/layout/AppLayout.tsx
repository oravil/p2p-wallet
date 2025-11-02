import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useIsMobile } from '@/hooks/use-mobile'
import { Wallet, ShieldCheck, UserCircle, SignOut, Translate, List } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface SidebarNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userRole: 'admin' | 'trader'
  onLogout: () => void
  onToggleLanguage: () => void
  userName: string
}

export function SidebarNav({ activeTab, onTabChange, userRole, onLogout, onToggleLanguage, userName }: SidebarNavProps) {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const navItems = [
    {
      id: 'dashboard',
      label: t('dashboard.title'),
      icon: Wallet,
      show: true
    },
    {
      id: 'admin',
      label: t('admin.title'),
      icon: ShieldCheck,
      show: userRole === 'admin'
    },
    {
      id: 'profile',
      label: t('common.profile'),
      icon: UserCircle,
      show: true
    }
  ].filter(item => item.show)

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">{t('app.title')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{userName}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                'hover:bg-accent hover:text-accent-foreground',
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground'
              )}
            >
              <Icon size={20} weight="bold" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={onToggleLanguage}
        >
          <Translate size={20} weight="bold" />
          <span>{t('common.language')}</span>
        </Button>

        <Separator className="my-2" />

        <Button
          variant="outline"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <SignOut size={20} weight="bold" />
          <span>{t('auth.logout')}</span>
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <List size={20} weight="bold" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <NavContent />
        </SheetContent>
      </Sheet>
    )
  }

  return null
}

interface AppLayoutProps {
  children: ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
  userRole: 'admin' | 'trader'
  onLogout: () => void
  onToggleLanguage: () => void
  userName: string
}

export function AppLayout({ 
  children, 
  activeTab, 
  onTabChange, 
  userRole, 
  onLogout, 
  onToggleLanguage, 
  userName 
}: AppLayoutProps) {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const navItems = [
    {
      id: 'dashboard',
      label: t('dashboard.title'),
      icon: Wallet,
      show: true
    },
    {
      id: 'admin',
      label: t('admin.title'),
      icon: ShieldCheck,
      show: userRole === 'admin'
    },
    {
      id: 'profile',
      label: t('common.profile'),
      icon: UserCircle,
      show: true
    }
  ].filter(item => item.show)

  return (
    <div className="min-h-screen bg-background flex">
      {!isMobile && (
        <aside className="w-64 border-r bg-card flex flex-col sticky top-0 h-screen">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">{t('app.title')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{userName}</p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                    'hover:bg-accent hover:text-accent-foreground',
                    activeTab === item.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon size={20} weight="bold" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="p-4 border-t space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={onToggleLanguage}
            >
              <Translate size={20} weight="bold" />
              <span>{t('common.language')}</span>
            </Button>

            <Separator className="my-2" />

            <Button
              variant="outline"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onLogout}
            >
              <SignOut size={20} weight="bold" />
              <span>{t('auth.logout')}</span>
            </Button>
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col">
        {isMobile && (
          <header className="border-b bg-card sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <SidebarNav
                activeTab={activeTab}
                onTabChange={onTabChange}
                userRole={userRole}
                onLogout={onLogout}
                onToggleLanguage={onToggleLanguage}
                userName={userName}
              />
              <h1 className="text-lg font-bold">{t('app.title')}</h1>
              <div className="w-10" />
            </div>
          </header>
        )}
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
