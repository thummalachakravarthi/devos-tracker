// Original art — no copyrighted subjects, no photos required.
// Cinematic gradients, particles, orbits — one scene per tab.

const bannerCls = 'absolute inset-0 w-full h-full'

export function CityBackdrop() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cbSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1024" />
          <stop offset="1" stopColor="#050710" />
        </linearGradient>
        <radialGradient id="cbGlowA" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#5b8def" stopOpacity="0.7" />
          <stop offset="1" stopColor="#5b8def" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cbGlowB" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c084fc" stopOpacity="0.55" />
          <stop offset="1" stopColor="#c084fc" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#cbSky)" />
      <circle cx="1180" cy="260" r="420" fill="url(#cbGlowA)">
        <animate attributeName="opacity" values="0.75;1;0.75" dur="10s" repeatCount="indefinite" />
      </circle>
      <circle cx="260" cy="200" r="360" fill="url(#cbGlowB)">
        <animate attributeName="opacity" values="1;0.65;1" dur="13s" repeatCount="indefinite" />
      </circle>
      {/* stars */}
      <g fill="#e6ecff">
        {Array.from({ length: 40 }).map((_, i) => {
          const x = (i * 37) % 1440
          const y = (i * 23) % 400
          const r = (i % 3) * 0.5 + 0.6
          return <circle key={i} cx={x} cy={y} r={r} opacity={0.4 + (i % 4) * 0.15} />
        })}
      </g>
    </svg>
  )
}

