# Changelog - Iteration 12

## Summary
This iteration focuses on fixing and enhancing the limit calculation system, adding withdraw transaction type, and improving manual remaining limit management with monthly persistence options.

## Major Changes

### 1. Transaction Type Enhancement
**Added "Withdraw" Transaction Type**
- Updated `TransactionType` to include `'withdraw'` alongside `'send'` and `'receive'`
- Withdraw transactions behave like send transactions (deduct from balance)
- Added withdraw UI in AddTransactionDialog with Bank icon
- Updated TransactionsHistoryDialog to display and filter withdraw transactions
- Updated translation files (en.json and ar.json) with "withdraw" translations

**Files Modified:**
- `src/lib/types.ts` - Added 'withdraw' to TransactionType
- `src/components/wallet/AddTransactionDialog.tsx` - Added withdraw tab with Bank icon
- `src/components/wallet/TransactionsHistoryDialog.tsx` - Added withdraw badge, filter option, and proper handling
- `src/hooks/use-data.ts` - Updated addTransaction to handle withdraw like send
- `src/i18n/locales/en.json` - Added "withdraw": "Withdraw"
- `src/i18n/locales/ar.json` - Added "withdraw": "سحب"

### 2. Daily & Monthly Limit Calculation Logic
**Updated Limit Calculations Based on Requirements:**

#### Daily Limits:
- **Sending**: `min(dailyLimit - dailySent, currentBalance, 60000)`
  - Cannot send more than daily limit minus already sent
  - Cannot send more than current balance
  - Hard cap at 60,000 EGP for mobile wallets
  
- **Receiving**: `max(0, 60000 - currentBalance - dailyReceived)`
  - Can receive until balance + received reaches 60,000 EGP
  - Prevents balance from exceeding 60K cap

#### Monthly Limits:
- **Sending**: `min(monthlyLimit - monthlySent, currentBalance, 200000)`
  - Cannot send more than monthly limit minus already sent
  - Cannot send more than current balance
  - Hard cap at 200,000 EGP for mobile wallets

- **Receiving**: `max(0, 200000 - currentBalance - monthlyReceived)`
  - Can receive until balance + received reaches 200,000 EGP
  - Prevents balance from exceeding 200K cap

**Files Modified:**
- `src/lib/utils.ts` - Completely rewrote `calculateWalletSummary()` function with new logic

### 3. Manual Remaining Limit Override System
**Enhanced Manual Limit Control with Monthly Persistence:**

#### New Wallet Properties:
- `remainingDailyManual?: number` - Manual override for daily remaining
- `remainingMonthlyManual?: number` - Manual override for monthly remaining
- `manualLimitType?: 'this-month-only' | 'every-month'` - Duration control
- `manualLimitMonth?: string` - Track which month the limit was set (format: "YYYY-MM")

#### How It Works:
1. **Leave Empty (Default)**: Automatic calculation based on balance and transactions
2. **Set Manual Value**: Overrides automatic calculation
3. **Every Month**: Manual limit persists across months until changed
4. **This Month Only**: Manual limit applies only to current month, resets to automatic next month

#### UI Improvements:
- Separated manual remaining limits into dedicated section in EditWalletDialog
- Clear help text explaining when to use manual overrides
- Dropdown to select duration type (every month vs this month only)
- Empty inputs indicate automatic calculation (not zero)

**Files Modified:**
- `src/lib/types.ts` - Updated Wallet interface with new fields
- `src/components/wallet/EditWalletDialog.tsx` - Complete redesign of form with manual limit section
- `src/lib/utils.ts` - Added logic to check manual overrides in calculateWalletSummary()
- `src/i18n/locales/en.json` - Added comprehensive translation keys for manual limits
- `src/i18n/locales/ar.json` - Added Arabic translations for manual limits

### 4. Translation Improvements
**Added Missing Translation Keys:**

English (en.json):
```json
"manualRemainingLimits": "Manual Remaining Limits (Optional)"
"remainingDailyManual": "Edit Remaining Daily (Manual Override)"
"remainingMonthlyManual": "Edit Remaining Monthly (Manual Override)"
"remainingManualPlaceholder": "Leave empty for automatic calculation"
"remainingDailyManualHelp": "Manually override the daily remaining limit..."
"remainingMonthlyManualHelp": "Manually override the monthly remaining limit..."
"manualLimitType": "Manual Limit Duration"
"everyMonth": "Every Month"
"thisMonthOnly": "This Month Only"
"everyMonthHelp": "Manual limits will persist and apply every month..."
"thisMonthOnlyHelp": "Manual limits will only apply to this month..."
"withdraw": "Withdraw"
```

