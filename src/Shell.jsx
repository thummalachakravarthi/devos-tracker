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

function Inner({ tab, setTab }) {
  const { loading, error } = useData()
  if (loading)
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="font-display text-dim animate-pulse">Loading your mission…</div>
      </div>
    )
  if (error)
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="card max-w-md text-center">
          <p className="text-red font-medium mb-1">Couldn't load data</p>
          <p className="text-dim text-sm">{error}</p>
          <p className="text-dim text-sm mt-2">
            Check that you ran <span className="font-mono text-text">schema.sql</span> in Supabase.
          </p>
        </div>
      </div>
    )

  return (
    <div className="max-w-2xl mx-auto px-4 pb-28 pt-4">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img src="/icon.svg" alt="" className="w-8 h-8 rounded-lg" />
          <div>
            <div className="font-display font-bold leading-none">DevOS</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-dim">Mission 240</div>
          </div>
        </div>
        <button
          className="btn !px-2.5"
          title="Sign out"
          onClick={() => supabase.auth.signOut()}
        >
          <LogOut size={16} />
        </button>
      </header>

      {tab === 'today' && <Today setTab={setTab} />}
      {tab === 'java' && <JavaHQ />}
      {tab === 'stats' && <Stats setTab={setTab} />}
      {tab === 'habits' && <Habits />}

      <nav className="fixed bottom-0 inset-x-0 z-20 bg-surface/90 backdrop-blur border-t border-line">
        <div className="max-w-2xl mx-auto grid grid-cols-4">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] transition ${
                tab === id ? 'text-amber' : 'text-dim hover:text-text'
              }`}
            >
              <Icon size={20} strokeWidth={tab === id ? 2.4 : 1.8} />
              {label}
            </button>
          ))}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  )
}

export default function Shell({ session }) {
  const [tab, setTab] = useState('today')
  return (
    <DataProvider session={session}>
      <Inner tab={tab} setTab={setTab} />
    </DataProvider>
  )
}
