import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import StockDashboard from '@/components/StockDashboard'
import LoginPage from '@/components/LoginPage'
import LoadingScreen from '@/components/LoadingScreen'

function App() {
  const [session, setSession] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setCheckingAuth(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (checkingAuth) {
    return <LoadingScreen />
  }

  if (!session) {
    return <LoginPage />
  }

  return <StockDashboard onLogout={handleLogout} />
}

export default App