# P2P Wallet Manager - Product Requirements Document

A bilingual progressive web app (PWA) empowering Egyptian P2P traders to manage e-wallets and bank accounts, monitor transaction limits, and prevent account freezes through intelligent limit tracking with advanced search, import/export, and transaction history features.

**Experience Qualities**:
1. **Trustworthy**: Clear, accurate limit tracking with visual indicators that give traders confidence in their transaction safety
2. **Efficient**: Quick transaction logging with instant search by phone number (4+ digits), bulk import, and instant feedback on remaining limits so traders can act fast in P2P markets
3. **Professional**: Polished bilingual interface that respects Arabic RTL layout and English LTR, making it accessible to all Egyptian traders

**Complexity Level**: Complex Application (advanced functionality, accounts)
- Requires user authentication with role-based access (trader/admin), persistent wallet management, transaction tracking with daily/monthly aggregations, subscription tiers, and bilingual UI with RTL/LTR support

## Essential Features

### User Authentication & Authorization
- **Functionality**: Single admin account with default credentials (eng.ay88@gmail.com / adminadmin) created on first app launch. Admin must change password on first login. No public registration.
- **Purpose**: Secure single-admin access with mandatory password change for security
- **Trigger**: Landing page with login form, or admin accessing restricted routes
- **Progression**: Enter credentials → validate → force password change if first login → redirect to dashboard
- **Success criteria**: Admin can access all features; password must be changed on first login; new password must be at least 6 characters

### Wallet & Bank Account Management
- **Functionality**: Add/edit/delete multiple e-wallets (Vodafone Cash, Orange, Etisalat, InstaPay) and bank accounts with customizable daily/monthly limits. Default limits are automatically populated based on wallet type: Mobile wallets (60K daily, 200K monthly), InstaPay/Bank (70K per transaction, 120K daily, 400K monthly). Account names are optional - if left blank, auto-generates mask from mobile number (e.g., vf-012345, or-098765). Mobile numbers must be unique across all wallets to prevent duplicates. Admin can modify default limits from admin panel. Edit wallet balance and limits after creation.
- **Purpose**: Centralize all payment methods with intelligent default limits that match Egyptian banking regulations, with unique mobile number validation preventing duplicate accounts
- **Trigger**: Dashboard "Add Wallet" button, or "Edit" button on wallet card
- **Progression**: Click add → select wallet type → defaults auto-populate → enter mobile number (validated for uniqueness) → optionally enter name (or leave blank for auto-generated mask) → optionally adjust limits → enter balance → save → appears in dashboard list with real-time updates
- **Success criteria**: All wallets display with correct limits and real-time balance updates, defaults match wallet type, traders can customize limits, admin can change system defaults, data persists between sessions, duplicate mobile numbers are prevented, account name auto-generates if left blank (format: company-code + last 6 digits), wallet editing works correctly

### Quick Search & Filtering
- **Functionality**: Real-time search across all wallets by entering any 4+ digits of phone number or account name. Instantly filters visible wallets as you type, showing only matching accounts.
- **Purpose**: Enable traders to quickly find specific wallets in large collections without scrolling through cards
- **Trigger**: Type in search box in dashboard header
- **Progression**: Enter 4+ digits → system searches phone numbers and names → matching wallets displayed → clear search to show all
- **Success criteria**: Search works with partial phone numbers (4+ digits), updates results instantly, searches both phone and name fields, works in both Arabic and English

### Bulk Import & Export
- **Functionality**: Import multiple wallet phone numbers from text input (one per line) or CSV file (with optional name and type columns). Export all wallets and transactions to CSV format for backup or analysis. CSV import supports columns: phone/number/mobile (required), name (optional), type (optional).
- **Purpose**: Save time when adding many wallets, enable data backup and external analysis
- **Trigger**: "Import" button in dashboard, "Export" button for wallets or transactions
- **Progression**: Import: Click import → choose text or CSV tab → select wallet type → paste numbers/data → validate uniqueness → import with auto-generated names → Exports: Click export → CSV file downloads with timestamp
- **Success criteria**: Text import accepts one phone per line, CSV import parses correctly with flexible column names, duplicate numbers are skipped with count shown, account names auto-generate for blank entries, export includes all relevant data, files download with descriptive names

