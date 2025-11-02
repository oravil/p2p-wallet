import { WalletSummary } from '@/lib/types'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, getLimitColor, getProgressColor } from '@/lib/utils'
import { Wallet, Bank, Plus, ArrowUp, ArrowDown, Warning } from '@phosphor-icons/react'
import { useState } from 'react'
import { AddTransactionDialog } from './AddTransactionDialog'

interface WalletCardProps {
  summary: WalletSummary
  onEdit?: () => void
}

export function WalletCard({ summary, onEdit }: WalletCardProps) {
  const { t, i18n } = useTranslation()
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const { wallet, dailyPercentage, monthlyPercentage, dailyRemaining, monthlyRemaining } = summary

  const isAtRisk = dailyPercentage >= 80 || monthlyPercentage >= 80
  const isExceeded = dailyPercentage >= 100 || monthlyPercentage >= 100

  const getWalletIcon = () => {
    if (wallet.type === 'bank') {
      return <Bank size={24} weight="fill" className="text-primary" />
    }
    return <Wallet size={24} weight="fill" className="text-accent" />
  }

  const getWalletTypeName = () => {
    switch (wallet.type) {
      case 'vodafone':
        return t('wallet.vodafoneCash')
      case 'orange':
        return t('wallet.orangeMoney')
      case 'etisalat':
        return t('wallet.etisalatCash')
      case 'instapay':
        return t('wallet.instaPay')
      case 'bank':
        return wallet.bankName || t('wallet.bankAccount')
      default:
        return wallet.type
    }
  }

  return (
    <>
      <Card className={`hover:shadow-lg transition-shadow ${isAtRisk ? 'ring-2 ring-warning/30' : ''} ${isExceeded ? 'ring-2 ring-destructive/30' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                {getWalletIcon()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{wallet.accountName}</CardTitle>
                  {isExceeded && (
                    <Badge variant="destructive" className="gap-1 text-xs">
                      <Warning size={12} weight="fill" />
                      {t('limits.exceeded')}
                    </Badge>
                  )}
                  {isAtRisk && !isExceeded && (
                    <Badge variant="outline" className="gap-1 text-xs border-warning text-warning">
                      <Warning size={12} weight="fill" />
                      {t('limits.warning')}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{getWalletTypeName()}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{wallet.accountNumber}</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setShowAddTransaction(true)}
              className="shrink-0"
            >
              <Plus size={16} weight="bold" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t('dashboard.dailyLimit')}</span>
                <span className={`text-sm font-semibold ${getLimitColor(dailyPercentage)}`}>
                  {dailyPercentage.toFixed(0)}%
                </span>
              </div>
              <Progress value={dailyPercentage} className="h-2" indicatorClassName={getProgressColor(dailyPercentage)} />
              <div className="flex items-center justify-between mt-1.5 text-xs text-muted-foreground">
                <span>{formatCurrency(dailyRemaining, i18n.language)} {t('dashboard.remaining')}</span>
                <span>{formatCurrency(wallet.dailyLimit, i18n.language)}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t('dashboard.monthlyLimit')}</span>
                <span className={`text-sm font-semibold ${getLimitColor(monthlyPercentage)}`}>
                  {monthlyPercentage.toFixed(0)}%
                </span>
              </div>
              <Progress value={monthlyPercentage} className="h-2" indicatorClassName={getProgressColor(monthlyPercentage)} />
              <div className="flex items-center justify-between mt-1.5 text-xs text-muted-foreground">
                <span>{formatCurrency(monthlyRemaining, i18n.language)} {t('dashboard.remaining')}</span>
                <span>{formatCurrency(wallet.monthlyLimit, i18n.language)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-red-50">
                <ArrowUp size={16} className="text-red-600" weight="bold" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('dashboard.totalSent')}</p>
                <p className="text-sm font-semibold">{formatCurrency(summary.dailySent, i18n.language)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-green-50">
                <ArrowDown size={16} className="text-green-600" weight="bold" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('dashboard.totalReceived')}</p>
                <p className="text-sm font-semibold">{formatCurrency(summary.dailyReceived, i18n.language)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddTransactionDialog
        open={showAddTransaction}
        onOpenChange={setShowAddTransaction}
        wallet={wallet}
      />
    </>
  )
}
