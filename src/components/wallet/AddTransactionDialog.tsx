import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wallet, TransactionType } from '@/lib/types'
import { useTransactions } from '@/hooks/use-data'
import { toast } from 'sonner'
import { ArrowUp, ArrowDown } from '@phosphor-icons/react'

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  wallet: Wallet
}

export function AddTransactionDialog({ open, onOpenChange, wallet }: AddTransactionDialogProps) {
  const { t } = useTranslation()
  const { addTransaction } = useTransactions()
  const [type, setType] = useState<TransactionType>('send')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const accountStatus = wallet.status || 'active'
    if (accountStatus !== 'active') {
      const statusMessages = {
        paused: 'This account is paused. Transactions are not allowed.',
        suspended: 'This account is suspended. Transactions are not allowed.',
        issue: 'This account has issues. Please resolve before making transactions.'
      }
      toast.error(statusMessages[accountStatus] || 'Account is not active')
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Invalid amount')
      return
    }

    if (type === 'send' && amountNum > (wallet.balance || 0)) {
      toast.error('Insufficient balance. Cannot send amount greater than current balance.')
      return
    }

    try {
      addTransaction({
        walletId: wallet.id,
        type,
        amount: amountNum,
        description,
        date: new Date().toISOString()
      }, wallet)

      toast.success(t('transaction.success'))
      setAmount('')
      setDescription('')
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add transaction')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('transaction.add')}</DialogTitle>
        </DialogHeader>

        {wallet.status && wallet.status !== 'active' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
            <strong>Warning:</strong> This account is currently {wallet.status}. 
            {wallet.note && <p className="mt-1 text-xs">{wallet.note}</p>}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('transaction.type')}</Label>
            <Tabs value={type} onValueChange={(v) => setType(v as TransactionType)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="send" className="gap-2">
                  <ArrowUp size={16} weight="bold" />
                  {t('transaction.send')}
                </TabsTrigger>
                <TabsTrigger value="receive" className="gap-2">
                  <ArrowDown size={16} weight="bold" />
                  {t('transaction.receive')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">{t('transaction.amount')}</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('transaction.description')}</Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
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
