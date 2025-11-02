export type WalletType = 'vodafone' | 'orange' | 'etisalat' | 'instapay' | 'bank'

export type TransactionType = 'send' | 'receive' | 'withdraw'

export type UserRole = 'trader' | 'admin'

export type UserStatus = 'active' | 'pending' | 'suspended' | 'banned'

export type SubscriptionTier = 'free' | 'pro'

export type AccountStatus = 'active' | 'paused' | 'suspended' | 'issue'

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
  emailVerified?: boolean
  emailVerificationSentAt?: string
  phone?: string
  address?: string
}

export interface Wallet {
  id: string
  userId: string
  type: WalletType
  accountNumber: string
  accountName: string
  bankName?: string
  balance: number
  dailyLimit: number
  monthlyLimit: number
  remainingDailyManual?: number
  remainingMonthlyManual?: number
  manualLimitType?: 'this-month-only' | 'every-month'
  manualLimitMonth?: string
  status?: AccountStatus
  note?: string
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
  screenshot?: string
}

export interface WalletSummary {
  wallet: Wallet
  dailySent: number
  dailyReceived: number
  monthlySent: number
  monthlyReceived: number
  dailyRemaining: number
  dailyRemainingReceive: number
  monthlyRemaining: number
  monthlyRemainingReceive: number
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
