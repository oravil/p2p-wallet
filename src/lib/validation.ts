import { z } from 'zod'
import { WalletType } from './types'

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(1, 'Email is required')
  .max(100, 'Email is too long')

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
  .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
  .regex(/(?=.*\d)/, 'Password must contain at least one number')

// Egyptian phone number validation
export const phoneNumberSchema = z
  .string()
  .min(11, 'Egyptian mobile number must be 11 digits')
  .max(11, 'Egyptian mobile number must be 11 digits')
  .regex(/^01[0-9]{9}$/, 'Invalid Egyptian mobile number format (must start with 01)')

// Wallet type validation
export const walletTypeSchema = z.enum(['vodafone', 'orange', 'etisalat', 'instapay', 'bank'] as const)

// Account name validation
export const accountNameSchema = z
  .string()
  .min(1, 'Account name is required')
  .max(50, 'Account name is too long')
  .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Account name contains invalid characters')

// Bank name validation
export const bankNameSchema = z
  .string()
  .min(1, 'Bank name is required')
  .max(50, 'Bank name is too long')
  .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Bank name contains invalid characters')

// Amount validation (for balance, limits, transactions)
export const amountSchema = z
  .number()
  .min(0, 'Amount cannot be negative')
  .max(10000000, 'Amount is too large')
  .finite('Amount must be a valid number')

// Limit validation (stricter than amount)
export const limitSchema = z
  .number()
  .min(1, 'Limit must be greater than 0')
  .max(10000000, 'Limit is too large')
  .finite('Limit must be a valid number')

// Transaction description validation
export const transactionDescriptionSchema = z
  .string()
  .min(1, 'Description is required')
  .max(200, 'Description is too long')
  .regex(/^[a-zA-Z0-9\s\-_.,!?]+$/, 'Description contains invalid characters')

// Login form validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

// Password change validation
export const passwordChangeSchema = z.object({
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Wallet creation validation
export const walletSchema = z.object({
  type: walletTypeSchema,
  accountNumber: phoneNumberSchema,
  accountName: accountNameSchema.optional(),
  bankName: z.string().optional(),
  balance: amountSchema.optional().default(0),
  dailyLimit: limitSchema,
  monthlyLimit: limitSchema
}).refine((data) => {
  // Bank accounts require bank name
  if (data.type === 'bank' && !data.bankName) {
    return false
  }
  return true
}, {
  message: "Bank name is required for bank accounts",
  path: ["bankName"]
}).refine((data) => {
  // Monthly limit should be >= daily limit
  return data.monthlyLimit >= data.dailyLimit
}, {
  message: "Monthly limit must be greater than or equal to daily limit",
  path: ["monthlyLimit"]
})

// Transaction creation validation
export const transactionSchema = z.object({
  type: z.enum(['send', 'receive', 'withdraw']),
  amount: limitSchema,
  recipient: z.string().min(1, 'Recipient is required').max(100, 'Recipient name is too long'),
  description: transactionDescriptionSchema,
  date: z.string().datetime('Invalid date format')
})

// User creation validation (for admin)
export const userSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name is too long'),
  role: z.enum(['admin', 'trader']),
  status: z.enum(['active', 'inactive']),
  subscription: z.enum(['free', 'pro'])
})

// Default limits validation
export const defaultLimitsSchema = z.object({
  vodafone: z.object({
    dailyLimit: limitSchema,
    monthlyLimit: limitSchema
  }),
  orange: z.object({
    dailyLimit: limitSchema,
    monthlyLimit: limitSchema
  }),
  etisalat: z.object({
    dailyLimit: limitSchema,
    monthlyLimit: limitSchema
  }),
  instapay: z.object({
    dailyLimit: limitSchema,
    monthlyLimit: limitSchema,
    perTransactionLimit: limitSchema.optional()
  }),
  bank: z.object({
    dailyLimit: limitSchema,
    monthlyLimit: limitSchema,
    perTransactionLimit: limitSchema.optional()
  })
})

// Export types for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>
export type WalletFormData = z.infer<typeof walletSchema>
export type TransactionFormData = z.infer<typeof transactionSchema>
export type UserFormData = z.infer<typeof userSchema>
export type DefaultLimitsData = z.infer<typeof defaultLimitsSchema>