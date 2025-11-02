import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWalletSummaries, useTransactions } from '@/hooks/use-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WalletType } from '@/lib/types'
  Wallet,
  TrendUp,
  Warning,
import { WalletType } from '@/lib/types'
  Arrows
  Wallet,
export 
  TrendUp,

  Warning,
  CheckCircle,
  Percent,
  CurrencyCircleDollar,
        totalMonth
        to
        totalDailyRemainingRec

        monthlyUsagePercent: 0,
        walletsExceeded: 0,
        byType: {} as Record<WalletType,
        topWalletsByBalance: [],


    const totalDailySent = summaries.reduce((su
    const tota
    
    const totalMonthlyLi
    const totalDailyRemaining
    const totalMonthlyRema

    const monthlyUsagePercen
    const walletsAtRisk = summar
    const walletsSafe = sum
    const byType = summaries.
      if (!acc[type]) {
          count: 0,
          dailySent: 0,
          monthlySent: 0,
        }
        monthlyUsagePercent: 0,
      acc[type].dailySent
        walletsExceeded: 0,
      return acc

      const status = s.wallet.status || 'active
        topWalletsByBalance: [],

      .


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
          <CardHeader clas
      acc[type].balance += s.wallet.balance || 0
            </CardTitle>
      acc[type].dailyReceived += s.dailyReceived
            <p className="text-xs text-muted
      acc[type].monthlyReceived += s.monthlyReceived
        </Card>
    }, {} as Record<WalletType, { count: number; balance: number; dailySent: number; dailyReceived: number; monthlySent: number; monthlyReceived: number }>)

    const byStatus = summaries.reduce((acc, s) => {
      const status = s.wallet.status || 'active'
      acc[status] = (acc[status] || 0) + 1
              <s
    }, {} as Record<string, number>)

    const topWalletsByBalance = [...summaries]
      .sort((a, b) => (b.wallet.balance || 0) - (a.wallet.balance || 0))
      .slice(0, 5)

    const topWalletsByDailyUsage = [...summaries]
              {t('statistics.safeWallets')}
      .slice(0, 5)

    return {
      totalWallets: summaries.length,

      totalTransactions: allTransactions?.length || 0,
      totalDailySent,
            </CardTitle>
      totalMonthlySent,
            <div className=
      totalDailyLimit,
      totalMonthlyLimit,
      totalDailyRemainingSend,
        <Card>
      totalMonthlyRemainingSend,
              {t('statistics.dailyL
      dailyUsagePercent,
            <div>
      walletsAtRisk,
      walletsExceeded,
      walletsSafe,
            <
      byStatus,
                <span clas
      topWalletsByDailyUsage
     
  }, [summaries, allTransactions])

  const getWalletTypeIcon = (type: WalletType) => {
    if (type === 'bank' || type === 'instapay') {
      return <Bank size={20} weight="fill" className="text-primary" />
     
    return <Wallet size={20} weight="fill" className="text-accent" />
   

  const getWalletTypeName = (type: WalletType) => {
    switch (type) {
        <Card>
        return t('wallet.vodafoneCash')
              {t('st
        return t('wallet.orangeMoney')
      case 'etisalat':
        return t('wallet.etisalatCash')
      case 'instapay':
        return t('wallet.instaPay')
            <Separ
        return t('wallet.bankAccount')
              
        return type
     
  }

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 90) return 'bg-red-500'
              <div className="flex items-center 
    return 'bg-green-500'
   

          
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('statistics.title')}</h2>
            

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
                <div key={type} classNa
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CurrencyCircleDollar size={18} weight="fill" className="text-primary" />
              {t('dashboard.totalBalance')}
                  <div c
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{formatCurrency(stats.totalBalance, i18n.language)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('statistics.across')} {stats.totalWallets} {t('statistics.wallets')}
            <Car
          </CardContent>
          </Car

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowsLeftRight size={18} weight="fill" className="text-accent" />
                  <div className="text-right ml-2
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

          </CardContent>



          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle size={18} weight="fill" className="text-green-600" />
              {t('statistics.safeWallets')}
            </CardTitle>

          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.walletsSafe}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('statistics.below70Usage')}
            </p>




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

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t('statistics.overallUsage')}</span>
                <span className="text-sm font-semibold">{stats.dailyUsagePercent.toFixed(1)}%</span>

              <Progress value={stats.dailyUsagePercent} className="h-3" indicatorClassName={getProgressColor(stats.dailyUsagePercent)} />
            </div>



            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('statistics.totalSent')}</span>
                <span className="font-semibold text-red-600">{formatCurrency(stats.totalDailySent, i18n.language)}</span>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('statistics.totalReceived')}</span>
                <span className="font-semibold text-green-600">{formatCurrency(stats.totalDailyReceived, i18n.language)}</span>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('statistics.totalLimit')}</span>
                <span className="font-semibold">{formatCurrency(stats.totalDailyLimit, i18n.language)}</span>

            </div>

            <Separator />

            <div className="space-y-3 bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('statistics.remainingSend')}</span>
                <span className="font-bold text-red-600">{formatCurrency(stats.totalDailyRemainingSend, i18n.language)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('statistics.remainingReceive')}</span>



















































































































