import { useEffect, useRef, useState } from 'react'
import { Wind, Square, Heart, Moon, PersonStanding, Eye, Sparkles, Play, Pause, RotateCcw, Info } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// Break Space — 7 restorative modes for post-focus recovery.
// 4 breathing techniques + stretch prompt + eye rest + gratitude.
// Meant to sit below the Pomodoro timer on the Focus page.
// ═══════════════════════════════════════════════════════════════

const MODES = [
  {
    id: 'sigh',
    label: 'Quick reset',
    icon: Wind,
    color: '#f59e0b',
    duration: 60,
    type: 'breath',
    fullName: 'Physiological Sigh',
    why: 'Fastest known way to lower stress in real time (Stanford, Huberman Lab). Two short inhales through the nose, then one long slow exhale. Even 1–2 cycles measurably drops heart rate.',
    when: 'You feel spiked — frustrated, anxious, overwhelmed. 30 seconds beats 5 minutes of anything else.',
    // Phases: double-inhale pattern, then long exhale
    phases: [
      { name: 'Breathe in', dur: 1.5, from: 0.3, to: 0.75 },
      { name: 'Top up', dur: 0.7, from: 0.75, to: 1 },
      { name: 'Breathe out slowly', dur: 4, from: 1, to: 0.3 },
      { name: 'Rest', dur: 0.5, from: 0.3, to: 0.3 },
    ],
  },
  {
    id: 'box',
    label: 'Sharpen',
    icon: Square,
    color: '#38bdf8',
    duration: 180,
    type: 'breath',
    fullName: 'Box Breathing (4-4-4-4)',
    why: 'Used by US Navy SEALs and first responders before high-stakes tasks. Equal inhale, hold, exhale, hold. Trains focus and steady nervous-system control.',
    when: 'You have another work block coming and need to sharpen up, not wind down.',
    phases: [
      { name: 'Breathe in', dur: 4, from: 0.3, to: 1 },
      { name: 'Hold', dur: 4, from: 1, to: 1 },
      { name: 'Breathe out', dur: 4, from: 1, to: 0.3 },
      { name: 'Hold', dur: 4, from: 0.3, to: 0.3 },
    ],
  },
  {
    id: 'coherent',
    label: 'Balance',
    icon: Heart,
    color: '#10b981',
    duration: 300,
    type: 'breath',
    fullName: 'Coherent Breathing (5-5)',
    why: 'About 6 breaths per minute. Research (Brown & Gerbarg, Columbia) shows sustained practice improves heart-rate variability and reduces anxiety and depression markers.',
    when: 'Default option. When you\'re not sure which to pick, this one. Gentle, safe, any time.',
    phases: [
      { name: 'Breathe in', dur: 5, from: 0.3, to: 1 },
      { name: 'Breathe out', dur: 5, from: 1, to: 0.3 },
    ],
  },
  {
    id: 'four78',
    label: 'Wind down',
    icon: Moon,
    color: '#a78bfa',
    duration: 240,
    type: 'breath',
    fullName: '4-7-8 Breathing',
    why: 'Popularized by Dr. Andrew Weil, based on pranayama. The long exhale activates the parasympathetic nervous system (rest state). Also used to fall asleep faster.',
    when: 'You feel wired or anxious after a stressful work block. Or at the end of the day.',
    phases: [
      { name: 'Breathe in', dur: 4, from: 0.3, to: 1 },
      { name: 'Hold', dur: 7, from: 1, to: 1 },
      { name: 'Breathe out', dur: 8, from: 1, to: 0.3 },
    ],
  },
  {
    id: 'stretch',
    label: 'Stretch',
    icon: PersonStanding,
    color: '#f97316',
    duration: 180,
    type: 'stretch',
    fullName: 'Desk Stretch Sequence',
    why: 'Long sitting compresses the spine, shortens hip flexors, and stiffens the neck and shoulders. Even 2 minutes of movement restores blood flow and posture.',
    when: 'After any Pomodoro. Especially if you\'ve been hunched over the phone or laptop.',
  },
  {
    id: 'eye',
    label: 'Eye rest',
    icon: Eye,
    color: '#60a5fa',
    duration: 20,
    type: 'eye',
    fullName: '20-20-20 Rule',
    why: 'Recommended by the American Academy of Ophthalmology. Every 20 minutes of screen time, look at something 20 feet away for 20 seconds. Prevents digital eye strain.',
    when: 'You\'ve been staring at code or the phone. Especially if your eyes feel dry or tired.',
  },
  {
    id: 'gratitude',
    label: 'Gratitude',
    icon: Sparkles,
    color: '#fbbf24',
    duration: 90,
    type: 'gratitude',
    fullName: 'One good thing',
    why: 'Research (Emmons, UC Davis) shows regular gratitude practice improves mood, sleep quality, and long-term wellbeing. Written works better than mental notes.',
    when: 'End of the workday, after a hard block, or anytime you\'re stuck in a negative loop.',
  },
]

