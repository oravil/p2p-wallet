import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Transaction, Wallet, WalletSummary } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, locale: string = 'en'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatDate(date: string, locale: string = 'en'): string {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function getStartOfDay(): Date {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

export function getStartOfMonth(): Date {
  const date = new Date()
  date.setDate(1)
  date.setHours(0, 0, 0, 0)
  return date
}

export function calculateWalletSummary(
  wallet: Wallet,
  transactions: Transaction[]
): WalletSummary {
  const now = new Date()
  const startOfDay = getStartOfDay()
  const startOfMonth = getStartOfMonth()
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const dailyTransactions = transactions.filter(
    t => new Date(t.date) >= startOfDay
  )
  const monthlyTransactions = transactions.filter(
    t => new Date(t.date) >= startOfMonth
  )

  const dailySent = dailyTransactions
    .filter(t => t.type === 'send' || t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0)

  const dailyReceived = dailyTransactions
    .filter(t => t.type === 'receive')
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlySent = monthlyTransactions
    .filter(t => t.type === 'send' || t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyReceived = monthlyTransactions
    .filter(t => t.type === 'receive')
    .reduce((sum, t) => sum + t.amount, 0)

  const currentBalance = wallet.balance || 0

  let dailyRemainingSend = Math.min(wallet.dailyLimit - dailySent, currentBalance)
  let dailyRemainingReceive = Math.max(0, wallet.dailyLimit - currentBalance - dailyReceived)

  let monthlyRemainingSend = Math.min(wallet.monthlyLimit - monthlySent, currentBalance)
  let monthlyRemainingReceive = Math.max(0, wallet.monthlyLimit - currentBalance - monthlyReceived)

  if (wallet.remainingDailyManual !== undefined && wallet.remainingDailyManual >= 0) {
    dailyRemainingSend = wallet.remainingDailyManual
    dailyRemainingReceive = wallet.remainingDailyManual
  }

  if (wallet.remainingMonthlyManual !== undefined && wallet.remainingMonthlyManual >= 0) {
    if (wallet.manualLimitType === 'this-month-only' && wallet.manualLimitMonth !== currentMonthKey) {
      monthlyRemainingSend = Math.min(wallet.monthlyLimit - monthlySent, currentBalance)
      monthlyRemainingReceive = Math.max(0, wallet.monthlyLimit - currentBalance - monthlyReceived)
    } else {
      monthlyRemainingSend = wallet.remainingMonthlyManual
      monthlyRemainingReceive = wallet.remainingMonthlyManual
    }
  }

  const dailyTotal = dailySent + dailyReceived
  const monthlyTotal = monthlySent + monthlyReceived

  const dailyPercentage = (dailyTotal / wallet.dailyLimit) * 100
  const monthlyPercentage = (monthlyTotal / wallet.monthlyLimit) * 100

  return {
    wallet,
    dailySent,
    dailyReceived,
    monthlySent,
    monthlyReceived,
    dailyRemaining: Math.max(0, dailyRemainingSend),
    dailyRemainingReceive: Math.max(0, dailyRemainingReceive),
    monthlyRemaining: Math.max(0, monthlyRemainingSend),
    monthlyRemainingReceive: Math.max(0, monthlyRemainingReceive),
    dailyPercentage: Math.min(100, dailyPercentage),
    monthlyPercentage: Math.min(100, monthlyPercentage),
    transactions: transactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }
}

export function getLimitStatus(percentage: number): 'safe' | 'warning' | 'critical' | 'exceeded' {
  if (percentage >= 100) return 'exceeded'
  if (percentage >= 90) return 'critical'
  if (percentage >= 70) return 'warning'
  return 'safe'
}

export function getLimitColor(percentage: number): string {
  const status = getLimitStatus(percentage)
  switch (status) {
    case 'safe':
      return 'text-green-600'
    case 'warning':
      return 'text-orange-600'
    case 'critical':
    case 'exceeded':
      return 'text-red-600'
  }
}

export function getProgressColor(percentage: number): string {
  const status = getLimitStatus(percentage)
  switch (status) {
    case 'safe':
      return 'bg-green-500'
    case 'warning':
      return 'bg-orange-500'
    case 'critical':
    case 'exceeded':
      return 'bg-red-500'
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function generateAccountMask(accountNumber: string, walletType: string): string {
  const prefixes: Record<string, string> = {
    vodafone: 'vf',
    orange: 'or',
    etisalat: 'et',
    instapay: 'ip',
    bank: 'bn'
  }
  
  const prefix = prefixes[walletType.toLowerCase()] || 'wt'
  const digits = accountNumber.replace(/\D/g, '').slice(-6)
  
  return `${prefix}-${digits || '000000'}`
}

export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function searchPhoneNumber(query: string, phone: string): boolean {
  const normalizedQuery = query.replace(/\D/g, '')
  const normalizedPhone = phone.replace(/\D/g, '')
  
  if (normalizedQuery.length < 4) return false
  
  return normalizedPhone.includes(normalizedQuery)
}

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}