### Transaction History Viewer
- **Functionality**: Per-wallet transaction history with search by description/amount, filter by type (all/send/receive), summary statistics (total sent/received/net), and CSV export. Displays transactions in reverse chronological order with clear visual distinction between sent (red) and received (green) transactions.
- **Purpose**: Review transaction patterns, identify specific transactions, export for record-keeping
- **Trigger**: "History" button on wallet card
- **Progression**: Click history → view transaction list with summary stats → use search or filter → optionally export filtered results to CSV
- **Success criteria**: All transactions for wallet displayed, search works on description and amount, filters apply instantly, statistics update based on filters, export includes filtered data only

### Transaction Tracking
- **Functionality**: Manual entry of sent/received transactions with real-time calculation of daily and monthly totals against limits, including automated warnings at 80% usage. Balance updates automatically with each transaction (added for receive, subtracted for send).
- **Purpose**: Monitor transaction volume to prevent exceeding limits that trigger account freezes, maintain accurate running balance
- **Trigger**: "Add Transaction" (+) button on wallet card
- **Progression**: Select wallet → choose send/receive → enter amount → submit → balance updates instantly → totals recalculate → remaining limits adjust → shows visual feedback → triggers toast notification if 80%+ threshold reached
- **Success criteria**: Totals update instantly with real-time reactivity, balance reflects all transactions accurately, warnings appear when approaching limits (80%+), error alerts when exceeding limits, toast notifications persist for appropriate duration, data syncs across all views immediately

### Automated Limit Warnings
- **Functionality**: Real-time monitoring of wallet limit usage with automatic toast notifications when reaching 80% of daily or monthly limits
- **Purpose**: Proactive alerts to prevent traders from accidentally exceeding limits and triggering account restrictions
- **Trigger**: Automatic when any transaction pushes wallet usage to 80% or higher
- **Progression**: Transaction recorded → calculate new percentages → detect 80% threshold crossed → display toast warning with wallet name and percentage → show visual badges on wallet cards → persist warning state until usage drops below 80%
- **Success criteria**: Warnings only trigger once per threshold crossing, notifications are bilingual, visual badges appear on affected wallet cards, warnings clear when usage drops below threshold

### Limit Visualization
- **Functionality**: Progress bars and percentage indicators showing daily/monthly usage against limits with color-coded warnings
- **Purpose**: Provide instant visual feedback on limit status to prevent risky transactions
- **Trigger**: Automatic on dashboard load and after each transaction
- **Progression**: Calculate usage → determine percentage → apply color (green <70%, orange 70-90%, red >90%) → render progress bar
- **Success criteria**: Visual state accurately reflects usage percentage, updates immediately after transactions

### Bilingual Interface (Arabic/English)
- **Functionality**: Complete UI translation with RTL layout for Arabic and LTR for English, persistent language preference
- **Purpose**: Serve Egyptian market where traders use both Arabic and English
- **Trigger**: Language toggle in navbar
- **Progression**: Click language icon → switch translation namespace → flip layout direction → save preference to storage
- **Success criteria**: All text translates correctly, layouts flip appropriately, preference persists across sessions

### Admin Panel
- **Functionality**: User management (view, edit status, suspend, ban, delete), subscription management (upgrade/downgrade users), view all user wallets and transactions, global statistics dashboard, manage default wallet limits for all wallet types, bulk delete all trader accounts
- **Purpose**: Enable platform oversight, configure system defaults, manage users, and perform administrative cleanup operations
- **Trigger**: Admin user logs in and navigates to admin tab (visible only to admin role)
- **Progression**: Admin dashboard → view statistics → select user management or default limits → modify as needed → delete individual users or bulk delete all → changes persist immediately
- **Success criteria**: Only admin role can access panel, all actions persist correctly, changes reflect immediately, admins can view and manage all users' data, delete users with cascade deletion of wallets and transactions, cannot edit or delete themselves, can set system-wide default limits, can bulk delete all trader accounts while preserving admin accounts

### Daily/Monthly Summary & Reports
- **Functionality**: Aggregated view of all transactions across all wallets showing totals, patterns, and limit compliance
- **Purpose**: Provide big-picture financial overview for strategic decision making
- **Trigger**: Navigate to Reports section from main nav
- **Progression**: Select date range → query transactions → aggregate by wallet and time period → display charts and tables
- **Success criteria**: Accurate calculations, visual charts render correctly, data can be filtered by date range