Arabic (ar.json):
```json
"manualRemainingLimits": "الحدود المتبقية اليدوية (اختياري)"
"remainingDailyManual": "تعديل المتبقي اليومي (تجاوز يدوي)"
"remainingMonthlyManual": "تعديل المتبقي الشهري (تجاوز يدوي)"
... (full translations added)
"withdraw": "سحب"
```

## Technical Implementation Details

### Limit Calculation Algorithm
```typescript
// Daily Sending Remaining
let dailyRemainingSend = Math.min(
  wallet.dailyLimit - dailySent,  // Limit minus already sent
  currentBalance,                   // Can't send more than balance
  60000                             // Hard cap for mobile wallets
)

// Daily Receiving Remaining
let dailyRemainingReceive = Math.max(
  0,                                      // Never negative
  60000 - currentBalance - dailyReceived  // Room until 60K cap
)

// If manual override is set, use it instead
if (wallet.remainingDailyManual !== undefined && wallet.remainingDailyManual >= 0) {
  dailyRemainingSend = wallet.remainingDailyManual
  dailyRemainingReceive = wallet.remainingDailyManual
}
```

### Month Tracking System
```typescript
const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

// Check if "this month only" limit should still apply
if (wallet.manualLimitType === 'this-month-only' && 
    wallet.manualLimitMonth !== currentMonthKey) {
  // Revert to automatic calculation
  monthlyRemainingSend = Math.min(wallet.monthlyLimit - monthlySent, currentBalance, 200000)
} else {
  // Use manual override
  monthlyRemainingSend = wallet.remainingMonthlyManual
}
```

## Testing Checklist

### Transaction Type Testing
- [ ] Add send transaction - balance decreases
- [ ] Add receive transaction - balance increases
- [ ] Add withdraw transaction - balance decreases
- [ ] Verify withdraw appears with orange badge in history
- [ ] Filter transactions by withdraw type
- [ ] Export transactions includes withdraw type correctly

### Limit Calculation Testing
- [ ] Daily sending limit respects current balance
- [ ] Daily sending limit cannot exceed 60K
- [ ] Daily receiving calculates room to 60K correctly
- [ ] Monthly sending limit respects current balance
- [ ] Monthly sending limit cannot exceed 200K
- [ ] Monthly receiving calculates room to 200K correctly

### Manual Override Testing
- [ ] Set manual daily remaining - overrides automatic calculation
- [ ] Set manual monthly remaining - overrides automatic calculation
- [ ] Set "every month" - persists across month boundaries
- [ ] Set "this month only" - resets next month
- [ ] Leave empty - uses automatic calculation
- [ ] Edit wallet updates manual limits correctly

### UI/UX Testing
- [ ] Edit wallet dialog shows all new fields
- [ ] Manual limit section is clearly separated
- [ ] Help text is clear and helpful
- [ ] Translations appear correctly in Arabic
- [ ] Withdraw tab appears in add transaction dialog
- [ ] Withdraw transactions display correctly in history

## Migration Notes

**Automatic Migration:**
Existing wallets without the new fields will continue to work normally:
- `remainingDailyManual: undefined` → automatic calculation
- `remainingMonthlyManual: undefined` → automatic calculation
- `manualLimitType: undefined` → treated as 'every-month' if manual values exist

**No Data Loss:**
All existing transaction data remains intact. Withdraw type is new, so no existing transactions need updating.

## Known Limitations

1. **Hard Caps**: The 60K daily and 200K monthly caps are hard-coded for mobile wallets. InstaPay/Bank accounts have different limits and may need separate handling in future iterations.

2. **Balance-Based Limits**: The receiving limit calculation assumes a 60K/200K balance cap for mobile wallets. This may not apply to all wallet types.

3. **Month Boundary**: "This month only" limits check the month key. If changed on the last day of a month, it will reset the next day.

## Future Enhancements

1. Make hard caps configurable per wallet type (mobile vs bank vs InstaPay)
2. Add visual indicators showing why a limit is calculated as it is
3. Add history of manual limit changes for audit trail
4. Support different limit rules for different wallet types
5. Add warnings when manual override significantly differs from automatic calculation
