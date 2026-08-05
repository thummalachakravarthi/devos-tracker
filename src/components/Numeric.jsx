import { useEffect, useRef, useState } from 'react'

/** Numbers that settle into place read as considered; numbers that snap don't. */
export function useCountUp(value, ms = 700) {
  const [v, setV] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    const start = performance.now()
    const a = from.current, b = Number(value) || 0
    if (a === b) return
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / ms)
      const eased = 1 - Math.pow(1 - p, 3)
      setV(a + (b - a) * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
      else from.current = b
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, ms])
  return v
}

/** Whole-number counter with Indian grouping. */
export function CountUp({ value, className, suffix }) {
  const v = useCountUp(value)
  return (
    <span className={className}>
      {Math.round(v).toLocaleString('en-IN')}{suffix}
    </span>
  )
}

/** Circular progress. Cleaner than a bar for a single headline goal. */
export function Ring({ pct, size = 92, stroke = 8, tone = '#F5A623', track = 'rgba(255,255,255,.08)', children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (Math.min(100, Math.max(0, pct)) / 100) * c
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={`${dash} ${c - dash}`}
          style={{ transition: 'stroke-dasharray .8s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

/** Smooth area curve for a short series. */
export function Curve({ points, tone = '#F5A623', id = 'cv', height = 56 }) {
  if (!points.length) return null
  const max = Math.max(1, ...points)
  const W = 300, H = height
  const pts = points.map((n, i) => [
    (i / Math.max(1, points.length - 1)) * W,
    H - (n / max) * (H - 6) - 3,
  ])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tone} stopOpacity="0.34" />
          <stop offset="1" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${W},${H} L0,${H} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={tone} strokeWidth="1.8" strokeLinecap="round"
        strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
