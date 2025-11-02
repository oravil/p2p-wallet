import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { AccountStatus, Wallet } from '@/lib/types'
import { useWallets, useTransactions } from '@/hooks/use-data'
import { toast } from 'sonner'
import { Trash, ArrowsClockwise, PencilSimple } from '@phosphor-icons/react'

interface BulkActionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  wallets: Wallet[]
}

type BulkAction = 'status' | 'delete' | 'reset-daily' | 'reset-monthly' | null

export function BulkActionsDialog({ open, onOpenChange, wallets }: BulkActionsDialogProps) {
  const { t } = useTranslation()
  const { updateWallet, deleteWallet } = useWallets()
  const { deleteTransactionsByWallet, resetDailyTransactions, resetMonthlyTransactions } = useTransactions()
  const [selectedWalletIds, setSelectedWalletIds] = useState<Set<string>>(new Set())
  const [action, setAction] = useState<BulkAction>(null)
  const [newStatus, setNewStatus] = useState<AccountStatus>('active')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const toggleWalletSelection = (walletId: string) => {
    const newSelection = new Set(selectedWalletIds)
    if (newSelection.has(walletId)) {
      newSelection.delete(walletId)
    } else {
      newSelection.add(walletId)
    }
    setSelectedWalletIds(newSelection)
  }

  const toggleSelectAll = () => {
    if (selectedWalletIds.size === wallets.length) {
      setSelectedWalletIds(new Set())
    } else {
      setSelectedWalletIds(new Set(wallets.map(w => w.id)))
    }
  }

  const handleAction = () => {
    if (selectedWalletIds.size === 0) {
      toast.error(t('admin.noAccountsSelected'))
      return
    }
    setShowConfirmDialog(true)
  }

  const confirmAction = () => {
    const selectedIds = Array.from(selectedWalletIds)

    switch (action) {
      case 'status':
        selectedIds.forEach(id => {
          updateWallet(id, { status: newStatus })
        })
        toast.success(t('admin.bulkActionsSuccess'))
        break

      case 'delete':
        selectedIds.forEach(id => {
          deleteTransactionsByWallet(id)
          deleteWallet(id)
        })
        toast.success(t('admin.bulkActionsSuccess'))
        break

      case 'reset-daily':
        selectedIds.forEach(id => {
          resetDailyTransactions(id)
        })
        toast.success(t('admin.bulkActionsSuccess'))
        break

      case 'reset-monthly':
        selectedIds.forEach(id => {
          resetMonthlyTransactions(id)
        })
        toast.success(t('admin.bulkActionsSuccess'))
        break
    }

    setShowConfirmDialog(false)
    setSelectedWalletIds(new Set())
    setAction(null)
    onOpenChange(false)
  }

  const getConfirmDialogContent = () => {
    const count = selectedWalletIds.size

    switch (action) {
      case 'status':
        return {
          title: t('admin.bulkUpdateStatusTitle'),
          description: t('admin.bulkUpdateStatusDescription', { count })
        }
      case 'delete':
        return {
          title: t('admin.bulkDeleteTitle'),
          description: t('admin.bulkDeleteDescription', { count })
        }
      case 'reset-daily':
        return {
          title: t('admin.bulkResetTitle'),
          description: t('admin.bulkResetDescription', { count }) + ' ' + t('admin.resetDailyLimits')
        }
      case 'reset-monthly':
        return {
          title: t('admin.bulkResetTitle'),
          description: t('admin.bulkResetDescription', { count }) + ' ' + t('admin.resetMonthlyLimits')
        }
      default:
        return { title: '', description: '' }
    }
  }

  return (
    <>
      <Dialog open={open && !showConfirmDialog} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{t('admin.bulkActions')}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b sticky top-0 bg-background z-10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedWalletIds.size === wallets.length && wallets.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                  <Label className="cursor-pointer" onClick={toggleSelectAll}>
                    {t('admin.selectAccounts')}
                  </Label>
                </div>
                {selectedWalletIds.size > 0 && (
                  <Badge variant="secondary">
                    {t('admin.selectedCount', { count: selectedWalletIds.size })}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {wallets.map(wallet => (
                <div
                  key={wallet.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedWalletIds.has(wallet.id) ? 'bg-primary/5 border-primary' : ''
                  }`}
                  onClick={() => toggleWalletSelection(wallet.id)}
                >
                  <Checkbox
                    checked={selectedWalletIds.has(wallet.id)}
                    onCheckedChange={() => toggleWalletSelection(wallet.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{wallet.accountName}</p>
                    <p className="text-sm text-muted-foreground">{wallet.accountNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{wallet.type}</p>
                    {wallet.status && wallet.status !== 'active' && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {t(`wallet.status${wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1)}`)}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('common.actions')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={action === 'status' ? 'default' : 'outline'}
                    onClick={() => setAction('status')}
                    className="gap-2"
                  >
                    <PencilSimple size={16} weight="bold" />
                    {t('admin.bulkUpdateStatus')}
                  </Button>
                  <Button
                    variant={action === 'reset-daily' ? 'default' : 'outline'}
                    onClick={() => setAction('reset-daily')}
                    className="gap-2"
                  >
                    <ArrowsClockwise size={16} weight="bold" />
                    {t('wallet.resetDaily')}
                  </Button>
                  <Button
                    variant={action === 'reset-monthly' ? 'default' : 'outline'}
                    onClick={() => setAction('reset-monthly')}
                    className="gap-2"
                  >
                    <ArrowsClockwise size={16} weight="bold" />
                    {t('wallet.resetMonthly')}
                  </Button>
                  <Button
                    variant={action === 'delete' ? 'destructive' : 'outline'}
                    onClick={() => setAction('delete')}
                    className="gap-2"
                  >
                    <Trash size={16} weight="bold" />
                    {t('admin.bulkDelete')}
                  </Button>
                </div>
              </div>

              {action === 'status' && (
                <div className="space-y-2">
                  <Label>{t('wallet.accountStatus')}</Label>
                  <Select value={newStatus} onValueChange={(value: AccountStatus) => setNewStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('wallet.statusActive')}</SelectItem>
                      <SelectItem value="paused">{t('wallet.statusPaused')}</SelectItem>
                      <SelectItem value="suspended">{t('wallet.statusSuspended')}</SelectItem>
                      <SelectItem value="issue">{t('wallet.statusIssue')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleAction}
                disabled={!action || selectedWalletIds.size === 0}
                variant={action === 'delete' ? 'destructive' : 'default'}
              >
                {t('common.confirm')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getConfirmDialogContent().title}</DialogTitle>
            <DialogDescription>{getConfirmDialogContent().description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={confirmAction}
              variant={action === 'delete' ? 'destructive' : 'default'}
            >
              {t('common.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
