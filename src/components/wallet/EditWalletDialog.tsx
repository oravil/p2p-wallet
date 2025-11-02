import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wallet } from '@/lib/types'
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
    monthlyLimit: ''
  })

  useEffect(() => {
    if (wallet && open) {
      setFormData({
        balance: (wallet.balance || 0).toString(),
        dailyLimit: wallet.dailyLimit.toString(),
        monthlyLimit: wallet.monthlyLimit.toString()
      })
    }
  }, [wallet, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallet) return

    const balance = parseFloat(formData.balance) || 0
    const dailyLimit = parseFloat(formData.dailyLimit)
    const monthlyLimit = parseFloat(formData.monthlyLimit)

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
      monthlyLimit
    })

    toast.success('Wallet updated successfully')
    onOpenChange(false)
  }

  if (!wallet) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Wallet Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Wallet Name</Label>
            <Input value={wallet.accountName} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label>Account Number</Label>
            <Input value={wallet.accountNumber} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-balance">Current Balance (EGP)</Label>
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
            <Label htmlFor="edit-dailyLimit">{t('wallet.dailyLimit')} (EGP)</Label>
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
            <Label htmlFor="edit-monthlyLimit">{t('wallet.monthlyLimit')} (EGP)</Label>
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

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
