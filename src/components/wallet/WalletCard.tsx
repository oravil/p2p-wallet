import { WalletSummary } from '@/lib/types'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { formatCurrency, getLimitColor, getProgressColor } from '@/lib/utils'
import { Wallet, Bank, Plus, ArrowUp, ArrowDown, Warning, PencilSimple, ClockCounterClockwise, DotsThree, Trash, ArrowsClockwise, Pause, X, Article } from '@phosphor-icons/react'
import { useState } from 'react'
import { AddTransactionDialog } from './AddTransactionDialog'
import { EditWalletDialog } from './EditWalletDialog'
import { TransactionsHistoryDialog } from './TransactionsHistoryDialog'
import { useWallets, useTransactions } from '@/hooks/use-data'
import { toast } from 'sonner'

interface WalletCardProps {
  summary: WalletSummary
  onEdit?: () => void
}

export function WalletCard({ summary, onEdit }: WalletCardProps) {
  const { t, i18n } = useTranslation()
  const { deleteWallet } = useWallets()
  const { deleteTransactionsByWallet, resetDailyTransactions, resetMonthlyTransactions } = useTransactions()
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [showEditWallet, setShowEditWallet] = useState(false)
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showResetDailyDialog, setShowResetDailyDialog] = useState(false)
  const [showResetMonthlyDialog, setShowResetMonthlyDialog] = useState(false)
  const { wallet, dailyPercentage, monthlyPercentage, dailyRemaining, monthlyRemaining } = summary

  const isAtRisk = dailyPercentage >= 80 || monthlyPercentage >= 80
  const isExceeded = dailyPercentage >= 100 || monthlyPercentage >= 100

  const getStatusBadge = () => {
    const status = wallet.status || 'active'
    switch (status) {
      case 'paused':
        return (
          <Badge variant="secondary" className="gap-1 text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
            <Pause size={12} weight="fill" />
            {t('wallet.statusPaused')}
          </Badge>
        )
      case 'suspended':
        return (
          <Badge variant="secondary" className="gap-1 text-xs bg-red-100 text-red-800 border-red-300">
            <X size={12} weight="fill" />
            {t('wallet.statusSuspended')}
          </Badge>
        )
      case 'issue':
        return (
          <Badge variant="secondary" className="gap-1 text-xs bg-orange-100 text-orange-800 border-orange-300">
            <Warning size={12} weight="fill" />
            {t('wallet.statusIssue')}
          </Badge>
        )
      default:
        return null
    }
  }

  const handleDeleteAccount = () => {
    deleteTransactionsByWallet(wallet.id)
    deleteWallet(wallet.id)
    toast.success(t('wallet.deleteAccountSuccess'))
    setShowDeleteDialog(false)
  }

  const handleResetDaily = () => {
    resetDailyTransactions(wallet.id)
    toast.success(t('wallet.resetDailySuccess'))
    setShowResetDailyDialog(false)
  }

  const handleResetMonthly = () => {
    resetMonthlyTransactions(wallet.id)
    toast.success(t('wallet.resetMonthlySuccess'))
    setShowResetMonthlyDialog(false)
  }

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
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-lg">{wallet.accountName}</CardTitle>
                  {getStatusBadge()}
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
                {wallet.note && (
                  <div className="flex items-start gap-1 mt-1 text-xs text-muted-foreground bg-muted/50 p-1.5 rounded">
                    <Article size={12} weight="fill" className="mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{wallet.note}</span>
                  </div>
                )}
                <p className="text-lg font-bold text-primary mt-1">{formatCurrency(wallet.balance || 0, i18n.language)}</p>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                size="sm"
                onClick={() => setShowAddTransaction(true)}
                disabled={wallet.status !== 'active' && wallet.status !== undefined}
                title={wallet.status && wallet.status !== 'active' ? `Account is ${wallet.status}` : 'Add Transaction'}
              >
                <Plus size={16} weight="bold" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost">
                    <DotsThree size={20} weight="bold" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowResetDailyDialog(true)}>
                    <ArrowsClockwise size={16} weight="bold" className="mr-2" />
                    {t('wallet.resetDaily')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowResetMonthlyDialog(true)}>
                    <ArrowsClockwise size={16} weight="bold" className="mr-2" />
                    {t('wallet.resetMonthly')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash size={16} weight="bold" className="mr-2" />
                    {t('wallet.deleteAccount')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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

          <div className="grid grid-cols-3 gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditWallet(true)}
              className="gap-1"
            >
              <PencilSimple size={14} weight="bold" />
              <span className="hidden sm:inline">{t('wallet.edit')}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTransactionHistory(true)}
              className="gap-1"
            >
              <ClockCounterClockwise size={14} weight="bold" />
              <span className="hidden sm:inline">{t('transaction.history')}</span>
            </Button>
            <div className="col-span-1 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1">
                <div className="p-1 rounded bg-red-50">
                  <ArrowUp size={12} className="text-red-600" weight="bold" />
                </div>
                <div>
                  <p className="text-xs font-semibold">{formatCurrency(summary.dailySent, i18n.language)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="p-1 rounded bg-green-50">
                  <ArrowDown size={12} className="text-green-600" weight="bold" />
                </div>
                <div>
                  <p className="text-xs font-semibold">{formatCurrency(summary.dailyReceived, i18n.language)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddTransactionDialog
        open={showAddTransaction}
        onOpenChange={setShowAddTransaction}
        wallet={wallet}
        summary={summary}
      />
      
      <EditWalletDialog
        open={showEditWallet}
        onOpenChange={setShowEditWallet}
        wallet={wallet}
      />

      <TransactionsHistoryDialog
        open={showTransactionHistory}
        onOpenChange={setShowTransactionHistory}
        wallet={wallet}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('wallet.deleteAccountTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('wallet.deleteAccountDescription', { 
                wallet: wallet.accountName, 
                count: summary.transactions.length 
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetDailyDialog} onOpenChange={setShowResetDailyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('wallet.resetDailyTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('wallet.resetDailyDescription', { wallet: wallet.accountName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetDaily}>
              {t('wallet.resetDaily')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetMonthlyDialog} onOpenChange={setShowResetMonthlyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('wallet.resetMonthlyTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('wallet.resetMonthlyDescription', { wallet: wallet.accountName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetMonthly}>
              {t('wallet.resetMonthly')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
