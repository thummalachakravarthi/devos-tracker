import { useEffect, useState } from 'react'
import { supabase, configMissing } from './lib/supabase'
import BootSequence from './BootSequence'
import Login from './pages/Login'
import Shell from './Shell'

function Center({ children }) {
  return <div className="min-h-screen grid place-items-center p-6 text-center">{children}</div>
}

export default function App() {
  const [session, setSession] = useState(undefined)
  const [booting, setBooting] = useState(() => {
    if (typeof window === 'undefined') return false
    // no intro for users who ask for reduced motion; otherwise play every cold load
    return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  let content
  if (configMissing)
    content = (
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
  else if (session === undefined)
    content = (
      <Center>
        <div className="font-display text-dim animate-pulse">Brewing…</div>
      </Center>
    )
  else if (!session) content = <Login />
  else content = <Shell session={session} />

  // The intro is an overlay: the real app renders underneath and auth resolves
  // during the ~2.5s boot, so the curtain lifts to reveal the live dashboard.
  return (
    <>
      {content}
      {booting && <BootSequence onDone={() => setBooting(false)} />}
    </>
  )
}
