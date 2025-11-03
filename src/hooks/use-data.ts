import { useKV } from '@github/spark/hooks'
import { Wallet, Transaction, WalletSummary } from '@/lib/types'
import { calculateWalletSummary } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useMemo, useState, useEffect } from 'react'

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
  const [transactionQueue, setTransactionQueue] = useState<Array<() => Promise<void>>>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const transactions = useMemo(() => {
    const txs = allTransactions || []
    return walletId ? txs.filter(t => t.walletId === walletId) : txs
  }, [allTransactions, walletId])

  // Process transaction queue sequentially to avoid race conditions
  useEffect(() => {
    const processQueue = async () => {
      if (isProcessing || transactionQueue.length === 0) return
      
      setIsProcessing(true)
      try {
        const nextTransaction = transactionQueue[0]
        await nextTransaction()
        setTransactionQueue(prev => prev.slice(1))
      } catch (error) {
        console.error('Transaction processing error:', error)
        setTransactionQueue(prev => prev.slice(1))
        throw error
      } finally {
        setIsProcessing(false)
      }
    }

    processQueue()
  }, [transactionQueue, isProcessing])

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>, wallet?: Wallet) => {
    return new Promise<void>((resolve, reject) => {
      const processTransaction = async () => {
        try {
          // Get the latest wallet data to check balance
          const currentWallets = allWallets || []
          const currentWallet = currentWallets.find(w => w.id === transaction.walletId)
          
          if (!currentWallet) {
            throw new Error('Wallet not found')
          }

          // Check balance for send/withdraw operations
          if (transaction.type === 'send' || transaction.type === 'withdraw') {
            const currentBalance = currentWallet.balance || 0
            if (currentBalance < transaction.amount) {
              throw new Error('Insufficient balance. Cannot send/withdraw amount greater than current balance.')
            }
          }

          const newTransaction: Transaction = {
            ...transaction,
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            createdAt: new Date().toISOString()
          }

          // Atomic update: add transaction and update wallet balance
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

          resolve()
        } catch (error) {
          reject(error)
        }
      }

      setTransactionQueue(prev => [...prev, processTransaction])
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
