# P2P Wallet Manager - Product Requirements Document

A bilingual progressive web app (PWA) empowering Egyptian P2P traders to manage e-wallets and bank accounts, monitor transaction limits, and prevent account freezes through intelligent limit tracking.

**Experience Qualities**:
1. **Trustworthy**: Clear, accurate limit tracking with visual indicators that give traders confidence in their transaction safety
2. **Efficient**: Quick transaction logging and instant feedback on remaining limits so traders can act fast in P2P markets
3. **Professional**: Polished bilingual interface that respects Arabic RTL layout and English LTR, making it accessible to all Egyptian traders

**Complexity Level**: Complex Application (advanced functionality, accounts)
- Requires user authentication with role-based access (trader/admin), persistent wallet management, transaction tracking with daily/monthly aggregations, subscription tiers, and bilingual UI with RTL/LTR support

## Essential Features

### User Authentication & Authorization
- **Functionality**: Register, login, logout with JWT-based session management and role-based access control
- **Purpose**: Secure access to sensitive financial data and enable admin capabilities
- **Trigger**: Landing page with login/register forms, or admin accessing restricted routes
- **Progression**: Enter credentials → validate → generate JWT → store token → redirect to dashboard
- **Success criteria**: Users can only access their own wallet data; admins can view all users; tokens expire appropriately

### Wallet & Bank Account Management
- **Functionality**: Add/edit/delete multiple e-wallets (Vodafone Cash, Orange, Etisalat, InstaPay) and bank accounts with custom daily/monthly limits
- **Purpose**: Centralize all payment methods in one place for comprehensive limit tracking
- **Trigger**: Dashboard "Add Wallet" or "Add Bank Account" button
- **Progression**: Click add → select wallet type → enter account details → set limits → save → appears in dashboard list
- **Success criteria**: All wallets display with correct limits, can be edited or removed, data persists between sessions

### Transaction Tracking
- **Functionality**: Manual entry of sent/received transactions with real-time calculation of daily and monthly totals against limits
- **Purpose**: Monitor transaction volume to prevent exceeding limits that trigger account freezes
- **Trigger**: "Add Transaction" button on wallet card
- **Progression**: Select wallet → choose send/receive → enter amount → submit → updates totals → recalculates remaining limits → shows visual feedback
- **Success criteria**: Totals update instantly, warnings appear when approaching limits (80%+), error alerts when exceeding limits

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
- **Functionality**: User management (view, approve, suspend, ban), global limit configuration, statistics dashboard, subscription management
- **Purpose**: Enable platform oversight and customer support operations
- **Trigger**: Admin user logs in and navigates to admin routes
- **Progression**: Admin dashboard → select user management → view list → filter/search → perform action → confirmation → update database
- **Success criteria**: Only admin role can access panel, all actions persist correctly, changes reflect immediately

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
- **Exceeding Limits**: Block transaction submission when limit exceeded, show alternative wallets with available capacity
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
  - Badge (account status, subscription tier)
  - Table (transaction history, admin user list)
  - Tabs (switching between daily/monthly views)
  - Select (wallet type chooser, language picker)
  - Avatar (user profile images)
  - Toast (non-blocking notifications via sonner)
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
  - Cards: hover (shadow elevation), selected (accent border), danger (red border pulse when limit exceeded)
  
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
