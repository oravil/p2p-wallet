import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WalletType, Wallet } from '@/lib/types'
import { useWallets } from '@/hooks/use-data'
import { getDefaultLimits } from '@/lib/defaults'
import { useKV } from '@github/spark/hooks'
import { DefaultLimits, INITIAL_DEFAULT_LIMITS } from '@/lib/defaults'
import { toast } from 'sonner'
import { generateAccountMask, normalizePhoneNumber } from '@/lib/utils'
import { sanitizeText, sanitizePhoneNumber, sanitizeNumericInput } from '@/lib/sanitize'

interface AddWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddWalletDialog({ open, onOpenChange }: AddWalletDialogProps) {
  const { t } = useTranslation()
  const { addWallet, wallets } = useWallets()
  const [defaultLimits] = useKV<DefaultLimits>('default-limits', INITIAL_DEFAULT_LIMITS)
  const [allWallets] = useKV<Wallet[]>('wallets', [])
  const [formData, setFormData] = useState({
    type: 'vodafone' as WalletType,
    accountNumber: '',
    accountName: '',
    bankName: '',
    balance: '',
    dailyLimit: '',
    monthlyLimit: '',
    perTransactionLimit: ''
  })

  useEffect(() => {
    if (open && defaultLimits) {
      const limits = getDefaultLimits(formData.type, defaultLimits)
      setFormData(prev => ({
        ...prev,
        dailyLimit: limits.dailyLimit.toString(),
        monthlyLimit: limits.monthlyLimit.toString(),
        perTransactionLimit: limits.perTransactionLimit?.toString() || ''
      }))
    }
  }, [open, formData.type, defaultLimits])

  const handleTypeChange = (newType: WalletType) => {
    const limits = getDefaultLimits(newType, defaultLimits)
    setFormData({
      ...formData,
      type: newType,
      dailyLimit: limits.dailyLimit.toString(),
      monthlyLimit: limits.monthlyLimit.toString(),
      perTransactionLimit: limits.perTransactionLimit?.toString() || ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Sanitize all inputs
    const sanitizedAccountNumber = sanitizePhoneNumber(formData.accountNumber)
    const sanitizedAccountName = sanitizeText(formData.accountName, 50)
    const sanitizedBankName = sanitizeText(formData.bankName, 50)
    const sanitizedBalance = sanitizeNumericInput(formData.balance)
    const sanitizedDailyLimit = sanitizeNumericInput(formData.dailyLimit)
    const sanitizedMonthlyLimit = sanitizeNumericInput(formData.monthlyLimit)

    const balance = parseFloat(sanitizedBalance) || 0
    const dailyLimit = parseFloat(sanitizedDailyLimit)
    const monthlyLimit = parseFloat(sanitizedMonthlyLimit)

    if (isNaN(dailyLimit) || dailyLimit <= 0 || isNaN(monthlyLimit) || monthlyLimit <= 0) {
      toast.error('Invalid limits')
      return
    }

    if (monthlyLimit < dailyLimit) {
      toast.error('Monthly limit should be at least equal to daily limit')
      return
    }

    const normalizedNumber = normalizePhoneNumber(sanitizedAccountNumber)
    
    // Egyptian mobile numbers should be 11 digits (e.g., 01012345678)
    if (normalizedNumber.length < 11) {
      toast.error('Egyptian mobile number must be 11 digits (e.g., 01012345678)')
      return
    }

    const existingWallet = (allWallets || []).find(
      w => normalizePhoneNumber(w.accountNumber) === normalizedNumber
    )

    if (existingWallet) {
      toast.error('This mobile number already exists. Phone numbers must be unique.')
      return
    }

    const accountName = sanitizedAccountName.trim() || generateAccountMask(sanitizedAccountNumber, formData.type)

    addWallet({
      type: formData.type,
      accountNumber: sanitizedAccountNumber,
      accountName,
      bankName: formData.type === 'bank' ? sanitizedBankName : undefined,
      balance,
      dailyLimit,
      monthlyLimit
    })

    toast.success(t('wallet.addSuccess'))
    setFormData({
      type: 'vodafone',
      accountNumber: '',
      accountName: '',
      bankName: '',
      balance: '',
      dailyLimit: '',
      monthlyLimit: '',
      perTransactionLimit: ''
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
            <Select value={formData.type} onValueChange={(v) => handleTypeChange(v as WalletType)}>
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
            <Label htmlFor="accountName">{t('wallet.accountName')} ({t('common.optional')})</Label>
            <Input
              id="accountName"
              type="text"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              placeholder={generateAccountMask(formData.accountNumber || '000000', formData.type)}
            />
            <p className="text-xs text-muted-foreground">Leave blank to auto-generate from mobile number</p>
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
            <Label htmlFor="balance">Current Balance (EGP)</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              min="0"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              placeholder="0.00"
            />
            <p className="text-xs text-muted-foreground">Enter the current balance of this account</p>
          </div>

          {(formData.type === 'instapay' || formData.type === 'bank') && formData.perTransactionLimit && (
            <div className="space-y-2">
              <Label htmlFor="perTransactionLimit">Per Transaction Limit (EGP)</Label>
              <Input
                id="perTransactionLimit"
                type="number"
                step="0.01"
                min="0"
                value={formData.perTransactionLimit}
                onChange={(e) => setFormData({ ...formData, perTransactionLimit: e.target.value })}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Default limit for {formData.type === 'instapay' ? 'InstaPay' : 'Banking'}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dailyLimit">{t('wallet.dailyLimit')} (EGP)</Label>
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
            <Label htmlFor="monthlyLimit">{t('wallet.monthlyLimit')} (EGP)</Label>
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
