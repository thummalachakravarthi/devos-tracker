// Original hero-tab art — vibrant, saturated, high-contrast.
// Every scene uses its own gradient palette + animated depth + strong headline color.

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

// ═══════════════════════════════════════════════════════════════
// TODAY — magenta→amber sunrise over rolling waves
// ═══════════════════════════════════════════════════════════════
export function ArtToday() {
  const planets = [
    { r: 55,  size: 4.5,  color: '#a0aec0', dur: 4.5,  ring: false, name: 'Mercury' },
    { r: 82,  size: 7,    color: '#f0b464', dur: 7,    ring: false, name: 'Venus' },
    { r: 112, size: 8,    color: '#4ade80', dur: 9,    ring: false, name: 'Earth' },
    { r: 145, size: 6.5,  color: '#ef4444', dur: 11.5, ring: false, name: 'Mars' },
    { r: 190, size: 15,   color: '#fbbf24', dur: 16,   ring: false, name: 'Jupiter' },
    { r: 235, size: 12,   color: '#fb923c', dur: 22,   ring: true,  name: 'Saturn' },
  ]
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="tdSpace" cx="0.5" cy="0.5" r="0.9">
          <stop offset="0" stopColor="#1e2b7a" />
          <stop offset="0.5" stopColor="#0a1240" />
          <stop offset="1" stopColor="#020617" />
        </radialGradient>
        <radialGradient id="tdSunGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fef3c7" stopOpacity="1" />
          <stop offset="0.35" stopColor="#fbbf24" stopOpacity="0.85" />
          <stop offset="1" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tdSunCore" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffbeb" />
          <stop offset="0.6" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#ea580c" />
        </radialGradient>
        <radialGradient id="tdNeb" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c084fc" stopOpacity="0.4" />
          <stop offset="1" stopColor="#c084fc" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="300" fill="url(#tdSpace)" />

      {/* purple nebula corner accents */}
      <circle cx="80" cy="60" r="120" fill="url(#tdNeb)">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="9s" repeatCount="indefinite" />
      </circle>
      <circle cx="720" cy="260" r="140" fill="url(#tdNeb)">
        <animate attributeName="opacity" values="1;0.55;1" dur="11s" repeatCount="indefinite" />
      </circle>

      {/* stars */}
      <g fill="#ffffff">
        {Array.from({ length: 80 }).map((_, i) => {
          const x = (i * 41) % 800
          const y = (i * 29) % 300
          const r = (i % 3) * 0.5 + 0.4
          return (
            <circle key={i} cx={x} cy={y} r={r} opacity={0.35 + (i % 4) * 0.15}>
              <animate attributeName="opacity" values="0.2;0.9;0.2" dur={`${2 + (i % 5)}s`} repeatCount="indefinite" begin={`${(i * 0.13) % 3}s`} />
            </circle>
          )
        })}
      </g>

      {/* SOLAR SYSTEM — centered so it works at any banner height */}
      <g transform="translate(400 150)">
        {/* orbit paths (subtle) */}
        <g fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1">
          {planets.map((p) => (
            <circle key={p.r} r={p.r} />
          ))}
        </g>

        {/* SUN — glow + rotating core */}
        <circle r="70" fill="url(#tdSunGlow)">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="4s" repeatCount="indefinite" />
          <animate attributeName="r" values="66;74;66" dur="4s" repeatCount="indefinite" />
        </circle>
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="60s" repeatCount="indefinite" />
          <circle r="26" fill="url(#tdSunCore)" />
          <ellipse cx="0" cy="-6" rx="18" ry="4" fill="#fef3c7" opacity="0.5" />
          <ellipse cx="5" cy="8" rx="12" ry="3" fill="#f59e0b" opacity="0.6" />
        </g>

        {/* PLANETS — each revolves (group rotates) and spins (planet spins) */}
        {planets.map((p, i) => (
          <g key={p.name}>
            <animateTransform attributeName="transform" type="rotate"
              from={`${i * 47} 0 0`} to={`${i * 47 + 360} 0 0`}
              dur={`${p.dur}s`} repeatCount="indefinite" />
            <g transform={`translate(${p.r} 0)`}>
              {/* Saturn's ring */}
              {p.ring && (
                <g>
                  <ellipse cx="0" cy="0" rx={p.size * 2.1} ry={p.size * 0.5}
                    fill="none" stroke="#facc15" strokeWidth="2.2" opacity="0.85" transform="rotate(-14)" />
                  <ellipse cx="0" cy="0" rx={p.size * 1.7} ry={p.size * 0.4}
                    fill="none" stroke="#fde68a" strokeWidth="1.4" opacity="0.7" transform="rotate(-14)" />
                </g>
              )}
              {/* planet body — spins on its own axis */}
              <g>
                <animateTransform attributeName="transform" type="rotate"
                  from="0" to="360" dur={`${p.dur * 0.6}s`} repeatCount="indefinite" />
                <circle r={p.size} fill={p.color} />
                {/* dark hemisphere for depth */}
                <path d={`M -${p.size} 0 A ${p.size} ${p.size} 0 0 1 ${p.size} 0 A ${p.size * 0.55} ${p.size} 0 0 1 -${p.size} 0 Z`}
                  fill="#000" opacity="0.28" />
                <circle r={p.size * 0.35} cx={-p.size * 0.3} cy={-p.size * 0.3} fill="#ffffff" opacity="0.35" />
              </g>
            </g>
          </g>
        ))}
      </g>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// JAVA HQ — molten amber core with concentric orbits, coffee steam
// ═══════════════════════════════════════════════════════════════
export function ArtJava() {
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="jvBg" cx="0.7" cy="0.5" r="0.9">
          <stop offset="0" stopColor="#b45309" />
          <stop offset="0.35" stopColor="#7a1e12" />
          <stop offset="0.75" stopColor="#2a0812" />
          <stop offset="1" stopColor="#0d0210" />
        </radialGradient>
        <radialGradient id="jvRays" cx="0.7" cy="0.5" r="0.7">
          <stop offset="0" stopColor="#fbbf24" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="jvCore" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff4c2" />
          <stop offset="0.3" stopColor="#ffca5c" />
          <stop offset="0.65" stopColor="#f27f38" stopOpacity="0.9" />
          <stop offset="1" stopColor="#c72d3e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="jvRing" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffca5c" />
          <stop offset="1" stopColor="#f27f38" />
        </linearGradient>
      </defs>
      <rect width="800" height="300" fill="url(#jvBg)" />
      <circle cx="560" cy="150" r="220" fill="url(#jvRays)">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="6s" repeatCount="indefinite" />
      </circle>
      <g transform="translate(560 150)">
        {/* orbit rings */}
        {[150, 118, 88].map((r, i) => (
          <ellipse key={r} cx="0" cy="0" rx={r} ry={r * 0.38} fill="none"
            stroke="url(#jvRing)" strokeOpacity={0.35 + i * 0.15} strokeWidth="1.6">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360"
              dur={`${18 + i * 6}s`} repeatCount="indefinite" />
          </ellipse>
        ))}
        {/* orbiting planets */}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="10s" repeatCount="indefinite" />
          <circle cx="150" cy="0" r="7" fill="#ffca5c" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="7s" repeatCount="indefinite" />
          <circle cx="118" cy="0" r="5" fill="#f27f38" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
          <circle cx="88" cy="0" r="4" fill="#fff4c2" />
        </g>
        {/* core */}
        <circle r="80" fill="url(#jvCore)">
          <animate attributeName="opacity" values="0.85;1;0.85" dur="3.5s" repeatCount="indefinite" />
        </circle>
      </g>
      {/* steam curls */}
      <g stroke="#ffca5c" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M170 210 C 160 175 195 158 175 122 C 158 92 190 72 175 42" opacity="0.7">
          <animate attributeName="opacity" values="0.35;0.85;0.35" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M220 215 C 210 180 245 163 225 128 C 208 98 240 78 225 48" opacity="0.55">
          <animate attributeName="opacity" values="0.8;0.35;0.8" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M270 220 C 260 185 295 168 275 132 C 258 102 290 82 275 52" opacity="0.4">
          <animate attributeName="opacity" values="0.35;0.7;0.35" dur="5s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// STATS — teal→cyan gradient with growing 3-D bars and gold trend
// ═══════════════════════════════════════════════════════════════
export function ArtStats() {
  const bars = [
    { x: 130, h: 90, c1: '#5eead4', c2: '#0d9488' },
    { x: 210, h: 130, c1: '#67e8f9', c2: '#0891b2' },
    { x: 290, h: 175, c1: '#7dd3fc', c2: '#0284c7' },
    { x: 370, h: 215, c1: '#a5b4fc', c2: '#4338ca' },
    { x: 450, h: 160, c1: '#c4b5fd', c2: '#7c3aed' },
    { x: 530, h: 205, c1: '#f0abfc', c2: '#a21caf' },
    { x: 610, h: 245, c1: '#fda4af', c2: '#be123c' },
  ]
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="stBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a2540" />
          <stop offset="0.5" stopColor="#062f4a" />
          <stop offset="1" stopColor="#031424" />
        </linearGradient>
        {bars.map((b, i) => (
          <linearGradient key={i} id={`sb${i}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={b.c2} />
            <stop offset="1" stopColor={b.c1} />
          </linearGradient>
        ))}
      </defs>
      <rect width="800" height="300" fill="url(#stBg)" />
      {/* grid glow */}
      <g stroke="#5eead4" strokeOpacity="0.12">
        {[70, 130, 190, 250].map((y) => (
          <line key={y} x1="0" x2="800" y1={y} y2={y}>
            <animate attributeName="stroke-opacity" values="0.05;0.22;0.05" dur="6s" repeatCount="indefinite" />
          </line>
        ))}
      </g>
      {/* soft aurora over bars */}
      <ellipse cx="400" cy="80" rx="450" ry="70" fill="#7c3aed" opacity="0.28" />
      {/* achievement confetti sparkles */}
      <g>
        {Array.from({ length: 22 }).map((_, i) => {
          const x = (i * 61) % 780 + 10
          const y = 30 + (i * 17) % 220
          const c = ['#fbbf24','#22d3ee','#a78bfa','#38bdf8','#5eead4'][i % 5]
          return (
            <circle key={i} cx={x} cy={y} r="1.8" fill={c}>
              <animate attributeName="opacity" values="0;1;0" dur={`${2 + (i % 4)}s`} repeatCount="indefinite" begin={`${(i * 0.19) % 3}s`} />
            </circle>
          )
        })}
      </g>
      {/* bars */}
      {bars.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={270 - b.h} width="52" height={b.h} rx="12" fill={`url(#sb${i})`}>
            <animate attributeName="height" from="0" to={b.h} dur="1.1s" fill="freeze" begin={`${i * 0.08}s`} />
            <animate attributeName="y" from="270" to={270 - b.h} dur="1.1s" fill="freeze" begin={`${i * 0.08}s`} />
          </rect>
          <rect x={b.x} y={270 - b.h} width="52" height="6" rx="3" fill="#ffffff" opacity="0.5" />
        </g>
      ))}
      {/* trend */}
      <polyline
        points="156,180 236,145 316,100 396,55 476,110 556,65 636,25"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="3.5"
        strokeLinecap="round"
      >
        <animate attributeName="stroke-dasharray" from="0 800" to="800 0" dur="1.6s" fill="freeze" />
      </polyline>
      {[[156,180],[236,145],[316,100],[396,55],[476,110],[556,65],[636,25]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="4" fill="#fbbf24">
          <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" begin={`${i*0.2}s`}/>
        </circle>
      ))}
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// HABITS — vivid nebula constellation of colored habit-nodes
// ═══════════════════════════════════════════════════════════════
export function ArtHabits() {
  const nodes = [
    { x: 100, y: 100, c: '#38bdf8' },  // pink
    { x: 200, y: 200, c: '#22d3ee' },  // cyan
    { x: 320, y: 90, c: '#fbbf24' },   // amber
    { x: 420, y: 210, c: '#34d399' },  // green
    { x: 540, y: 90, c: '#a78bfa' },   // violet
    { x: 640, y: 200, c: '#fb7185' },  // rose
    { x: 730, y: 110, c: '#60a5fa' },  // blue
  ]
  const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [0, 2], [2, 4], [4, 6], [1, 3], [3, 5]]
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="hbBg" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0" stopColor="#2c1065" />
          <stop offset="0.55" stopColor="#170b3d" />
          <stop offset="1" stopColor="#08041a" />
        </radialGradient>
        <radialGradient id="hbNeb1" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#38bdf8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hbNeb2" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#60a5fa" stopOpacity="0.55" />
          <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
        </radialGradient>
        <filter id="hbGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <rect width="800" height="300" fill="url(#hbBg)" />
      <circle cx="150" cy="80" r="180" fill="url(#hbNeb1)">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="9s" repeatCount="indefinite" />
      </circle>
      <circle cx="680" cy="220" r="200" fill="url(#hbNeb2)">
        <animate attributeName="opacity" values="1;0.6;1" dur="11s" repeatCount="indefinite" />
      </circle>
      {/* twinkling stars */}
      <g fill="#ffffff">
        {Array.from({ length: 26 }).map((_, i) => {
          const x = (i * 61) % 800
          const y = (i * 23) % 260
          const r = (i % 3) * 0.5 + 0.6
          return (
            <circle key={i} cx={x} cy={y} r={r} opacity={0.35 + (i % 4) * 0.12}>
              <animate attributeName="opacity" values="0.2;0.85;0.2" dur={`${3 + (i % 4)}s`} repeatCount="indefinite" />
            </circle>
          )
        })}
      </g>
      {/* edges — glow along the whole graph */}
      <g stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}>
            <animate attributeName="stroke-opacity" values="0.1;0.65;0.1" dur={`${3 + (i % 3)}s`} repeatCount="indefinite" begin={`${i * 0.15}s`} />
          </line>
        ))}
        {/* light pulses that travel along edges */}
        {edges.slice(0, 5).map(([a, b], i) => (
          <circle key={`p${i}`} r="3" fill="#ffffff" opacity="0.9">
            <animate attributeName="cx"
              values={`${nodes[a].x};${nodes[b].x};${nodes[a].x}`}
              dur={`${4 + i}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
            <animate attributeName="cy"
              values={`${nodes[a].y};${nodes[b].y};${nodes[a].y}`}
              dur={`${4 + i}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
            <animate attributeName="opacity" values="0;1;0" dur={`${4 + i}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
          </circle>
        ))}
      </g>

      {/* nodes — pulsing halos + slow drift */}
      {nodes.map((n, i) => (
        <g key={i} transform={`translate(${n.x} ${n.y})`}>
          <g>
            <animateTransform attributeName="transform" type="translate"
              values={`0 0; 0 ${i % 2 === 0 ? -6 : 6}; 0 0`}
              dur={`${5 + i * 0.6}s`} repeatCount="indefinite" />
            <circle r="34" fill={n.c} opacity="0.35" filter="url(#hbGlow)">
              <animate attributeName="opacity" values="0.2;0.75;0.2" dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="r" values="28;38;28" dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
            </circle>
            <circle r="14" fill={n.c} />
            <circle r="6" cx="-4" cy="-4" fill="#ffffff" opacity="0.75" />
          </g>
        </g>
      ))}

      {/* shooting star across the constellation */}
      <g>
        <line x1="0" y1="0" x2="45" y2="18" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        <circle r="2.5" fill="#fffbeb" />
        <animateTransform attributeName="transform" type="translate"
          values="-60 40; 860 200; 860 200" keyTimes="0; 0.35; 1"
          dur="9s" repeatCount="indefinite" />
      </g>
    </svg>
  )
}
// ═══════════════════════════════════════════════════════════════
// FOCUS — flow-state visualization: perspective tunnel + pulsing rings + inward particles
// (very different from Java's amber orbital core: cool cyan/violet, meditative not molten)
// ═══════════════════════════════════════════════════════════════
export function ArtFocus() {
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="fcBg" cx="0.5" cy="0.5" r="0.9">
          <stop offset="0" stopColor="#0d1a3a" />
          <stop offset="0.55" stopColor="#050a1c" />
          <stop offset="1" stopColor="#02040c" />
        </radialGradient>
        <radialGradient id="fcCore" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e0f2fe" />
          <stop offset="0.3" stopColor="#67e8f9" />
          <stop offset="0.7" stopColor="#3b82f6" stopOpacity="0.7" />
          <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fcRing" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#818cf8" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <filter id="fcBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>
      <rect width="800" height="300" fill="url(#fcBg)" />

      {/* perspective tunnel — concentric ellipses receding into the distance */}
      <g transform="translate(400 150)">
        {Array.from({ length: 10 }).map((_, i) => {
          const r = 40 + i * 32
          const opacity = 0.45 - i * 0.035
          const dur = 6 + i * 0.4
          return (
            <ellipse
              key={i}
              cx="0" cy="0"
              rx={r} ry={r * 0.55}
              fill="none"
              stroke="url(#fcRing)"
              strokeWidth="1.2"
              opacity={opacity}
            >
              <animate attributeName="rx"
                values={`${r};${r + 8};${r}`}
                dur={`${dur}s`} repeatCount="indefinite" />
              <animate attributeName="ry"
                values={`${r * 0.55};${(r + 8) * 0.55};${r * 0.55}`}
                dur={`${dur}s`} repeatCount="indefinite" />
              <animate attributeName="opacity"
                values={`${opacity};${opacity + 0.15};${opacity}`}
                dur={`${dur}s`} repeatCount="indefinite" />
            </ellipse>
          )
        })}

        {/* brain-wave pulses — three rings expanding outward, staggered like a heartbeat */}
        {[0, 1.6, 3.2].map((delay, i) => (
          <circle
            key={i}
            cx="0" cy="0" r="30"
            fill="none"
            stroke="#67e8f9"
            strokeWidth="2"
          >
            <animate attributeName="r"
              values="30;220"
              dur="4.8s" begin={`${delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity"
              values="0.8;0"
              dur="4.8s" begin={`${delay}s`} repeatCount="indefinite" />
            <animate attributeName="stroke-width"
              values="3;0.5"
              dur="4.8s" begin={`${delay}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* glowing focused core */}
        <circle r="55" fill="url(#fcCore)">
          <animate attributeName="opacity" values="0.85;1;0.85" dur="3s" repeatCount="indefinite" />
          <animate attributeName="r" values="52;58;52" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle r="14" fill="#f0f9ff" filter="url(#fcBlur)">
          <animate attributeName="opacity" values="0.9;1;0.9" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* inward-drifting particles from screen edges toward center — "attention converging" */}
      <g fill="#a5f3fc">
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * Math.PI * 2
          const startR = 380
          const sx = 400 + Math.cos(angle) * startR
          const sy = 150 + Math.sin(angle) * startR * 0.55
          const dur = 4 + (i % 4) * 1.2
          const delay = (i * 0.35) % 4
          return (
            <circle key={i} r="1.8" opacity="0">
              <animate attributeName="cx" values={`${sx};400`} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${sy};150`} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.9;0" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;0.5" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
            </circle>
          )
        })}
      </g>

      {/* soft grid glow at bottom, like a stage floor */}
      <g stroke="#22d3ee" strokeOpacity="0.08" strokeWidth="1">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={i * 100} y1="300" x2="400" y2="180" />
        ))}
      </g>
    </svg>
  )
}
// ═══════════════════════════════════════════════════════════════
// COMMAND — tactical radar sweep + HUD grid (a "war room" screen)
// ═══════════════════════════════════════════════════════════════
export function ArtCommand() {
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="cmBg" cx="0.5" cy="0.5" r="0.9">
          <stop offset="0" stopColor="#0a2418" />
          <stop offset="0.6" stopColor="#031610" />
          <stop offset="1" stopColor="#010805" />
        </radialGradient>
        <linearGradient id="cmSweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4ade80" stopOpacity="0" />
          <stop offset="1" stopColor="#4ade80" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="cmGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#86efac" stopOpacity="0.6" />
          <stop offset="1" stopColor="#4ade80" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="300" fill="url(#cmBg)" />

      {/* HUD grid — tactical map crosshatch */}
      <g stroke="#4ade80" strokeOpacity="0.08">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="300" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} />
        ))}
      </g>

      {/* RADAR — the star of the show */}
      <g transform="translate(400 150)">
        {/* range rings */}
        {[40, 80, 120, 160].map((r) => (
          <circle key={r} r={r} fill="none" stroke="#4ade80" strokeOpacity="0.35" strokeWidth="1" />
        ))}
        {/* crosshairs */}
        <line x1="-180" y1="0" x2="180" y2="0" stroke="#4ade80" strokeOpacity="0.28" strokeWidth="1" />
        <line x1="0" y1="-140" x2="0" y2="140" stroke="#4ade80" strokeOpacity="0.28" strokeWidth="1" />

        {/* soft glow behind sweep */}
        <circle r="160" fill="url(#cmGlow)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* the rotating sweep — a wedge */}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4.5s" repeatCount="indefinite" />
          <path d="M 0 0 L 160 0 A 160 160 0 0 1 138.6 -80 Z" fill="url(#cmSweep)" />
          <line x1="0" y1="0" x2="160" y2="0" stroke="#86efac" strokeWidth="2" opacity="0.95" />
        </g>

        {/* center pip */}
        <circle r="4" fill="#4ade80" />
        <circle r="8" fill="none" stroke="#4ade80" strokeOpacity="0.5" strokeWidth="1.5">
          <animate attributeName="r" values="6;14;6" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* blip contacts detected on the radar, flashing */}
        {[
          { x: 95, y: -50, delay: 0 },
          { x: -70, y: 90, delay: 1.2 },
          { x: 130, y: 60, delay: 2.4 },
          { x: -110, y: -30, delay: 3.1 },
          { x: 40, y: 110, delay: 0.6 },
        ].map((b, i) => (
          <g key={i} transform={`translate(${b.x} ${b.y})`}>
            <circle r="4" fill="#86efac">
              <animate attributeName="opacity" values="1;0.15;1" dur="4.5s" begin={`${b.delay}s`} repeatCount="indefinite" />
              <animate attributeName="r" values="3;5;3" dur="4.5s" begin={`${b.delay}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </g>

      {/* left-side HUD readouts (fake tactical text) */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#4ade80" fillOpacity="0.55">
        <text x="20" y="30">SYS_STATUS: OK</text>
        <text x="20" y="45">MISSION_D240</text>
        <text x="20" y="60">TRACK: 5</text>
        <text x="20" y="270">SCAN 04.5s</text>
        <text x="20" y="285">TZ: LOCAL</text>
      </g>

      {/* right-side HUD */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#4ade80" fillOpacity="0.55" textAnchor="end">
        <text x="780" y="30">◈ COMMAND</text>
        <text x="780" y="45">DEBRIEF-01</text>
        <text x="780" y="270">ONLINE</text>
        <text x="780" y="285">SEC ▮▮▮▯▯</text>
      </g>

      {/* corner brackets — tactical UI style */}
      <g stroke="#4ade80" strokeWidth="2" fill="none" opacity="0.6">
        <path d="M 12 12 L 12 32 M 12 12 L 32 12" />
        <path d="M 788 12 L 788 32 M 788 12 L 768 12" />
        <path d="M 12 288 L 12 268 M 12 288 L 32 288" />
        <path d="M 788 288 L 788 268 M 788 288 L 768 288" />
      </g>
    </svg>
  )
}
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// RISE — Storm duel. Two masters at full commitment in driving rain.
// Hard, fast, violent. 4s loop, no gore.
//
//  0.00–0.22  crouch and wind-up, lightning cracks, rain hammers
//  0.22–0.40  explosive charge — speed lines, motion smear
//  0.40–0.48  CLASH — white blowout, shockwave ring, spark burst, shake
//  0.48–0.70  blades locked, grinding sparks, both trembling
//  0.70–0.86  push-off, violent recoil
//  0.86–1.00  land, reset — seamless
// ═══════════════════════════════════════════════════════════════
export function ArtRise() {
  const rain = Array.from({ length: 90 }, (_, i) => {
    const x = (i * 137) % 900 - 40
    const len = 26 + ((i * 53) % 26)
    const dur = (0.34 + ((i * 29) % 22) / 100).toFixed(2)
    const dly = (((i * 71) % 100) / 100).toFixed(2)
    return { x, len, dur, dly, o: (0.18 + ((i * 17) % 40) / 100).toFixed(2) }
  })
  const sparks = Array.from({ length: 26 }, (_, i) => {
    const a = (i / 26) * Math.PI * 2
    const spread = 60 + ((i * 37) % 70)
    return {
      dx: (Math.cos(a) * spread).toFixed(0),
      dy: (Math.sin(a) * spread * 0.62 - 12).toFixed(0),
      d: (0.3 + ((i * 13) % 30) / 100).toFixed(2),
      r: (1 + ((i * 7) % 20) / 10).toFixed(1),
    }
  })

  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="rzSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0d18" />
          <stop offset="0.42" stopColor="#1b1430" />
          <stop offset="0.72" stopColor="#3d1630" />
          <stop offset="1" stopColor="#0b0a14" />
        </linearGradient>
        <radialGradient id="rzMoon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd9c2" />
          <stop offset="0.3" stopColor="#ff6b4a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ff3b2f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rzBlade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#dbeafe" />
          <stop offset="1" stopColor="#93a4bd" />
        </linearGradient>
        <radialGradient id="rzBurst" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#ffe8a3" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rzVig" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.72" />
        </radialGradient>
        <filter id="rzGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="rzSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>

        <style>{`
          .rz-shake { animation: rzShake 4s steps(1,end) infinite; }
          @keyframes rzShake {
            0%,39.9% { transform: translate(0,0); }
            40%  { transform: translate(-7px,4px) scale(1.02); }
            41.5%{ transform: translate(6px,-5px) scale(1.02); }
            43%  { transform: translate(-5px,-2px) scale(1.015); }
            44.5%{ transform: translate(3px,3px); }
            46%  { transform: translate(-2px,-1px); }
            48%,100% { transform: translate(0,0); }
          }
          .rz-flash { animation: rzFlash 4s linear infinite; }
          @keyframes rzFlash {
            0%,39% { opacity: 0; }
            40%    { opacity: .95; }
            43%    { opacity: .35; }
            47%    { opacity: .08; }
            52%,100% { opacity: 0; }
          }
          .rz-bolt { animation: rzBolt 4s linear infinite; }
          @keyframes rzBolt {
            0%,7% { opacity: 0; } 8% { opacity: .9; } 9.5% { opacity: .15; }
            10.5% { opacity: .8; } 12% { opacity: 0; }
            66% { opacity: 0; } 67% { opacity: .75; } 68.5% { opacity: 0; }
            100% { opacity: 0; }
          }
          .rz-ring { animation: rzRing 4s linear infinite; transform-origin: 400px 196px; }
          @keyframes rzRing {
            0%,40% { opacity: 0; transform: scale(.1); }
            41% { opacity: .95; }
            56% { opacity: 0; transform: scale(3.4); }
            100% { opacity: 0; transform: scale(3.4); }
          }
          .rz-burst { animation: rzBurst 4s linear infinite; transform-origin: 400px 194px; }
          @keyframes rzBurst {
            0%,39% { opacity: 0; transform: scale(.2); }
            40.5% { opacity: 1; transform: scale(1.25); }
            50% { opacity: 0; transform: scale(1.9); }
            100% { opacity: 0; }
          }
          .rz-spark { animation: rzSpark 4s linear infinite; }
          @keyframes rzSpark {
            0%,39.5% { opacity: 0; transform: translate(0,0) scale(1); }
            41% { opacity: 1; }
            58% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(.2); }
            100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(.2); }
          }
          .rz-grind { animation: rzGrind .16s linear infinite; }
          @keyframes rzGrind { 0%,100% { opacity: .2; } 50% { opacity: 1; } }
          .rz-grindwrap { animation: rzGrindWrap 4s linear infinite; }
          @keyframes rzGrindWrap { 0%,48% { opacity: 0; } 50% { opacity: 1; } 68% { opacity: 1; } 71%,100% { opacity: 0; } }

          .rz-red  { animation: rzRed 4s cubic-bezier(.7,0,.3,1) infinite; }
          @keyframes rzRed {
            0%    { transform: translate(-96px,0) rotate(-4deg); }
            20%   { transform: translate(-108px,6px) rotate(-9deg); }
            38%   { transform: translate(-14px,0) rotate(2deg); }
            40%   { transform: translate(-8px,0) rotate(3deg); }
            50%   { transform: translate(-12px,0) rotate(1deg); }
            68%   { transform: translate(-16px,2px) rotate(0deg); }
            78%   { transform: translate(-120px,-10px) rotate(-12deg); }
            88%   { transform: translate(-96px,0) rotate(-4deg); }
            100%  { transform: translate(-96px,0) rotate(-4deg); }
          }
          .rz-blue { animation: rzBlue 4s cubic-bezier(.7,0,.3,1) infinite; }
          @keyframes rzBlue {
            0%    { transform: translate(96px,0) scale(-1,1) rotate(-4deg); }
            20%   { transform: translate(108px,6px) scale(-1,1) rotate(-9deg); }
            38%   { transform: translate(14px,0) scale(-1,1) rotate(2deg); }
            40%   { transform: translate(8px,0) scale(-1,1) rotate(3deg); }
            50%   { transform: translate(12px,0) scale(-1,1) rotate(1deg); }
            68%   { transform: translate(16px,2px) scale(-1,1) rotate(0deg); }
            78%   { transform: translate(120px,-10px) scale(-1,1) rotate(-12deg); }
            88%   { transform: translate(96px,0) scale(-1,1) rotate(-4deg); }
            100%  { transform: translate(96px,0) scale(-1,1) rotate(-4deg); }
          }
          .rz-speed { animation: rzSpeed 4s linear infinite; }
          @keyframes rzSpeed {
            0%,22% { opacity: 0; transform: scaleX(0); }
            26% { opacity: .85; transform: scaleX(1); }
            39% { opacity: .5; transform: scaleX(1); }
            41%,100% { opacity: 0; transform: scaleX(0); }
          }
          .rz-rain line { animation: rzRain linear infinite; }
          @keyframes rzRain {
            0% { transform: translate(0,-60px); } 100% { transform: translate(-52px,340px); }
          }
          .rz-dust { animation: rzDust 4s linear infinite; }
          @keyframes rzDust {
            0%,76% { opacity: 0; transform: scale(.3); }
            80% { opacity: .5; transform: scale(1); }
            96% { opacity: 0; transform: scale(1.8); }
            100% { opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .rz-shake,.rz-flash,.rz-bolt,.rz-ring,.rz-burst,.rz-spark,.rz-grind,
            .rz-grindwrap,.rz-red,.rz-blue,.rz-speed,.rz-dust,.rz-rain line { animation: none !important; }
          }
        `}</style>
      </defs>

      <rect width="800" height="300" fill="url(#rzSky)" />

      {/* blood moon */}
      <circle cx="620" cy="82" r="96" fill="url(#rzMoon)" opacity="0.55" />
      <circle cx="620" cy="82" r="34" fill="#ff7a55" opacity="0.9" filter="url(#rzSoft)" />

      {/* storm clouds */}
      <g opacity="0.9">
        <path d="M-40,96 C90,44 210,110 320,66 C430,24 560,96 700,52 C760,34 820,58 860,44 L860,-20 L-40,-20 Z" fill="#0b0e1c" />
        <path d="M-40,132 C110,92 220,146 350,110 C480,74 600,132 860,96 L860,-20 L-40,-20 Z" fill="#0a0c16" opacity="0.85" />
      </g>

      {/* lightning */}
      <g className="rz-bolt">
        <path d="M262,-10 L238,88 L276,84 L226,196 L252,102 L216,106 Z" fill="#dce9ff" opacity="0.95" />
        <path d="M262,-10 L238,88 L276,84 L226,196 L252,102 L216,106 Z" fill="#ffffff" filter="url(#rzGlow)" opacity="0.7" />
      </g>

      {/* jagged ridge line */}
      <path d="M-40,214 L70,150 L140,192 L214,132 L300,190 L380,146 L470,196 L560,140 L648,190 L740,150 L860,206 L860,300 L-40,300 Z" fill="#080a12" />
      <path d="M-40,236 L110,196 L230,228 L360,192 L500,232 L640,194 L860,234 L860,300 L-40,300 Z" fill="#050609" />

      <g className="rz-shake">
        {/* ground */}
        <rect x="-40" y="252" width="880" height="60" fill="#04050a" />
        <path d="M-40,252 Q400,240 860,252 L860,262 L-40,262 Z" fill="#12141f" opacity="0.8" />

        {/* speed lines into the centre */}
        <g className="rz-speed" opacity="0.85">
          {[168, 182, 196, 210, 224].map((y, i) => (
            <g key={i}>
              <rect x="150" y={y} width="180" height={i % 2 ? 1.6 : 2.6} fill="#e8f0ff" opacity="0.5"
                style={{ transformOrigin: '330px center' }} />
              <rect x="470" y={y + 4} width="180" height={i % 2 ? 1.6 : 2.6} fill="#e8f0ff" opacity="0.5"
                style={{ transformOrigin: '470px center' }} />
            </g>
          ))}
        </g>

        {/* ── RED fighter ── */}
        <g className="rz-red" style={{ transformOrigin: '400px 250px' }}>
          <g transform="translate(400,0)">
            <path d="M-52,250 C-40,214 -30,196 -16,186 L-2,192 C-14,208 -22,228 -26,250 Z" fill="#7f1020" />
            <path d="M-30,250 L-18,250 L-14,214 L-26,214 Z" fill="#0d0d14" />
            <path d="M-22,214 C-30,196 -26,178 -12,170 L4,178 C-4,192 -6,204 -8,214 Z" fill="#a3132a" />
            <path d="M-16,172 C-16,160 -6,152 4,154 C12,156 14,166 10,174 C4,180 -8,180 -16,172 Z" fill="#12121c" />
            <path d="M-14,158 L-2,148 L10,158 L-2,164 Z" fill="#c2183a" />
            <circle cx="2" cy="167" r="2" fill="#ff5a3d" />
            {/* extended arm + katana */}
            <path d="M2,180 L44,168" stroke="#a3132a" strokeWidth="8" strokeLinecap="round" />
            <path d="M44,168 L150,150" stroke="url(#rzBlade)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M44,168 L150,150" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
            <rect x="38" y="163" width="12" height="10" rx="2" fill="#2a2a36" transform="rotate(-10 44 168)" />
            {/* cape whipping back */}
            <path d="M-24,186 C-56,196 -74,222 -80,250 L-46,250 C-42,224 -34,204 -20,196 Z" fill="#6d0f1c" opacity="0.95" />
          </g>
        </g>

        {/* ── BLUE fighter (mirrored) ── */}
        <g className="rz-blue" style={{ transformOrigin: '400px 250px' }}>
          <g transform="translate(-400,0)">
            <path d="M-52,250 C-40,214 -30,196 -16,186 L-2,192 C-14,208 -22,228 -26,250 Z" fill="#12306b" />
            <path d="M-30,250 L-18,250 L-14,214 L-26,214 Z" fill="#0b0d16" />
            <path d="M-22,214 C-30,196 -26,178 -12,170 L4,178 C-4,192 -6,204 -8,214 Z" fill="#1b479c" />
            <path d="M-16,172 C-16,160 -6,152 4,154 C12,156 14,166 10,174 C4,180 -8,180 -16,172 Z" fill="#101018" />
            <path d="M-14,158 L-2,148 L10,158 L-2,164 Z" fill="#2a5fc9" />
            <circle cx="2" cy="167" r="2" fill="#68d0ff" />
            <path d="M2,180 L44,168" stroke="#1b479c" strokeWidth="8" strokeLinecap="round" />
            <path d="M44,168 L150,150" stroke="url(#rzBlade)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M44,168 L150,150" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
            <rect x="38" y="163" width="12" height="10" rx="2" fill="#232330" transform="rotate(-10 44 168)" />
            <path d="M-24,186 C-56,196 -74,222 -80,250 L-46,250 C-42,224 -34,204 -20,196 Z" fill="#0d2352" opacity="0.95" />
          </g>
        </g>

        {/* blades locked — grinding sparks */}
        <g className="rz-grindwrap">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} className="rz-grind" cx={392 + i * 4} cy={192 + (i % 3) * 3}
              r={1 + (i % 3) * 0.6} fill="#ffe08a"
              style={{ animationDelay: `${(i * 0.03).toFixed(2)}s` }} />
          ))}
          <circle cx="400" cy="194" r="16" fill="#ffb648" opacity="0.28" filter="url(#rzGlow)" />
        </g>

        {/* impact burst + shockwave */}
        <circle className="rz-burst" cx="400" cy="194" r="52" fill="url(#rzBurst)" />
        <circle className="rz-ring" cx="400" cy="196" r="26" fill="none" stroke="#ffe8b0" strokeWidth="3" opacity="0.9" />
        <circle className="rz-ring" cx="400" cy="196" r="26" fill="none" stroke="#ffffff" strokeWidth="1.2"
          opacity="0.7" style={{ animationDelay: '0.06s' }} />

        {/* spark shrapnel */}
        <g>
          {sparks.map((s, i) => (
            <circle key={i} className="rz-spark" cx="400" cy="194" r={s.r} fill={i % 3 ? '#ffd166' : '#fff3c4'}
              style={{ '--sx': `${s.dx}px`, '--sy': `${s.dy}px`, animationDelay: `${s.d}s` }} />
          ))}
        </g>

        {/* dust plumes on the push-off */}
        <g className="rz-dust">
          <ellipse cx="300" cy="252" rx="46" ry="13" fill="#7a6a58" opacity="0.5" filter="url(#rzSoft)" />
          <ellipse cx="500" cy="252" rx="46" ry="13" fill="#7a6a58" opacity="0.5" filter="url(#rzSoft)" />
        </g>
      </g>

      {/* driving rain */}
      <g className="rz-rain" opacity="0.65">
        {rain.map((d, i) => (
          <line key={i} x1={d.x} y1="0" x2={d.x - 9} y2={d.len} stroke="#cfe0ff" strokeWidth="1.2"
            strokeLinecap="round" opacity={d.o}
            style={{ animationDuration: `${d.dur}s`, animationDelay: `-${d.dly}s` }} />
        ))}
      </g>

      {/* clash blowout */}
      <rect className="rz-flash" width="800" height="300" fill="#ffffff" />
      <rect width="800" height="300" fill="url(#rzVig)" />
    </svg>
  )
}
