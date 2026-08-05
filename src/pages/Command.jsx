import { useMemo, useState, useEffect } from 'react'
import {
  History, StickyNote, CalendarRange, Map, Building2, Plus, Trash2,
  ChevronRight, TrendingUp, TrendingDown, Minus, Radio, Target
} from 'lucide-react'
import { useData } from '../DataStore'
import { supabase } from '../lib/supabase'
import { todayISO, addDays, dayDiff, startOfWeek, weekdayShort, fmtNice, fmtShort } from '../lib/dates'

import { PHASES } from '../config/plan'

// ═══════════════════════════════════════════════════════════
// YESTERDAY RECAP
// ═══════════════════════════════════════════════════════════
function YesterdayRecap() {
  const { javaSessions, dsaLogs, logs, activeHabits, settings } = useData()
  const today = todayISO()
  const y = addDays(today, -1)
  const y2 = addDays(today, -2)

  const stats = (day) => ({
    java: javaSessions.filter((s) => s.session_date === day).reduce((a, s) => a + s.minutes, 0),
    dsa: dsaLogs.filter((l) => l.log_date === day).reduce((a, l) => a + l.problems, 0),
    habits: activeHabits.filter((h) => logs[h.id]?.[day]?.completed).length,
  })
  const cur = stats(y)
  const prev = stats(y2)

  const target = settings.daily_java_minutes
  const totalHabits = activeHabits.length
  const perfect = cur.java >= target && cur.habits === totalHabits && cur.dsa >= 1

  return (
    <section className="card card-hover">
      <div className="flex items-center gap-2 mb-4">
        <History size={16} className="text-amber" />
        <div className="label">Yesterday · {fmtNice(y)}</div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatTile
          label="Java"
          value={`${Math.floor(cur.java / 60)}h ${cur.java % 60}m`}
          trend={cur.java - prev.java}
          suffix="m"
          good={cur.java >= target}
          hint={`target ${Math.floor(target/60)}h`}
        />
        <StatTile
          label="DSA"
          value={cur.dsa}
          trend={cur.dsa - prev.dsa}
          good={cur.dsa >= 1}
          hint="problems"
        />
        <StatTile
          label="Habits"
          value={`${cur.habits}/${totalHabits}`}
          trend={cur.habits - prev.habits}
          good={totalHabits > 0 && cur.habits === totalHabits}
          hint="completed"
        />
      </div>

      {perfect ? (
        <p className="text-xs text-mint mt-3">⭐ Perfect day. Keep it going.</p>
      ) : cur.java + cur.dsa + cur.habits === 0 ? (
        <p className="text-xs text-red mt-3">You logged nothing yesterday. Don't let today be the same.</p>
      ) : (
        <p className="text-xs text-dim mt-3">
          {cur.java < target && `Missed the ${Math.floor(target/60)}h Java target by ${Math.floor((target-cur.java)/60)}h ${Math.max(0,target-cur.java)%60}m. `}
          {cur.dsa === 0 && 'No DSA logged. '}
          Today's your chance.
        </p>
      )}
    </section>
  )
}

