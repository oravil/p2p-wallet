# 🔐 Admin Panel Access Guide

## How to Access the Admin Panel

The P2P Wallet Manager has a built-in admin panel that provides full control over users, wallets, and transactions.

### Step 1: Create an Admin Account

**The first registered user automatically becomes an admin with full control.**

1. Open the application
2. Click **Register** on the login page
3. Enter your details:
   - **Full Name**: Your name
   - **Email**: Your email address
   - **Password**: Your secure password
4. Click **Register**

🎉 **Congratulations!** As the first user, you now have:
- ✅ **Admin role** with full control
- ✅ **Pro subscription** (free forever for the first user)
- ✅ Access to all admin features

### Step 2: Access the Admin Panel

Once logged in as an admin:

1. Look at the top of your dashboard
2. You'll see **two tabs**:
   - 🏦 **Dashboard** - Your personal wallets and transactions
   - 🛡️ **Admin** - The admin control panel

3. Click the **Admin** tab to access the admin panel

### What Can Admins Do?

The admin panel provides complete platform management:

#### 📊 Statistics Dashboard
- Total users count
- Active users count
- Pro subscription users
- Total wallets across all users
- Total transactions across all users

#### 👥 User Management
- **View all users** with their:
  - Full name and email
  - Role (Admin/Trader)
  - Status (Active/Pending/Suspended/Banned)
  - Subscription tier (Free/Pro)
  - Number of wallets

- **Edit any user** (except yourself):
  - Change user status (Active/Pending/Suspended/Banned)
  - Upgrade/downgrade subscriptions (Free/Pro)
  - View user's wallets with limits
  - View user's transaction history

- **Delete users** (except yourself):
  - Remove users and all their data
  - Cascade deletion removes wallets and transactions
  - Confirmation required before deletion

#### 🔒 Admin Restrictions
For safety, admins **cannot**:
- Edit their own status or subscription
- Delete their own account
- These buttons are automatically disabled

### Important Notes

#### Multiple Admins
- Only the **first registered user** gets admin access automatically
- Other users register as regular traders
- Admins can promote other users to admin by manually editing the user data (if needed)

#### Admin Status
- Admin status is permanent (unless manually changed in data)
- The first user always gets Pro subscription for free
- Subsequent users start with Free subscription

#### Security
- All user data is stored securely in persistent storage
- Admins can see all users' data but cannot access passwords
- All actions are logged and can be audited

### Troubleshooting

**Q: I don't see the Admin tab**
- Only users with admin role can see this tab
- Make sure you registered as the first user
- Check your user role in the navigation (should show your name)

**Q: Can I have multiple admins?**
- Currently, only the first registered user is automatically admin
- You can manually promote users by editing the stored user data if needed

**Q: What happens if I delete a user?**
- All their wallets are deleted
- All their transactions are deleted
- This action cannot be undone
- You cannot delete yourself

**Q: I registered first but don't have admin access**
- Check if there were any previous registrations
- Clear your browser data and register again as the first user
- The system checks if `users.length === 0` to give admin status

### Need Help?

If you encounter any issues accessing the admin panel:
1. Ensure you're the first registered user
2. Check the browser console for any errors
3. Clear browser cache and try again
4. Look for the 🛡️ Admin tab next to the 🏦 Dashboard tab

---

**Remember**: With great power comes great responsibility! The admin panel gives you full control over all users and their data. Use it wisely. 🦸‍♂️