### PWA Installation
- **Functionality**: Web app manifest and service worker enabling installation on mobile devices with offline support
- **Purpose**: Provide app-like experience and quick access from home screen
- **Trigger**: Browser prompts installation when criteria met, or manual install from menu
- **Progression**: Visit site → browser detects manifest → shows install prompt → user accepts → icon added to home screen → opens in standalone mode
- **Success criteria**: Installable on iOS and Android, works offline for viewing cached data, shows custom app icon

### Pro Subscription & API Access
- **Functionality**: Subscription upgrade unlocking API endpoints for programmatic access to wallet data and transaction creation
- **Purpose**: Enable automation for high-volume traders and integration with trading bots
- **Trigger**: User clicks upgrade to Pro, completes payment flow
- **Progression**: Select Pro plan → payment → generate API key → display key with docs → enable API endpoints → rate limiting applied
- **Success criteria**: API authentication works with JWT + API key, endpoints return correct data, rate limits enforced

## Edge Case Handling

- **Network Failures**: Show retry mechanism with cached data fallback; queue transactions for sync when connection restored
- **Concurrent Transactions**: Optimistic UI updates with rollback on conflict; refresh data after submission
- **Invalid Limits**: Validate that monthly limit >= daily limit * 30, prevent negative values, warn if limits are unusually low
- **Account Deletion**: Confirm deletion with password re-entry; soft delete with 30-day recovery period; anonymize user data
- **Language Detection**: Auto-detect browser language on first visit, default to Arabic for Egyptian IPs, remember manual selection
- **Exceeding Limits**: Block transaction submission when limit exceeded, show alternative wallets with available capacity, maintain persistent warning state
- **Warning Notification Spam**: Prevent duplicate toast notifications by tracking warning state per wallet, only re-show if usage drops below 80% then crosses again
- **Multiple Simultaneous Warnings**: Handle multiple wallets reaching thresholds at same time with staggered toast displays
- **Time Zone Handling**: All timestamps in UTC, convert to Egypt timezone (GMT+2) for display, reset daily limits at midnight Egypt time
- **Expired Sessions**: Detect expired JWT, show login modal overlay without losing form data, restore after re-authentication

## Design Direction

The design should feel professional and trustworthy like a financial dashboard, with clear data visualization that reduces cognitive load. Interface should be information-dense but not cluttered, using cards and progressive disclosure. Minimal ornamentation with focus on readability and quick scanning of critical limit information. Design must feel equally polished in both Arabic RTL and English LTR layouts.

## Color Selection

Triadic color scheme with financial industry trust signals - using blue for primary actions, green for success/safe limits, and red for warnings/exceeded limits.

- **Primary Color**: Deep Professional Blue `oklch(0.45 0.15 250)` - Communicates trust, stability, and financial professionalism
- **Secondary Colors**: 
  - Neutral Slate `oklch(0.65 0.02 250)` for backgrounds and cards
  - Warm Gray `oklch(0.85 0.01 70)` for subtle borders and disabled states
- **Accent Color**: Vibrant Teal `oklch(0.60 0.12 200)` - Draws attention to CTAs and important interactive elements
- **Foreground/Background Pairings**:
  - Background (Light Slate `oklch(0.98 0.005 250)`): Dark Blue-Gray text `oklch(0.25 0.03 250)` - Ratio 12.1:1 ✓
  - Card (Pure White `oklch(1 0 0)`): Same Dark Blue-Gray `oklch(0.25 0.03 250)` - Ratio 14.8:1 ✓
  - Primary (Deep Blue `oklch(0.45 0.15 250)`): White text `oklch(1 0 0)` - Ratio 7.2:1 ✓
  - Secondary (Slate `oklch(0.65 0.02 250)`): Dark Blue-Gray `oklch(0.25 0.03 250)` - Ratio 4.7:1 ✓
  - Accent (Vibrant Teal `oklch(0.60 0.12 200)`): White text `oklch(1 0 0)` - Ratio 5.1:1 ✓
  - Muted (Pale Slate `oklch(0.92 0.01 250)`): Medium Gray `oklch(0.50 0.02 250)` - Ratio 5.8:1 ✓
  - Success (Green `oklch(0.55 0.15 145)`): White text `oklch(1 0 0)` - Ratio 4.9:1 ✓
  - Warning (Orange `oklch(0.70 0.15 65)`): Dark text `oklch(0.20 0.03 65)` - Ratio 7.8:1 ✓
  - Destructive (Red `oklch(0.55 0.22 25)`): White text `oklch(1 0 0)` - Ratio 5.3:1 ✓

