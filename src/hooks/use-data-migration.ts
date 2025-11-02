import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Wallet } from '@/lib/types'
import { normalizePhoneNumber } from '@/lib/utils'

export function useDataMigration() {
  const [allWallets, setAllWallets] = useKV<Wallet[]>('wallets', [])
  const [migrationVersion, setMigrationVersion] = useKV<number>('migration-version', 0)

  useEffect(() => {
    const version = migrationVersion || 0
    if (version < 1) {
      migrateV1()
    }
  }, [migrationVersion])

  const migrateV1 = () => {
    if (!allWallets || allWallets.length === 0) {
      setMigrationVersion(1)
      return
    }

    let hasChanges = false
    const seen = new Map<string, string>()
    
    const migratedWallets = allWallets
      .map(wallet => {
        let updated = { ...wallet }
        
        if (typeof wallet.balance !== 'number') {
          updated.balance = 0
          hasChanges = true
        }
        
        return updated
      })
      .filter(wallet => {
        const normalized = normalizePhoneNumber(wallet.accountNumber)
        
        if (seen.has(normalized)) {
          hasChanges = true
          return false
        }
        
        seen.set(normalized, wallet.id)
        return true
      })

    if (hasChanges) {
      setAllWallets(migratedWallets)
    }

    setMigrationVersion(1)
  }

  const version = migrationVersion || 0
  return { migrationComplete: version >= 1 }
}