// TODAY — night sky with a crescent moon and softly rising particles
export function ArtToday() {
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="tdBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1030" />
          <stop offset="1" stopColor="#170a2b" />
        </linearGradient>
        <radialGradient id="tdMoonGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff4c2" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff4c2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="300" fill="url(#tdBg)" />
      <circle cx="620" cy="110" r="140" fill="url(#tdMoonGlow)" />
      {/* crescent moon */}
      <g transform="translate(620 110)">
        <circle r="52" fill="#fff4c2" />
        <circle r="52" cx="18" cy="-6" fill="#0e0e28" />
      </g>
      {/* stars */}
      <g fill="#e6ecff">
        {Array.from({ length: 30 }).map((_, i) => {
          const x = (i * 53) % 800
          const y = (i * 17) % 260
          const r = (i % 3) * 0.5 + 0.7
          return (
            <circle key={i} cx={x} cy={y} r={r} opacity={0.5 + (i % 3) * 0.2}>
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${3 + (i % 4)}s`} repeatCount="indefinite" />
            </circle>
          )
        })}
      </g>
      {/* mountains */}
      <path d="M0 300 L120 210 L200 240 L340 170 L470 220 L600 180 L720 230 L800 200 L800 300 Z" fill="#0a0620" />
      <path d="M0 300 L100 240 L220 265 L360 210 L500 260 L640 230 L800 260 L800 300 Z" fill="#050110" />
    </svg>
  )
}

// JAVA HQ — orbit rings around a bright core, coffee steam curls
export function ArtJava() {
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="jvBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#241005" />
          <stop offset="1" stopColor="#100510" />
        </linearGradient>
        <radialGradient id="jvCore" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe19a" />
          <stop offset="0.5" stopColor="#f2a33c" stopOpacity="0.85" />
          <stop offset="1" stopColor="#f2a33c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="300" fill="url(#jvBg)" />
      <g transform="translate(560 150)">
        <circle r="120" fill="none" stroke="#f2a33c" strokeOpacity="0.25" strokeWidth="1.5" />
        <circle r="88" fill="none" stroke="#f2a33c" strokeOpacity="0.4" strokeWidth="1.5" />
        <circle r="56" fill="none" stroke="#f2a33c" strokeOpacity="0.55" strokeWidth="1.5" />
        <circle r="70" fill="url(#jvCore)">
          <animate attributeName="opacity" values="0.85;1;0.85" dur="3.5s" repeatCount="indefinite" />
        </circle>
        {/* orbiting dots */}
        <g>
          <circle cx="120" cy="0" r="4" fill="#f2a33c">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite" />
          </circle>
        </g>
        <g>
          <circle cx="0" cy="-88" r="3" fill="#ffe19a">
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="6s" repeatCount="indefinite" />
          </circle>
        </g>
        <g>
          <circle cx="56" cy="0" r="2.5" fill="#fff4c2">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>
      </g>
      {/* steam curls on the left */}
      <g stroke="#f2a33c" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M180 200 C170 170 200 150 180 120 C165 95 195 75 180 50">
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M230 210 C220 180 250 160 230 130 C215 105 245 85 230 60">
          <animate attributeName="opacity" values="0.7;0.2;0.7" dur="4s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  )
}

// STATS — clean data-viz landscape: rising bars + a gentle line
export function ArtStats() {
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="stBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#062017" />
          <stop offset="1" stopColor="#0a1520" />
        </linearGradient>
        <linearGradient id="stBar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#21c39e" />
          <stop offset="1" stopColor="#7ae6cd" />
        </linearGradient>
      </defs>
      <rect width="800" height="300" fill="url(#stBg)" />
      {/* grid */}
      <g stroke="#ffffff" strokeOpacity="0.05">
        {[70, 130, 190, 250].map((y) => (
          <line key={y} x1="0" x2="800" y1={y} y2={y} />
        ))}
      </g>
      {/* bars */}
      {[
        { x: 120, h: 90 },
        { x: 200, h: 130 },
        { x: 280, h: 170 },
        { x: 360, h: 210 },
        { x: 440, h: 155 },
        { x: 520, h: 200 },
        { x: 600, h: 240 },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={270 - b.h} width="46" height={b.h} rx="10" fill="url(#stBar)">
            <animate attributeName="height" from="0" to={b.h} dur="1.2s" fill="freeze" begin={`${i * 0.1}s`} />
            <animate attributeName="y" from="270" to={270 - b.h} dur="1.2s" fill="freeze" begin={`${i * 0.1}s`} />
          </rect>
        </g>
      ))}
      {/* trend line */}
      <polyline
        points="143,180 223,140 303,100 383,60 463,115 543,70 623,30"
        fill="none"
        stroke="#e8b341"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <animate attributeName="stroke-dasharray" from="0 800" to="800 0" dur="1.6s" fill="freeze" />
      </polyline>
      {/* dots */}
      <g fill="#e8b341">
        {[[143,180],[223,140],[303,100],[383,60],[463,115],[543,70],[623,30]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="4">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" begin={`${i*0.2}s`}/>
          </circle>
        ))}
      </g>
    </svg>
  )
}

// HABITS — a soft constellation of connected nodes (routines as a network)
export function ArtHabits() {
  const nodes = [
    { x: 130, y: 90, c: '#f2a33c' },
    { x: 220, y: 190, c: '#43d6b5' },
    { x: 330, y: 100, c: '#c084fc' },
    { x: 420, y: 200, c: '#5b8def' },
    { x: 520, y: 90, c: '#f26ca7' },
    { x: 600, y: 200, c: '#7ae6cd' },
    { x: 690, y: 110, c: '#ffe19a' },
  ]
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [0, 2], [2, 4], [4, 6],
  ]
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hbBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f0a24" />
          <stop offset="1" stopColor="#1c0e35" />
        </linearGradient>
        <filter id="hbGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <rect width="800" height="300" fill="url(#hbBg)" />
      {/* edges */}
      <g stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}>
            <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur={`${3 + (i % 3)}s`} repeatCount="indefinite" />
          </line>
        ))}
      </g>
      {/* nodes */}
      {nodes.map((n, i) => (
        <g key={i} transform={`translate(${n.x} ${n.y})`}>
          <circle r="22" fill={n.c} opacity="0.35" filter="url(#hbGlow)">
            <animate attributeName="opacity" values="0.25;0.55;0.25" dur={`${3 + (i * 0.4)}s`} repeatCount="indefinite" />
          </circle>
          <circle r="10" fill={n.c} />
          <circle r="4" cx="-3" cy="-3" fill="#ffffff" opacity="0.7" />
        </g>
      ))}
    </svg>
  )
}
