import { useState } from 'react'
import { Home, Coffee, BarChart3, ListChecks, LogOut } from 'lucide-react'
import { supabase } from './lib/supabase'
import { DataProvider, useData } from './DataStore'
import Today from './pages/Today'
import JavaHQ from './pages/JavaHQ'
import Stats from './pages/Stats'
import Habits from './pages/Habits'

const TABS = [
  { id: 'today', label: 'Today', icon: Home },
  { id: 'java', label: 'Java HQ', icon: Coffee },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'habits', label: 'Habits', icon: ListChecks },
]

export function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
    </div>
  )
}

function Sidebar({ tab, setTab }) {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 flex-col border-r border-white/10 bg-black/25 backdrop-blur-xl z-30">
      <div className="flex items-center gap-3 px-5 pt-6 pb-8">
        <img src="/icon.svg" alt="" className="w-10 h-10 rounded-xl glow-amber" />
        <div>
          <div className="font-display font-bold text-lg leading-none">DevOS</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-dim mt-1">Mission 240</div>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              tab === id
                ? 'bg-white/10 text-amber shadow-[0_0_28px_-10px_rgba(242,163,60,.6)]'
                : 'text-dim hover:text-text hover:bg-white/5'
            }`}
          >
            <Icon size={18} strokeWidth={tab === id ? 2.4 : 1.8} />
            {label}
            {tab === id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber" />}
          </button>
        ))}
      </nav>
      <button
        className="m-3 btn justify-start !px-3 text-dim"
        onClick={() => supabase.auth.signOut()}
      >
        <LogOut size={16} /> Sign out
      </button>
    </aside>
  )
}

function Inner({ tab, setTab }) {
  const { loading, error } = useData()
  if (loading)
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center anim-up">
          <img src="/icon.svg" alt="" className="w-14 h-14 rounded-2xl glow-amber mx-auto mb-4" style={{ animation: 'glowPulse 1.6s ease-in-out infinite' }} />
          <div className="font-display text-dim">Loading your mission…</div>
        </div>
      </div>
    )
  if (error)
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="card max-w-md text-center anim-up">
          <p className="text-red font-medium mb-1">Couldn't load data</p>
          <p className="text-dim text-sm">{error}</p>
          <p className="text-dim text-sm mt-2">
            Check that you ran <span className="font-mono text-text">schema.sql</span> in Supabase.
          </p>
        </div>
      </div>
    )

  return (
    <>
      <Sidebar tab={tab} setTab={setTab} />

      <div className="lg:pl-60">
        {/* mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="" className="w-8 h-8 rounded-lg" />
            <div>
              <div className="font-display font-bold leading-none">DevOS</div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-dim">Mission 240</div>
            </div>
          </div>
          <button className="btn !px-2.5" title="Sign out" onClick={() => supabase.auth.signOut()}>
            <LogOut size={16} />
          </button>
        </header>

        <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-2 lg:pt-8 pb-28 lg:pb-14">
          <div key={tab} className="anim-up">
            {tab === 'today' && <Today setTab={setTab} />}
            {tab === 'java' && <JavaHQ />}
            {tab === 'stats' && <Stats setTab={setTab} />}
            {tab === 'habits' && <Habits />}
          </div>
        </main>
      </div>

      {/* mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-black/40 backdrop-blur-xl border-t border-white/10">
        <div className="grid grid-cols-4">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] transition ${
                tab === id ? 'text-amber' : 'text-dim'
              }`}
            >
              <Icon size={20} strokeWidth={tab === id ? 2.4 : 1.8} />
              {label}
            </button>
          ))}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  )
}

export default function Shell({ session }) {
  const [tab, setTab] = useState('today')
  return (
    <DataProvider session={session}>
      <Aurora />
      <Inner tab={tab} setTab={setTab} />
    </DataProvider>
  )
}
