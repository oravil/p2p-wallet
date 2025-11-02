# Changelog - Iteration 12

## Summary
This iteration focuses on fixing and enhancing the limit calculation system, adding withdraw transaction type, and improving manual remaining limit management with monthly persistence options.

- Withdraw trans


- `src/lib/types.ts` - Added 'withdra
- `src/components/wallet/TransactionsHistoryDialog.tsx` - Added withdraw badge, filter
- `src/i18n/locales/en.json` - Added "withdraw": "Withdraw"

**Updated Limit Calculations Based on Requirements:**
#### Daily Limits:

  - Hard cap at 60,
- **Receiving**: `max(0, 60000 - currentBalance - dailyRec
  - Prevents balance from exceeding 60K cap
#### Monthly Limits:
  - Cannot send more than monthly limit minus already sent
- `src/i18n/locales/en.json` - Added "withdraw": "Withdraw"
- **Receiving**: `max(0, 200000 - currentBalance - mon

**Files Modified:**
**Updated Limit Calculations Based on Requirements:**

#### Daily Limits:
- `remainingMonthlyManual?: number` - Manual override for monthly r
- `manualLimitMonth?: string` - Track which month the li
#### How It Works:
2. **Set Manual Value**: Overrides automatic 
4.
#### UI Improvements:
- Clear help text explaining when to use manual overrides
  - Prevents balance from exceeding 60K cap

#### Monthly Limits:
- `src/i18n/locales/en.json` - Added comprehensive translation keys for 
  - Cannot send more than monthly limit minus already sent
**Added Missing Translation Keys:**
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

)
```json
"manualRemainingLimits": "Manual Remaining Limits (Optional)"
"remainingDailyManual": "Edit Remaining Daily (Manual Override)"
}
"remainingManualPlaceholder": "Leave empty for automatic calculation"
"remainingDailyManualHelp": "Manually override the daily remaining limit..."
"remainingMonthlyManualHelp": "Manually override the monthly remaining limit..."

"everyMonth": "Every Month"
"thisMonthOnly": "This Month Only"
"everyMonthHelp": "Manual limits will persist and apply every month..."
"thisMonthOnlyHelp": "Manual limits will only apply to this month..."
"withdraw": "Withdraw"
}

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
### Manual Ov
// Daily Sending Remaining
- [ ] Set "every month" - persists
  wallet.dailyLimit - dailySent,  // Limit minus already sent
- [ ] Edit wallet updates manual limits correctly
  60000                             // Hard cap for mobile wallets
)

// Daily Receiving Remaining
let dailyRemainingReceive = Math.max(

  60000 - currentBalance - dailyReceived  // Room until 60K cap
*

- `remainingMonthlyManual: undefined` → auto
if (wallet.remainingDailyManual !== undefined && wallet.remainingDailyManual >= 0) {
**No Data Loss:**
  dailyRemainingReceive = wallet.remainingDailyManual
}
```

### Month Tracking System
3. **Month Bo
const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

// Check if "this month only" limit should still apply
3. Add history of manual limit changes for audit tra
    wallet.manualLimitMonth !== currentMonthKey) {

  monthlyRemainingSend = Math.min(wallet.monthlyLimit - monthlySent, currentBalance, 200000)
} else {
  // Use manual override
  monthlyRemainingSend = wallet.remainingMonthlyManual
}





- [ ] Add send transaction - balance decreases

- [ ] Add withdraw transaction - balance decreases

- [ ] Filter transactions by withdraw type
- [ ] Export transactions includes withdraw type correctly


- [ ] Daily sending limit respects current balance
- [ ] Daily sending limit cannot exceed 60K
- [ ] Daily receiving calculates room to 60K correctly
- [ ] Monthly sending limit respects current balance
- [ ] Monthly sending limit cannot exceed 200K












































