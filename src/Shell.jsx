import { useEffect, useState } from 'react'
import { Home, Coffee, BarChart3, ListChecks, LogOut, Timer, Command as CommandIcon, LineChart } from 'lucide-react'
import { supabase } from './lib/supabase'
import { DataProvider, useData } from './DataStore'
import { CityBackdrop, ArtToday, ArtJava, ArtStats, ArtHabits } from './components/HeroArt'
import Today from './pages/Today'
import JavaHQ from './pages/JavaHQ'
import Stats from './pages/Stats'
import Habits from './pages/Habits'
import Focus from './pages/Focus'
import Command from './pages/Command'
import Insights from './pages/Insights'

const TABS = [
  { id: 'today', label: 'Today', icon: Home },
  { id: 'focus', label: 'Focus', icon: Timer },
  { id: 'command', label: 'Command', icon: CommandIcon },
  { id: 'java', label: 'Java HQ', icon: Coffee },
  { id: 'insights', label: 'Insights', icon: LineChart },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'habits', label: 'Habits', icon: ListChecks },
]

const HERO = {
  today: { src: '/heroes/today.jpg', title: "Today's Mission", Art: ArtToday },
  focus: { src: '/heroes/focus.jpg', title: 'Focus Lab', Art: ArtJava },
  command: { src: '/heroes/command.jpg', title: 'Command Center', Art: ArtStats },
  insights: { src: '/heroes/insights.jpg', title: 'Analyst Desk', Art: ArtStats },
  java: { src: '/heroes/java.jpg', title: 'Java HQ', Art: ArtJava },
  stats: { src: '/heroes/stats.jpg', title: 'Battle Stats', Art: ArtStats },
  habits: { src: '/heroes/habits.jpg', title: 'The Roster', Art: ArtHabits },
}

// Shows the tab's hero photo if /public/heroes/<tab>.jpg exists; hides itself if not.
function HeroBanner({ tab }) {
  const [ok, setOk] = useState(true)
  const h = HERO[tab]
  useEffect(() => setOk(true), [tab])
  if (!h) return null
  return (
    <div className="relative rounded-2xl overflow-hidden mb-3 h-40 lg:h-56 shadow-[0_22px_48px_-16px_rgba(4,8,20,.6)] anim-up">
      {ok ? (
        <img
          src={h.src}
          onError={() => setOk(false)}
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />
      ) : (
        <h.Art />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
      <div className="absolute bottom-3 left-4 lg:bottom-4 lg:left-6 font-display font-bold text-2xl lg:text-4xl text-white drop-shadow-lg">
        {h.title}
      </div>
    </div>
  )
}

export function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <CityBackdrop />
      <div className="bg-photo" />
      <div className="bg-overlay" />
    </div>
  )
}

function Sidebar({ tab, setTab }) {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 flex-col border-r border-white/20 bg-white/80 backdrop-blur-xl z-30">
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
                ? 'bg-red/10 text-red shadow-[0_6px_18px_-8px_rgba(212,52,42,.5)]'
                : 'text-dim hover:text-text hover:bg-black/5'
            }`}
          >
            <Icon size={18} strokeWidth={tab === id ? 2.4 : 1.8} />
            {label}
            {tab === id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red" />}
          </button>
        ))}
      </nav>
      <button
        className="m-3 btn btn-thanos justify-start !px-3"
        onClick={() => supabase.auth.signOut()}
        title="Snap yourself out"
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
        <header className="lg:hidden flex items-center justify-between mx-3 mt-3 mb-1 px-3 py-2 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
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
          <HeroBanner tab={tab} />
          <div key={tab} className="anim-up">
            {tab === 'today' && <Today setTab={setTab} />}
            {tab === 'focus' && <Focus />}
            {tab === 'command' && <Command />}
            {tab === 'insights' && <Insights />}
            {tab === 'java' && <JavaHQ />}
            {tab === 'stats' && <Stats setTab={setTab} />}
            {tab === 'habits' && <Habits />}
          </div>
        </main>
      </div>

      {/* mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-white/85 backdrop-blur-xl border-t border-white/40">
        <div className="grid grid-cols-7">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] transition ${
                tab === id ? 'text-red' : 'text-dim'
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

  // cursor-tracking spotlight for .card elements
  useEffect(() => {
    const move = (e) => {
      const c = e.target.closest?.('.card')
      if (!c) return
      const r = c.getBoundingClientRect()
      c.style.setProperty('--mx', `${e.clientX - r.left}px`)
      c.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('mousemove', move)
    return () => document.removeEventListener('mousemove', move)
  }, [])
  return (
    <DataProvider session={session}>
      <Aurora />
      <Inner tab={tab} setTab={setTab} />
    </DataProvider>
  )
}