const STRETCHES = [
  { name: 'Neck rolls', instr: 'Slowly roll your head in a full circle. 3 clockwise, 3 counter-clockwise.', dur: 30 },
  { name: 'Shoulder shrugs', instr: 'Lift shoulders to ears, hold 2s, drop hard. Repeat 8 times.', dur: 30 },
  { name: 'Seated spinal twist', instr: 'Right hand on left knee, twist gently left. Hold 15s. Switch sides.', dur: 30 },
  { name: 'Wrist & finger stretch', instr: 'Extend arm, palm up, pull fingers back with other hand. Hold 15s each side.', dur: 30 },
  { name: 'Stand & reach', instr: 'Stand, interlace fingers overhead, palms up. Reach tall. Hold 20s.', dur: 30 },
  { name: 'Hip flexor stretch', instr: 'Step one foot back into a lunge. Hold 15s. Switch sides.', dur: 30 },
]

// ─── Breathing mode ─────────────────────────────────────────────
function BreathingMode({ mode, running, elapsed, onDone }) {
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [phaseElapsed, setPhaseElapsed] = useState(0)
  const startedAt = useRef(null)

  useEffect(() => {
    if (!running) { startedAt.current = null; return }
    if (!startedAt.current) startedAt.current = Date.now() - phaseElapsed * 1000

    const tick = () => {
      const now = Date.now()
      const total = (now - startedAt.current) / 1000
      let acc = 0
      let idx = 0
      const cycleLen = mode.phases.reduce((s, p) => s + p.dur, 0)
      const cyclePos = total % cycleLen
      for (let i = 0; i < mode.phases.length; i++) {
        if (cyclePos < acc + mode.phases[i].dur) {
          idx = i
          break
        }
        acc += mode.phases[i].dur
      }
      setPhaseIdx(idx)
      setPhaseElapsed(cyclePos - acc)
    }
    const id = setInterval(tick, 60)
    return () => clearInterval(id)
  }, [running, mode])

  useEffect(() => {
    if (elapsed >= mode.duration && running) onDone?.()
  }, [elapsed, mode.duration, running, onDone])

  const phase = mode.phases[phaseIdx]
  const t = Math.min(1, phaseElapsed / phase.dur)
  // ease in-out for smoothness
  const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  const scale = phase.from + (phase.to - phase.from) * eased

  const remaining = Math.max(0, mode.duration - elapsed)
  const rMin = Math.floor(remaining / 60)
  const rSec = Math.floor(remaining % 60)

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative w-56 h-56 grid place-items-center">
        {/* outer glow */}
        <div className="absolute rounded-full transition-all duration-100"
          style={{
            width: `${scale * 100}%`, height: `${scale * 100}%`,
            background: `radial-gradient(circle, ${mode.color}66, ${mode.color}00 70%)`,
            filter: 'blur(20px)',
          }} />
        {/* main breathing circle */}
        <div className="absolute rounded-full border-2 transition-all"
          style={{
            width: `${scale * 90}%`, height: `${scale * 90}%`,
            borderColor: mode.color,
            background: `radial-gradient(circle, ${mode.color}33 0%, ${mode.color}11 60%, transparent 100%)`,
            boxShadow: `0 0 60px ${mode.color}55, inset 0 0 40px ${mode.color}33`,
            transitionDuration: `${(phase.dur * 1000)}ms`,
            transitionTimingFunction: 'ease-in-out',
          }} />
        {/* phase name */}
        <div className="relative text-center z-10">
          <div className="font-display font-bold text-2xl tracking-tight">{phase.name}</div>
          <div className="font-mono text-xs text-dim mt-1">{Math.ceil(phase.dur - phaseElapsed)}s</div>
        </div>
      </div>
      <div className="mt-4 font-mono text-xs text-dim">
        {String(rMin).padStart(2, '0')}:{String(rSec).padStart(2, '0')} remaining
      </div>
    </div>
  )
}

