import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useKV } from '@github/spark/hooks'
import { User, UserStatus, SubscriptionTier, Wallet, Transaction } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, ChartBar, Crown, Wallet as WalletIcon, ArrowsLeftRight, ShieldCheck, UserGear, Trash, Database, Palette } from '@phosphor-icons/react'
import { DefaultLimitsManager } from './DefaultLimitsManager'
import { ThemeManager } from './ThemeManager'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export function AdminPanel() {
  const { t } = useTranslation()
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useKV<User[]>('users', [])
  const [wallets, setWallets] = useKV<Wallet[]>('wallets', [])
  const [transactions, setTransactions] = useKV<Transaction[]>('transactions', [])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)

  const totalUsers = users?.length || 0
  const activeUsers = users?.filter(u => u.status === 'active').length || 0
  const proUsers = users?.filter(u => u.subscription === 'pro').length || 0
  const totalWallets = wallets?.length || 0
  const totalTransactions = transactions?.length || 0

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      pending: 'secondary',
      suspended: 'secondary',
      banned: 'destructive'
    }
    return <Badge variant={variants[status] || 'default'}>{t(`admin.${status}`)}</Badge>
  }

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <Badge className="bg-primary text-primary-foreground">
        <ShieldCheck size={14} weight="fill" className="mr-1" />
        {t('admin.admin')}
      </Badge>
    ) : (
      <Badge variant="outline">{t('admin.trader')}</Badge>
    )
  }

  const getSubscriptionBadge = (subscription: string) => {
    return subscription === 'pro' ? (
      <Badge className="bg-accent text-accent-foreground">
        <Crown size={14} weight="fill" className="mr-1" />
        {t('admin.pro')}
      </Badge>
    ) : (
      <Badge variant="outline">{t('admin.free')}</Badge>
    )
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowUserDialog(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const confirmDeleteUser = () => {
    if (!selectedUser) return
    
    setUsers(current => current?.filter(u => u.id !== selectedUser.id) || [])
    setWallets(current => current?.filter(w => w.userId !== selectedUser.id) || [])
    setTransactions(current => {
      const userWalletIds = wallets?.filter(w => w.userId === selectedUser.id).map(w => w.id) || []
      return current?.filter(t => !userWalletIds.includes(t.walletId)) || []
    })
    
    toast.success(t('admin.userDeleted'))
    setShowDeleteDialog(false)
    setSelectedUser(null)
  }

  const handleDeleteAllAccounts = () => {
    setShowDeleteAllDialog(true)
  }

  const confirmDeleteAllAccounts = () => {
    const adminUsers = users?.filter(u => u.role === 'admin') || []
    setUsers(adminUsers)
    setWallets([])
    setTransactions([])
    
    toast.success(t('admin.deleteAllAccountsSuccess'))
    setShowDeleteAllDialog(false)
  }

  const handleUpdateUserStatus = (status: UserStatus) => {
    if (!selectedUser) return
    
    setUsers(current => 
      current?.map(u => 
        u.id === selectedUser.id ? { ...u, status } : u
      ) || []
    )
    setSelectedUser({ ...selectedUser, status })
    toast.success(t('admin.statusUpdated'))
  }

  const handleUpdateSubscription = (subscription: SubscriptionTier) => {
    if (!selectedUser) return
    
    setUsers(current => 
      current?.map(u => 
        u.id === selectedUser.id ? { ...u, subscription } : u
      ) || []
    )
    setSelectedUser({ ...selectedUser, subscription })
    toast.success(t('admin.subscriptionUpdated'))
  }

  const getUserWallets = (userId: string) => {
    return wallets?.filter(w => w.userId === userId) || []
  }

  const getUserTransactions = (userId: string) => {
    const userWalletIds = getUserWallets(userId).map(w => w.id)
    return transactions?.filter(t => userWalletIds.includes(t.walletId)) || []
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gradient">{t('admin.title')}</h1>
        <button className="btn-modern bg-red-500 hover:bg-red-600" onClick={handleDeleteAllAccounts}>
          <Database size={18} weight="bold" className="mr-2" />
          {t('admin.deleteAllAccounts')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="admin-card">
          <div className="pb-3">
            <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users size={18} className="text-blue-500" />
              {t('admin.totalUsers')}
            </h3>
          </div>
          <div>
            <p className="text-3xl font-bold text-gradient">{totalUsers}</p>
          </div>
        </div>

        <div className="admin-card">
          <div className="pb-3">
            <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <ChartBar size={18} className="text-green-500" />
              {t('admin.activeUsers')}
            </h3>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
          </div>
        </div>

        <div className="admin-card">
          <div className="pb-3">
            <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Crown size={18} weight="fill" className="text-yellow-500" />
              {t('admin.proUsers')}
            </h3>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-600">{proUsers}</p>
          </div>
        </div>

        <div className="admin-card">
          <div className="pb-3">
            <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <WalletIcon size={18} className="text-purple-500" />
              {t('admin.totalWallets')}
            </h3>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">{totalWallets}</p>
          </div>
        </div>

        <div className="admin-card">
          <div className="pb-3">
            <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <ArrowsLeftRight size={18} className="text-indigo-500" />
              {t('admin.totalTransactions')}
            </h3>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600">{totalTransactions}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">{t('admin.userManagementTab')}</TabsTrigger>
          <TabsTrigger value="limits">{t('admin.defaultLimitsTab')}</TabsTrigger>
          <TabsTrigger value="theme">
            <Palette size={16} weight="bold" className="mr-2" />
            {t('admin.themeTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="admin-card">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-semibold text-gradient">{t('admin.userManagement')}</h2>
            </div>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('auth.fullName')}</TableHead>
                    <TableHead>{t('auth.email')}</TableHead>
                    <TableHead>{t('admin.role')}</TableHead>
                    <TableHead>{t('admin.status')}</TableHead>
                    <TableHead>{t('admin.subscription')}</TableHead>
                    <TableHead>{t('admin.wallets')}</TableHead>
                    <TableHead>{t('admin.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                      <TableCell>{getUserWallets(user.id).length}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                            disabled={user.id === currentUser?.id}
                            className="bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70"
                          >
                            <UserGear size={16} weight="bold" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteUser(user)}
                            disabled={user.id === currentUser?.id}
                            className="bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70"
                          >
                            <Trash size={16} weight="bold" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="limits">
          <DefaultLimitsManager />
        </TabsContent>

        <TabsContent value="theme">
          <ThemeManager />
        </TabsContent>
      </Tabs>

      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('admin.editUser')}</DialogTitle>
            <DialogDescription>
              {selectedUser?.fullName} ({selectedUser?.email})
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">{t('admin.details')}</TabsTrigger>
                <TabsTrigger value="wallets">{t('admin.wallets')}</TabsTrigger>
                <TabsTrigger value="transactions">{t('admin.transactions')}</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('admin.status')}</label>
                  <Select 
                    value={selectedUser.status} 
                    onValueChange={(value) => handleUpdateUserStatus(value as UserStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('admin.active')}</SelectItem>
                      <SelectItem value="pending">{t('admin.pending')}</SelectItem>
                      <SelectItem value="suspended">{t('admin.suspended')}</SelectItem>
                      <SelectItem value="banned">{t('admin.banned')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('admin.subscription')}</label>
                  <Select 
                    value={selectedUser.subscription} 
                    onValueChange={(value) => handleUpdateSubscription(value as SubscriptionTier)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">{t('admin.free')}</SelectItem>
                      <SelectItem value="pro">{t('admin.pro')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="wallets" className="mt-4">
                <div className="space-y-2">
                  {getUserWallets(selectedUser.id).length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">{t('admin.noWallets')}</p>
                  ) : (
                    <div className="space-y-2">
                      {getUserWallets(selectedUser.id).map(wallet => (
                        <Card key={wallet.id}>
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{wallet.accountName}</p>
                                <p className="text-sm text-muted-foreground">{wallet.type}</p>
                                <p className="text-xs text-muted-foreground">{wallet.accountNumber}</p>
                              </div>
                              <div className="text-right text-sm">
                                <p>{t('wallet.dailyLimit')}: {wallet.dailyLimit}</p>
                                <p>{t('wallet.monthlyLimit')}: {wallet.monthlyLimit}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="mt-4">
                <div className="max-h-96 overflow-y-auto">
                  {getUserTransactions(selectedUser.id).length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">{t('admin.noTransactions')}</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('transaction.type')}</TableHead>
                          <TableHead>{t('transaction.amount')}</TableHead>
                          <TableHead>{t('transaction.description')}</TableHead>
                          <TableHead>{t('transaction.date')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getUserTransactions(selectedUser.id).map(transaction => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <Badge variant={transaction.type === 'send' ? 'destructive' : 'default'}>
                                {t(`transaction.${transaction.type}`)}
                              </Badge>
                            </TableCell>
                            <TableCell>{transaction.amount}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell className="text-xs">{new Date(transaction.date).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.deleteUser')}</DialogTitle>
            <DialogDescription>
              {t('admin.deleteUserConfirm', { name: selectedUser?.fullName })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.deleteAllAccountsTitle')}</DialogTitle>
            <DialogDescription>
              {t('admin.deleteAllAccountsDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteAllDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAllAccounts}>
              {t('admin.deleteAllAccounts')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
