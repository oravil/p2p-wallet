import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AuthPage } from '@/components/auth/AuthPage'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { Toaster } from '@/components/ui/sonner'
import '@/i18n/config'

function AppContent() {
    const { user, isLoading } = useAuth()
    const { i18n } = useTranslation()

    useEffect(() => {
        const lang = i18n.language
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', lang)
    }, [i18n.language])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    return (
        <>
            {user ? <Dashboard /> : <AuthPage />}
            <Toaster position="top-center" />
        </>
    )
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    )
}

export default App