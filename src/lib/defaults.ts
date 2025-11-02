import { WalletType } from './types'

export interface WalletDefaults {
  dailyLimit: number
  monthlyLimit: number
  perTransactionLimit?: number
}

export interface DefaultLimits {
  vodafone: WalletDefaults
  orange: WalletDefaults
  etisalat: WalletDefaults
  instapay: WalletDefaults
  bank: WalletDefaults
}

export const INITIAL_DEFAULT_LIMITS: DefaultLimits = {
  vodafone: {
    dailyLimit: 60000,
    monthlyLimit: 200000
  },
  orange: {
    dailyLimit: 60000,
    monthlyLimit: 200000
  },
  etisalat: {
    dailyLimit: 60000,
    monthlyLimit: 200000
  },
  instapay: {
    dailyLimit: 120000,
    monthlyLimit: 400000,
    perTransactionLimit: 70000
  },
  bank: {
    dailyLimit: 120000,
    monthlyLimit: 400000,
    perTransactionLimit: 70000
  }
}

export function getDefaultLimits(type: WalletType, customDefaults?: DefaultLimits): WalletDefaults {
  const defaults = customDefaults || INITIAL_DEFAULT_LIMITS
  return defaults[type]
}
