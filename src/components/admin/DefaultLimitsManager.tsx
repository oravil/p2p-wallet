import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { DefaultLimits, INITIAL_DEFAULT_LIMITS } from '@/lib/defaults'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { FloppyDisk, ArrowsClockwise } from '@phosphor-icons/react'

export function DefaultLimitsManager() {
  const [defaultLimits, setDefaultLimits] = useKV<DefaultLimits>('default-limits', INITIAL_DEFAULT_LIMITS)
  const [limits, setLimits] = useState<DefaultLimits>(defaultLimits || INITIAL_DEFAULT_LIMITS)

  const handleSave = () => {
    setDefaultLimits(limits)
    toast.success('Default limits updated successfully')
  }

  const handleReset = () => {
    setLimits(INITIAL_DEFAULT_LIMITS)
    setDefaultLimits(INITIAL_DEFAULT_LIMITS)
    toast.success('Default limits reset to factory defaults')
  }

  const updateLimit = (walletType: keyof DefaultLimits, field: 'dailyLimit' | 'monthlyLimit' | 'perTransactionLimit', value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return

    setLimits(prev => ({
      ...prev,
      [walletType]: {
        ...prev[walletType],
        [field]: numValue
      }
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Wallet Limits</CardTitle>
        <CardDescription>
          Set default limits for new wallets. Traders can modify these when adding wallets.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Mobile Wallets (Vodafone, Orange, Etisalat)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Daily Limit (EGP)</Label>
                <Input
                  type="number"
                  value={limits.vodafone.dailyLimit}
                  onChange={(e) => {
                    const value = e.target.value
                    updateLimit('vodafone', 'dailyLimit', value)
                    updateLimit('orange', 'dailyLimit', value)
                    updateLimit('etisalat', 'dailyLimit', value)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Limit (EGP)</Label>
                <Input
                  type="number"
                  value={limits.vodafone.monthlyLimit}
                  onChange={(e) => {
                    const value = e.target.value
                    updateLimit('vodafone', 'monthlyLimit', value)
                    updateLimit('orange', 'monthlyLimit', value)
                    updateLimit('etisalat', 'monthlyLimit', value)
                  }}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">InstaPay</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Per Transaction (EGP)</Label>
                <Input
                  type="number"
                  value={limits.instapay.perTransactionLimit || 0}
                  onChange={(e) => updateLimit('instapay', 'perTransactionLimit', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Daily Limit (EGP)</Label>
                <Input
                  type="number"
                  value={limits.instapay.dailyLimit}
                  onChange={(e) => updateLimit('instapay', 'dailyLimit', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Limit (EGP)</Label>
                <Input
                  type="number"
                  value={limits.instapay.monthlyLimit}
                  onChange={(e) => updateLimit('instapay', 'monthlyLimit', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Bank Account</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Per Transaction (EGP)</Label>
                <Input
                  type="number"
                  value={limits.bank.perTransactionLimit || 0}
                  onChange={(e) => updateLimit('bank', 'perTransactionLimit', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Daily Limit (EGP)</Label>
                <Input
                  type="number"
                  value={limits.bank.dailyLimit}
                  onChange={(e) => updateLimit('bank', 'dailyLimit', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Limit (EGP)</Label>
                <Input
                  type="number"
                  value={limits.bank.monthlyLimit}
                  onChange={(e) => updateLimit('bank', 'monthlyLimit', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleReset}>
            <ArrowsClockwise size={16} weight="bold" className="mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            <FloppyDisk size={16} weight="bold" className="mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
