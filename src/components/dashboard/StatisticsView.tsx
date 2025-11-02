import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWalletSummaries, useTransactions } from '@/hooks/use-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { WalletType } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import {
  ArrowsLeftRight,
  Bank,
  Calendar,
  CheckCircle,
  CurrencyCircleDollar,
  Percent,
  TrendDown,
  TrendUp,
  Wallet,
  Warning,
} from '@phosphor-icons/react'

export function StatisticsView() {
  const { t, i18n } = useTranslation()
  const summaries = useWalletSummaries()
  const { transactions: allTransactions } = useTransactions()

  const stats = useMemo(() => {
    if (!summaries || summaries.length === 0) {
      return {
        totalWallets: 0,
        totalBalance: 0,
        totalTransactions: 0,
        totalDailySent: 0,
        totalDailyReceived: 0,
        totalMonthlySent: 0,
        totalMonthlyReceived: 0,
        totalDailyLimit: 0,
        totalMonthlyLimit: 0,
        totalDailyRemainingSend: 0,
        totalDailyRemainingReceive: 0,
        totalMonthlyRemainingSend: 0,
        totalMonthlyRemainingReceive: 0,
        dailyUsagePercent: 0,
        monthlyUsagePercent: 0,
        walletsAtRisk: 0,
        walletsExceeded: 0,
        walletsSafe: 0,
        byType: {} as Record<WalletType, { count: number; balance: number; dailySent: number; dailyReceived: number; monthlySent: number; monthlyReceived: number }>,
        byStatus: {} as Record<string, number>,
        topWalletsByBalance: [],
        topWalletsByDailyUsage: []
      }
    }

    const totalBalance = summaries.reduce((sum, s) => sum + (s.wallet.balance || 0), 0)
    const totalDailySent = summaries.reduce((sum, s) => sum + s.dailySent, 0)
    const totalDailyReceived = summaries.reduce((sum, s) => sum + s.dailyReceived, 0)
    const totalMonthlySent = summaries.reduce((sum, s) => sum + s.monthlySent, 0)
    const totalMonthlyReceived = summaries.reduce((sum, s) => sum + s.monthlyReceived, 0)
    
    const totalDailyLimit = summaries.reduce((sum, s) => sum + s.wallet.dailyLimit, 0)
    const totalMonthlyLimit = summaries.reduce((sum, s) => sum + s.wallet.monthlyLimit, 0)
    
    const totalDailyRemainingSend = summaries.reduce((sum, s) => sum + s.dailyRemaining, 0)
    const totalDailyRemainingReceive = summaries.reduce((sum, s) => sum + s.dailyRemainingReceive, 0)
    const totalMonthlyRemainingSend = summaries.reduce((sum, s) => sum + s.monthlyRemaining, 0)
    const totalMonthlyRemainingReceive = summaries.reduce((sum, s) => sum + s.monthlyRemainingReceive, 0)

    const dailyUsagePercent = totalDailyLimit > 0 ? ((totalDailySent + totalDailyReceived) / totalDailyLimit) * 100 : 0
    const monthlyUsagePercent = totalMonthlyLimit > 0 ? ((totalMonthlySent + totalMonthlyReceived) / totalMonthlyLimit) * 100 : 0

    const walletsAtRisk = summaries.filter(s => s.dailyPercentage >= 70 || s.monthlyPercentage >= 70).length
    const walletsExceeded = summaries.filter(s => s.dailyPercentage >= 100 || s.monthlyPercentage >= 100).length
    const walletsSafe = summaries.filter(s => s.dailyPercentage < 70 && s.monthlyPercentage < 70).length

    const byType = summaries.reduce((acc, s) => {
      const type = s.wallet.type
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          balance: 0,
          dailySent: 0,
          dailyReceived: 0,
          monthlySent: 0,
          monthlyReceived: 0
        }
      }
      acc[type].count += 1
      acc[type].balance += s.wallet.balance || 0
      acc[type].dailySent += s.dailySent
      acc[type].dailyReceived += s.dailyReceived
      acc[type].monthlySent += s.monthlySent
      acc[type].monthlyReceived += s.monthlyReceived
      return acc
    }, {} as Record<WalletType, { count: number; balance: number; dailySent: number; dailyReceived: number; monthlySent: number; monthlyReceived: number }>)

    const byStatus = summaries.reduce((acc, s) => {
      const status = s.wallet.status || 'active'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topWalletsByBalance = [...summaries]
      .sort((a, b) => (b.wallet.balance || 0) - (a.wallet.balance || 0))
      .slice(0, 5)

    const topWalletsByDailyUsage = [...summaries]
      .sort((a, b) => b.dailyPercentage - a.dailyPercentage)
      .slice(0, 5)

    return {
      totalWallets: summaries.length,
      totalBalance,
      totalTransactions: allTransactions?.length || 0,
      totalDailySent,
      totalDailyReceived,
      totalMonthlySent,
      totalMonthlyReceived,
      totalDailyLimit,
      totalMonthlyLimit,
      totalDailyRemainingSend,
      totalDailyRemainingReceive,
      totalMonthlyRemainingSend,
      totalMonthlyRemainingReceive,
      dailyUsagePercent,
      monthlyUsagePercent,
      walletsAtRisk,
      walletsExceeded,
      walletsSafe,
      byType,
      byStatus,
      topWalletsByBalance,
      topWalletsByDailyUsage
    }
  }, [summaries, allTransactions])

  const getWalletTypeIcon = (type: WalletType) => {
    if (type === 'bank' || type === 'instapay') {
      return <Bank size={20} weight="fill" className="text-primary" />
    }
    return <Wallet size={20} weight="fill" className="text-accent" />
  }

  const getWalletTypeName = (type: WalletType) => {
    switch (type) {
      case 'vodafone':
        return t('wallet.vodafoneCash')
      case 'orange':
        return t('wallet.orangeMoney')
      case 'etisalat':
        return t('wallet.etisalatCash')
      case 'instapay':
        return t('wallet.instaPay')
      case 'bank':
        return t('wallet.bankAccount')
      default:
        return type
    }
  }

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-orange-500'
    return 'bg-green-500'
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('statistics.title')}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CurrencyCircleDollar size={18} weight="fill" className="text-primary" />
              {t('dashboard.totalBalance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{formatCurrency(stats.totalBalance, i18n.language)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('statistics.across')} {stats.totalWallets} {t('statistics.wallets')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowsLeftRight size={18} weight="fill" className="text-accent" />
              {t('statistics.transactions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">{stats.totalTransactions}</p>
            <div className="flex items-center gap-3 mt-1 text-xs">
              <span className="text-red-600 flex items-center gap-1">
                <TrendUp size={12} weight="bold" />
                {formatCurrency(stats.totalDailySent, i18n.language)}
              </span>
              <span className="text-green-600 flex items-center gap-1">
                <TrendDown size={12} weight="bold" />
                {formatCurrency(stats.totalDailyReceived, i18n.language)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle size={18} weight="fill" className="text-green-600" />
              {t('statistics.safeWallets')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.walletsSafe}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('statistics.below70Usage')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Warning size={18} weight="fill" className="text-orange-600" />
              {t('dashboard.walletsAtRisk')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{stats.walletsAtRisk}</p>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <Badge variant="destructive" className="text-xs">{stats.walletsExceeded} {t('statistics.exceeded')}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} weight="fill" className="text-primary" />
              {t('statistics.dailyLimits')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t('statistics.overallUsage')}</span>
                <span className="text-sm font-semibold">{stats.dailyUsagePercent.toFixed(1)}%</span>
              </div>
              <Progress value={stats.dailyUsagePercent} className="h-3" indicatorClassName={getProgressColor(stats.dailyUsagePercent)} />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('statistics.totalSent')}</span>
                <span className="font-semibold text-red-600">{formatCurrency(stats.totalDailySent, i18n.language)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('statistics.totalReceived')}</span>
                <span className="font-semibold text-green-600">{formatCurrency(stats.totalDailyReceived, i18n.language)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('statistics.totalLimit')}</span>
                <span className="font-semibold">{formatCurrency(stats.totalDailyLimit, i18n.language)}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('statistics.remainingSend')}</span>
                <span className="font-bold text-red-600">{formatCurrency(stats.totalDailyRemainingSend, i18n.language)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('statistics.remainingReceive')}</span>
                <span className="font-bold text-green-600">{formatCurrency(stats.totalDailyRemainingReceive, i18n.language)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} weight="fill" className="text-accent" />
              {t('statistics.monthlyLimits')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t('statistics.overallUsage')}</span>
                <span className="text-sm font-semibold">{stats.monthlyUsagePercent.toFixed(1)}%</span>
              </div>
              <Progress value={stats.monthlyUsagePercent} className="h-3" indicatorClassName={getProgressColor(stats.monthlyUsagePercent)} />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('statistics.totalSent')}</span>
                <span className="font-semibold text-red-600">{formatCurrency(stats.totalMonthlySent, i18n.language)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('statistics.totalReceived')}</span>
                <span className="font-semibold text-green-600">{formatCurrency(stats.totalMonthlyReceived, i18n.language)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('statistics.totalLimit')}</span>
                <span className="font-semibold">{formatCurrency(stats.totalMonthlyLimit, i18n.language)}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('statistics.remainingSend')}</span>
                <span className="font-bold text-red-600">{formatCurrency(stats.totalMonthlyRemainingSend, i18n.language)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('statistics.remainingReceive')}</span>
                <span className="font-bold text-green-600">{formatCurrency(stats.totalMonthlyRemainingReceive, i18n.language)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet size={20} weight="fill" className="text-primary" />
              {t('statistics.byType')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.byType).map(([type, data]) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getWalletTypeIcon(type as WalletType)}
                      <span className="font-medium">{getWalletTypeName(type as WalletType)}</span>
                    </div>
                    <Badge variant="secondary">{data.count}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm pl-7">
                    <div className="text-muted-foreground">{t('statistics.balance')}:</div>
                    <div className="text-right font-semibold">{formatCurrency(data.balance, i18n.language)}</div>
                    <div className="text-muted-foreground">{t('statistics.dailySent')}:</div>
                    <div className="text-right text-red-600">{formatCurrency(data.dailySent, i18n.language)}</div>
                    <div className="text-muted-foreground">{t('statistics.dailyReceived')}:</div>
                    <div className="text-right text-green-600">{formatCurrency(data.dailyReceived, i18n.language)}</div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent size={20} weight="fill" className="text-accent" />
              {t('statistics.byStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize">{t(`wallet.status.${status}`)}</span>
                  <Badge variant={status === 'active' ? 'default' : 'secondary'}>{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendUp size={20} weight="fill" className="text-primary" />
              {t('statistics.topByBalance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topWalletsByBalance.map((summary, index) => (
                <div key={summary.wallet.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{summary.wallet.accountName || summary.wallet.accountNumber}</p>
                    <p className="text-xs text-muted-foreground">{getWalletTypeName(summary.wallet.type)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{formatCurrency(summary.wallet.balance, i18n.language)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warning size={20} weight="fill" className="text-orange-600" />
              {t('statistics.topByUsage')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topWalletsByDailyUsage.map((summary, index) => (
                <div key={summary.wallet.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-600/10 text-orange-600 text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{summary.wallet.accountName || summary.wallet.accountNumber}</p>
                    <p className="text-xs text-muted-foreground">{getWalletTypeName(summary.wallet.type)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">{summary.dailyPercentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
