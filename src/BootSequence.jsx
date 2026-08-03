import { useEffect, useRef, useState } from 'react'

// DevOS launch intro — a ~2.2s counter-driven boot that lifts away to
// reveal the live app. Plays on every cold load. Tap anywhere to skip.
// Self-disables under prefers-reduced-motion (gated in App.jsx, guarded here too).

const STEPS = [
  { at: 0, text: 'initializing…' },
  { at: 22, text: 'mounting habit modules…' },
  { at: 48, text: 'loading mission clock…' },
  { at: 74, text: 'syncing XP engine…' },
  { at: 100, text: 'ready ✓', ok: true },
]

const DURATION = 2200 // counter run time (ms)
const HOLD_MS = 340 // pause on 100% before the lift
const LIFT_MS = 1050 // curtain lift duration (matches CSS transition)

const easeOut = (t) => 1 - Math.pow(1 - t, 2.4) // sprint, then settle

export default function BootSequence({ onDone }) {
  const [pct, setPct] = useState(0)
  const [step, setStep] = useState(0)
  const [lifting, setLifting] = useState(false)
  const rafRef = useRef(null)
  const doneRef = useRef(false)

  const reveal = () => {
    if (doneRef.current) return
    doneRef.current = true
    setLifting(true)
    setTimeout(() => onDone?.(), LIFT_MS + 40)
  }

  const skip = () => {
    if (doneRef.current) return
    cancelAnimationFrame(rafRef.current)
    setPct(100)
    setStep(STEPS.length - 1)
    reveal()
  }

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setPct(100)
      setStep(STEPS.length - 1)
      reveal()
      return
    }
    let start = null
    const tick = (ts) => {
      if (start === null) start = ts
      const t = Math.min(1, (ts - start) / DURATION)
      const p = Math.round(easeOut(t) * 100)
      setPct(p)
      let s = 0
      for (let i = 0; i < STEPS.length; i++) if (p >= STEPS[i].at) s = i
      setStep(s)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else setTimeout(reveal, HOLD_MS)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`devos-boot${lifting ? ' lift' : ''}`}
      onClick={skip}
      role="button"
      aria-label="Skip intro"
    >
      <style>{`
        .devos-boot {
          position: fixed; inset: 0; z-index: 100;
          display: grid; place-items: center; overflow: hidden;
          cursor: pointer; -webkit-user-select: none; user-select: none;
          transition: transform ${LIFT_MS}ms cubic-bezier(.76,0,.24,1);
          background: radial-gradient(120% 90% at 50% 0%, #0e1220 0%, #06070c 55%), #05060b;
        }
        .devos-boot.lift { transform: translateY(-100%); }
        .devos-boot::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px);
          background-size: 54px 54px;
          -webkit-mask-image: radial-gradient(ellipse 100% 65% at 50% 8%, #000, transparent 78%);
                  mask-image: radial-gradient(ellipse 100% 65% at 50% 8%, #000, transparent 78%);
        }
        .devos-boot .bblob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: .5; }
        .devos-boot .bb1 { width: 60vw; height: 60vw; left: -10vw; top: -8vh;
          background: radial-gradient(circle, rgba(76,123,255,.4), transparent 60%); animation: bdrift1 22s ease-in-out infinite; }
        .devos-boot .bb2 { width: 55vw; height: 55vw; right: -12vw; bottom: -10vh;
          background: radial-gradient(circle, rgba(147,88,255,.34), transparent 60%); animation: bdrift2 26s ease-in-out infinite; }
        @keyframes bdrift1 { 0%,100%{transform:translate(-3%,-2%) scale(1)} 50%{transform:translate(5%,4%) scale(1.1)} }
        @keyframes bdrift2 { 0%,100%{transform:translate(3%,3%) scale(1.05)} 50%{transform:translate(-4%,-3%) scale(.96)} }
        .devos-boot .stage { position: relative; text-align: center; padding: 0 24px; }
        .devos-boot .mark { width: 76px; height: 76px; margin: 0 auto 26px;
          animation: bmarkIn .8s cubic-bezier(.2,.8,.2,1) both;
          filter: drop-shadow(0 8px 26px rgba(76,123,255,.5)); }
        @keyframes bmarkIn { 0%{transform:scale(.4) rotate(-8deg);opacity:0} 60%{transform:scale(1.12) rotate(2deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
        .devos-boot .count { font-family:'Space Grotesk',sans-serif; font-weight:700;
          font-size: clamp(72px, 26vw, 132px); line-height:.9; letter-spacing:-.03em;
          font-variant-numeric: tabular-nums;
          background: linear-gradient(180deg,#fff,#9db6ff 70%,#6f7dff);
          -webkit-background-clip:text; background-clip:text; color:transparent; }
        .devos-boot .count sup { font-size:.28em; vertical-align:super; color:#8B94A8;
          -webkit-text-fill-color:#8B94A8; margin-left:4px; }
        .devos-boot .bar { width:min(280px,74vw); height:2px; margin:26px auto 0;
          background:rgba(255,255,255,.1); border-radius:2px; overflow:hidden; }
        .devos-boot .bar > i { display:block; height:100%; background:linear-gradient(90deg,#4C7BFF,#9358FF);
          box-shadow:0 0 12px rgba(76,123,255,.7); transition:width .12s linear; }
        .devos-boot .status { margin-top:18px; font-family:'JetBrains Mono',monospace; font-size:12px;
          letter-spacing:.04em; color:#8B94A8; min-height:16px; }
        .devos-boot .status.ok { color:#22C55E; }
        .devos-boot .wm { margin-top:4px; font-family:'Space Grotesk',sans-serif; font-weight:700;
          letter-spacing:.02em; font-size:15px; color:#E9EEF8; }
        .devos-boot .wm span { display:block; font-size:9px; letter-spacing:.28em; text-transform:uppercase;
          color:#8B94A8; font-weight:500; margin-top:5px; }
        .devos-boot .skip { position:absolute; left:0; right:0;
          bottom: calc(26px + env(safe-area-inset-bottom)); text-align:center;
          font-size:10px; letter-spacing:.1em; color:rgba(139,148,168,.6); text-transform:uppercase; }
        .devos-boot .seam { position:absolute; left:0; right:0; bottom:-2px; height:2px; opacity:0;
          background:linear-gradient(90deg,transparent,#6f9bff,#9358FF,transparent);
          box-shadow:0 0 22px 4px rgba(111,155,255,.55); transition:opacity .3s; }
        .devos-boot.lift .seam { opacity:1; }
        @media (prefers-reduced-motion: reduce) {
          .devos-boot { transition:none; }
          .devos-boot .mark { animation:none; }
        }
      `}</style>

      <span className="bblob bb1" aria-hidden="true" />
      <span className="bblob bb2" aria-hidden="true" />

      <div className="stage">
        <svg className="mark" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="42" height="42" rx="13" fill="url(#bootg)" />
          <path d="M16 18l-6 6 6 6" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 16l-4 16" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
          <defs>
            <linearGradient id="bootg" x1="3" y1="3" x2="45" y2="45">
              <stop stopColor="#4C7BFF" />
              <stop offset="1" stopColor="#9358FF" />
            </linearGradient>
          </defs>
        </svg>

        <div className="count">{pct}<sup>%</sup></div>
        <div className="bar"><i style={{ width: pct + '%' }} /></div>
        <div className={`status${STEPS[step].ok ? ' ok' : ''}`}>{STEPS[step].text}</div>
        <div className="wm">DevOS<span>Mission 240</span></div>
      </div>

      <div className="skip">tap anywhere to skip</div>
      <div className="seam" aria-hidden="true" />
    </div>
  )
}
