import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WalletType } from '@/lib/types'
import { useWallets } from '@/hooks/use-data'
import { toast } from 'sonner'

interface AddWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddWalletDialog({ open, onOpenChange }: AddWalletDialogProps) {
  const { t } = useTranslation()
  const { addWallet } = useWallets()
  const [formData, setFormData] = useState({
    type: 'vodafone' as WalletType,
    accountNumber: '',
    accountName: '',
    bankName: '',
    dailyLimit: '',
    monthlyLimit: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const dailyLimit = parseFloat(formData.dailyLimit)
    const monthlyLimit = parseFloat(formData.monthlyLimit)

    if (isNaN(dailyLimit) || dailyLimit <= 0 || isNaN(monthlyLimit) || monthlyLimit <= 0) {
      toast.error('Invalid limits')
      return
    }

    if (monthlyLimit < dailyLimit * 30) {
      toast.error('Monthly limit should be at least 30 times the daily limit')
      return
    }

    addWallet({
      type: formData.type,
      accountNumber: formData.accountNumber,
      accountName: formData.accountName,
      bankName: formData.type === 'bank' ? formData.bankName : undefined,
      dailyLimit,
      monthlyLimit
    })

    toast.success(t('wallet.addSuccess'))
    setFormData({
      type: 'vodafone',
      accountNumber: '',
      accountName: '',
      bankName: '',
      dailyLimit: '',
      monthlyLimit: ''
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('dashboard.addWallet')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">{t('wallet.type')}</Label>
            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as WalletType })}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vodafone">{t('wallet.vodafoneCash')}</SelectItem>
                <SelectItem value="orange">{t('wallet.orangeMoney')}</SelectItem>
                <SelectItem value="etisalat">{t('wallet.etisalatCash')}</SelectItem>
                <SelectItem value="instapay">{t('wallet.instaPay')}</SelectItem>
                <SelectItem value="bank">{t('wallet.bankAccount')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountName">{t('wallet.accountName')}</Label>
            <Input
              id="accountName"
              type="text"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">{t('wallet.accountNumber')}</Label>
            <Input
              id="accountNumber"
              type="text"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              required
            />
          </div>

          {formData.type === 'bank' && (
            <div className="space-y-2">
              <Label htmlFor="bankName">{t('wallet.bankName')}</Label>
              <Input
                id="bankName"
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dailyLimit">{t('wallet.dailyLimit')}</Label>
            <Input
              id="dailyLimit"
              type="number"
              step="0.01"
              min="0"
              value={formData.dailyLimit}
              onChange={(e) => setFormData({ ...formData, dailyLimit: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyLimit">{t('wallet.monthlyLimit')}</Label>
            <Input
              id="monthlyLimit"
              type="number"
              step="0.01"
              min="0"
              value={formData.monthlyLimit}
              onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {t('common.add')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