// ─── Stretch mode ───────────────────────────────────────────────
function StretchMode({ mode, running, elapsed, onDone }) {
  const total = STRETCHES.reduce((s, x) => s + x.dur, 0)
  useEffect(() => {
    if (elapsed >= total && running) onDone?.()
  }, [elapsed, total, running, onDone])
  let acc = 0
  let idx = 0
  for (let i = 0; i < STRETCHES.length; i++) {
    if (elapsed < acc + STRETCHES[i].dur) { idx = i; break }
    acc += STRETCHES[i].dur
    idx = i
  }
  const s = STRETCHES[idx]
  const inStretch = elapsed - acc
  const remaining = Math.max(0, s.dur - inStretch)
  return (
    <div className="flex flex-col items-center py-6 px-4 text-center">
      <div className="w-20 h-20 rounded-full grid place-items-center mb-4"
        style={{ background: `${mode.color}22`, border: `1px solid ${mode.color}66` }}>
        <PersonStanding size={40} style={{ color: mode.color }} />
      </div>
      <div className="text-xs uppercase tracking-widest text-dim mb-2">
        Stretch {idx + 1} of {STRETCHES.length}
      </div>
      <div className="font-display font-bold text-2xl mb-2">{s.name}</div>
      <div className="text-sm text-dim max-w-md">{s.instr}</div>
      <div className="mt-4 font-mono text-3xl font-bold" style={{ color: mode.color }}>{Math.ceil(remaining)}s</div>
    </div>
  )
}

