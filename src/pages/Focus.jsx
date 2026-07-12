import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, SkipForward, Coffee, Brain, Zap } from 'lucide-react'
import { useData } from '../DataStore'
import { todayISO } from '../lib/dates'

// ═══════════════════════════════════════════════════════════
// Big animated ring — the shared visual centerpiece
// ═══════════════════════════════════════════════════════════
function BigRing({ pct, running, label, sub, accent = '#60a5fa', pulse = false }) {
  const size = 260
  const stroke = 12
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c * (1 - Math.min(1, Math.max(0, pct)))
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* soft glow behind */}
      <div
        className="absolute inset-4 rounded-full transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${accent}44, transparent 65%)`,
          opacity: running ? 1 : 0.3,
          animation: pulse && running ? 'iconFloat 2.4s ease-in-out infinite' : undefined,
        }}
      />
      <svg width={size} height={size} className="-rotate-90 relative">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={accent} />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset .5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-mono font-bold text-6xl leading-none tracking-tight">
            {label}
          </div>
          {sub && <div className="text-[11px] uppercase tracking-widest text-dim mt-3">{sub}</div>}
        </div>
      </div>
    </div>
  )
}

const fmt = (secs) => {
  const s = Math.max(0, Math.floor(secs))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(r)}` : `${pad(m)}:${pad(r)}`
}

// beep — no audio file needed
function beep(freq = 660, ms = 200) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.value = freq
    gain.gain.value = 0.15
    osc.start()
    setTimeout(() => { osc.stop(); ctx.close() }, ms)
  } catch {}
}

// ═══════════════════════════════════════════════════════════
// POMODORO — 25/5 or 50/10, auto-logs to Java, cycles work→break
// ═══════════════════════════════════════════════════════════
function Pomodoro() {
  const { logJava } = useData()
  const [preset, setPreset] = useState({ work: 25, brk: 5, long: 15, every: 4 })
  const [phase, setPhase] = useState('work') // work | break | longbreak
  const [remaining, setRemaining] = useState(preset.work * 60)
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(0) // finished work cycles today (session)
  const [autoLog, setAutoLog] = useState(true)
  const tick = useRef(null)

  useEffect(() => {
    if (phase === 'work') setRemaining(preset.work * 60)
    else if (phase === 'break') setRemaining(preset.brk * 60)
    else setRemaining(preset.long * 60)
  }, [preset, phase])

  useEffect(() => {
    if (!running) return
    tick.current = setInterval(() => setRemaining((r) => r - 1), 1000)
    return () => clearInterval(tick.current)
  }, [running])

  useEffect(() => {
    if (remaining > 0) return
    setRunning(false)
    beep(phase === 'work' ? 880 : 520, 350)
    if (phase === 'work') {
      const next = completed + 1
      setCompleted(next)
      if (autoLog) logJava(preset.work, `Pomodoro · ${preset.work}m`, todayISO())
      const nextPhase = next % preset.every === 0 ? 'longbreak' : 'break'
      setPhase(nextPhase)
    } else {
      setPhase('work')
    }
  }, [remaining]) // eslint-disable-line

  const totalSec =
    phase === 'work' ? preset.work * 60 : phase === 'break' ? preset.brk * 60 : preset.long * 60
  const pct = 1 - remaining / totalSec

  const accent = phase === 'work' ? '#60a5fa' : phase === 'break' ? '#22c55e' : '#a78bfa'
  const label = phase === 'work' ? 'Focus' : phase === 'break' ? 'Short break' : 'Long break'

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr] items-center">
      <BigRing
        pct={pct}
        running={running}
        label={fmt(remaining)}
        sub={`${label} · ${completed} done`}
        accent={accent}
        pulse
      />
      <div className="space-y-4">
        <div>
          <div className="label mb-2">Preset</div>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Classic', v: { work: 25, brk: 5, long: 15, every: 4 } },
              { name: 'Deep Work', v: { work: 50, brk: 10, long: 20, every: 3 } },
              { name: 'Sprint', v: { work: 15, brk: 3, long: 10, every: 4 } },
              { name: '90-min flow', v: { work: 90, brk: 20, long: 30, every: 2 } },
            ].map((p) => (
              <button
                key={p.name}
                className={`chip ${preset.work === p.v.work ? '!text-amber !border-amber/40' : ''}`}
                onClick={() => { setPreset(p.v); setRunning(false); setPhase('work') }}
              >
                {p.name} · {p.v.work}/{p.v.brk}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className={`btn flex-1 ${running ? '' : 'btn-amber'}`}
            onClick={() => setRunning((r) => !r)}
          >
            {running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start focus</>}
          </button>
          <button className="btn" onClick={() => { setRunning(false); setRemaining(totalSec) }}>
            <RotateCcw size={16} /> Reset
          </button>
          <button
            className="btn"
            onClick={() => {
              setRunning(false)
              const next = phase === 'work' ? (completed + 1) % preset.every === 0 ? 'longbreak' : 'break' : 'work'
              if (phase === 'work') setCompleted((c) => c + 1)
              setPhase(next)
            }}
          >
            <SkipForward size={16} /> Skip
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm text-dim">
          <input
            type="checkbox"
            className="accent-blue-400"
            checked={autoLog}
            onChange={(e) => setAutoLog(e.target.checked)}
          />
          Auto-log completed focus blocks as Java time
        </label>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <Metric icon={<Brain size={14} className="text-amber" />} label="Focused today" value={`${completed * preset.work}m`} />
          <Metric icon={<Coffee size={14} className="text-violet" />} label="Cycle" value={`${(completed % preset.every) + 1}/${preset.every}`} />
          <Metric icon={<Zap size={14} className="text-mint" />} label="Preset" value={`${preset.work}/${preset.brk}`} />
        </div>
      </div>
    </div>
  )
}

function Metric({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[.03] p-3">
      <div className="label flex items-center gap-1">{icon}{label}</div>
      <div className="font-mono font-bold mt-1">{value}</div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// CUSTOM TIMER — any duration, minutes + seconds
// ═══════════════════════════════════════════════════════════
function CustomTimer() {
  const [min, setMin] = useState(10)
  const [sec, setSec] = useState(0)
  const [label, setLabel] = useState('')
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)
  const [total, setTotal] = useState(0)
  const tick = useRef(null)

  useEffect(() => {
    if (!running) return
    tick.current = setInterval(() => setRemaining((r) => r - 1), 1000)
    return () => clearInterval(tick.current)
  }, [running])

  useEffect(() => {
    if (running && remaining <= 0) {
      setRunning(false)
      beep(660, 400)
      setTimeout(() => beep(880, 400), 500)
    }
  }, [remaining, running])

  const start = () => {
    const t = Number(min) * 60 + Number(sec)
    if (t <= 0) return
    setTotal(t); setRemaining(t); setRunning(true)
  }
  const pct = total ? 1 - remaining / total : 0

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr] items-center">
      <BigRing
        pct={pct}
        running={running}
        label={fmt(remaining || Number(min) * 60 + Number(sec))}
        sub={label || 'Custom timer'}
        accent="#f59e0b"
      />
      <div className="space-y-4">
        <div>
          <div className="label mb-2">Duration</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-dim">Minutes</label>
              <input
                type="number" min="0" inputMode="numeric" className="input mt-1 font-mono"
                value={min} onChange={(e) => setMin(e.target.value)} disabled={running}
              />
            </div>
            <div>
              <label className="text-[11px] text-dim">Seconds</label>
              <input
                type="number" min="0" max="59" inputMode="numeric" className="input mt-1 font-mono"
                value={sec} onChange={(e) => setSec(e.target.value)} disabled={running}
              />
            </div>
          </div>
        </div>
        <div>
          <label className="text-[11px] text-dim">Label (optional)</label>
          <input
            className="input mt-1" placeholder="e.g. HashMap deep dive"
            value={label} onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="label w-full">Quick set</div>
          {[1, 3, 5, 10, 15, 20, 30, 45, 60, 90].map((m) => (
            <button
              key={m}
              className="chip"
              onClick={() => { setMin(m); setSec(0) }}
              disabled={running}
            >{m}m</button>
          ))}
        </div>
        <div className="flex gap-2">
          {!running ? (
            <button className="btn btn-amber flex-1" onClick={start}>
              <Play size={16} /> Start
            </button>
          ) : (
            <button className="btn flex-1" onClick={() => setRunning(false)}>
              <Pause size={16} /> Pause
            </button>
          )}
          <button className="btn" onClick={() => { setRunning(false); setRemaining(0); setTotal(0) }}>
            <RotateCcw size={16} /> Clear
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// STOPWATCH — up-count with laps
// ═══════════════════════════════════════════════════════════
function Stopwatch() {
  const [ms, setMs] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const t0 = useRef(0)
  const tick = useRef(null)

  useEffect(() => {
    if (!running) return
    t0.current = Date.now() - ms
    tick.current = setInterval(() => setMs(Date.now() - t0.current), 100)
    return () => clearInterval(tick.current)
  }, [running]) // eslint-disable-line

  const total = ms / 1000
  const cs = Math.floor((ms % 1000) / 10)
  const pad = (n) => String(n).padStart(2, '0')
  const display = `${fmt(total)}.${pad(cs)}`

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr] items-center">
      <BigRing
        pct={(total % 60) / 60}
        running={running}
        label={fmt(total)}
        sub={`.${pad(cs)}`}
        accent="#22c55e"
      />
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            className={`btn flex-1 ${running ? '' : 'btn-amber'}`}
            onClick={() => setRunning((r) => !r)}
          >
            {running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
          </button>
          <button
            className="btn"
            disabled={!running && ms === 0}
            onClick={() => setLaps((l) => [...l, ms])}
          >
            Lap
          </button>
          <button
            className="btn"
            onClick={() => { setRunning(false); setMs(0); setLaps([]) }}
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        {laps.length > 0 && (
          <div className="card !p-0 max-h-72 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface/95 backdrop-blur">
                <tr className="text-left text-xs text-dim">
                  <th className="px-3 py-2 font-medium">Lap</th>
                  <th className="px-3 py-2 font-medium">Split</th>
                  <th className="px-3 py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6 font-mono">
                {laps.map((lap, i) => {
                  const prev = i === 0 ? 0 : laps[i - 1]
                  const split = (lap - prev) / 1000
                  return (
                    <tr key={i}>
                      <td className="px-3 py-2 text-dim">#{i + 1}</td>
                      <td className="px-3 py-2">{fmt(split)}</td>
                      <td className="px-3 py-2 text-amber">{fmt(lap / 1000)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// FOCUS PAGE — three-tab surface
// ═══════════════════════════════════════════════════════════
export default function Focus() {
  const [tab, setTab] = useState('pomodoro')
  const tabs = [
    { id: 'pomodoro', label: 'Pomodoro', icon: Brain },
    { id: 'timer', label: 'Custom Timer', icon: Zap },
    { id: 'stopwatch', label: 'Stopwatch', icon: Coffee },
  ]
  return (
    <div>
      <section className="card g-border p-5 lg:p-6 anim-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="label mb-1">Focus lab</div>
            <h1 className="font-display font-bold text-3xl lg:text-4xl text-grad">Deep Work</h1>
          </div>
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  tab === id ? 'bg-amber text-black' : 'text-dim hover:text-text'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>
        {/* mobile tab pills */}
        <div className="sm:hidden flex gap-2 mb-6 overflow-x-auto -mx-1 px-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`chip whitespace-nowrap ${tab === id ? '!text-amber !border-amber/40' : ''}`}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>

        <div key={tab} className="anim-up">
          {tab === 'pomodoro' && <Pomodoro />}
          {tab === 'timer' && <CustomTimer />}
          {tab === 'stopwatch' && <Stopwatch />}
        </div>
      </section>
    </div>
  )
}
