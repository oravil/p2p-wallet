import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useIsMobile } from '@/hooks/use-mobile'
import { Wallet, ShieldCheck, UserCircle, SignOut, Translate, List, ChartBar, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useKV } from '@github/spark/hooks'

interface SidebarNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userRole: 'admin' | 'trader'
  onLogout: () => void
  onToggleLanguage: () => void
  userName: string
}

export function SidebarNav({ activeTab, onTabChange, userRole, onLogout, onToggleLanguage, userName }: SidebarNavProps) {
  const { t, i18n } = useTranslation()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const isRTL = i18n.language === 'ar'

  const navItems = [
    {
      id: 'dashboard',
      label: t('dashboard.title'),
      icon: Wallet,
      show: true
    },
    {
      id: 'statistics',
      label: t('statistics.title'),
      icon: ChartBar,
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

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    setOpen(false)
  }

  const handleLogout = () => {
    setOpen(false)
    onLogout()
  }

  const handleToggleLanguage = () => {
    onToggleLanguage()
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold truncate">{t('app.title')}</h2>
        <p className="text-sm text-muted-foreground mt-1 truncate">{userName}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                'hover:bg-accent hover:text-accent-foreground active:scale-95',
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground'
              )}
            >
              <Icon size={22} weight="bold" />
              <span className="font-medium text-base">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-12"
          onClick={handleToggleLanguage}
        >
          <Translate size={22} weight="bold" />
          <span className="text-base">{t('common.language')}</span>
        </Button>

        <Separator className="my-2" />

        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <SignOut size={22} weight="bold" />
          <span className="text-base">{t('auth.logout')}</span>
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
            <List size={22} weight="bold" />
          </Button>
        </SheetTrigger>
        <SheetContent side={isRTL ? "right" : "left"} className="p-0 w-[85vw] max-w-[320px]">
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
  const [sidebarCollapsed, setSidebarCollapsed] = useKV<boolean>('sidebar-collapsed', false)

  const navItems = [
    {
      id: 'dashboard',
      label: t('dashboard.title'),
      icon: Wallet,
      show: true
    },
    {
      id: 'statistics',
      label: t('statistics.title'),
      icon: ChartBar,
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

  const toggleSidebar = () => {
    setSidebarCollapsed(current => !current)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {!isMobile && (
        <aside 
          className={cn(
            "border-r bg-card/50 backdrop-blur-sm flex flex-col sticky top-0 h-screen transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "w-20" : "w-64"
          )}
        >
          <div className={cn("p-6 border-b transition-all", sidebarCollapsed && "px-4")}>
            {!sidebarCollapsed && (
              <>
                <h2 className="text-xl font-bold truncate">{t('app.title')}</h2>
                <p className="text-sm text-muted-foreground mt-1 truncate">{userName}</p>
              </>
            )}
            {sidebarCollapsed && (
              <div className="w-full h-10 flex items-center justify-center">
                <Wallet size={24} weight="bold" className="text-primary" />
              </div>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                    'hover:bg-accent hover:text-accent-foreground hover:shadow-sm',
                    activeTab === item.id
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground',
                    sidebarCollapsed && 'justify-center px-2'
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon size={20} weight="bold" />
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              )
            })}
          </nav>

          <div className={cn("p-4 border-t space-y-2", sidebarCollapsed && "px-2")}>
            {!sidebarCollapsed && (
              <>
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
              </>
            )}
            
            {sidebarCollapsed && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-full"
                  onClick={onToggleLanguage}
                  title={t('common.language')}
                >
                  <Translate size={20} weight="bold" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={onLogout}
                  title={t('auth.logout')}
                >
                  <SignOut size={20} weight="bold" />
                </Button>
              </>
            )}
            
            <Separator className="my-2" />
            
            <Button
              variant="outline"
              size={sidebarCollapsed ? "icon" : "default"}
              className={cn("w-full", !sidebarCollapsed && "justify-start gap-3")}
              onClick={toggleSidebar}
              title={sidebarCollapsed ? t('common.expand') : t('common.collapse')}
            >
              {sidebarCollapsed ? (
                <CaretRight size={20} weight="bold" />
              ) : (
                <>
                  <CaretLeft size={20} weight="bold" />
                  <span>{t('common.collapse')}</span>
                </>
              )}
            </Button>
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {isMobile && (
          <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
            <div className="flex items-center justify-between gap-3 p-4">
              <SidebarNav
                activeTab={activeTab}
                onTabChange={onTabChange}
                userRole={userRole}
                onLogout={onLogout}
                onToggleLanguage={onToggleLanguage}
                userName={userName}
              />
              <h1 className="text-lg font-bold truncate flex-1 text-center">{t('app.title')}</h1>
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
