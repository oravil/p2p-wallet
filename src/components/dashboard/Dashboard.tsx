import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useWalletSummaries, useTransactions, useWallets } from '@/hooks/use-data'
import { useLimitWarnings } from '@/hooks/use-limit-warnings'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { WalletCard } from '@/components/wallet/WalletCard'
import { AddWalletDialog } from '@/components/wallet/AddWalletDialog'
import { ImportWalletsDialog } from '@/components/wallet/ImportWalletsDialog'
import { BulkActionsDialog } from '@/components/wallet/BulkActionsDialog'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { UserProfile } from '@/components/profile/UserProfile'
import { Plus, MagnifyingGlass, Upload, Download, CheckSquare, SortAscending, Warning, ArrowsClockwise } from '@phosphor-icons/react'
import { formatCurrency, searchPhoneNumber, exportToCSV, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

type SortOption = 'balance-high' | 'balance-low' | 'daily-remaining-high' | 'daily-remaining-low' | 'monthly-remaining-high' | 'monthly-remaining-low'

export function Dashboard() {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const summaries = useWalletSummaries()
  const { transactions: allTransactions } = useTransactions()
  const { wallets } = useWallets()
  const [refreshKey, setRefreshKey] = useState(0)
  useLimitWarnings(summaries)
  const [showAddWallet, setShowAddWallet] = useState(false)
  const [showImportWallets, setShowImportWallets] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('balance-high')
  const [showVerificationWarning, setShowVerificationWarning] = useState(false)

  useEffect(() => {
    if (user && !user.emailVerified && user.emailVerificationSentAt) {
      const sentTime = new Date(user.emailVerificationSentAt).getTime()
      const now = Date.now()
      const hoursElapsed = (now - sentTime) / (1000 * 60 * 60)
      
      if (hoursElapsed >= 24) {
        setShowVerificationWarning(true)
      }
    }
  }, [user])

  useEffect(() => {
    setRefreshKey(prev => prev + 1)
  }, [wallets, allTransactions])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    toast.success(t('dashboard.refreshed'))
  }

  const isFeatureRestricted = user && !user.emailVerified && user.emailVerificationSentAt && 
    ((Date.now() - new Date(user.emailVerificationSentAt).getTime()) / (1000 * 60 * 60)) >= 24

  const filteredSummaries = useMemo(() => {
    let filtered = summaries

    if (searchQuery.trim() && searchQuery.replace(/\D/g, '').length >= 4) {
      filtered = filtered.filter(s => 
        searchPhoneNumber(searchQuery, s.wallet.accountNumber) ||
        s.wallet.accountName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'balance-high':
          return (b.wallet.balance || 0) - (a.wallet.balance || 0)
        case 'balance-low':
          return (a.wallet.balance || 0) - (b.wallet.balance || 0)
        case 'daily-remaining-high':
          return b.dailyRemaining - a.dailyRemaining
        case 'daily-remaining-low':
          return a.dailyRemaining - b.dailyRemaining
        case 'monthly-remaining-high':
          return b.monthlyRemaining - a.monthlyRemaining
        case 'monthly-remaining-low':
          return a.monthlyRemaining - b.monthlyRemaining
        default:
          return 0
      }
    })

    return sorted
  }, [summaries, searchQuery, sortBy])

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', newLang)
  }

  const totalSent = summaries.reduce((sum, s) => sum + s.dailySent, 0)
  const totalReceived = summaries.reduce((sum, s) => sum + s.dailyReceived, 0)
  const totalBalance = summaries.reduce((sum, s) => sum + (s.wallet.balance || 0), 0)
  const walletsAtRisk = summaries.filter(s => s.dailyPercentage >= 70 || s.monthlyPercentage >= 70).length
  const totalDailyRemainingSend = summaries.reduce((sum, s) => sum + s.dailyRemaining, 0)
  const totalDailyRemainingReceive = summaries.reduce((sum, s) => sum + s.dailyRemainingReceive, 0)
  const totalMonthlyRemainingSend = summaries.reduce((sum, s) => sum + s.monthlyRemaining, 0)
  const totalMonthlyRemainingReceive = summaries.reduce((sum, s) => sum + s.dailyRemainingReceive, 0)

  const handleExportWallets = () => {
    const exportData = summaries.map(s => ({
      Name: s.wallet.accountName,
      Type: s.wallet.type,
      'Account Number': s.wallet.accountNumber,
      Balance: s.wallet.balance || 0,
      'Daily Limit': s.wallet.dailyLimit,
      'Monthly Limit': s.wallet.monthlyLimit,
      'Daily Sent': s.dailySent,
      'Daily Received': s.dailyReceived,
      'Monthly Sent': s.monthlySent,
      'Monthly Received': s.monthlyReceived
    }))

    exportToCSV(exportData, `wallets-export-${Date.now()}.csv`)
  }

  const handleExportTransactions = () => {
    const exportData = (allTransactions || []).map(t => {
      const wallet = summaries.find(s => s.wallet.id === t.walletId)
      return {
        Date: formatDate(t.date, i18n.language),
        Wallet: wallet?.wallet.accountName || 'Unknown',
        'Account Number': wallet?.wallet.accountNumber || '',
        Type: t.type === 'send' ? 'Sent' : 'Received',
        Amount: t.amount,
        Description: t.description
      }
    })

    exportToCSV(exportData, `transactions-export-${Date.now()}.csv`)
  }

  const renderDashboardContent = () => (
    <div className="container mx-auto px-4 py-6">
      {showVerificationWarning && (
        <Alert className="mb-6 border-warning bg-warning/10">
          <Warning size={20} className="text-warning" />
          <AlertDescription>
            <strong>{t('profile.verificationRequired')}</strong>
            <p className="mt-1 text-sm">{t('profile.verificationMessage')}</p>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">{t('dashboard.totalBalance')}</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(totalBalance, i18n.language)}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">{t('dashboard.walletsAtRisk')}</p>
          <p className="text-2xl font-bold text-orange-600">{walletsAtRisk}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">{t('dashboard.dailyRemainingSend')}</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(totalDailyRemainingSend, i18n.language)}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('dashboard.dailyRemainingReceive')}: {formatCurrency(totalDailyRemainingReceive, i18n.language)}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">{t('dashboard.monthlyRemainingSend')}</p>
          <p className="text-xl font-bold text-blue-600">{formatCurrency(totalMonthlyRemainingSend, i18n.language)}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('dashboard.monthlyRemainingReceive')}: {formatCurrency(totalMonthlyRemainingReceive, i18n.language)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-semibold">{t('dashboard.allWallets')}</h2>
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            title={t('dashboard.refresh')}
          >
            <ArrowsClockwise size={20} weight="bold" />
          </Button>
          <div className="relative flex-1 sm:flex-none">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('dashboard.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-[200px]"
            />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SortAscending size={18} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="balance-high">{t('dashboard.sortBalanceHigh')}</SelectItem>
              <SelectItem value="balance-low">{t('dashboard.sortBalanceLow')}</SelectItem>
              <SelectItem value="daily-remaining-high">{t('dashboard.sortDailyHigh')}</SelectItem>
              <SelectItem value="daily-remaining-low">{t('dashboard.sortDailyLow')}</SelectItem>
              <SelectItem value="monthly-remaining-high">{t('dashboard.sortMonthlyHigh')}</SelectItem>
              <SelectItem value="monthly-remaining-low">{t('dashboard.sortMonthlyLow')}</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setShowImportWallets(true)} className="flex-1 sm:flex-none">
              <Upload size={20} weight="bold" />
              <span className="ml-2">{t('dashboard.import')}</span>
            </Button>
            <Button variant="outline" onClick={handleExportWallets} disabled={summaries.length === 0} className="flex-1 sm:flex-none">
              <Download size={20} weight="bold" />
              <span className="ml-2">{t('dashboard.export')}</span>
            </Button>
          </div>
          {user?.role === 'admin' && (
            <Button variant="outline" onClick={() => setShowBulkActions(true)} disabled={summaries.length === 0} className="w-full sm:w-auto">
              <CheckSquare size={20} weight="bold" />
              <span className="ml-2">{t('admin.bulkActions')}</span>
            </Button>
          )}
          <Button onClick={() => setShowAddWallet(true)} className="w-full sm:w-auto">
            <Plus size={20} weight="bold" />
            <span className="ml-2">{t('dashboard.addWallet')}</span>
          </Button>
        </div>
      </div>

      {summaries.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
          <p className="text-muted-foreground mb-4">{t('dashboard.noWallets')}</p>
          <Button onClick={() => setShowAddWallet(true)}>
            <Plus size={20} weight="bold" />
            <span className="ml-2">{t('dashboard.addWallet')}</span>
          </Button>
        </div>
      ) : filteredSummaries.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
          <p className="text-muted-foreground">{t('dashboard.noWalletsMatch')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" key={refreshKey}>
          {filteredSummaries.map((summary) => (
            <WalletCard key={summary.wallet.id} summary={summary} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      userRole={user?.role || 'trader'}
      onLogout={logout}
      onToggleLanguage={toggleLanguage}
      userName={user?.fullName || ''}
    >
      {activeTab === 'dashboard' && renderDashboardContent()}
      {activeTab === 'admin' && user?.role === 'admin' && <AdminPanel />}
      {activeTab === 'profile' && <UserProfile />}

      <AddWalletDialog open={showAddWallet} onOpenChange={setShowAddWallet} />
      <ImportWalletsDialog open={showImportWallets} onOpenChange={setShowImportWallets} />
      <BulkActionsDialog 
        open={showBulkActions} 
        onOpenChange={setShowBulkActions}
        wallets={summaries.map(s => s.wallet)}
      />
    </AppLayout>
  )
}
