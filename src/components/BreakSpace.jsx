import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Wind, Square, Heart, Moon, Play, Pause, X, Info } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// Break Space — 4 breathing techniques, immersive Oak-style visual.
// Full-screen takeover when active. Big gradient orb + expanding rings.
// ═══════════════════════════════════════════════════════════════

const MODES = [
  {
    id: 'sigh',
    label: 'Quick reset',
    icon: Wind,
    palette: { core: '#f97316', mid: '#dc2626', outer: '#7c2d12', bg1: '#1c0808', bg2: '#450a0a' },
    duration: 60,
    fullName: 'Physiological Sigh',
    subtitle: 'Two short inhales, one long slow exhale',
    why: 'Fastest known way to lower stress in real time (Stanford, Huberman Lab). The double-inhale re-inflates collapsed air sacs; the long exhale drops your heart rate within seconds.',
    when: 'When you feel spiked — frustrated, anxious, overwhelmed. Even 30 seconds works.',
    phases: [
      { name: 'Breathe in', dur: 1.5, from: 0.35, to: 0.75, hint: 'through the nose' },
      { name: 'Top up', dur: 0.7, from: 0.75, to: 1, hint: 'one more short inhale' },
      { name: 'Long exhale', dur: 4, from: 1, to: 0.35, hint: 'through the mouth' },
      { name: 'Rest', dur: 0.5, from: 0.35, to: 0.35, hint: '' },
    ],
  },
  {
    id: 'box',
    label: 'Sharpen',
    icon: Square,
    palette: { core: '#22d3ee', mid: '#0891b2', outer: '#155e75', bg1: '#04141a', bg2: '#083344' },
    duration: 180,
    fullName: 'Box Breathing',
    subtitle: 'Equal 4-second inhale, hold, exhale, hold',
    why: 'Used by US Navy SEALs and first responders before high-stakes tasks. Trains steady nervous-system control and sharpens focus without over-relaxing you.',
    when: 'You have another work block coming and need to lock in.',
    phases: [
      { name: 'Breathe in', dur: 4, from: 0.35, to: 1, hint: '' },
      { name: 'Hold', dur: 4, from: 1, to: 1, hint: 'stay full' },
      { name: 'Breathe out', dur: 4, from: 1, to: 0.35, hint: '' },
      { name: 'Hold', dur: 4, from: 0.35, to: 0.35, hint: 'stay empty' },
    ],
  },
  {
    id: 'coherent',
    label: 'Balance',
    icon: Heart,
    palette: { core: '#34d399', mid: '#10b981', outer: '#065f46', bg1: '#03150e', bg2: '#064e3b' },
    duration: 300,
    fullName: 'Coherent Breathing',
    subtitle: '5 seconds in, 5 seconds out',
    why: 'Around 6 breaths per minute — the pace that maximizes heart-rate variability. Sustained practice (Brown & Gerbarg, Columbia) improves mood and lowers anxiety.',
    when: 'Default choice. When unsure which to pick, pick this.',
    phases: [
      { name: 'Breathe in', dur: 5, from: 0.35, to: 1, hint: '' },
      { name: 'Breathe out', dur: 5, from: 1, to: 0.35, hint: '' },
    ],
  },
  {
    id: 'four78',
    label: 'Wind down',
    icon: Moon,
    palette: { core: '#a78bfa', mid: '#7c3aed', outer: '#4c1d95', bg1: '#0a0416', bg2: '#1e1b4b' },
    duration: 240,
    fullName: '4-7-8 Breathing',
    subtitle: '4 in, hold 7, out 8',
    why: 'Popularized by Dr. Andrew Weil. The long exhale flips you into the parasympathetic (rest) state. Widely used to fall asleep faster.',
    when: 'You feel wired or anxious. End of the day.',
    phases: [
      { name: 'Breathe in', dur: 4, from: 0.35, to: 1, hint: 'through the nose' },
      { name: 'Hold', dur: 7, from: 1, to: 1, hint: 'stay still' },
      { name: 'Breathe out', dur: 8, from: 1, to: 0.35, hint: 'through the mouth, slow' },
    ],
  },
]

