import { useEffect, useMemo, useState } from 'react'
import { Zap, Check, RefreshCw, Trophy, Clock, Flame } from 'lucide-react'
import { useData } from '../DataStore'
import { todayISO } from '../lib/dates'

// ─── challenge pool ─────────────────────────────────────────
// Each challenge: text, category, difficulty (1=easy, 2=med, 3=hard),
// auto-detect: predicate on today's stats returns true when completed
const POOL = [
  // FOCUS / STUDY
  { id: 'java_3h',   text: 'Log 3 hours of Java',                  cat: 'focus',   diff: 2, xp: 60, auto: (s) => s.javaMin >= 180 },
  { id: 'java_1h',   text: 'Log 1 hour of deep focus',              cat: 'focus',   diff: 1, xp: 30, auto: (s) => s.javaMin >= 60 },
  { id: 'java_4h',   text: 'Log 4 hours of Java — grind day',        cat: 'focus',   diff: 3, xp: 100, auto: (s) => s.javaMin >= 240 },
  { id: 'pomo_2',    text: 'Complete 2 Pomodoro sessions',          cat: 'focus',   diff: 1, xp: 25, auto: (s) => s.javaMin >= 50 },
  { id: 'pomo_4',    text: 'Complete 4 Pomodoro sessions',          cat: 'focus',   diff: 2, xp: 50, auto: (s) => s.javaMin >= 100 },

  // DSA / CODE
  { id: 'dsa_1',     text: 'Solve at least 1 DSA problem',          cat: 'code',    diff: 1, xp: 20, auto: (s) => s.dsa >= 1 },
  { id: 'dsa_3',     text: 'Solve 3 DSA problems',                  cat: 'code',    diff: 2, xp: 60, auto: (s) => s.dsa >= 3 },
  { id: 'dsa_5',     text: 'Solve 5 DSA problems',                  cat: 'code',    diff: 3, xp: 100, auto: (s) => s.dsa >= 5 },
  { id: 'code_hard', text: 'Solve a Hard-tier problem',             cat: 'code',    diff: 3, xp: 80, manual: true },

  // HABIT
  { id: 'perfect',   text: 'Perfect day — complete every habit',    cat: 'habit',   diff: 3, xp: 90, auto: (s) => s.habitsDone === s.habitsTotal && s.habitsTotal > 0 },
  { id: 'half',      text: 'Complete half of your habits',          cat: 'habit',   diff: 1, xp: 20, auto: (s) => s.habitsDone >= Math.ceil((s.habitsTotal || 1) / 2) },

  // BODY
  { id: 'walk_10k',  text: 'Walk 10,000 steps',                    cat: 'body',    diff: 2, xp: 40, manual: true },
  { id: 'walk_5k',   text: 'Walk 5,000 steps',                    cat: 'body',    diff: 1, xp: 20, manual: true },
  { id: 'workout',   text: 'Do a workout — sweat for 20+ minutes',  cat: 'body',    diff: 2, xp: 40, manual: true },
  { id: 'water_4l',  text: 'Drink 4 litres of water',              cat: 'body',    diff: 1, xp: 20, manual: true },
  { id: 'sleep_7h',  text: 'Sleep 7+ hours tonight',                cat: 'body',    diff: 1, xp: 25, manual: true },

  // MIND
  { id: 'meditate',  text: 'Meditate for 10 minutes',              cat: 'mind',    diff: 1, xp: 20, manual: true },
  { id: 'read_30',   text: 'Read 30 pages of a book',              cat: 'mind',    diff: 2, xp: 40, manual: true },
  { id: 'no_social', text: 'No social media for 24 hours',          cat: 'mind',    diff: 3, xp: 80, manual: true },
  { id: 'phone_off', text: 'Phone off for 2 hours while studying',  cat: 'mind',    diff: 2, xp: 40, manual: true },

  // SKILLS
  { id: 'learn_new', text: 'Learn one genuinely new concept today', cat: 'skill',   diff: 2, xp: 40, manual: true },
  { id: 'blog',      text: "Write a short note or blog on today's learning", cat: 'skill', diff: 2, xp: 50, manual: true },
  { id: 'teach',     text: 'Explain a concept out loud — teach it',  cat: 'skill',   diff: 1, xp: 30, manual: true },

  // CAREER
  { id: 'apply_1',   text: 'Apply to 1 target company',             cat: 'career',  diff: 2, xp: 50, manual: true },
  { id: 'apply_3',   text: 'Apply to 3 target companies',           cat: 'career',  diff: 3, xp: 100, manual: true },
  { id: 'linkedin',  text: 'Update LinkedIn or resume',             cat: 'career',  diff: 2, xp: 40, manual: true },
  { id: 'mock',      text: 'Do 1 mock interview',                   cat: 'career',  diff: 3, xp: 80, manual: true },
]

