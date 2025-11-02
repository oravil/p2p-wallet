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

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Invalid amount')
      return
    }

    addTransaction({
      walletId: wallet.id,
      type,
      amount: amountNum,
      description,
      date: new Date().toISOString()
    })

    toast.success(t('transaction.success'))
    setAmount('')
    setDescription('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('transaction.add')}</DialogTitle>
        </DialogHeader>

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
