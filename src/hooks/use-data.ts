import { useKV } from '@github/spark/hooks'
import { Wallet, Transaction, WalletSummary } from '@/lib/types'
import { calculateWalletSummary } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useMemo } from 'react'

export function useWallets() {
  const { user } = useAuth()
  const [allWallets, setAllWallets] = useKV<Wallet[]>('wallets', [])

  const wallets = useMemo(() => {
    if (!user?.id) {
      return []
    }
    const filteredWallets = (allWallets || []).filter(w => w.userId === user.id)
    return filteredWallets
  }, [allWallets, user?.id])

  const addWallet = (wallet: Omit<Wallet, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) {
      console.error('Cannot add wallet: No user logged in')
      return
    }

    const newWallet: Wallet = {
      ...wallet,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: user.id,
      createdAt: new Date().toISOString()
    }

    setAllWallets(current => {
      const updated = [...(current || []), newWallet]
      return updated
    })
  }

  const updateWallet = (id: string, updates: Partial<Wallet>) => {
    setAllWallets(current =>
      (current || []).map(w => (w.id === id ? { ...w, ...updates } : w))
    )
  }

  const deleteWallet = (id: string) => {
    setAllWallets(current => (current || []).filter(w => w.id !== id))
  }

  return { wallets, allWallets, addWallet, updateWallet, deleteWallet }
}

export function useTransactions(walletId?: string) {
  const [allTransactions, setAllTransactions] = useKV<Transaction[]>('transactions', [])
  const [allWallets, setAllWallets] = useKV<Wallet[]>('wallets', [])

  const transactions = useMemo(() => {
    const txs = allTransactions || []
    return walletId ? txs.filter(t => t.walletId === walletId) : txs
  }, [allTransactions, walletId])

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>, wallet?: Wallet) => {
    if (wallet && (transaction.type === 'send' || transaction.type === 'withdraw')) {
      const currentBalance = wallet.balance || 0
      if (currentBalance < transaction.amount) {
        throw new Error('Insufficient balance. Cannot send/withdraw amount greater than current balance.')
      }
    }

    const newTransaction: Transaction = {
      ...transaction,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString()
    }

    setAllTransactions(current => [...(current || []), newTransaction])

    setAllWallets(current => {
      const wallets = current || []
      return wallets.map(w => {
        if (w.id === transaction.walletId) {
          const currentBalance = w.balance || 0
          const balanceChange = transaction.type === 'receive' 
            ? transaction.amount 
            : -transaction.amount
          return { ...w, balance: currentBalance + balanceChange }
        }
        return w
      })
    })
  }

  const deleteTransaction = (id: string) => {
    const transaction = (allTransactions || []).find(t => t.id === id)
    
    if (transaction) {
      setAllWallets(current => {
        const wallets = current || []
        return wallets.map(w => {
          if (w.id === transaction.walletId) {
            const currentBalance = w.balance || 0
            const balanceChange = transaction.type === 'receive' ? -transaction.amount : transaction.amount
            return { ...w, balance: currentBalance + balanceChange }
          }
          return w
        })
      })
    }

    setAllTransactions(current => (current || []).filter(t => t.id !== id))
  }

  const deleteTransactionsByWallet = (walletId: string) => {
    setAllTransactions(current => (current || []).filter(t => t.walletId !== walletId))
  }

  const resetDailyTransactions = (walletId: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    setAllTransactions(current => 
      (current || []).filter(t => {
        if (t.walletId !== walletId) return true
        const txDate = new Date(t.date)
        txDate.setHours(0, 0, 0, 0)
        return txDate.getTime() !== today.getTime()
      })
    )
  }

  const resetMonthlyTransactions = (walletId: string) => {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    setAllTransactions(current => 
      (current || []).filter(t => {
        if (t.walletId !== walletId) return true
        const txDate = new Date(t.date)
        return txDate < startOfMonth
      })
    )
  }

  return { 
    transactions, 
    addTransaction, 
    deleteTransaction, 
    deleteTransactionsByWallet,
    resetDailyTransactions,
    resetMonthlyTransactions
  }
}

export function useWalletSummaries() {
  const { wallets } = useWallets()
  const { transactions: allTransactions } = useTransactions()

  const summaries = useMemo<WalletSummary[]>(() => {
    return wallets.map(wallet => {
      const walletTransactions = (allTransactions || []).filter(
        t => t.walletId === wallet.id
      )
      return calculateWalletSummary(wallet, walletTransactions)
    })
  }, [wallets, allTransactions])

  return summaries
}