## Font Selection

Typefaces should support both Arabic and Latin scripts with excellent legibility at small sizes for dense financial data. Using Inter for English (geometric clarity) and Cairo for Arabic (modern, professional, optimized for screens).

- **Typographic Hierarchy**:
  - H1 (Dashboard Title): Cairo/Inter Bold/32px/tight letter-spacing/-0.02em - Main page headings
  - H2 (Section Headers): Cairo/Inter SemiBold/24px/tight letter-spacing/-0.01em - Card titles, panel sections
  - H3 (Card Titles): Cairo/Inter Medium/18px/normal letter-spacing - Wallet names
  - Body (Transaction Lists): Cairo/Inter Regular/15px/relaxed line-height/1.6 - Main content, descriptions
  - Small (Metadata): Cairo/Inter Regular/13px/loose letter-spacing/0.01em - Timestamps, helper text
  - Numbers (Amounts): Inter Tabular/16px/medium weight - All monetary values for alignment

## Animations

Animations should feel responsive and purposeful, confirming actions without delaying workflow. Favor micro-interactions over elaborate transitions, with slightly slower timing for Arabic speakers (cultural preference research suggests slightly more contemplative pacing).

- **Purposeful Meaning**: Quick feedback animations (200ms) on transaction submissions, smooth limit bar fills (400ms ease-out), gentle page transitions (300ms) that maintain spatial context
- **Hierarchy of Movement**: Transaction success checkmarks and warning badges get attention-grabbing scale animations (bounce), limit bars animate on data changes, background cards subtly lift on hover (2px translate)

## Component Selection

- **Components**: 
  - Card (wallet and bank account containers with hover states)
  - Progress (visual limit bars with color variants)
  - Button (primary actions, ghost variants for secondary)
  - Form + Input + Label (transaction entry, wallet creation)
  - Dialog (confirmations, transaction forms)
  - Alert (limit warnings, success messages)
  - Badge (account status, subscription tier, wallet limit warnings)
  - Table (transaction history, admin user list)
  - Tabs (switching between daily/monthly views)
  - Select (wallet type chooser, language picker)
  - Avatar (user profile images)
  - Toast (non-blocking notifications via sonner for automated limit warnings and transaction confirmations)
  - Separator (visual grouping of sections)
  - Switch (toggle between send/receive)
  
- **Customizations**: 
  - Custom wallet type icon component combining phosphor icons with colored backgrounds
  - RTL-aware layout wrapper that flips flex directions and text alignment
  - Limit progress bar with gradient colors transitioning through safe→warning→danger zones
  - Bilingual date formatter component respecting locale conventions
  
- **States**: 
  - Buttons: hover (lift + brightness), active (scale 0.98), disabled (opacity 0.5 + no pointer)
  - Inputs: focus (ring + border accent color), error (red border + shake animation), filled (subtle background change)
  - Cards: hover (shadow elevation), selected (accent border), danger (red border pulse when limit exceeded), warning (orange ring when at 80%+)
  
- **Icon Selection**: 
  - Wallet/Bank (phosphor-icons: Wallet, Bank)
  - Add Transaction (Plus, ArrowUp/ArrowDown for send/receive)
  - Language Switch (Translate or Globe)
  - Limits (WarningCircle, CheckCircle, XCircle)
  - Navigation (List, ChartBar, Gear, SignOut)
  - Admin (UserGear, Crown, Shield)
  
- **Spacing**: 
  - Container padding: p-6 (24px) on desktop, p-4 (16px) on mobile
  - Card gaps: gap-4 (16px) between cards, gap-2 (8px) within card content
  - Form fields: space-y-4 between groups, gap-1.5 between label and input
  - Section margins: mb-8 (32px) between major sections
  
- **Mobile**: 
  - Stack wallet cards vertically on mobile (grid-cols-1), 2 columns on tablet (md:grid-cols-2), 3 on desktop (lg:grid-cols-3)
  - Collapse detailed transaction list into summary view with expand drawer on mobile
  - Fixed bottom navigation bar on mobile replacing sidebar
  - Larger touch targets (min-h-12) for all interactive elements
  - Responsive text scaling: text-sm on mobile, text-base on desktop for body content
  - Hamburger menu for admin sidebar on mobile with slide-in drawer