const CAT_COLORS = {
  focus:  '#f59e0b',
  code:   '#a78bfa',
  habit:  '#22c55e',
  body:   '#38bdf8',
  mind:   '#f472b6',
  skill:  '#facc15',
  career: '#fb7185',
}
const CAT_ICONS = {
  focus:  '🎯', code: '💻', habit: '✅', body: '💪',
  mind:   '🧘', skill: '📚', career: '🎓',
}

// ─── deterministic RNG so 3 challenges/day stay the same all day ──
function seedFromDate(iso, salt = 0) {
  let h = salt
  for (let i = 0; i < iso.length; i++) h = (h * 31 + iso.charCodeAt(i)) >>> 0
  return h
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function pickDaily(iso, salt, want, filterFn = () => true) {
  const rng = mulberry32(seedFromDate(iso, salt))
  const eligible = POOL.filter(filterFn)
  const taken = []
  const used = new Set()
  const usedCats = new Set()
  // First pass: prefer variety of categories
  while (taken.length < want && eligible.length > 0) {
    const idx = Math.floor(rng() * eligible.length)
    const c = eligible[idx]
    if (used.has(c.id)) { if (used.size >= eligible.length) break; continue }
    // Prefer new category; but if we've been trying too long, take anything
    if (!usedCats.has(c.cat) || taken.length >= want - 1 || Math.random() > 0.5) {
      taken.push(c); used.add(c.id); usedCats.add(c.cat)
    } else if (used.size + usedCats.size > eligible.length * 1.5) {
      taken.push(c); used.add(c.id)
    }
  }
  return taken
}

// ─── LocalStorage: per-day claim tracking ──────────────────
const KEY = (iso) => `devos:challenges:${iso}`
function loadClaims(iso) {
  try { return JSON.parse(localStorage.getItem(KEY(iso)) || '{}') } catch { return {} }
}
function saveClaims(iso, obj) {
  localStorage.setItem(KEY(iso), JSON.stringify(obj))
}

export default function Challenges() {
  const { javaSessions, dsaLogs, logs, activeHabits } = useData()
  const today = todayISO()

  // Today's stats for auto-detect
  const stats = useMemo(() => {
    const javaMin = javaSessions.filter(s => s.session_date === today).reduce((a, s) => a + s.minutes, 0)
    const dsa = dsaLogs.filter(l => l.log_date === today).reduce((a, l) => a + l.problems, 0)
    const habitsDone = activeHabits.filter(h => logs[h.id]?.[today]?.completed).length
    return { javaMin, dsa, habitsDone, habitsTotal: activeHabits.length }
  }, [javaSessions, dsaLogs, logs, activeHabits, today])

  // Pick 3 challenges: one easy, one medium, one hard-ish
  const [rerollBump, setRerollBump] = useState(() => Number(localStorage.getItem(`devos:reroll:${today}`) || 0))
  const dailyChallenges = useMemo(() => {
    const easy = pickDaily(today, rerollBump * 100 + 1, 1, (c) => c.diff === 1)
    const mid  = pickDaily(today, rerollBump * 100 + 2, 1, (c) => c.diff === 2)
    const hard = pickDaily(today, rerollBump * 100 + 3, 1, (c) => c.diff === 3)
    return [...easy, ...mid, ...hard]
  }, [today, rerollBump])

  const [claims, setClaims] = useState(() => loadClaims(today))
  useEffect(() => { saveClaims(today, claims) }, [today, claims])

  // Auto-mark: if a challenge with an auto-predicate is satisfied by real data
  useEffect(() => {
    const next = { ...claims }
    let changed = false
    for (const c of dailyChallenges) {
      if (c.auto && !claims[c.id]?.done && c.auto(stats)) {
        next[c.id] = { done: true, auto: true, at: Date.now() }; changed = true
      }
    }
    if (changed) setClaims(next)
  }, [stats, dailyChallenges]) // eslint-disable-line

  const toggleManual = (c) => {
    setClaims((cur) => {
      const now = !cur[c.id]?.done
      return { ...cur, [c.id]: now ? { done: true, auto: false, at: Date.now() } : {} }
    })
  }

  const reroll = () => {
    const n = rerollBump + 1
    setRerollBump(n)
    localStorage.setItem(`devos:reroll:${today}`, String(n))
    setClaims({}) // reset claims for the new set
    saveClaims(today, {})
  }

  const doneCount = dailyChallenges.filter(c => claims[c.id]?.done).length
  const xpEarned = dailyChallenges.filter(c => claims[c.id]?.done).reduce((a, c) => a + c.xp, 0)
  const xpPossible = dailyChallenges.reduce((a, c) => a + c.xp, 0)

  return (
    <div className="space-y-3">
      {/* Hero */}
      <section className="card g-border p-5 lg:p-6 anim-up">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="label mb-1 flex items-center gap-1.5">
              <Zap size={11} className="text-amber" /> Daily challenges
            </div>
            <h1 className="font-display font-bold text-3xl lg:text-4xl text-grad">Rise up.</h1>
            <p className="text-sm text-dim mt-2 max-w-md">
              Three tests. Complete them to level up your day. Auto-tracked ones tick themselves as you use the app.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 100 100" className="-rotate-90">
                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="42" stroke="#f59e0b" strokeWidth="8" fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - doneCount / 3)}
                  style={{ transition: 'stroke-dashoffset .6s ease' }} />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="font-mono font-bold text-lg leading-none">{doneCount}/3</div>
                  <div className="text-[9px] text-dim uppercase tracking-widest mt-0.5">done</div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-dim font-mono">
              <span className="text-amber font-bold">{xpEarned}</span>/{xpPossible} XP
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button className="btn" onClick={reroll} title="Reroll today's challenges">
            <RefreshCw size={13} /> Reroll set
          </button>
          <span className="text-[11px] text-dim">Next set unlocks tomorrow — rerolls reset claims.</span>
        </div>
      </section>

      {/* Challenges */}
      <div className="grid gap-3 md:grid-cols-3 stagger">
        {dailyChallenges.map((c) => {
          const done = !!claims[c.id]?.done
          const auto = !!claims[c.id]?.auto
          const color = CAT_COLORS[c.cat]
          const icon = CAT_ICONS[c.cat]
          const diffLabel = ['Easy', 'Medium', 'Hard'][c.diff - 1]
          return (
            <div
              key={c.id}
              className={`card card-hover relative transition ${done ? '' : 'border-white/8'}`}
              style={done ? { borderColor: color + '80', background: color + '11' } : {}}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl grid place-items-center text-lg"
                  style={{ background: color + '22', boxShadow: `inset 0 0 0 1px ${color}55` }}>
                  {icon}
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest" style={{ color }}>{diffLabel}</div>
                  <div className="font-mono text-xs text-dim">+{c.xp} XP</div>
                </div>
              </div>

              <p className={`font-medium leading-snug ${done ? 'line-through text-dim' : ''}`}>
                {c.text}
              </p>

              <div className="flex items-center justify-between mt-4">
                <span className="text-[11px] text-dim">
                  {c.auto ? '🤖 Auto-tracked' : '✋ Manual'}
                </span>
                {c.auto ? (
                  <div className={`text-xs font-medium ${done ? 'text-mint' : 'text-dim'}`}>
                    {done ? <><Check size={12} className="inline" /> Complete</> : 'Not yet'}
                  </div>
                ) : (
                  <button
                    onClick={() => toggleManual(c)}
                    className={`btn !py-1.5 !px-3 text-xs ${done ? '!bg-mint/20 !border-mint/50 !text-mint' : ''}`}
                  >
                    {done ? <><Check size={13} /> Done</> : 'Mark done'}
                  </button>
                )}
              </div>

              {done && auto && (
                <div className="absolute top-2 right-2">
                  <span className="text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded bg-mint/20 text-mint">
                    auto ✓
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom feedback bar */}
      {doneCount === 3 && (
        <div className="card !bg-mint/10 !border-mint/40 text-center py-6 anim-up">
          <Trophy size={28} className="text-mint mx-auto mb-2" />
          <div className="font-display font-bold text-xl text-mint">All three cleared.</div>
          <p className="text-sm text-dim mt-1">Come back tomorrow for a new set.</p>
        </div>
      )}
      {doneCount === 0 && (
        <div className="text-center text-xs text-dim mt-2 flex items-center justify-center gap-1.5">
          <Clock size={12} /> {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} — get started
        </div>
      )}
    </div>
  )
}