function StatTile({ label, value, trend, hint, good }) {
  const Icon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus
  return (
    <div className={`rounded-xl p-3 border ${good ? 'bg-mint/10 border-mint/30' : 'bg-white/[.03] border-white/8'}`}>
      <div className="label">{label}</div>
      <div className="font-mono font-bold text-xl mt-1">{value}</div>
      <div className="flex items-center gap-1 text-[10px] text-dim mt-1">
        <Icon size={11} className={trend > 0 ? 'text-mint' : trend < 0 ? 'text-red' : ''} />
        {hint}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// SESSION NOTES
// ═══════════════════════════════════════════════════════════
function SessionNotes() {
  const { javaSessions } = useData()
  const [expanded, setExpanded] = useState(null)
  const withNotes = useMemo(
    () => javaSessions.filter((s) => s.note && s.note.trim()).slice().reverse().slice(0, 30),
    [javaSessions]
  )

  return (
    <section className="card card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StickyNote size={16} className="text-violet" />
          <div className="label">Study notes</div>
        </div>
        <div className="chip">{withNotes.length} logged</div>
      </div>
      {withNotes.length === 0 ? (
        <div className="text-sm text-dim py-6 text-center">
          Add a note when logging Java time in Java HQ.<br/>
          <span className="text-xs">Future-you will thank you at interview prep.</span>
        </div>
      ) : (
        <ul className="divide-y divide-white/6">
          {withNotes.map((s) => (
            <li key={s.id}>
              <button
                className="w-full flex items-center gap-3 py-2.5 text-left"
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              >
                <span className="font-mono text-amber text-xs w-14 shrink-0">{s.minutes}m</span>
                <span className="text-xs text-dim w-16 shrink-0">{fmtShort(s.session_date)}</span>
                <span className={`flex-1 text-sm truncate ${expanded === s.id ? 'whitespace-normal' : ''}`}>
                  {s.note}
                </span>
                <ChevronRight
                  size={14}
                  className={`text-dim transition ${expanded === s.id ? 'rotate-90' : ''}`}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// WEEKLY REVIEW
// ═══════════════════════════════════════════════════════════
function WeeklyReview() {
  const { javaSessions, dsaLogs, logs, activeHabits } = useData()
  const today = todayISO()
  const weekStart = startOfWeek(today, settings?.week_starts_monday !== false)
  const prevWeekStart = addDays(weekStart, -7)

  const week = (start) => {
    let java = 0, dsa = 0, checkins = 0, perfect = 0
    for (let i = 0; i < 7; i++) {
      const d = addDays(start, i)
      java += javaSessions.filter((s) => s.session_date === d).reduce((a, s) => a + s.minutes, 0)
      dsa += dsaLogs.filter((l) => l.log_date === d).reduce((a, l) => a + l.problems, 0)
      const done = activeHabits.filter((h) => logs[h.id]?.[d]?.completed).length
      checkins += done
      if (activeHabits.length && done === activeHabits.length) perfect++
    }
    return { java, dsa, checkins, perfect }
  }
  const cur = week(weekStart)
  const prev = week(prevWeekStart)

  const bestHabit = activeHabits
    .map((h) => ({ h, n: Array.from({ length: 7 }).filter((_, i) => logs[h.id]?.[addDays(weekStart, i)]?.completed).length }))
    .sort((a, b) => b.n - a.n)[0]
  const worstHabit = activeHabits
    .map((h) => ({ h, n: Array.from({ length: 7 }).filter((_, i) => logs[h.id]?.[addDays(weekStart, i)]?.completed).length }))
    .sort((a, b) => a.n - b.n)[0]

  return (
    <section className="card card-hover">
      <div className="flex items-center gap-2 mb-4">
        <CalendarRange size={16} className="text-mint" />
        <div className="label">This week</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniStat label="Java" value={`${(cur.java/60).toFixed(1)}h`} delta={cur.java - prev.java} unit="m" />
        <MiniStat label="DSA" value={cur.dsa} delta={cur.dsa - prev.dsa} unit="" />
        <MiniStat label="Check-ins" value={cur.checkins} delta={cur.checkins - prev.checkins} unit="" />
        <MiniStat label="Perfect days" value={cur.perfect} delta={cur.perfect - prev.perfect} unit="" />
      </div>
      {(bestHabit || worstHabit) && (
        <div className="text-xs text-dim mt-4 space-y-1">
          {bestHabit && bestHabit.n > 0 && (
            <p>Strongest: <span className="text-mint">{bestHabit.h.name}</span> ({bestHabit.n}/7)</p>
          )}
          {worstHabit && bestHabit && bestHabit.h.id !== worstHabit.h.id && (
            <p>Needs work: <span className="text-red">{worstHabit.h.name}</span> ({worstHabit.n}/7)</p>
          )}
        </div>
      )}
    </section>
  )
}
function MiniStat({ label, value, delta, unit }) {
  const Icon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus
  return (
    <div className="rounded-xl p-3 border border-white/8 bg-white/[.03]">
      <div className="label">{label}</div>
      <div className="font-mono font-bold text-xl mt-1">{value}</div>
      <div className="text-[10px] text-dim mt-0.5 flex items-center gap-0.5">
        <Icon size={10} className={delta > 0 ? 'text-mint' : delta < 0 ? 'text-red' : ''} />
        {delta > 0 ? '+' : ''}{delta}{unit} vs last
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// ROADMAP — visual 240-day timeline with phase markers
// ═══════════════════════════════════════════════════════════
function Roadmap() {
  const { settings } = useData()
  const dayNum = Math.min(settings.plan_days, Math.max(1, dayDiff(settings.plan_start_date, todayISO()) + 1))
  const pct = dayNum / settings.plan_days

  return (
    <section className="card card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Map size={16} className="text-amber" />
          <div className="label">240-day roadmap</div>
        </div>
        <div className="font-mono text-xs">
          <span className="text-amber font-bold">Day {dayNum}</span>
          <span className="text-dim"> / {settings.plan_days}</span>
        </div>
      </div>

      {/* timeline bar with markers */}
      <div className="relative py-6">
        <div className="progress-track h-2 relative">
          <div className="progress-fill" style={{ width: `${pct * 100}%` }} />
        </div>
        {/* phase markers */}
        {PHASES.map((p, i) => {
          const at = (p.from - 1) / settings.plan_days
          const passed = dayNum >= p.from
          return (
            <div key={p.name}
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${at * 100}%` }}>
              <div className="text-[9px] text-dim font-mono mb-1">P{i + 1}</div>
              <div className={`w-2 h-2 rounded-full ${passed ? 'bg-amber' : 'bg-white/20'}`} />
            </div>
          )
        })}
        {/* today marker */}
        <div className="absolute -translate-x-1/2 -bottom-1"
          style={{ left: `${pct * 100}%` }}>
          <div className="w-3 h-3 rounded-full bg-amber shadow-[0_0_16px_4px_rgba(245,158,11,.6)]" />
        </div>
      </div>

      {/* phase list */}
      <ul className="space-y-3 mt-6">
        {PHASES.map((p) => {
          const status = dayNum > p.to ? 'done' : dayNum >= p.from ? 'now' : 'later'
          const prog = status === 'done' ? 1 : status === 'later' ? 0 : (dayNum - p.from + 1) / (p.to - p.from + 1)
          return (
            <li key={p.name} className={status === 'later' ? 'opacity-45' : ''}>
              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${status === 'now' ? 'text-amber' : ''}`}>
                  {p.name}
                  {status === 'now' && <span className="chip !text-amber !border-amber/30 ml-2">now</span>}
                  {status === 'done' && <span className="chip !text-mint !border-mint/30 ml-2">done</span>}
                </span>
                <span className="font-mono text-[11px] text-dim">d{p.from}–{p.to}</span>
              </div>
              <p className="text-xs text-dim mt-0.5">{p.focus}</p>
              <div className="progress-track h-1 mt-1.5">
                <div className={`progress-fill ${status === 'done' ? '!bg-mint' : ''}`}
                  style={{ width: `${prog * 100}%` }} />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// COMPANY TARGETS — localStorage only, no schema change
// ═══════════════════════════════════════════════════════════
const STAGES = ['Interested', 'Applied', 'OA', 'Phone', 'Onsite', 'Offer', 'Rejected']
const STAGE_COLOR = {
  Interested: '#7c88a8',
  Applied: '#60a5fa',
  OA: '#a78bfa',
  Phone: '#f59e0b',
  Onsite: '#f43f5e',
  Offer: '#22c55e',
  Rejected: '#71717a',
}

function CompanyTargets() {
  const [companies, setCompanies] = useState(() => {
    try { return JSON.parse(localStorage.getItem('devos:companies') || '[]') } catch { return [] }
  })
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ name: '', role: 'SDE II', stage: 'Interested', notes: '' })

  useEffect(() => {
    localStorage.setItem('devos:companies', JSON.stringify(companies))
  }, [companies])

  const add = () => {
    if (!draft.name.trim()) return
    setCompanies((c) => [...c, { ...draft, id: Date.now() }])
    setDraft({ name: '', role: 'SDE II', stage: 'Interested', notes: '' })
    setAdding(false)
  }
  const advance = (id) => setCompanies((cs) => cs.map((c) => {
    if (c.id !== id) return c
    const idx = STAGES.indexOf(c.stage)
    return { ...c, stage: STAGES[Math.min(idx + 1, STAGES.length - 1)] }
  }))
  const setStage = (id, stage) => setCompanies((cs) => cs.map((c) => c.id === id ? { ...c, stage } : c))
  const remove = (id) => setCompanies((cs) => cs.filter((c) => c.id !== id))

  return (
    <section className="card card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-violet" />
          <div className="label">Company targets</div>
        </div>
        {!adding ? (
          <button className="btn !py-1.5 !px-3" onClick={() => setAdding(true)}>
            <Plus size={13} /> Add
          </button>
        ) : (
          <button className="btn !py-1.5 !px-3" onClick={() => setAdding(false)}>Cancel</button>
        )}
      </div>

      {adding && (
        <div className="card !bg-white/[.02] space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <input className="input" placeholder="Company (e.g. Atlassian)"
              value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <input className="input" placeholder="Role"
              value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
          </div>
          <select className="input" value={draft.stage}
            onChange={(e) => setDraft({ ...draft, stage: e.target.value })}>
            {STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input className="input" placeholder="Notes (referral, recruiter, links)"
            value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
          <button className="btn btn-amber w-full" onClick={add}>Save target</button>
        </div>
      )}

      {companies.length === 0 && !adding && (
        <div className="text-sm text-dim py-6 text-center">
          No targets yet. Add companies you want to interview at.
        </div>
      )}

      <ul className="space-y-2">
        {companies.map((c) => (
          <li key={c.id} className="rounded-xl border border-white/8 bg-white/[.03] p-3">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-lg grid place-items-center text-sm font-bold shrink-0"
                style={{ background: STAGE_COLOR[c.stage] + '22', color: STAGE_COLOR[c.stage] }}
              >
                {c.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{c.name}</span>
                  <span className="text-xs text-dim">{c.role}</span>
                </div>
                {c.notes && <p className="text-xs text-dim mt-0.5 truncate">{c.notes}</p>}
                <div className="flex flex-wrap gap-1 mt-2">
                  {STAGES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStage(c.id, s)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border transition ${
                        c.stage === s
                          ? 'text-black'
                          : 'text-dim border-white/8 hover:border-white/25'
                      }`}
                      style={c.stage === s ? { background: STAGE_COLOR[s], borderColor: STAGE_COLOR[s] } : {}}
                    >{s}</button>
                  ))}
                </div>
              </div>
              <button className="text-dim hover:text-red" onClick={() => remove(c.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// MISSION BRIEFING — the headline "so, what should I do today?" box
// ═══════════════════════════════════════════════════════════
function MissionBriefing() {
  const { javaSessions, dsaLogs, logs, activeHabits, settings } = useData()
  const today = todayISO()
  const y = addDays(today, -1)

  const stats = (day) => ({
    java: javaSessions.filter(s => s.session_date === day).reduce((a, s) => a + s.minutes, 0),
    dsa: dsaLogs.filter(l => l.log_date === day).reduce((a, l) => a + l.problems, 0),
    habits: activeHabits.filter(h => logs[h.id]?.[day]?.completed).length,
  })
  const t = stats(today)
  const yStats = stats(y)
  const target = settings.daily_java_minutes
  const totalHabits = activeHabits.length
  const dayNum = Math.min(settings.plan_days, Math.max(1, dayDiff(settings.plan_start_date, today) + 1))
  const daysLeft = Math.max(0, settings.plan_days - dayNum)
  const phase = PHASES.find(p => dayNum >= p.from && dayNum <= p.to)

  // Priorities — smart list based on what's missing today
  const priorities = []
  if (t.java < target) {
    const gap = target - t.java
    priorities.push({
      icon: '☕',
      label: `Log ${Math.floor(gap/60)}h ${gap % 60}m of Java`,
      hint: `Target ${Math.floor(target/60)}h · you're at ${Math.floor(t.java/60)}h ${t.java % 60}m`,
      severity: gap > target * 0.5 ? 'high' : 'med',
    })
  }
  if (t.dsa < 3) {
    priorities.push({
      icon: '🧠',
      label: `Solve ${3 - t.dsa} more DSA problem${3 - t.dsa === 1 ? '' : 's'}`,
      hint: t.dsa ? `${t.dsa} done today, aim for 3` : 'None solved yet today',
      severity: t.dsa === 0 ? 'high' : 'low',
    })
  }
  if (totalHabits > 0 && t.habits < totalHabits) {
    priorities.push({
      icon: '✅',
      label: `${totalHabits - t.habits} habit${totalHabits - t.habits === 1 ? '' : 's'} left`,
      hint: `${t.habits}/${totalHabits} done today`,
      severity: 'low',
    })
  }
  if (!priorities.length) {
    priorities.push({ icon: '🏆', label: 'You crushed it. Rest.', hint: 'All targets met — keep the streak alive tomorrow.', severity: 'good' })
  }

  // Debrief lines — yesterday's honest report
  const debriefLines = []
  const yPerfect = totalHabits > 0 && yStats.habits === totalHabits && yStats.java >= target && yStats.dsa >= 1
  if (yPerfect) debriefLines.push(`⭐ Perfect day. ${yStats.java} min Java, ${yStats.dsa} DSA, all habits.`)
  else if (yStats.java + yStats.dsa + yStats.habits === 0) debriefLines.push(`⚠️ Nothing logged. Don't let today follow suit.`)
  else {
    debriefLines.push(`☕ Java: ${Math.floor(yStats.java/60)}h ${yStats.java%60}m ${yStats.java >= target ? '✓' : `(${Math.floor((target-yStats.java)/60)}h short)`}`)
    debriefLines.push(`🧠 DSA: ${yStats.dsa} solved ${yStats.dsa >= 1 ? '✓' : '✗'}`)
    if (totalHabits > 0) debriefLines.push(`✅ Habits: ${yStats.habits}/${totalHabits}`)
  }

  const dow = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()]

  return (
    <section className="card g-border p-5 lg:p-7 anim-up">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
        <div>
          <div className="label mb-1 flex items-center gap-2">
            <Radio size={11} className="text-mint" />
            <span>Command Center · {dow} · {fmtNice(today)}</span>
          </div>
          <h1 className="font-display font-bold text-3xl lg:text-5xl text-grad leading-tight">
            Mission Briefing
          </h1>
        </div>
        <div className="text-right">
          <div className="label">Day</div>
          <div className="font-mono font-bold text-3xl">{dayNum}<span className="text-dim text-sm"> / {settings.plan_days}</span></div>
          <div className="text-[10px] text-dim">{daysLeft} left · {phase?.name.split('·')[0] || 'Prep'}</div>
        </div>
      </div>

      {/* PRIORITIES — the "here's what to do next" list */}
      <div className="mt-5">
        <div className="label mb-2 flex items-center gap-1.5">
          <Target size={11} className="text-amber" /> Priorities
        </div>
        <ul className="space-y-2">
          {priorities.map((p, i) => (
            <li key={i}
              className={`flex items-start gap-3 rounded-xl p-3 border ${
                p.severity === 'high' ? 'bg-red/10 border-red/30' :
                p.severity === 'med'  ? 'bg-amber/10 border-amber/25' :
                p.severity === 'good' ? 'bg-mint/10 border-mint/30' :
                'bg-white/[.03] border-white/8'
              }`}>
              <span className="text-xl leading-none">{p.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{p.label}</div>
                <div className="text-[11px] text-dim mt-0.5">{p.hint}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* DEBRIEF — yesterday's report */}
      <div className="mt-5 pt-4 border-t border-white/6">
        <div className="label mb-2 flex items-center gap-1.5">
          <History size={11} className="text-violet" /> Yesterday's debrief
        </div>
        <ul className="text-sm text-dim space-y-1">
          {debriefLines.map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// COMMAND PAGE — single column, everything visible, no tabs
// ═══════════════════════════════════════════════════════════
export default function Command() {
  return (
    <div className="space-y-3">
      <MissionBriefing />
      <YesterdayRecap />
      <WeeklyReview />
      <Roadmap />
      <SessionNotes />
      <CompanyTargets />
    </div>
  )
}
