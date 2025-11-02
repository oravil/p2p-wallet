import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { WalletSummary } from '@/lib/types'
import { useKV } from '@github/spark/hooks'
import { Warning } from '@phosphor-icons/react'

interface LimitWarningState {
  [walletId: string]: {
    dailyWarningShown: boolean
    monthlyWarningShown: boolean
  }
}

const WARNING_THRESHOLD = 80

export function useLimitWarnings(summaries: WalletSummary[]) {
  const { t, i18n } = useTranslation()
  const [warningState, setWarningState] = useKV<LimitWarningState>('limit-warning-state', {})
  const previousSummariesRef = useRef<WalletSummary[]>([])

  useEffect(() => {
    if (!warningState) return
    
    const previousSummaries = previousSummariesRef.current
    
    summaries.forEach(summary => {
      const { wallet, dailyPercentage, monthlyPercentage } = summary
      const prevSummary = previousSummaries.find(s => s.wallet.id === wallet.id)
      const currentWarningState = warningState[wallet.id] || {
        dailyWarningShown: false,
        monthlyWarningShown: false
      }

      const shouldShowDailyWarning = 
        dailyPercentage >= WARNING_THRESHOLD &&
        dailyPercentage < 100 &&
        !currentWarningState.dailyWarningShown &&
        (!prevSummary || prevSummary.dailyPercentage < WARNING_THRESHOLD)

      const shouldShowMonthlyWarning = 
        monthlyPercentage >= WARNING_THRESHOLD &&
        monthlyPercentage < 100 &&
        !currentWarningState.monthlyWarningShown &&
        (!prevSummary || prevSummary.monthlyPercentage < WARNING_THRESHOLD)

      if (shouldShowDailyWarning) {
        const walletName = wallet.accountName
        const percentage = dailyPercentage.toFixed(1)
        const message = `${walletName}: ${percentage}% ${t('warnings.dailyUsed')}`
        const description = t('warnings.approachingLimit')
        
        toast.warning(message, {
          duration: 6000,
          description,
        })

        setWarningState(current => ({
          ...current,
          [wallet.id]: {
            ...currentWarningState,
            dailyWarningShown: true
          }
        }))
      }

      if (shouldShowMonthlyWarning) {
        const walletName = wallet.accountName
        const percentage = monthlyPercentage.toFixed(1)
        const message = `${walletName}: ${percentage}% ${t('warnings.monthlyUsed')}`
        const description = t('warnings.approachingLimit')
        
        toast.warning(message, {
          duration: 6000,
          description,
        })

        setWarningState(current => ({
          ...current,
          [wallet.id]: {
            ...currentWarningState,
            monthlyWarningShown: true
          }
        }))
      }

      if (dailyPercentage >= 100 && prevSummary && prevSummary.dailyPercentage < 100) {
        const message = `${wallet.accountName}: ${t('warnings.dailyLimitExceeded')}`
        const description = t('warnings.limitExceededDescription')
        
        toast.error(message, {
          duration: 8000,
          description,
        })
      }

      if (monthlyPercentage >= 100 && prevSummary && prevSummary.monthlyPercentage < 100) {
        const message = `${wallet.accountName}: ${t('warnings.monthlyLimitExceeded')}`
        const description = t('warnings.limitExceededDescription')
        
        toast.error(message, {
          duration: 8000,
          description,
        })
      }

      if (dailyPercentage < WARNING_THRESHOLD && currentWarningState.dailyWarningShown) {
        setWarningState(current => ({
          ...current,
          [wallet.id]: {
            ...currentWarningState,
            dailyWarningShown: false
          }
        }))
      }

      if (monthlyPercentage < WARNING_THRESHOLD && currentWarningState.monthlyWarningShown) {
        setWarningState(current => ({
          ...current,
          [wallet.id]: {
            ...currentWarningState,
            monthlyWarningShown: false
          }
        }))
      }
    })

    previousSummariesRef.current = summaries
  }, [summaries, t, i18n.language, warningState, setWarningState])

  const resetWarnings = (walletId?: string) => {
    if (walletId) {
      setWarningState(current => ({
        ...current,
        [walletId]: {
          dailyWarningShown: false,
          monthlyWarningShown: false
        }
      }))
    } else {
      setWarningState({})
    }
  }

  return { resetWarnings }
}
