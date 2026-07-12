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
// RISE — actual fight scene: an agile red hero vs a hulking green brute,
// throwing punches, dodging, staggering. Original characters, not IP.
// ═══════════════════════════════════════════════════════════════
export function ArtRise() {
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="rsSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a0510" />
          <stop offset="0.4" stopColor="#4a0e18" />
          <stop offset="1" stopColor="#7a1a0d" />
        </linearGradient>
        <radialGradient id="rsMoon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fef3c7" />
          <stop offset="0.5" stopColor="#f59e0b" stopOpacity="0.7" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <filter id="rsImpact" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="rsSmoke" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <rect width="800" height="300" fill="url(#rsSky)" />

      {/* full moon behind them */}
      <circle cx="400" cy="90" r="80" fill="url(#rsMoon)">
        <animate attributeName="opacity" values="0.85;1;0.85" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* city skyline silhouette */}
      <path d="M 0 260 L 40 240 L 70 260 L 100 220 L 140 260 L 180 210 L 220 260 L 260 230 L 310 260 L 350 200 L 400 260 L 450 190 L 500 260 L 540 220 L 590 260 L 640 230 L 700 260 L 750 240 L 800 260 L 800 300 L 0 300 Z"
        fill="#0a0308" />

      {/* rooftop battleground */}
      <rect x="0" y="255" width="800" height="45" fill="#170410" />
      <rect x="0" y="255" width="800" height="3" fill="#3a0a1a" />

      {/* dust cloud swirling around the fighters */}
      <ellipse cx="400" cy="248" rx="220" ry="35" fill="#78350f" opacity="0.35" filter="url(#rsSmoke)">
        <animate attributeName="opacity" values="0.25;0.55;0.25" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="rx" values="200;240;200" dur="1.6s" repeatCount="indefinite" />
      </ellipse>

      {/* ═════ LEFT FIGHTER — Red agile hero ═════ */}
      {/* Whole body group cycles: charge → punch → recoil → dodge */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="240 0; 310 0; 305 0; 280 0; 240 0"
          keyTimes="0; 0.35; 0.5; 0.75; 1"
          dur="3.2s" repeatCount="indefinite" />

        {/* body */}
        <g transform="translate(60 210)">
          {/* legs — lunge stance */}
          <path d="M -8 30 L -20 60 L -14 62 L -2 32 Z" fill="#b91c1c" />
          <path d="M 8 30 L 20 55 L 26 55 L 14 32 Z" fill="#dc2626" />
          {/* boots */}
          <ellipse cx="-16" cy="61" rx="7" ry="3" fill="#7f1d1d" />
          <ellipse cx="23" cy="55" rx="7" ry="3" fill="#7f1d1d" />

          {/* torso — red with black chest emblem */}
          <path d="M -14 -12 L -18 30 L 18 30 L 14 -12 Z" fill="#dc2626" />
          <path d="M -14 -12 L -18 30 L 18 30 L 14 -12 Z" fill="#7f1d1d" opacity="0.3" />
          {/* chest emblem — abstract, not any real character */}
          <path d="M -6 -2 L 0 10 L 6 -2 L 0 4 Z" fill="#0a0308" />
          <circle cx="0" cy="12" r="2" fill="#0a0308" />

          {/* head — full-face mask, big white eye lenses */}
          <ellipse cx="0" cy="-22" rx="12" ry="14" fill="#dc2626" />
          <path d="M -8 -25 Q 0 -30 8 -25" stroke="#7f1d1d" strokeWidth="1" fill="none" />
          <ellipse cx="-4" cy="-24" rx="3" ry="4" fill="#ffffff" />
          <ellipse cx="4" cy="-24" rx="3" ry="4" fill="#ffffff" />
          <ellipse cx="-4" cy="-24" rx="1.2" ry="2" fill="#0a0308" />
          <ellipse cx="4" cy="-24" rx="1.2" ry="2" fill="#0a0308" />

          {/* THROWING RIGHT ARM — animated: cocked → thrown → retract */}
          <g>
            <animateTransform attributeName="transform" type="rotate"
              values="-30 15 -5; 60 15 -5; 60 15 -5; -30 15 -5; -30 15 -5"
              keyTimes="0; 0.35; 0.5; 0.75; 1"
              dur="3.2s" repeatCount="indefinite" />
            <path d="M 12 -8 L 20 5 L 45 -5 L 40 -15 Z" fill="#dc2626" />
            <path d="M 40 -15 L 60 -12 L 62 -6 L 50 -2 Z" fill="#dc2626" />
            {/* fist */}
            <circle cx="60" cy="-10" r="10" fill="#dc2626" />
            <circle cx="60" cy="-10" r="10" fill="#7f1d1d" opacity="0.35" />
            {/* knuckle lines */}
            <line x1="53" y1="-14" x2="55" y2="-8" stroke="#7f1d1d" strokeWidth="1" />
            <line x1="58" y1="-16" x2="59" y2="-8" stroke="#7f1d1d" strokeWidth="1" />
            <line x1="63" y1="-16" x2="63" y2="-8" stroke="#7f1d1d" strokeWidth="1" />
            {/* motion blur trail on the fist */}
            <ellipse cx="45" cy="-10" rx="20" ry="4" fill="#ffffff" opacity="0.35">
              <animate attributeName="opacity" values="0;0.55;0" dur="3.2s" keyTimes="0.3;0.4;0.5" repeatCount="indefinite" />
            </ellipse>
          </g>

          {/* LEFT ARM — guarding */}
          <path d="M -12 -8 L -25 5 L -22 15 L -8 5 Z" fill="#dc2626" />
          <circle cx="-25" cy="8" r="7" fill="#dc2626" />
        </g>
      </g>

      {/* ═════ RIGHT FIGHTER — Green muscle brute ═════ */}
      {/* Cycles: brace → get hit → recoil back → return */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0 0; 20 0; 60 -4; 40 -2; 0 0"
          keyTimes="0; 0.35; 0.55; 0.75; 1"
          dur="3.2s" repeatCount="indefinite" />

        <g transform="translate(590 210)">
          {/* HUGE legs planted wide */}
          <path d="M -25 20 L -40 62 L -25 62 L -12 22 Z" fill="#166534" />
          <path d="M 25 20 L 40 62 L 25 62 L 12 22 Z" fill="#15803d" />
          {/* boots */}
          <ellipse cx="-32" cy="62" rx="11" ry="4" fill="#052e16" />
          <ellipse cx="32" cy="62" rx="11" ry="4" fill="#052e16" />
          {/* torn purple shorts */}
          <path d="M -22 15 L -25 30 L 25 30 L 22 15 Z" fill="#5b21b6" />
          <path d="M -15 30 L -18 35 L -12 32 Z" fill="#5b21b6" />
          <path d="M 15 30 L 18 35 L 12 32 Z" fill="#5b21b6" />

          {/* massive torso */}
          <path d="M -32 -25 L -30 20 L 30 20 L 32 -25 Q 0 -35 -32 -25 Z" fill="#16a34a" />
          {/* chest shadow */}
          <path d="M -32 -25 L -30 20 L 30 20 L 32 -25 Q 0 -35 -32 -25 Z" fill="#052e16" opacity="0.25" />
          {/* pec definition */}
          <path d="M -20 -15 Q -10 -8 -2 -12 L -2 5 L -20 5 Z" fill="#052e16" opacity="0.3" />
          <path d="M 20 -15 Q 10 -8 2 -12 L 2 5 L 20 5 Z" fill="#052e16" opacity="0.3" />
          <path d="M -6 -8 L -6 15 M 6 -8 L 6 15" stroke="#052e16" opacity="0.4" strokeWidth="1.5" />

          {/* head — snarling green face, small compared to body */}
          <ellipse cx="0" cy="-40" rx="15" ry="14" fill="#16a34a" />
          {/* jagged black hair on top */}
          <path d="M -14 -48 L -10 -55 L -6 -50 L -2 -56 L 2 -50 L 6 -55 L 10 -50 L 14 -48 Z" fill="#0a0a0a" />
          {/* angry brow */}
          <path d="M -10 -42 L -3 -44" stroke="#052e16" strokeWidth="2" strokeLinecap="round" />
          <path d="M 3 -44 L 10 -42" stroke="#052e16" strokeWidth="2" strokeLinecap="round" />
          {/* eyes glowing */}
          <circle cx="-5" cy="-39" r="2" fill="#fef3c7" />
          <circle cx="5" cy="-39" r="2" fill="#fef3c7" />
          {/* teeth-gritted mouth */}
          <path d="M -6 -32 L 6 -32 L 5 -30 L -5 -30 Z" fill="#ffffff" />
          <path d="M -4 -32 L -4 -30 M 0 -32 L 0 -30 M 4 -32 L 4 -30" stroke="#0a0308" strokeWidth="0.5" />

          {/* HUGE arms — right one guarding, left one wound up */}
          <g>
            {/* left arm — cocked back to throw */}
            <animateTransform attributeName="transform" type="rotate"
              values="30 -25 -10; 30 -25 -10; -50 -25 -10; -50 -25 -10; 30 -25 -10"
              keyTimes="0; 0.4; 0.65; 0.8; 1"
              dur="3.2s" repeatCount="indefinite" />
            <path d="M -28 -15 L -45 5 L -40 20 L -22 5 Z" fill="#15803d" />
            <path d="M -40 20 L -55 30 L -50 40 L -35 30 Z" fill="#15803d" />
            {/* massive fist */}
            <circle cx="-52" cy="35" r="14" fill="#16a34a" />
            <circle cx="-52" cy="35" r="14" fill="#052e16" opacity="0.2" />
            <line x1="-60" y1="30" x2="-58" y2="40" stroke="#052e16" strokeWidth="1.2" />
            <line x1="-55" y1="27" x2="-54" y2="40" stroke="#052e16" strokeWidth="1.2" />
            <line x1="-50" y1="27" x2="-50" y2="40" stroke="#052e16" strokeWidth="1.2" />
            <line x1="-45" y1="29" x2="-46" y2="40" stroke="#052e16" strokeWidth="1.2" />
          </g>

          {/* right arm — up to block */}
          <path d="M 28 -20 L 42 -5 L 38 8 L 22 -5 Z" fill="#15803d" />
          <circle cx="42" cy="-2" r="12" fill="#16a34a" />
        </g>
      </g>

      {/* ═════ IMPACT FLASH — when the red hero's punch lands ═════ */}
      <g transform="translate(560 200)">
        <circle r="0" fill="#fef3c7" filter="url(#rsImpact)">
          <animate attributeName="r" values="0;0;35;25;0" keyTimes="0; 0.4; 0.5; 0.6; 0.75" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0;1;0.6;0" keyTimes="0; 0.4; 0.5; 0.6; 0.75" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle r="0" fill="#ffffff">
          <animate attributeName="r" values="0;0;20;12;0" keyTimes="0; 0.42; 0.5; 0.6; 0.7" dur="3.2s" repeatCount="indefinite" />
        </circle>
        {/* impact star burst */}
        <g>
          <animate attributeName="opacity" values="0;0;1;0" keyTimes="0; 0.45; 0.5; 0.65" dur="3.2s" repeatCount="indefinite" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const x = Math.cos(angle) * 22
            const y = Math.sin(angle) * 22
            return <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="#fef3c7" strokeWidth="2.5" strokeLinecap="round" />
          })}
        </g>
        {/* POW! text zapping in */}
        <g transform="translate(-6 -30)">
          <animate attributeName="opacity" values="0;0;1;0.8;0" keyTimes="0; 0.45; 0.5; 0.6; 0.7" dur="3.2s" repeatCount="indefinite" />
          <text fontFamily="Space Grotesk, sans-serif" fontWeight="900" fontSize="26" fill="#fbbf24" stroke="#7f1d1d" strokeWidth="1.5" transform="rotate(-8)">POW!</text>
        </g>
      </g>

      {/* SPARKS radiating from impact */}
      <g transform="translate(560 200)">
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2 + 0.1
          const dist = 45 + (i % 3) * 15
          return (
            <circle key={i} r="0" fill="#fef3c7">
              <animate attributeName="cx" values={`0;0;${Math.cos(angle)*dist}`} keyTimes="0;0.45;0.65" dur="3.2s" repeatCount="indefinite" />
              <animate attributeName="cy" values={`0;0;${Math.sin(angle)*dist}`} keyTimes="0;0.45;0.65" dur="3.2s" repeatCount="indefinite" />
              <animate attributeName="r" values="0;0;2.5;0" keyTimes="0;0.45;0.5;0.65" dur="3.2s" repeatCount="indefinite" />
            </circle>
          )
        })}
      </g>
    </svg>
  )
}
