import { useEffect, useState } from 'react'
import { supabase, configMissing } from './lib/supabase'
import Login from './pages/Login'
import Shell from './Shell'

function Center({ children }) {
  return <div className="min-h-screen grid place-items-center p-6 text-center">{children}</div>
}

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (configMissing)
    return (
      <Center>
        <div className="card max-w-md">
          <h1 className="font-display text-xl mb-2">Almost there ☕</h1>
          <p className="text-dim text-sm">
            Supabase keys are missing. Copy <span className="font-mono text-text">.env.example</span> to{' '}
            <span className="font-mono text-text">.env</span>, paste your project URL and anon key, then restart{' '}
            <span className="font-mono text-text">npm run dev</span>.
          </p>
        </div>
      </Center>
    )

  if (session === undefined)
    return (
      <Center>
        <div className="font-display text-dim animate-pulse">Brewing…</div>
      </Center>
    )

  if (!session) return <Login />
  return <Shell session={session} />
}
