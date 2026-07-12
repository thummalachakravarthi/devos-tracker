import { useMemo, useState, useRef } from 'react'
import { TrendingUp, TrendingDown, Minus, Trophy, Flame, Zap } from 'lucide-react'
import Stats from './Stats'
import { useData } from '../DataStore'
import { todayISO, addDays, dayDiff, fmtShort, fmtNice, parseISO } from '../lib/dates'

// ─── metrics ────────────────────────────────────────────────
const METRICS = {
  java:   { label: 'Java minutes',    accent: '#f59e0b', unit: 'm',  target: (s) => s.daily_java_minutes },
  dsa:    { label: 'DSA problems',    accent: '#a78bfa', unit: '',   target: () => 3 },
  habits: { label: 'Habit check-ins', accent: '#22c55e', unit: '',   target: (s, n) => n || 0 },
  xp:     { label: 'XP earned',       accent: '#60a5fa', unit: '',   target: () => 300 },
}
const RANGES = [
  { id: 7,  label: '7D' },
  { id: 14, label: '14D' },
  { id: 30, label: '30D' },
  { id: 60, label: '60D' },
  { id: 90, label: '90D' },
]

export default function Insights() {
  const { javaSessions, dsaLogs, logs, activeHabits, settings } = useData()
  const [metric, setMetric] = useState('java')
  const [range, setRange] = useState(30)
  const [hoverIdx, setHoverIdx] = useState(null)
  const svgRef = useRef(null)

  const today = todayISO()

  // ── 1. build per-day value series over the selected range ──
  const series = useMemo(() => {
    const out = []
    for (let i = range - 1; i >= 0; i--) {
      const d = addDays(today, -i)
      let v = 0
      if (metric === 'java') {
        v = javaSessions.filter(s => s.session_date === d).reduce((a, s) => a + s.minutes, 0)
      } else if (metric === 'dsa') {
        v = dsaLogs.filter(l => l.log_date === d).reduce((a, l) => a + l.problems, 0)
      } else if (metric === 'habits') {
        v = activeHabits.filter(h => logs[h.id]?.[d]?.completed).length
      } else if (metric === 'xp') {
        const jv = javaSessions.filter(s => s.session_date === d).reduce((a, s) => a + s.minutes, 0)
        const dv = dsaLogs.filter(l => l.log_date === d).reduce((a, l) => a + l.problems * 20, 0)
        const hv = activeHabits.filter(h => logs[h.id]?.[d]?.completed).length * 5
        v = jv + dv + hv
      }
      out.push({ date: d, value: v })
    }
    return out
  }, [metric, range, javaSessions, dsaLogs, logs, activeHabits, today])

  // ── 2. moving average ──
  const window = Math.min(7, range)
  const withMA = useMemo(() => {
    return series.map((p, i) => {
      const start = Math.max(0, i - window + 1)
      const slice = series.slice(start, i + 1).map(x => x.value)
      const ma = slice.reduce((a, b) => a + b, 0) / slice.length
      return { ...p, ma }
    })
  }, [series, window])

  // ── 3. stats ──
  const cur = withMA[withMA.length - 1]?.value ?? 0
  const prev = withMA[withMA.length - 2]?.value ?? 0
  const total = withMA.reduce((a, p) => a + p.value, 0)
  const avg = withMA.length ? total / withMA.length : 0
  const values = withMA.map(p => p.value)
  const peak = Math.max(0, ...values)
  const peakIdx = values.indexOf(peak)
  const daysActive = values.filter(v => v > 0).length
  const targetVal = METRICS[metric].target(settings, activeHabits.length)

  // consistency score: % of days at or above target
  const consistency = withMA.length
    ? Math.round((values.filter(v => v >= targetVal).length / withMA.length) * 100)
    : 0

  // momentum: last 7d avg vs previous 7d avg
  const last7 = values.slice(-7)
  const prev7 = values.slice(-14, -7)
  const last7Avg = last7.length ? last7.reduce((a, b) => a + b, 0) / last7.length : 0
  const prev7Avg = prev7.length ? prev7.reduce((a, b) => a + b, 0) / prev7.length : 0
  const momentum = prev7Avg > 0 ? Math.round(((last7Avg - prev7Avg) / prev7Avg) * 100) : 0

  // best/worst weekday
  const byDow = [0, 0, 0, 0, 0, 0, 0]
  const cntDow = [0, 0, 0, 0, 0, 0, 0]
  for (const p of withMA) {
    const dow = parseISO(p.date).getDay()
    byDow[dow] += p.value
    cntDow[dow] += 1
  }
  const dowAvg = byDow.map((sum, i) => cntDow[i] ? sum / cntDow[i] : 0)
  const dowNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const bestDow = dowAvg.indexOf(Math.max(...dowAvg))
  const worstDow = dowAvg.indexOf(Math.min(...dowAvg.filter((_, i) => cntDow[i] > 0)))

  // ── 4. chart geometry ──
  const W = 900
  const H = 340
  const padL = 42, padR = 20, padT = 18, padB = 30
  const chartW = W - padL - padR
  const chartH = H - padT - padB
  const yMax = Math.max(peak, targetVal, 10) * 1.15
  const yToPx = (v) => padT + chartH - (v / yMax) * chartH
  const xToPx = (i) => padL + (i / Math.max(1, withMA.length - 1)) * chartW
  const barW = Math.max(2, (chartW / withMA.length) * 0.65)

  // ma path
  const maPath = withMA.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xToPx(i)} ${yToPx(p.ma)}`).join(' ')

  // y-axis ticks
  const nTicks = 4
  const ticks = Array.from({ length: nTicks + 1 }).map((_, k) => Math.round(yMax * (k / nTicks)))

  // hover handler
  function onMove(e) {
    const svg = svgRef.current
    if (!svg) return
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const loc = pt.matrixTransform(svg.getScreenCTM().inverse())
    const x = loc.x - padL
    const i = Math.round((x / chartW) * (withMA.length - 1))
    if (i >= 0 && i < withMA.length) setHoverIdx(i)
  }

  const hoverPoint = hoverIdx != null ? withMA[hoverIdx] : null

  // insight callout — dynamic based on metric
  const insight = (() => {
    if (withMA.length < 2) return null
    if (values.every(v => v === 0))
      return { tone: 'warn', text: `Zero ${METRICS[metric].label.toLowerCase()} in the last ${range} days. Log something today and this chart lights up.` }
    if (momentum > 15)
      return { tone: 'good', text: `Momentum: last 7 days averaging ${last7Avg.toFixed(0)}${METRICS[metric].unit} vs ${prev7Avg.toFixed(0)}${METRICS[metric].unit} previously (+${momentum}%). Keep pushing.` }
    if (momentum < -15)
      return { tone: 'warn', text: `Momentum dropping ${momentum}% vs last week. Small course correction today saves a lot of catch-up later.` }
    if (consistency >= 80)
      return { tone: 'good', text: `You hit target on ${consistency}% of days. This is elite consistency.` }
    if (consistency < 30 && targetVal > 0)
      return { tone: 'warn', text: `Only ${consistency}% of days hit target. Cut the target lower or grind harder — pick one.` }
    if (bestDow !== worstDow && dowAvg[bestDow] > 0)
      return { tone: 'info', text: `Best day: ${dowNames[bestDow]} (${dowAvg[bestDow].toFixed(0)}${METRICS[metric].unit} avg). Weakest: ${dowNames[worstDow]} (${dowAvg[worstDow].toFixed(0)}${METRICS[metric].unit}). Move commitments accordingly.` }
    return { tone: 'info', text: `Averaging ${avg.toFixed(0)}${METRICS[metric].unit} per day over ${range} days. Peak was ${peak.toFixed(0)}${METRICS[metric].unit} on ${fmtShort(withMA[peakIdx].date)}.` }
  })()

  const M = METRICS[metric]

  return (
    <div>
      {/* ── HEADER ── */}
      <section className="card g-border p-5 lg:p-6 anim-up">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="label mb-1">Insights terminal</div>
            <h1 className="font-display font-bold text-3xl lg:text-4xl text-grad">Analyst Desk</h1>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
            {Object.entries(METRICS).map(([id, m]) => (
              <button key={id}
                onClick={() => setMetric(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  metric === id ? 'bg-amber text-black' : 'text-dim hover:text-text'
                }`}>
                {m.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* headline number */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <KPI label="Today" value={cur} unit={M.unit} accent={M.accent}
               sub={<Delta v={cur - prev} unit={M.unit} vs="yesterday" />} />
          <KPI label={`${range}D total`} value={total} unit={M.unit} accent="#60a5fa"
               sub={<span className="text-dim">avg {avg.toFixed(0)}{M.unit}/day</span>} />
          <KPI label="Peak" value={peak} unit={M.unit} accent="#a78bfa"
               sub={peak > 0 ? <span className="text-dim">{fmtShort(withMA[peakIdx].date)}</span> : <span className="text-dim">—</span>} />
          <KPI label="Consistency" value={consistency} unit="%" accent="#22c55e"
               sub={<span className="text-dim">days ≥ target</span>} />
        </div>
      </section>

      {/* ── CHART ── */}
      <section className="card card-hover mt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: M.accent }} />
            <span className="text-sm font-medium">{M.label}</span>
            <span className="chip"><span className="w-3 h-[2px] bg-white/60 mr-1" />7D avg</span>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
            {RANGES.map(r => (
              <button key={r.id}
                onClick={() => { setRange(r.id); setHoverIdx(null) }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  range === r.id ? 'bg-white/12 text-text' : 'text-dim hover:text-text'
                }`}>{r.label}</button>
            ))}
          </div>
        </div>

        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto touch-none"
            onMouseMove={onMove}
            onMouseLeave={() => setHoverIdx(null)}
          >
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={M.accent} stopOpacity="1" />
                <stop offset="1" stopColor={M.accent} stopOpacity="0.35" />
              </linearGradient>
              <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fef3c7" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* gridlines + y labels */}
            {ticks.map((t, i) => (
              <g key={i}>
                <line
                  x1={padL} x2={W - padR}
                  y1={yToPx(t)} y2={yToPx(t)}
                  stroke="rgba(255,255,255,0.05)"
                />
                <text x={padL - 8} y={yToPx(t) + 3} textAnchor="end"
                  fill="#7c88a8" fontSize="10" fontFamily="JetBrains Mono, monospace">{t}</text>
              </g>
            ))}

            {/* target line */}
            {targetVal > 0 && targetVal <= yMax && (
              <g>
                <line x1={padL} x2={W - padR}
                  y1={yToPx(targetVal)} y2={yToPx(targetVal)}
                  stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
                <text x={W - padR - 4} y={yToPx(targetVal) - 4} textAnchor="end"
                  fill="#22c55e" fontSize="10" fontFamily="JetBrains Mono, monospace">
                  target {targetVal}{M.unit}
                </text>
              </g>
            )}

            {/* bars */}
            {withMA.map((p, i) => {
              const x = xToPx(i) - barW / 2
              const y = yToPx(p.value)
              const h = padT + chartH - y
              const isPeak = i === peakIdx && p.value > 0
              const isToday = i === withMA.length - 1
              return (
                <g key={p.date}>
                  <rect
                    x={x} y={y}
                    width={barW}
                    height={Math.max(0, h)}
                    rx={2}
                    fill={isPeak ? 'url(#peakGrad)' : 'url(#barGrad)'}
                    opacity={hoverIdx == null || hoverIdx === i ? 1 : 0.4}
                    style={{ transition: 'opacity .15s ease' }}
                  />
                  {isToday && (
                    <rect x={x} y={y - 3} width={barW} height="2" fill="#ffffff" rx="1" />
                  )}
                </g>
              )
            })}

            {/* moving-average line */}
            <path d={maPath} fill="none" stroke="#ffffff" strokeOpacity="0.75"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* hover crosshair */}
            {hoverPoint && (
              <g>
                <line
                  x1={xToPx(hoverIdx)} x2={xToPx(hoverIdx)}
                  y1={padT} y2={padT + chartH}
                  stroke="rgba(255,255,255,0.25)" strokeDasharray="3 3"
                />
                <circle cx={xToPx(hoverIdx)} cy={yToPx(hoverPoint.value)} r="4"
                  fill={M.accent} stroke="#fff" strokeWidth="2" />
              </g>
            )}

            {/* x labels — sparse */}
            {withMA.map((p, i) => {
              const step = Math.ceil(withMA.length / 6)
              if (i % step !== 0 && i !== withMA.length - 1) return null
              return (
                <text key={p.date}
                  x={xToPx(i)} y={H - 8}
                  textAnchor="middle"
                  fill="#7c88a8" fontSize="10" fontFamily="JetBrains Mono, monospace">
                  {fmtShort(p.date)}
                </text>
              )
            })}
          </svg>

          {/* hover readout */}
          {hoverPoint && (
            <div
              className="absolute pointer-events-none rounded-lg bg-black/85 border border-white/12 px-3 py-2 text-xs shadow-lg"
              style={{
                left: `${(xToPx(hoverIdx) / W) * 100}%`,
                top: '10px',
                transform: 'translateX(-50%)',
              }}
            >
              <div className="text-dim text-[10px]">{fmtNice(hoverPoint.date)}</div>
              <div className="font-mono font-bold" style={{ color: M.accent }}>
                {hoverPoint.value}{M.unit}
              </div>
              <div className="text-dim text-[10px]">7D avg {hoverPoint.ma.toFixed(1)}{M.unit}</div>
            </div>
          )}
        </div>

        {/* insight callout */}
        {insight && (
          <div className={`mt-4 flex items-start gap-2.5 rounded-xl border p-3 text-sm ${
            insight.tone === 'good' ? 'border-mint/40 bg-mint/10' :
            insight.tone === 'warn' ? 'border-red/40 bg-red/10' :
            'border-white/10 bg-white/5'
          }`}>
            {insight.tone === 'good' ? <TrendingUp size={16} className="text-mint mt-0.5 shrink-0" /> :
             insight.tone === 'warn' ? <TrendingDown size={16} className="text-red mt-0.5 shrink-0" /> :
             <Zap size={16} className="text-amber mt-0.5 shrink-0" />}
            <span className="leading-snug">{insight.text}</span>
          </div>
        )}
      </section>

      {/* ── SECONDARY STATS ── */}
      <div className="grid gap-3 md:grid-cols-3 mt-3 stagger">
        <StatCard
          icon={<Flame size={14} className="text-amber" />}
          label="Momentum · 7d vs prior 7d"
          value={`${momentum > 0 ? '+' : ''}${momentum}%`}
          hint={`${last7Avg.toFixed(0)}${M.unit}/day now, ${prev7Avg.toFixed(0)}${M.unit} then`}
          good={momentum > 0}
          bad={momentum < 0}
        />
        <StatCard
          icon={<Trophy size={14} className="text-mint" />}
          label="Best weekday"
          value={dowAvg[bestDow] > 0 ? dowNames[bestDow] : '—'}
          hint={dowAvg[bestDow] > 0 ? `${dowAvg[bestDow].toFixed(1)}${M.unit} avg` : 'log more data'}
        />
        <StatCard
          icon={<Minus size={14} className="text-red" />}
          label="Weakest weekday"
          value={dowAvg[worstDow] > 0 || cntDow[worstDow] > 0 ? dowNames[worstDow] : '—'}
          hint={cntDow[worstDow] ? `${dowAvg[worstDow].toFixed(1)}${M.unit} avg` : 'log more data'}
        />
      </div>

      {/* ── Weekly report card + monthly heatmap + streaks (from the old Stats tab) ── */}
      <div className="mt-6 pt-6 border-t border-white/8">
        <div className="label mb-3">Deep dive</div>
        <Stats />
      </div>
    </div>
  )
}

// ─── little helpers ─────────────────────────────────────────
function KPI({ label, value, unit, accent, sub }) {
  return (
    <div className="rounded-xl p-3 border border-white/8 bg-white/[.03]">
      <div className="label">{label}</div>
      <div className="font-mono font-bold text-2xl mt-1" style={{ color: accent }}>
        {value}<span className="text-sm ml-0.5" style={{ color: accent, opacity: 0.7 }}>{unit}</span>
      </div>
      <div className="text-[10px] mt-0.5">{sub}</div>
    </div>
  )
}
function Delta({ v, unit, vs }) {
  const Icon = v > 0 ? TrendingUp : v < 0 ? TrendingDown : Minus
  return (
    <span className={`inline-flex items-center gap-1 ${v > 0 ? 'text-mint' : v < 0 ? 'text-red' : 'text-dim'}`}>
      <Icon size={11} />
      {v > 0 ? '+' : ''}{v}{unit} vs {vs}
    </span>
  )
}
function StatCard({ icon, label, value, hint, good, bad }) {
  return (
    <div className={`card card-hover ${good ? '!border-mint/40' : bad ? '!border-red/40' : ''}`}>
      <div className="label flex items-center gap-1.5">{icon}{label}</div>
      <div className="font-mono font-bold text-2xl mt-1">{value}</div>
      <div className="text-xs text-dim mt-0.5">{hint}</div>
    </div>
  )
}
