import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
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
import { Transaction, Wallet, TransactionType } from '@/lib/types'
import { useTransactions } from '@/hooks/use-data'
import { formatCurrency, formatDate, exportToCSV } from '@/lib/utils'
import { ArrowUp, ArrowDown, MagnifyingGlass, Download, Trash, Bank } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TransactionsHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  wallet: Wallet
}

export function TransactionsHistoryDialog({ open, onOpenChange, wallet }: TransactionsHistoryDialogProps) {
  const { t, i18n } = useTranslation()
  const { transactions, deleteTransaction } = useTransactions(wallet.id)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all')
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null)

  const filteredTransactions = useMemo(() => {
    let filtered = transactions || []

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(query) ||
        t.amount.toString().includes(query)
      )
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions, filterType, searchQuery])

  const handleExport = () => {
    const exportData = filteredTransactions.map(t => ({
      Date: formatDate(t.date, i18n.language),
      Type: t.type === 'send' ? 'Sent' : t.type === 'receive' ? 'Received' : 'Withdrawn',
      Amount: t.amount,
      Description: t.description,
      Wallet: wallet.accountName
    }))

    exportToCSV(exportData, `transactions-${wallet.accountName}-${Date.now()}.csv`)
  }

  const totalSent = filteredTransactions
    .filter(t => t.type === 'send' || t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalReceived = filteredTransactions
    .filter(t => t.type === 'receive')
    .reduce((sum, t) => sum + t.amount, 0)

  const handleDeleteTransaction = () => {
    if (deleteTransactionId) {
      deleteTransaction(deleteTransactionId)
      toast.success('Transaction deleted successfully')
      setDeleteTransactionId(null)
    }
  }

  const getTransactionBadge = (type: TransactionType) => {
    if (type === 'send') {
      return (
        <Badge variant="outline" className="gap-1 border-red-200 text-red-600">
          <ArrowUp size={12} weight="bold" />
          Sent
        </Badge>
      )
    } else if (type === 'receive') {
      return (
        <Badge variant="outline" className="gap-1 border-green-200 text-green-600">
          <ArrowDown size={12} weight="bold" />
          Received
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="gap-1 border-orange-200 text-orange-600">
          <Bank size={12} weight="bold" />
          Withdrawn
        </Badge>
      )
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Transaction History - {wallet.accountName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Sent/Withdrawn</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(totalSent, i18n.language)}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Received</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(totalReceived, i18n.language)}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Net Change</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(totalReceived - totalSent, i18n.language)}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by amount or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="send">Sent Only</SelectItem>
                <SelectItem value="receive">Received Only</SelectItem>
                <SelectItem value="withdraw">Withdrawn Only</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport} disabled={filteredTransactions.length === 0}>
              <Download size={18} weight="bold" />
              <span className="ml-2 hidden sm:inline">Export</span>
            </Button>
          </div>

          <div className="flex-1 overflow-auto border rounded-lg">
            {filteredTransactions.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No transactions found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-sm">
                        {formatDate(transaction.date, i18n.language)}
                      </TableCell>
                      <TableCell>
                        {getTransactionBadge(transaction.type)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(transaction.amount, i18n.language)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTransactionId(transaction.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash size={16} weight="bold" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Showing {filteredTransactions.length} of {transactions?.length || 0} transactions
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <AlertDialog open={deleteTransactionId !== null} onOpenChange={(open) => !open && setDeleteTransactionId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this transaction? The wallet balance will be adjusted accordingly. 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteTransaction} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
