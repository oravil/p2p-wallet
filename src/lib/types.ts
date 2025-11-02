export type WalletType = 'vodafone' | 'orange' | 'etisalat' | 'instapay' | 'bank'

export type TransactionType = 'send' | 'receive'

export type UserRole = 'trader' | 'admin'

export type UserStatus = 'active' | 'pending' | 'suspended' | 'banned'

export type SubscriptionTier = 'free' | 'pro'

export interface User {
  id: string
  email: string
  fullName: string
  password: string
  role: UserRole
  status: UserStatus
  subscription: SubscriptionTier
  apiKey?: string
  createdAt: string
  mustChangePassword?: boolean
}

export interface Wallet {
  id: string
  userId: string
  type: WalletType
  accountNumber: string
  accountName: string
  bankName?: string
  dailyLimit: number
  monthlyLimit: number
  createdAt: string
}

export interface Transaction {
  id: string
  walletId: string
  type: TransactionType
  amount: number
  description: string
  date: string
  createdAt: string
}

export interface WalletSummary {
  wallet: Wallet
  dailySent: number
  dailyReceived: number
  monthlySent: number
  monthlyReceived: number
  dailyRemaining: number
  monthlyRemaining: number
  dailyPercentage: number
  monthlyPercentage: number
  transactions: Transaction[]
}

export interface DashboardStats {
  totalWallets: number
  totalSent: number
  totalReceived: number
  walletsAtRisk: number
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  proUsers: number
  totalWallets: number
  totalTransactions: number
}
