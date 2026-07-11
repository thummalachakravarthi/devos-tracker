// Small shared visual components

export function ProgressRing({ pct = 0, size = 92, stroke = 8, color = '#F2A33C', children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c * (1 - Math.min(1, Math.max(0, pct)))
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#26314A" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset .5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}

// The signature piece: a coffee cup that fills with today's Java minutes. ☕
export function CoffeeCup({ pct = 0, size = 120 }) {
  const p = Math.min(1, Math.max(0, pct))
  const cupX = 22
  const cupY = 30
  const cupW = 56
  const cupH = 62
  const fillH = cupH * p
  const fillY = cupY + cupH - fillH
  const full = p >= 1
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Java time progress">
      {/* steam */}
      <g stroke={full ? '#F2A33C' : '#26314A'} strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M42 12c0 6 5 6 5 12">
          {full && <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />}
        </path>
        <path d="M58 8c0 7 5 7 5 14">
          {full && <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />}
        </path>
      </g>
      {/* handle */}
      <path
        d={`M${cupX + cupW} 44 h10 a12 12 0 0 1 0 24 h-10`}
        fill="none"
        stroke="#26314A"
        strokeWidth="5"
      />
      {/* coffee fill */}
      <clipPath id="cupclip">
        <path d={`M${cupX} ${cupY} h${cupW} v${cupH - 12} a12 12 0 0 1 -12 12 h-${cupW - 24} a12 12 0 0 1 -12 -12 z`} />
      </clipPath>
      <rect
        x={cupX}
        y={fillY}
        width={cupW}
        height={fillH}
        fill="#F2A33C"
        clipPath="url(#cupclip)"
        style={{ transition: 'y .5s ease, height .5s ease' }}
      />
      {/* cup outline */}
      <path
        d={`M${cupX} ${cupY} h${cupW} v${cupH - 12} a12 12 0 0 1 -12 12 h-${cupW - 24} a12 12 0 0 1 -12 -12 z`}
        fill="none"
        stroke="#3A4763"
        strokeWidth="4"
      />
    </svg>
  )
}

// GitHub-style heatmap. levelFor(dateIso) -> 0..4, or -1 for "future / out of range"
export function Heatmap({ dates, levelFor, colors, cell = 11, gap = 3 }) {
  const palette = colors || ['#1B2231', '#5b4218', '#8a6423', '#c1892e', '#F2A33C']
  return (
    <div className="overflow-x-auto pb-1">
      <div
        className="grid grid-flow-col"
        style={{ gridTemplateRows: `repeat(7, ${cell}px)`, gap }}
      >
        {dates.map((d) => {
          const lv = levelFor(d)
          return (
            <div
              key={d}
              title={d}
              className="rounded-[3px]"
              style={{
                width: cell,
                height: cell,
                background: lv < 0 ? 'transparent' : palette[lv],
                border: lv === 0 ? '1px solid #26314A' : 'none',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
