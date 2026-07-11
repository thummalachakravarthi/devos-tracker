import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit() {
    setBusy(true)
    setMsg(null)
    const fn =
      mode === 'signin'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password })
    const { data, error } = await fn
    setBusy(false)
    if (error) return setMsg({ type: 'err', text: error.message })
    if (mode === 'signup' && !data.session)
      setMsg({ type: 'ok', text: 'Account created — check your email to confirm, then sign in.' })
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <img src="/icon.svg" alt="" className="w-12 h-12 rounded-xl" />
          <div>
            <div className="font-display font-bold text-2xl leading-none">DevOS</div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-dim mt-1">Mission 240</div>
          </div>
        </div>

        <div className="card space-y-3">
          <div>
            <label className="label">Email</label>
            <input
              className="input mt-1"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input mt-1"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </div>

          {msg && (
            <p className={`text-sm ${msg.type === 'err' ? 'text-red' : 'text-mint'}`}>{msg.text}</p>
          )}

          <button className="btn btn-amber w-full" onClick={submit} disabled={busy || !email || !password}>
            {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>

          <button
            className="w-full text-center text-sm text-dim hover:text-text transition"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setMsg(null)
            }}
          >
            {mode === 'signin' ? 'First time? Create your account' : 'Already set up? Sign in'}
          </button>
        </div>

        <p className="text-center text-xs text-dim mt-4">
          Your data lives in your own Supabase project. Nobody else's business.
        </p>
      </div>
    </div>
  )
}
