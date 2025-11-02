import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Wallet, AccountStatus } from '@/lib/types'
import { useWallets } from '@/hooks/use-data'
import { toast } from 'sonner'

interface EditWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  wallet: Wallet | null
}

export function EditWalletDialog({ open, onOpenChange, wallet }: EditWalletDialogProps) {
  const { t } = useTranslation()
  const { updateWallet } = useWallets()
  const [formData, setFormData] = useState({
    balance: '',
    dailyLimit: '',
    monthlyLimit: '',
    remainingManual: '',
    status: 'active' as AccountStatus,
    note: ''
  })

  useEffect(() => {
    if (wallet && open) {
      setFormData({
        balance: (wallet.balance || 0).toString(),
        dailyLimit: wallet.dailyLimit.toString(),
        monthlyLimit: wallet.monthlyLimit.toString(),
        remainingManual: (wallet.remainingManual || 0).toString(),
        status: wallet.status || 'active',
        note: wallet.note || ''
      })
    }
  }, [wallet, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallet) return

    const balance = parseFloat(formData.balance) || 0
    const dailyLimit = parseFloat(formData.dailyLimit)
    const monthlyLimit = parseFloat(formData.monthlyLimit)
    const remainingManual = parseFloat(formData.remainingManual) || 0

    if (isNaN(dailyLimit) || dailyLimit <= 0 || isNaN(monthlyLimit) || monthlyLimit <= 0) {
      toast.error('Invalid limits')
      return
    }

    if (monthlyLimit < dailyLimit) {
      toast.error('Monthly limit should be at least equal to daily limit')
      return
    }

    updateWallet(wallet.id, {
      balance,
      dailyLimit,
      monthlyLimit,
      remainingManual,
      status: formData.status,
      note: formData.note
    })

    toast.success('Wallet updated successfully')
    onOpenChange(false)
  }

  if (!wallet) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('wallet.editWalletDetails')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('wallet.walletName')}</Label>
            <Input value={wallet.accountName} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label>{t('wallet.accountNumber')}</Label>
            <Input value={wallet.accountNumber} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-balance">{t('wallet.currentBalance')}</Label>
            <Input
              id="edit-balance"
              type="number"
              step="0.01"
              min="0"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-dailyLimit">{t('wallet.dailyLimit')}</Label>
            <Input
              id="edit-dailyLimit"
              type="number"
              step="0.01"
              min="0"
              value={formData.dailyLimit}
              onChange={(e) => setFormData({ ...formData, dailyLimit: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-monthlyLimit">{t('wallet.monthlyLimit')}</Label>
            <Input
              id="edit-monthlyLimit"
              type="number"
              step="0.01"
              min="0"
              value={formData.monthlyLimit}
              onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-remainingManual">{t('wallet.remainingManual')}</Label>
            <Input
              id="edit-remainingManual"
              type="number"
              step="0.01"
              min="0"
              value={formData.remainingManual}
              onChange={(e) => setFormData({ ...formData, remainingManual: e.target.value })}
              placeholder={t('wallet.remainingManualPlaceholder')}
            />
            <p className="text-xs text-muted-foreground">
              {t('wallet.remainingManualHelp')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">{t('wallet.accountStatus')}</Label>
            <Select
              value={formData.status}
              onValueChange={(value: AccountStatus) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="edit-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t('wallet.statusActive')}</SelectItem>
                <SelectItem value="paused">{t('wallet.statusPaused')}</SelectItem>
                <SelectItem value="suspended">{t('wallet.statusSuspended')}</SelectItem>
                <SelectItem value="issue">{t('wallet.statusIssue')}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData.status === 'active' && t('wallet.accountStatusActive')}
              {formData.status === 'paused' && t('wallet.accountStatusPaused')}
              {formData.status === 'suspended' && t('wallet.accountStatusSuspended')}
              {formData.status === 'issue' && t('wallet.accountStatusIssue')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-note">{t('wallet.accountNote')}</Label>
            <Textarea
              id="edit-note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder={t('wallet.accountNotePlaceholder')}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {t('wallet.accountNoteHelp')}
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {t('wallet.saveChanges')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