// ─── Eye rest mode ──────────────────────────────────────────────
function EyeRestMode({ mode, running, elapsed, onDone }) {
  useEffect(() => {
    if (elapsed >= mode.duration && running) onDone?.()
  }, [elapsed, mode.duration, running, onDone])
  const remaining = Math.max(0, mode.duration - elapsed)
  const done = elapsed >= mode.duration
  return (
    <div className="flex flex-col items-center py-6 px-4 text-center">
      <div className="relative w-40 h-40 mb-4">
        {/* distant landscape SVG — restful visual */}
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <defs>
            <linearGradient id="brSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0c1e3d" />
              <stop offset="1" stopColor="#1e40af" />
            </linearGradient>
            <radialGradient id="brMoon" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#e0f2fe" />
              <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="58" fill="url(#brSky)" />
          <circle cx="80" cy="42" r="10" fill="url(#brMoon)" />
          <circle cx="80" cy="42" r="5" fill="#e0f2fe" />
          <path d="M 0 90 Q 30 70 60 85 T 120 80 L 120 120 L 0 120 Z" fill="#0f172a" />
          <path d="M 0 100 Q 40 85 70 95 T 120 92 L 120 120 L 0 120 Z" fill="#020617" />
          {/* stars */}
          {[[15,20],[30,15],[50,25],[70,18],[95,30],[100,55]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="0.6" fill="#e0f2fe">
              <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      </div>
      <div className="font-display font-bold text-2xl mb-2">Look 20 feet away</div>
      <div className="text-sm text-dim max-w-md">
        Focus on the farthest object you can see. A wall, out a window, a distant point. Let your eyes fully relax.
      </div>
      <div className="mt-4 font-mono text-3xl font-bold" style={{ color: mode.color }}>
        {done ? '✓' : `${Math.ceil(remaining)}s`}
      </div>
    </div>
  )
}

// ─── Gratitude mode ─────────────────────────────────────────────
const PROMPTS = [
  'One thing that went well in the last hour.',
  'One person you\'re grateful for right now.',
  'One thing your past self did that helped you today.',
  'One small win from this work block.',
  'One thing about your body or mind that\'s working well.',
  'One thing you\'re looking forward to today.',
]
function GratitudeMode({ mode, running, elapsed, onDone }) {
  const [text, setText] = useState('')
  const [prompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (elapsed >= mode.duration && running) onDone?.()
  }, [elapsed, mode.duration, running, onDone])

  const save = () => {
    if (!text.trim()) return
    try {
      const key = 'gratitude_log'
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      existing.unshift({ text: text.trim(), prompt, at: new Date().toISOString() })
      localStorage.setItem(key, JSON.stringify(existing.slice(0, 200)))
      setSaved(true)
      setText('')
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      // localStorage might be blocked — fall through
      setSaved(true)
      setText('')
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="flex flex-col items-center py-6 px-4">
      <div className="w-16 h-16 rounded-full grid place-items-center mb-3"
        style={{ background: `${mode.color}22`, border: `1px solid ${mode.color}66` }}>
        <Sparkles size={28} style={{ color: mode.color }} />
      </div>
      <div className="text-xs uppercase tracking-widest text-dim mb-2">Reflect</div>
      <div className="font-display font-bold text-lg mb-3 text-center max-w-md">{prompt}</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write it here…"
        rows={3}
        className="w-full max-w-md rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-amber/60 resize-none"
      />
      <button
        onClick={save}
        disabled={!text.trim()}
        className="mt-3 px-4 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-40"
        style={{ background: mode.color, color: '#000' }}
      >
        {saved ? '✓ Saved' : 'Save entry'}
      </button>
      <div className="mt-3 text-[10px] text-dim">Stored locally on this device. Never leaves your phone.</div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Main Break Space component
// ═══════════════════════════════════════════════════════════════
export default function BreakSpace() {
  const [modeId, setModeId] = useState('coherent')
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const startRef = useRef(null)

  const mode = MODES.find((m) => m.id === modeId) || MODES[0]

  useEffect(() => {
    // reset elapsed when mode changes
    setElapsed(0)
    setRunning(false)
    startRef.current = null
    setShowInfo(false)
  }, [modeId])

  useEffect(() => {
    if (!running) return
    if (!startRef.current) startRef.current = Date.now() - elapsed * 1000
    const id = setInterval(() => {
      const secs = (Date.now() - startRef.current) / 1000
      setElapsed(secs)
    }, 200)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const onDone = () => {
    setRunning(false)
    // gentle chime
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const o = ctx.createOscillator(); const g = ctx.createGain()
      o.frequency.value = 528; o.type = 'sine'
      o.connect(g); g.connect(ctx.destination)
      g.gain.setValueAtTime(0.001, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.05)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
      o.start(); o.stop(ctx.currentTime + 1.3)
    } catch (e) { /* silent */ }
  }

  const reset = () => {
    setRunning(false)
    setElapsed(0)
    startRef.current = null
  }

  const toggle = () => {
    if (!running) {
      startRef.current = Date.now() - elapsed * 1000
    }
    setRunning(!running)
  }

  return (
    <section className="card p-5 lg:p-6 mt-4 anim-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="label mb-0.5">Break space</div>
          <div className="text-xs text-dim">Restore before the next block. Pick what fits how you feel.</div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-1.5 rounded-lg hover:bg-white/5 text-dim hover:text-text transition"
          title="Why this one?"
        >
          <Info size={16} />
        </button>
      </div>

      {/* mode picker — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-2 mb-3">
        {MODES.map((m) => {
          const Icon = m.icon
          const active = m.id === modeId
          return (
            <button
              key={m.id}
              onClick={() => setModeId(m.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition whitespace-nowrap min-w-[70px] ${
                active ? 'bg-white/10' : 'bg-white/3 hover:bg-white/6'
              }`}
              style={{
                borderColor: active ? m.color : 'rgba(255,255,255,0.08)',
                boxShadow: active ? `0 0 12px ${m.color}44` : undefined,
              }}
            >
              <Icon size={16} style={{ color: active ? m.color : '#94a3b8' }} />
              <span className="text-[10px] font-medium" style={{ color: active ? m.color : '#94a3b8' }}>
                {m.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* info panel */}
      {showInfo && (
        <div className="rounded-lg bg-white/5 border border-white/8 p-3 mb-3 text-xs anim-up">
          <div className="font-semibold mb-1" style={{ color: mode.color }}>{mode.fullName}</div>
          <div className="text-dim mb-2"><span className="text-text/80 font-medium">What it does:</span> {mode.why}</div>
          <div className="text-dim"><span className="text-text/80 font-medium">When to use:</span> {mode.when}</div>
        </div>
      )}

      {/* the active mode's UI */}
      <div className="min-h-[280px] flex items-center justify-center rounded-xl bg-white/3 border border-white/6">
        <div className="w-full">
          {mode.type === 'breath' && (
            <BreathingMode mode={mode} running={running} elapsed={elapsed} onDone={onDone} />
          )}
          {mode.type === 'stretch' && (
            <StretchMode mode={mode} running={running} elapsed={elapsed} onDone={onDone} />
          )}
          {mode.type === 'eye' && (
            <EyeRestMode mode={mode} running={running} elapsed={elapsed} onDone={onDone} />
          )}
          {mode.type === 'gratitude' && (
            <GratitudeMode mode={mode} running={running} elapsed={elapsed} onDone={onDone} />
          )}
        </div>
      </div>

      {/* controls — gratitude has its own save flow so we hide start/reset */}
      {mode.type !== 'gratitude' && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={toggle}
            className="flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm transition"
            style={{ background: mode.color, color: '#000' }}
          >
            {running ? <Pause size={14} /> : <Play size={14} />}
            {running ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start'}
          </button>
          <button
            onClick={reset}
            disabled={elapsed === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-dim hover:text-text hover:bg-white/5 transition disabled:opacity-40"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      )}
    </section>
  )
}
