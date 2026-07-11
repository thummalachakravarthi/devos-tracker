import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts'
import { useData } from '../DataStore'
import {
  todayISO,
  addDays,
  parseISO,
  localISO,
  daysInMonth,
  monthLabel,
  startOfWeek,
  weekdayShort,
} from '../lib/dates'
import { currentStreak, bestStreak } from '../lib/stats'

function Trend({ now, prev, suffix = '', invert = false }) {
  const up = now > prev
  const down = now < prev
  const good = invert ? down : up
  const Icon = up ? TrendingUp : down ? TrendingDown : Minus
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${up || down ? (good ? 'text-mint' : 'text-red') : 'text-dim'}`}>
      <Icon size={13} />
      {prev}
      {suffix}
    </span>
  )
}

export default function Stats({ setTab }) {
  const { activeHabits, logs, getLog, javaSessions, dsaLogs, settings, setUiDate } = useData()
  const today = todayISO()
  const now = new Date()
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() })

  const nDays = daysInMonth(ym.y, ym.m)
  const monthDates = Array.from({ length: nDays }).map((_, i) => localISO(new Date(ym.y, ym.m, i + 1)))

  // perfect days this month (all active habits completed)
  const perfectDays = monthDates.filter(
    (d) => d <= today && activeHabits.length > 0 && activeHabits.every((h) => getLog(h.id, d)?.completed)
  ).length

  // ---- weekly report card (Mon–Sun) ----
  const weekStart = startOfWeek(today)
  const prevStart = addDays(weekStart, -7)
  const weekStats = (startIso) => {
    const days = Array.from({ length: 7 }).map((_, i) => addDays(startIso, i))
    let done = 0
    let steps = 0
    let water = 0
    let course = 0
    for (const d of days) {
      for (const h of activeHabits) {
        const l = getLog(h.id, d)
        if (l?.completed) done++
        if (h.type === 'steps') steps += l?.value || 0
        if (h.type === 'water') water += l?.value || 0
        if (h.type === 'hours') course += l?.value || 0
      }
    }
    const javaMin = javaSessions
      .filter((s) => days.includes(s.session_date))
      .reduce((a, s) => a + s.minutes, 0)
    const dsa = dsaLogs.filter((l) => days.includes(l.log_date)).reduce((a, l) => a + l.problems, 0)
    const denom = activeHabits.length * 7 || 1
    return {
      pct: Math.round((done / denom) * 100),
      steps,
      waterAvg: +(water / 7).toFixed(1),
      course: +course.toFixed(1),
      javaH: +(javaMin / 60).toFixed(1),
      dsa,
    }
  }
  const cur = useMemo(weekStats.bind(null, weekStart), [logs, javaSessions, dsaLogs, activeHabits])
  const prev = useMemo(weekStats.bind(null, prevStart), [logs, javaSessions, dsaLogs, activeHabits])

  // best / weakest habit this week
  const habitWeek = activeHabits
    .map((h) => ({
      h,
      n: Array.from({ length: 7 }).filter((_, i) => getLog(h.id, addDays(weekStart, i))?.completed).length,
    }))
    .sort((a, b) => b.n - a.n)
  const best = habitWeek[0]
  const weakest = habitWeek.at(-1)

  // steps chart last 7 days
  const stepsHabit = activeHabits.find((h) => h.type === 'steps')
  const stepsData = Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(today, i - 6)
    return { day: weekdayShort(d), steps: stepsHabit ? getLog(stepsHabit.id, d)?.value || 0 : 0 }
  })

  // streak table
  const streaks = activeHabits.map((h) => {
    const doneSet = new Set(
      Object.entries(logs[h.id] || {})
        .filter(([, v]) => v.completed)
        .map(([d]) => d)
    )
    return { h, cur: currentStreak(doneSet, today), best: bestStreak(doneSet) }
  })

  const monthDone = (h) => monthDates.filter((d) => getLog(h.id, d)?.completed).length

  return (
    <div className="grid gap-3 lg:grid-cols-2 stagger">
      {/* weekly report card */}
      <div className="card card-hover lg:col-span-2">
        <div className="label mb-3">This week's report card</div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { k: 'Check-ins', v: `${cur.pct}%`, t: <Trend now={cur.pct} prev={prev.pct} suffix="%" /> },
            { k: 'Java', v: `${cur.javaH}h`, t: <Trend now={cur.javaH} prev={prev.javaH} suffix="h" /> },
            { k: 'DSA', v: cur.dsa, t: <Trend now={cur.dsa} prev={prev.dsa} /> },
            { k: 'Steps', v: cur.steps.toLocaleString('en-IN'), t: <Trend now={cur.steps} prev={prev.steps} /> },
            { k: 'Course', v: `${cur.course}h`, t: <Trend now={cur.course} prev={prev.course} suffix="h" /> },
            { k: 'Water avg', v: `${cur.waterAvg}L`, t: <Trend now={cur.waterAvg} prev={prev.waterAvg} suffix="L" /> },
          ].map(({ k, v, t }) => (
            <div key={k} className="rounded-xl p-3 border border-white/10 bg-white/5">
              <div className="text-[10px] uppercase tracking-wider text-dim">{k}</div>
              <div className="font-mono font-bold text-lg mt-0.5">{v}</div>
              <div className="mt-0.5">{t}</div>
            </div>
          ))}
        </div>
        {best && weakest && best.h.id !== weakest.h.id && (
          <p className="text-xs text-dim mt-3">
            Strongest: <span className="text-mint">{best.h.name}</span> ({best.n}/7) · Needs love:{' '}
            <span className="text-red">{weakest.h.name}</span> ({weakest.n}/7)
          </p>
        )}
        <p className="text-[10px] text-dim mt-1">vs last week (small number)</p>
      </div>

      {/* steps chart */}
      {stepsHabit && (
        <div className="card card-hover">
          <div className="label mb-1">Steps · last 7 days</div>
          <div className="h-36 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepsData}>
                <XAxis dataKey="day" tick={{ fill: '#8E9AAE', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8E9AAE', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  cursor={{ fill: '#1B2231' }}
                  contentStyle={{ background: '#131822', border: '1px solid #26314A', borderRadius: 12 }}
                  labelStyle={{ color: '#E9EEF6' }}
                  formatter={(v) => [v.toLocaleString('en-IN'), 'steps']}
                />
                <ReferenceLine y={Number(stepsHabit.target)} stroke="#43D6B5" strokeDasharray="4 4" />
                <Bar dataKey="steps" fill="#43D6B5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* month navigator */}
      <div className="card card-hover lg:col-span-2">
        <div className="flex items-center justify-between mb-1">
          <button className="btn !p-1.5" onClick={() => setYm(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }))}>
            <ChevronLeft size={16} />
          </button>
          <div className="font-display font-bold">{monthLabel(ym.y, ym.m)}</div>
          <button className="btn !p-1.5" onClick={() => setYm(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }))}>
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="text-center text-xs text-dim mb-4">
          <span className="font-mono text-mint font-bold">{perfectDays}</span> perfect days this month
        </div>

        <div className="space-y-4">
          {activeHabits.map((h) => (
            <div key={h.id}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span>
                  <span className="mr-1.5">{h.icon}</span>
                  {h.name}
                </span>
                <span className="font-mono text-xs text-dim">
                  <span style={{ color: h.color }} className="font-bold">
                    {monthDone(h)}
                  </span>
                  /{h.monthly_goal}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {monthDates.map((d, i) => {
                  const l = getLog(h.id, d)
                  const future = d > today
                  return (
                    <button
                      key={d}
                      title={d}
                      disabled={future}
                      onClick={() => {
                        setUiDate(d)
                        setTab('today')
                      }}
                      className="w-[18px] h-[18px] rounded-[4px] text-[8px] grid place-items-center transition disabled:opacity-30"
                      style={{
                        background: l?.completed ? h.color : '#1B2231',
                        color: l?.completed ? '#000' : '#8E9AAE',
                        border: l?.completed ? 'none' : '1px solid #26314A',
                      }}
                    >
                      {i + 1}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-dim mt-3">Tap any day to open and fix it.</p>
      </div>

      {/* streaks */}
      <div className="card card-hover">
        <div className="label mb-2">Streaks</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-dim">
              <th className="font-medium pb-2">Habit</th>
              <th className="font-medium pb-2 text-right">Current</th>
              <th className="font-medium pb-2 text-right">Best</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {streaks.map(({ h, cur: c, best: b }) => (
              <tr key={h.id}>
                <td className="py-2">
                  <span className="mr-1.5">{h.icon}</span>
                  {h.name}
                </td>
                <td className="py-2 text-right font-mono text-amber">{c > 0 ? `${c}🔥` : '—'}</td>
                <td className="py-2 text-right font-mono text-dim">{b || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