const fmt = (secs) => {
  const s = Math.max(0, Math.floor(secs))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

// ═══════════════════════════════════════════════════════════════
// Immersive full-screen breathing session (renders as overlay)
// ═══════════════════════════════════════════════════════════════
function BreathingSession({ mode, onClose }) {
  const [running, setRunning] = useState(true)
  const [elapsed, setElapsed] = useState(0)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [phaseElapsed, setPhaseElapsed] = useState(0)
  const [showWhy, setShowWhy] = useState(false)
  const startRef = useRef(Date.now())
  const pausedAtRef = useRef(0)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setElapsed((Date.now() - startRef.current) / 1000 - pausedAtRef.current)
    }, 150)
    return () => clearInterval(id)
  }, [running])

  useEffect(() => {
    if (!running) return
    const cycleLen = mode.phases.reduce((s, p) => s + p.dur, 0)
    const id = setInterval(() => {
      const total = (Date.now() - startRef.current) / 1000 - pausedAtRef.current
      const cyclePos = total % cycleLen
      let acc = 0, idx = 0
      for (let i = 0; i < mode.phases.length; i++) {
        if (cyclePos < acc + mode.phases[i].dur) { idx = i; break }
        acc += mode.phases[i].dur
      }
      setPhaseIdx(idx)
      setPhaseElapsed(cyclePos - acc)
    }, 60)
    return () => clearInterval(id)
  }, [running, mode])

  useEffect(() => {
    if (elapsed >= mode.duration && running) {
      setRunning(false)
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const o = ctx.createOscillator(), g = ctx.createGain()
        o.frequency.value = 528; o.type = 'sine'
        o.connect(g); g.connect(ctx.destination)
        g.gain.setValueAtTime(0.001, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.08)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
        o.start(); o.stop(ctx.currentTime + 1.6)
      } catch (e) { /* silent */ }
    }
  }, [elapsed, mode.duration, running])

  const togglePlay = () => {
    if (running) {
      pausedAtRef.current += (Date.now() - startRef.current) / 1000 - elapsed
      setRunning(false)
    } else {
      startRef.current = Date.now()
      pausedAtRef.current = -elapsed
      setRunning(true)
    }
  }

  const phase = mode.phases[phaseIdx]
  const t = Math.min(1, phaseElapsed / phase.dur)
  const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  const scale = phase.from + (phase.to - phase.from) * eased
  const p = mode.palette
  const remaining = Math.max(0, mode.duration - elapsed)
  const isDone = remaining <= 0

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: `radial-gradient(ellipse at center, ${p.bg2} 0%, ${p.bg1} 55%, #000 100%)` }}>

      {/* ambient depth blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full opacity-40"
          style={{
            width: '60%', height: '60%', top: '-15%', left: '-15%',
            background: `radial-gradient(circle, ${p.mid}66, transparent 65%)`,
            filter: 'blur(60px)',
            animation: 'blobDrift1 30s ease-in-out infinite',
          }} />
        <div className="absolute rounded-full opacity-35"
          style={{
            width: '70%', height: '70%', bottom: '-20%', right: '-20%',
            background: `radial-gradient(circle, ${p.outer}88, transparent 65%)`,
            filter: 'blur(70px)',
            animation: 'blobDrift2 40s ease-in-out infinite',
          }} />
        <div className="absolute rounded-full opacity-25"
          style={{
            width: '50%', height: '50%', top: '40%', right: '10%',
            background: `radial-gradient(circle, ${p.core}66, transparent 65%)`,
            filter: 'blur(80px)',
            animation: 'blobDrift3 45s ease-in-out infinite',
          }} />
      </div>

      {/* drifting particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: '2px', height: '2px',
              left: `${(i * 47) % 100}%`,
              top: `${(i * 31) % 100}%`,
              background: p.core,
              opacity: 0.4,
              boxShadow: `0 0 6px ${p.core}`,
              animation: `particleFloat ${18 + (i % 5) * 3}s linear ${i * 0.4}s infinite`,
            }} />
        ))}
      </div>

      {/* top bar */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between z-10"
        style={{
          paddingTop: 'max(1.25rem, env(safe-area-inset-top))',
          paddingLeft: 'max(1.25rem, env(safe-area-inset-left))',
          paddingRight: 'max(1.25rem, env(safe-area-inset-right))',
          paddingBottom: '0.75rem',
        }}>
        <button
          onClick={onClose}
          className="w-14 h-14 rounded-full grid place-items-center bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 shadow-lg transition active:scale-95"
          aria-label="Close breathing session"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
        >
          <X size={26} strokeWidth={2.5} className="text-white" />
        </button>
        <div className="text-center flex-1 px-3">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/60">{mode.fullName}</div>
          <div className="text-xs text-white/70 mt-1">{mode.subtitle}</div>
        </div>
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="w-14 h-14 rounded-full grid place-items-center bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 shadow-lg transition active:scale-95"
          aria-label="Info about this technique"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
        >
          <Info size={22} strokeWidth={2.2} className="text-white" />
        </button>
      </div>

      {showWhy && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 max-w-md w-[calc(100%-3rem)] p-4 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 z-10 anim-up">
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: p.core }}>Why this technique</div>
          <div className="text-sm text-white/90 mb-3 leading-relaxed">{mode.why}</div>
          <div className="text-xs uppercase tracking-widest mb-1 text-white/50">When to use</div>
          <div className="text-sm text-white/80 leading-relaxed">{mode.when}</div>
        </div>
      )}

      {/* the orb */}
      <div className="relative flex items-center justify-center" style={{ width: 'min(80vw, 460px)', height: 'min(80vw, 460px)' }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="absolute rounded-full border"
            style={{
              width: `${scale * (100 + i * 12)}%`,
              height: `${scale * (100 + i * 12)}%`,
              borderColor: `${p.core}${['33', '22', '11'][i]}`,
              transition: `all ${phase.dur * 1000}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }} />
        ))}

        <div className="absolute rounded-full"
          style={{
            width: `${scale * 130}%`, height: `${scale * 130}%`,
            background: `radial-gradient(circle, ${p.core}44 0%, ${p.mid}22 30%, transparent 65%)`,
            filter: 'blur(30px)',
            transition: `all ${phase.dur * 1000}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }} />

        <div className="absolute rounded-full"
          style={{
            width: `${scale * 85}%`, height: `${scale * 85}%`,
            background: `radial-gradient(circle at 35% 30%, ${p.core}ee 0%, ${p.mid}dd 40%, ${p.outer}bb 75%, ${p.outer}00 100%)`,
            boxShadow: `0 0 80px ${p.core}66, inset 0 0 60px ${p.mid}55`,
            transition: `all ${phase.dur * 1000}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }} />

        <div className="absolute rounded-full pointer-events-none"
          style={{
            width: `${scale * 30}%`, height: `${scale * 30}%`,
            top: `${25 + (1 - scale) * 5}%`, left: `${25 + (1 - scale) * 5}%`,
            background: `radial-gradient(circle, #ffffff88 0%, transparent 70%)`,
            filter: 'blur(15px)',
            transition: `all ${phase.dur * 1000}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }} />

        <div className="relative z-10 text-center pointer-events-none">
          <div key={phase.name + phaseIdx} className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight bs-fade">
            {isDone ? 'Well done' : phase.name}
          </div>
          {!isDone && phase.hint && (
            <div className="text-xs sm:text-sm text-white/60 mt-2 max-w-[220px] mx-auto">{phase.hint}</div>
          )}
        </div>
      </div>

      {/* bottom */}
      <div className="absolute bottom-0 inset-x-0 flex flex-col items-center pb-10 pt-6 z-10">
        <div className="font-mono text-sm text-white/70 mb-4 tracking-widest">
          {isDone ? 'Session complete' : fmt(remaining)}
        </div>
        {isDone ? (
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full font-semibold text-sm transition backdrop-blur-sm"
            style={{ background: p.core, color: '#000' }}
          >
            Done
          </button>
        ) : (
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full grid place-items-center backdrop-blur-md border border-white/20 hover:scale-105 transition-all"
            style={{ background: `${p.core}22` }}
            aria-label={running ? 'Pause' : 'Play'}
          >
            {running
              ? <Pause size={22} className="text-white" />
              : <Play size={22} className="text-white translate-x-0.5" />}
          </button>
        )}
      </div>

      <style>{`
        @keyframes blobDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(20%, 15%) scale(1.15); }
          66%      { transform: translate(-10%, 25%) scale(0.9); }
        }
        @keyframes blobDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%      { transform: translate(-25%, -15%) scale(1.2); }
          75%      { transform: translate(10%, -20%) scale(0.85); }
        }
        @keyframes blobDrift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(-30%, 20%) scale(1.3); }
        }
        @keyframes particleFloat {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
        }
        @keyframes bs-fade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bs-fade { animation: bs-fade 0.4s ease-out; }
      `}</style>
    </div>,
    document.body,
  )
}

// ═══════════════════════════════════════════════════════════════
// Mode picker card
// ═══════════════════════════════════════════════════════════════
export default function BreakSpace() {
  const [activeMode, setActiveMode] = useState(null)

  return (
    <>
      <section className="card p-5 lg:p-6 mt-4 anim-up">
        <div className="mb-4">
          <div className="label mb-0.5">Break space</div>
          <div className="text-xs text-dim">Restore before the next block. Tap a technique to begin.</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MODES.map((m) => {
            const Icon = m.icon
            return (
              <button
                key={m.id}
                onClick={() => setActiveMode(m)}
                className="group relative overflow-hidden rounded-2xl p-4 border transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
                style={{
                  background: `linear-gradient(135deg, ${m.palette.bg2} 0%, ${m.palette.bg1} 100%)`,
                  borderColor: `${m.palette.mid}55`,
                }}
              >
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${m.palette.core}88, transparent 65%)`,
                    filter: 'blur(15px)',
                  }} />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl grid place-items-center mb-3"
                    style={{ background: `${m.palette.core}22`, border: `1px solid ${m.palette.core}55` }}>
                    <Icon size={18} style={{ color: m.palette.core }} />
                  </div>
                  <div className="font-semibold text-sm text-white mb-1">{m.label}</div>
                  <div className="text-[11px] text-white/50 leading-tight">{m.subtitle}</div>
                  <div className="text-[10px] font-mono mt-2" style={{ color: m.palette.core }}>
                    {Math.round(m.duration / 60)} min
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {activeMode && (
        <BreathingSession mode={activeMode} onClose={() => setActiveMode(null)} />
      )}
    </>
  )
}
