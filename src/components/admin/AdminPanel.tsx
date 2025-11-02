import { useTranslation } from 'react-i18next'
import { useKV } from '@github/spark/hooks'
import { User } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, ChartBar, Crown } from '@phosphor-icons/react'

export function AdminPanel() {
  const { t } = useTranslation()
  const [users] = useKV<User[]>('users', [])

  const totalUsers = users?.length || 0
  const activeUsers = users?.filter(u => u.status === 'active').length || 0
  const proUsers = users?.filter(u => u.subscription === 'pro').length || 0

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      pending: 'secondary',
      suspended: 'secondary',
      banned: 'destructive'
    }
    return <Badge variant={variants[status] || 'default'}>{t(`admin.${status}`)}</Badge>
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

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{t('admin.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users size={18} />
              {t('admin.totalUsers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ChartBar size={18} />
              {t('admin.activeUsers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Crown size={18} weight="fill" />
              {t('admin.proUsers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">{proUsers}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.userManagement')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('auth.fullName')}</TableHead>
                <TableHead>{t('auth.email')}</TableHead>
                <TableHead>{t('admin.status')}</TableHead>
                <TableHead>{t('admin.subscription')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        {t('wallet.edit')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
