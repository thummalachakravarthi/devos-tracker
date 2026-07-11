import { useMemo, useState } from 'react'
import { Trash2, Pencil } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useData } from '../DataStore'
import { CoffeeCup, Heatmap, CountUp } from '../components/Bits'
import { todayISO, addDays, dayDiff, weekdayShort, fmtShort } from '../lib/dates'
import { PHASES, DSA_MILESTONES, DSA_TOPICS } from '../config/plan'

export default function JavaHQ() {
  const {
    settings,
    updateSettings,
    javaSessions,
    javaMinutesOn,
    logJava,
    removeJava,
    dsaLogs,
    dsaTotal,
    logDsa,
    removeDsa,
  } = useData()

  const today = todayISO()
  const start = settings.plan_start_date
  const planDays = settings.plan_days
  const target = settings.daily_java_minutes

  const dayNum = Math.min(planDays, Math.max(1, dayDiff(start, today) + 1))
  const daysLeft = Math.max(0, planDays - dayNum)
  const planPct = dayNum / planDays

  const todayMin = javaMinutesOn(today)
  const [customMin, setCustomMin] = useState('')
  const [note, setNote] = useState('')
  const [editStart, setEditStart] = useState(false)

  // minutes per date map
  const byDate = useMemo(() => {
    const m = {}
    for (const s of javaSessions) m[s.session_date] = (m[s.session_date] || 0) + s.minutes
    return m
  }, [javaSessions])

  // last 7 days chart
  const weekData = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => {
        const d = addDays(today, i - 6)
        return { day: weekdayShort(d), min: byDate[d] || 0 }
      }),
    [byDate, today]
  )
  const weekTotal = weekData.reduce((a, r) => a + r.min, 0)

  // 240-day heatmap
  const heatDates = useMemo(
    () => Array.from({ length: planDays }).map((_, i) => addDays(start, i)),
    [start, planDays]
  )
  const levelFor = (d) => {
    if (dayDiff(start, d) > dayDiff(start, today)) return -1 // future
    const m = byDate[d] || 0
    if (m === 0) return 0
    if (m >= target) return 4
    if (m >= target * 0.66) return 3
    if (m >= target * 0.33) return 2
    return 1
  }
  const daysHit = heatDates.filter((d) => (byDate[d] || 0) >= target).length
  const totalHours = Math.round(javaSessions.reduce((a, s) => a + s.minutes, 0) / 60)

  const todaySessions = javaSessions.filter((s) => s.session_date === today)

  // DSA
  const nextMilestone = DSA_MILESTONES.find((m) => m.day >= dayNum) || DSA_MILESTONES.at(-1)
  const [dsaProblems, setDsaProblems] = useState('1')
  const [dsaTopic, setDsaTopic] = useState('')
  const [customTopic, setCustomTopic] = useState(false)
  // built-in topics + every topic you've ever logged (so new ones stick around)
  const allTopics = useMemo(() => {
    const set = new Set(DSA_TOPICS)
    for (const l of dsaLogs) if (l.topic) set.add(l.topic)
    return [...set]
  }, [dsaLogs])
  const topicAgg = useMemo(() => {
    const m = {}
    for (const l of dsaLogs) {
      const t = l.topic || 'Other'
      m[t] = (m[t] || 0) + l.problems
    }
    return Object.entries(m).sort((a, b) => b[1] - a[1])
  }, [dsaLogs])
  const maxTopic = topicAgg[0]?.[1] || 1
  const recentDsa = [...dsaLogs].reverse().slice(0, 5)

  const phase = PHASES.find((p) => dayNum >= p.from && dayNum <= p.to)

  return (
    <div className="grid gap-3 lg:grid-cols-2 stagger">
      {/* Mission header */}
      <div className="card card-hover g-border lg:col-span-2 p-6 lg:p-8">
        <div className="flex items-end justify-between">
          <div>
            <div className="label">Mission clock</div>
            <div className="font-mono font-bold text-5xl lg:text-7xl mt-1 text-grad">
              Day <CountUp value={dayNum} />
              <span className="text-2xl lg:text-4xl"> / {planDays}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-mint font-bold text-xl">{daysLeft}</div>
            <div className="text-xs text-dim">days left</div>
          </div>
        </div>
        <div className="progress-track h-2 mt-4">
          <div className="progress-fill bg-amber" style={{ width: `${planPct * 100}%` }} />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-dim">
          <span>
            started {fmtShort(start)}{' '}
            <button className="text-amber inline-flex align-middle ml-1" onClick={() => setEditStart(!editStart)}>
              <Pencil size={12} />
            </button>
          </span>
          <span>{Math.round(planPct * 100)}% through</span>
        </div>
        {editStart && (
          <div className="flex gap-2 mt-3">
            <input
              type="date"
              className="input flex-1"
              defaultValue={start}
              onChange={(e) => e.target.value && updateSettings({ plan_start_date: e.target.value })}
            />
            <button className="btn" onClick={() => setEditStart(false)}>
              Done
            </button>
          </div>
        )}
      </div>

      {/* Today's coffee */}
      <div className="card card-hover flex items-center gap-4">
        <CoffeeCup pct={todayMin / target} size={110} />
        <div className="flex-1">
          <div className="label">Today's Java</div>
          <div className="font-mono font-bold text-2xl mt-1">
            {Math.floor(todayMin / 60)}h {todayMin % 60}m
          </div>
          <div className="text-xs text-dim">
            {todayMin >= target
              ? 'Target hit. Refill? ☕'
              : `${Math.floor((target - todayMin) / 60)}h ${(target - todayMin) % 60}m to go`}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {[30, 60, 90].map((m) => (
              <button
                key={m}
                className="btn btn-amber"
                onClick={() => {
                  logJava(m, note || null, today)
                  setNote('')
                }}
              >
                +{m}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* custom log */}
      <div className="card card-hover space-y-2">
        <div className="label">Log a session</div>
        <div className="flex gap-2">
          <input
            className="input w-24"
            type="number"
            inputMode="numeric"
            placeholder="min"
            value={customMin}
            onChange={(e) => setCustomMin(e.target.value)}
          />
          <input
            className="input flex-1"
            placeholder="what did you study? (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            className="btn btn-amber"
            disabled={!customMin || Number(customMin) <= 0}
            onClick={() => {
              logJava(Number(customMin), note || null, today)
              setCustomMin('')
              setNote('')
            }}
          >
            Log
          </button>
        </div>
        {todaySessions.length > 0 && (
          <ul className="divide-y divide-line">
            {todaySessions.map((s) => (
              <li key={s.id} className="flex items-center gap-2 py-2 text-sm">
                <span className="font-mono text-amber w-14">{s.minutes}m</span>
                <span className="flex-1 text-dim truncate">{s.note || 'Java study'}</span>
                <button className="text-dim hover:text-red" onClick={() => removeJava(s.id)}>
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* weekly chart */}
      <div className="card card-hover">
        <div className="flex items-baseline justify-between">
          <div className="label">This week</div>
          <div className="font-mono text-sm">
            <span className="text-amber font-bold">{(weekTotal / 60).toFixed(1)}h</span>
            <span className="text-dim"> / {((target * 7) / 60).toFixed(0)}h</span>
          </div>
        </div>
        <div className="h-40 mt-2 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData}>
              <XAxis dataKey="day" tick={{ fill: '#98A2B3', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#98A2B3', fontSize: 11 }} axisLine={false} tickLine={false} width={34} />
              <Tooltip
                cursor={{ fill: '#F3F4FA' }}
                contentStyle={{ background: '#FFFFFF', border: '1px solid #E8EAF3', borderRadius: 12, boxShadow: '0 12px 30px -12px rgba(76,66,158,.25)' }}
                labelStyle={{ color: '#151A2D' }}
                formatter={(v) => [`${v} min`, 'Java']}
              />
              <ReferenceLine y={target} stroke="#0EA5E9" strokeDasharray="4 4" />
              <Bar dataKey="min" fill="#0284C7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* consistency heatmap */}
      <div className="card card-hover lg:col-span-2">
        <div className="flex items-baseline justify-between mb-3">
          <div className="label">240-day consistency</div>
          <div className="text-xs text-dim">
            <span className="text-mint font-mono font-bold">{daysHit}</span> days on target ·{' '}
            <span className="text-amber font-mono font-bold">{totalHours}h</span> total
          </div>
        </div>
        <Heatmap dates={heatDates} levelFor={levelFor} />
      </div>

      {/* phases */}
      <div className="card card-hover">
        <div className="label mb-3">Plan phases</div>
        <ul className="space-y-3">
          {PHASES.map((p) => {
            const status = dayNum > p.to ? 'done' : dayNum >= p.from ? 'now' : 'later'
            const prog =
              status === 'done' ? 1 : status === 'later' ? 0 : (dayNum - p.from + 1) / (p.to - p.from + 1)
            return (
              <li key={p.name} className={status === 'later' ? 'opacity-50' : ''}>
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-medium ${status === 'now' ? 'text-amber' : ''}`}>
                    {p.name} {status === 'now' && <span className="chip !text-amber !border-amber/30 ml-1">now</span>}
                  </span>
                  <span className="font-mono text-xs text-dim">
                    d{p.from}–{p.to}
                  </span>
                </div>
                <p className="text-xs text-dim mt-0.5">{p.focus}</p>
                <div className="h-1.5 rounded-full bg-surface2 mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${status === 'done' ? 'bg-mint' : 'bg-amber'}`}
                    style={{ width: `${prog * 100}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
        {phase && <p className="text-xs text-dim mt-3">Edit phases anytime in <span className="font-mono text-text">src/config/plan.js</span></p>}
      </div>

      {/* DSA */}
      <div className="card card-hover space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="label">DSA grind</div>
          <div className="font-mono text-sm">
            <span className="text-violet font-bold"><CountUp value={dsaTotal} /></span>
            <span className="text-dim"> / {nextMilestone.target} by day {nextMilestone.day}</span>
          </div>
        </div>
        <div className="progress-track h-2">
          <div
            className="progress-fill bg-violet"
            style={{ width: `${Math.min(100, (dsaTotal / nextMilestone.target) * 100)}%` }}
          />
        </div>
        <div className="flex gap-2">
          <input
            className="input w-20"
            type="number"
            inputMode="numeric"
            min="1"
            value={dsaProblems}
            onChange={(e) => setDsaProblems(e.target.value)}
          />
          {customTopic ? (
            <input
              className="input flex-1"
              autoFocus
              placeholder="Type new topic name…"
              value={dsaTopic}
              onChange={(e) => setDsaTopic(e.target.value)}
              onBlur={() => !dsaTopic.trim() && setCustomTopic(false)}
            />
          ) : (
            <select
              className="input flex-1"
              value={dsaTopic}
              onChange={(e) => {
                if (e.target.value === '__new__') {
                  setCustomTopic(true)
                  setDsaTopic('')
                } else setDsaTopic(e.target.value)
              }}
            >
              <option value="">Topic…</option>
              {allTopics.map((t) => (
                <option key={t}>{t}</option>
              ))}
              <option value="__new__">＋ Add new topic…</option>
            </select>
          )}
          <button
            className="btn"
            style={{ background: 'linear-gradient(135deg,#7ED957,#2E7D32)', borderColor: 'transparent', color: '#fff', boxShadow: '0 10px 22px -8px rgba(46,125,50,.6)' }}
            disabled={!dsaProblems || Number(dsaProblems) <= 0}
            onClick={() => {
              logDsa(Number(dsaProblems), dsaTopic.trim(), today)
              setDsaProblems('1')
              setCustomTopic(false)
            }}
          >
            Log
          </button>
        </div>

        {topicAgg.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {topicAgg.map(([t, n]) => (
              <div key={t} className="flex items-center gap-2 text-xs">
                <span className="w-28 text-dim truncate">{t}</span>
                <div className="flex-1 h-1.5 rounded-full bg-surface2 overflow-hidden">
                  <div className="h-full bg-violet rounded-full" style={{ width: `${(n / maxTopic) * 100}%` }} />
                </div>
                <span className="font-mono w-6 text-right">{n}</span>
              </div>
            ))}
          </div>
        )}

        {recentDsa.length > 0 && (
          <ul className="divide-y divide-line pt-1">
            {recentDsa.map((l) => (
              <li key={l.id} className="flex items-center gap-2 py-1.5 text-xs">
                <span className="font-mono text-violet w-8">+{l.problems}</span>
                <span className="flex-1 text-dim">{l.topic || 'Mixed'} · {fmtShort(l.log_date)}</span>
                <button className="text-dim hover:text-red" onClick={() => removeDsa(l.id)}>
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
