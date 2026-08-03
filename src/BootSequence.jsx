import { useEffect, useRef, useState } from 'react'
import { todayISO } from './lib/dates'

// DevOS boot sequence — a ~1s fake OS boot that plays on cold load.
// Shows once per local day, is tap-to-skip, and self-disables under
// prefers-reduced-motion (see the gate in App.jsx).

export const BOOT_SEEN_KEY = 'devos:bootShownDate'

const LINES = [
  '> booting DevOS kernel…',
  '> mounting habit modules…',
  '> loading mission clock…',
  '> spinning up XP engine…',
  '> ready.',
]

const LINE_MS = 170 // gap between lines appearing
const HOLD_MS = 300 // pause on the last line before fading
const FADE_MS = 360 // fade-out duration

export default function BootSequence({ onDone }) {
  const [shown, setShown] = useState(0) // how many lines are revealed
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    try {
      localStorage.setItem(BOOT_SEEN_KEY, todayISO())
    } catch {}
    setLeaving(true)
    setTimeout(() => onDone?.(), FADE_MS)
  }

  useEffect(() => {
    const timers = LINES.map((_, i) =>
      setTimeout(() => setShown((s) => Math.max(s, i + 1)), i * LINE_MS)
    )
    const end = setTimeout(finish, LINES.length * LINE_MS + HOLD_MS)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(end)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      onClick={finish}
      role="button"
      aria-label="Skip intro"
      className="fixed inset-0 z-[100] grid place-items-center cursor-pointer select-none"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 0%, #0e1220 0%, #06070c 55%), #05060b',
        opacity: leaving ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
      }}
    >
      <div className="text-center px-6">
        <img
          src="/icon.svg"
          alt=""
          className="w-16 h-16 rounded-2xl glow-amber mx-auto mb-5"
          style={{
            animation:
              'glowPulse 1.6s ease-in-out infinite, pop .5s cubic-bezier(.2,.7,.2,1) both',
          }}
        />
        <div className="font-display font-bold text-3xl text-grad leading-none">DevOS</div>
        <div className="text-[11px] uppercase tracking-[0.28em] text-dim mt-2">
          Mission 240 · booting
        </div>

        <div className="font-mono text-[12px] text-left mt-6 mx-auto w-[240px] space-y-1">
          {LINES.slice(0, shown).map((line, i) => (
            <div
              key={i}
              className="anim-up"
              style={{ color: i === LINES.length - 1 ? '#22C55E' : '#8B94A8' }}
            >
              {line}
              {i === shown - 1 && (
                <span
                  className="ml-1 inline-block animate-pulse"
                  style={{ color: '#4C7BFF' }}
                >
                  ▋
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="text-[10px] text-dim/60 mt-6">tap to skip</div>
      </div>
    </div>
  )
}
