import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WalletType, Wallet } from '@/lib/types'
import { useWallets } from '@/hooks/use-data'
import { useKV } from '@github/spark/hooks'
import { getDefaultLimits, DefaultLimits, INITIAL_DEFAULT_LIMITS } from '@/lib/defaults'
import { toast } from 'sonner'
import { generateAccountMask, normalizePhoneNumber, parseCSVLine } from '@/lib/utils'
import { Upload, FileText } from '@phosphor-icons/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ImportWalletsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportWalletsDialog({ open, onOpenChange }: ImportWalletsDialogProps) {
  const { t } = useTranslation()
  const { addWallet } = useWallets()
  const [defaultLimits] = useKV<DefaultLimits>('default-limits', INITIAL_DEFAULT_LIMITS)
  const [allWallets] = useKV<Wallet[]>('wallets', [])
  const [textInput, setTextInput] = useState('')
  const [csvInput, setCsvInput] = useState('')
  const [walletType, setWalletType] = useState<WalletType>('vodafone')
  const [importing, setImporting] = useState(false)

  const handleTextImport = async () => {
    if (!textInput.trim()) {
      toast.error('Please enter phone numbers')
      return
    }

    setImporting(true)
    const lines = textInput.split('\n').map(l => l.trim()).filter(l => l)
    const limits = getDefaultLimits(walletType, defaultLimits)
    let imported = 0
    let skipped = 0

    for (const line of lines) {
      const normalized = normalizePhoneNumber(line)
      if (normalized.length < 10) {
        skipped++
        continue
      }

      const exists = (allWallets || []).some(
        w => normalizePhoneNumber(w.accountNumber) === normalized
      )

      if (exists) {
        skipped++
        continue
      }

      const accountName = generateAccountMask(line, walletType)
      
      addWallet({
        type: walletType,
        accountNumber: line,
        accountName,
        balance: 0,
        dailyLimit: limits.dailyLimit,
        monthlyLimit: limits.monthlyLimit
      })

      imported++
    }

    setImporting(false)
    if (imported === 0 && skipped > 0) {
      toast.error(`All ${skipped} entries were skipped (duplicates or invalid). Phone numbers must be unique.`)
    } else {
      toast.success(`Imported ${imported} wallets. Skipped ${skipped} (duplicates or invalid).`)
    }
    setTextInput('')
    onOpenChange(false)
  }

  const handleCsvImport = async () => {
    if (!csvInput.trim()) {
      toast.error('Please enter CSV data')
      return
    }

    setImporting(true)
    const lines = csvInput.split('\n').map(l => l.trim()).filter(l => l)
    
    if (lines.length === 0) {
      toast.error('No data found')
      setImporting(false)
      return
    }

    const headers = parseCSVLine(lines[0].toLowerCase())
    const phoneIndex = headers.findIndex(h => h.includes('phone') || h.includes('number') || h.includes('mobile'))
    const nameIndex = headers.findIndex(h => h.includes('name'))
    const typeIndex = headers.findIndex(h => h.includes('type'))
    
    if (phoneIndex === -1) {
      toast.error('CSV must contain a phone/number/mobile column')
      setImporting(false)
      return
    }

    let imported = 0
    let skipped = 0

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const phoneNumber = values[phoneIndex]?.trim()
      
      if (!phoneNumber) {
        skipped++
        continue
      }

      const normalized = normalizePhoneNumber(phoneNumber)
      if (normalized.length < 10) {
        skipped++
        continue
      }

      const exists = (allWallets || []).some(
        w => normalizePhoneNumber(w.accountNumber) === normalized
      )

      if (exists) {
        skipped++
        continue
      }

      const type = (typeIndex !== -1 && values[typeIndex]?.toLowerCase()) || walletType
      const validTypes: WalletType[] = ['vodafone', 'orange', 'etisalat', 'instapay', 'bank']
      const finalType = validTypes.includes(type as WalletType) ? (type as WalletType) : walletType
      
      const limits = getDefaultLimits(finalType, defaultLimits)
      const accountName = (nameIndex !== -1 && values[nameIndex]?.trim()) || generateAccountMask(phoneNumber, finalType)
      
      addWallet({
        type: finalType,
        accountNumber: phoneNumber,
        accountName,
        balance: 0,
        dailyLimit: limits.dailyLimit,
        monthlyLimit: limits.monthlyLimit
      })

      imported++
    }

    setImporting(false)
    if (imported === 0 && skipped > 0) {
      toast.error(`All ${skipped} entries were skipped (duplicates or invalid). Phone numbers must be unique.`)
    } else {
      toast.success(`Imported ${imported} wallets. Skipped ${skipped} (duplicates or invalid).`)
    }
    setCsvInput('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Wallets</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="gap-2">
              <FileText size={16} weight="bold" />
              Text
            </TabsTrigger>
            <TabsTrigger value="csv" className="gap-2">
              <Upload size={16} weight="bold" />
              CSV
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-type">Default Wallet Type</Label>
              <Select value={walletType} onValueChange={(v) => setWalletType(v as WalletType)}>
                <SelectTrigger id="wallet-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vodafone">{t('wallet.vodafoneCash')}</SelectItem>
                  <SelectItem value="orange">{t('wallet.orangeMoney')}</SelectItem>
                  <SelectItem value="etisalat">{t('wallet.etisalatCash')}</SelectItem>
                  <SelectItem value="instapay">{t('wallet.instaPay')}</SelectItem>
                  <SelectItem value="bank">{t('wallet.bankAccount')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text-input">Phone Numbers (one per line)</Label>
              <Textarea
                id="text-input"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="01012345678&#10;01023456789&#10;01034567890"
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Enter one phone number per line. Account names will be auto-generated.
              </p>
            </div>

            <Button onClick={handleTextImport} disabled={importing} className="w-full">
              {importing ? 'Importing...' : 'Import Phone Numbers'}
            </Button>
          </TabsContent>

          <TabsContent value="csv" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-type">Default Wallet Type (if not in CSV)</Label>
              <Select value={walletType} onValueChange={(v) => setWalletType(v as WalletType)}>
                <SelectTrigger id="default-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vodafone">{t('wallet.vodafoneCash')}</SelectItem>
                  <SelectItem value="orange">{t('wallet.orangeMoney')}</SelectItem>
                  <SelectItem value="etisalat">{t('wallet.etisalatCash')}</SelectItem>
                  <SelectItem value="instapay">{t('wallet.instaPay')}</SelectItem>
                  <SelectItem value="bank">{t('wallet.bankAccount')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="csv-input">CSV Data</Label>
              <Textarea
                id="csv-input"
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder="phone,name,type&#10;01012345678,Client 1,vodafone&#10;01023456789,Client 2,orange"
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Required column: <strong>phone</strong> or <strong>number</strong> or <strong>mobile</strong><br />
                Optional columns: <strong>name</strong>, <strong>type</strong>
              </p>
            </div>

            <Button onClick={handleCsvImport} disabled={importing} className="w-full">
              {importing ? 'Importing...' : 'Import from CSV'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
