import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useWalletSummaries, useTransactions } from '@/hooks/use-data'
import { useLimitWarnings } from '@/hooks/use-limit-warnings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WalletCard } from '@/components/wallet/WalletCard'
import { AddWalletDialog } from '@/components/wallet/AddWalletDialog'
import { ImportWalletsDialog } from '@/components/wallet/ImportWalletsDialog'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { Plus, SignOut, Translate, Wallet, ShieldCheck, MagnifyingGlass, Upload, Download } from '@phosphor-icons/react'
import { formatCurrency, searchPhoneNumber, exportToCSV, formatDate } from '@/lib/utils'

export function Dashboard() {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const summaries = useWalletSummaries()
  const { transactions: allTransactions } = useTransactions()
  useLimitWarnings(summaries)
  const [showAddWallet, setShowAddWallet] = useState(false)
  const [showImportWallets, setShowImportWallets] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSummaries = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.replace(/\D/g, '').length < 4) {
      return summaries
    }

    return summaries.filter(s => 
      searchPhoneNumber(searchQuery, s.wallet.accountNumber) ||
      s.wallet.accountName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [summaries, searchQuery])

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', newLang)
  }

  const totalSent = summaries.reduce((sum, s) => sum + s.dailySent, 0)
  const totalReceived = summaries.reduce((sum, s) => sum + s.dailyReceived, 0)
  const totalBalance = summaries.reduce((sum, s) => sum + s.wallet.balance, 0)
  const walletsAtRisk = summaries.filter(s => s.dailyPercentage >= 70 || s.monthlyPercentage >= 70).length

  const handleExportWallets = () => {
    const exportData = summaries.map(s => ({
      Name: s.wallet.accountName,
      Type: s.wallet.type,
      'Account Number': s.wallet.accountNumber,
      Balance: s.wallet.balance,
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

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{t('app.title')}</h1>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.welcome')}, {user?.fullName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={toggleLanguage}>
                <Translate size={20} weight="bold" />
              </Button>
              <Button variant="outline" onClick={logout}>
                <SignOut size={20} weight="bold" />
                <span className="ml-2 hidden sm:inline">{t('auth.logout')}</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {user?.role === 'admin' ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b bg-muted/30">
              <div className="container mx-auto px-4">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="dashboard" className="gap-2">
                    <Wallet size={18} weight="bold" />
                    {t('dashboard.title')}
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="gap-2">
                    <ShieldCheck size={18} weight="bold" />
                    {t('admin.title')}
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="dashboard" className="m-0">
              <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-card p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Total Balance</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(totalBalance, i18n.language)}</p>
                  </div>
                  <div className="bg-card p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">{t('dashboard.totalSent')}</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSent, i18n.language)}</p>
                  </div>
                  <div className="bg-card p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">{t('dashboard.totalReceived')}</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalReceived, i18n.language)}</p>
                  </div>
                  <div className="bg-card p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Wallets at Risk</p>
                    <p className="text-2xl font-bold text-orange-600">{walletsAtRisk}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                  <h2 className="text-xl font-semibold">{t('dashboard.allWallets')}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by 4 digits or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-[200px]"
                      />
                    </div>
                    <Button variant="outline" onClick={() => setShowImportWallets(true)}>
                      <Upload size={20} weight="bold" />
                      <span className="ml-2 hidden sm:inline">Import</span>
                    </Button>
                    <Button variant="outline" onClick={handleExportWallets} disabled={summaries.length === 0}>
                      <Download size={20} weight="bold" />
                      <span className="ml-2 hidden sm:inline">Export</span>
                    </Button>
                    <Button onClick={() => setShowAddWallet(true)}>
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
                    <p className="text-muted-foreground">No wallets match your search</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSummaries.map((summary) => (
                      <WalletCard key={summary.wallet.id} summary={summary} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="admin" className="m-0">
              <AdminPanel />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalBalance, i18n.language)}</p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">{t('dashboard.totalSent')}</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSent, i18n.language)}</p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">{t('dashboard.totalReceived')}</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalReceived, i18n.language)}</p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Wallets at Risk</p>
                <p className="text-2xl font-bold text-orange-600">{walletsAtRisk}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
              <h2 className="text-xl font-semibold">{t('dashboard.allWallets')}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by 4 digits or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-[200px]"
                  />
                </div>
                <Button variant="outline" onClick={() => setShowImportWallets(true)}>
                  <Upload size={20} weight="bold" />
                  <span className="ml-2 hidden sm:inline">Import</span>
                </Button>
                <Button variant="outline" onClick={handleExportWallets} disabled={summaries.length === 0}>
                  <Download size={20} weight="bold" />
                  <span className="ml-2 hidden sm:inline">Export</span>
                </Button>
                <Button onClick={() => setShowAddWallet(true)}>
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
                <p className="text-muted-foreground">No wallets match your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSummaries.map((summary) => (
                  <WalletCard key={summary.wallet.id} summary={summary} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <AddWalletDialog open={showAddWallet} onOpenChange={setShowAddWallet} />
      <ImportWalletsDialog open={showImportWallets} onOpenChange={setShowImportWallets} />
    </div>
  )
}
