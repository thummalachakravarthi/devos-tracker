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
// RISE — Cinematic samurai duel. Feudal-Japan garden at golden hour.
// Painterly SVG, no gore. Two masters at their limit, circling, clashing,
// parrying, dashing through mist and falling blossoms. 10s seamless loop.
//
//  0.00–0.15  standoff, wind, petals drifting
//  0.15–0.30  RED dashes in, first clash — spark + shockwave
//  0.30–0.45  BLUE parries, they circle each other
//  0.45–0.60  BLUE lunges, RED sidesteps, sparks
//  0.60–0.75  spinning cross-slash — sword arcs cross mid-air
//  0.75–0.90  push-off, both leap back, capes billow, dust plumes
//  0.90–1.00  return to standoff — seamless loop
// ═══════════════════════════════════════════════════════════════
export function ArtRise() {
  const D = '10s'
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        {/* golden-hour sky — warm top, cool violet-blue below */}
        <linearGradient id="smSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9c06a" />
          <stop offset="0.35" stopColor="#e67e5b" />
          <stop offset="0.65" stopColor="#8b3a62" />
          <stop offset="1" stopColor="#2c1e4a" />
        </linearGradient>
        {/* soft haze layer over the ground */}
        <linearGradient id="smHaze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9c06a" stopOpacity="0" />
          <stop offset="0.6" stopColor="#f9c06a" stopOpacity="0.25" />
          <stop offset="1" stopColor="#f9c06a" stopOpacity="0" />
        </linearGradient>
        {/* setting sun — soft radial */}
        <radialGradient id="smSun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fef3c7" />
          <stop offset="0.25" stopColor="#fef3c7" stopOpacity="0.9" />
          <stop offset="0.55" stopColor="#f59e0b" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        {/* fog volume */}
        <radialGradient id="smFog" cx="0.5" cy="1" r="0.9">
          <stop offset="0" stopColor="#fce7c8" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#e5b98a" stopOpacity="0.2" />
          <stop offset="1" stopColor="#e5b98a" stopOpacity="0" />
        </radialGradient>
        {/* blade — polished steel with reflective streak */}
        <linearGradient id="smBlade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f8fafc" />
          <stop offset="0.3" stopColor="#e2e8f0" />
          <stop offset="0.6" stopColor="#fef3c7" />
          <stop offset="1" stopColor="#cbd5e1" />
        </linearGradient>
        {/* stream water */}
        <linearGradient id="smWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7dd3fc" stopOpacity="0.85" />
          <stop offset="1" stopColor="#1e40af" stopOpacity="0.6" />
        </linearGradient>
        {/* warm rim-light on RED samurai */}
        <linearGradient id="smArmorRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7f1d1d" />
          <stop offset="0.5" stopColor="#b91c1c" />
          <stop offset="1" stopColor="#450a0a" />
        </linearGradient>
        {/* cool rim-light on BLUE samurai */}
        <linearGradient id="smArmorBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0c1e3d" />
          <stop offset="0.5" stopColor="#1e40af" />
          <stop offset="1" stopColor="#0a0a1f" />
        </linearGradient>
        <linearGradient id="smCapeRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dc2626" />
          <stop offset="1" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="smCapeBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
        <filter id="smSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="smMotion">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <filter id="smBlur">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>

      {/* ═════ CAMERA — subtle parallax pan + shake on impacts ═════ */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0 0; -3 -1; -6 -2; -6 -2; 5 -4; -5 4; 0 0; 4 -3; -4 3; 0 0; 6 -5; -6 5; 3 -2; 0 0; 3 1; 6 2; 0 0"
          keyTimes="0; 0.05; 0.13; 0.19; 0.21; 0.23; 0.30; 0.48; 0.50; 0.55; 0.68; 0.70; 0.72; 0.80; 0.90; 0.95; 1"
          dur={D} repeatCount="indefinite" />

        {/* SKY */}
        <rect x="-40" y="-20" width="880" height="340" fill="url(#smSky)" />
        {/* sun */}
        <circle cx="560" cy="130" r="115" fill="url(#smSun)">
          <animate attributeName="opacity" values="0.9;1;0.95;1;0.9" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="560" cy="130" r="34" fill="#fffbeb" opacity="0.95" />
        {/* sun disc glare streak */}
        <ellipse cx="560" cy="130" rx="180" ry="4" fill="#fef3c7" opacity="0.4" filter="url(#smBlur)" />

        {/* DISTANT MOUNTAINS — layered for depth */}
        <path d="M -40 200 L 40 165 L 130 190 L 220 155 L 320 195 L 420 155 L 540 195 L 640 165 L 740 195 L 840 175 L 840 260 L -40 260 Z" fill="#5b2b5c" opacity="0.6" />
        <path d="M -40 215 L 80 185 L 180 210 L 290 180 L 390 220 L 500 180 L 610 215 L 720 190 L 840 215 L 840 260 L -40 260 Z" fill="#3d1a3e" opacity="0.75" />

        {/* haze band across the horizon */}
        <rect x="-40" y="180" width="880" height="90" fill="url(#smHaze)" opacity="0.85" />

        {/* PAGODA silhouette on the left ridge — feudal-Japan detail */}
        <g fill="#1a0d24" opacity="0.85">
          <rect x="90" y="175" width="4" height="30" />
          <path d="M 70 175 L 114 175 L 108 170 L 76 170 Z" />
          <path d="M 74 168 L 110 168 L 106 163 L 78 163 Z" />
          <path d="M 78 161 L 106 161 L 102 157 L 82 157 Z" />
          <path d="M 82 155 L 102 155 L 99 152 L 85 152 Z" />
          <rect x="91" y="152" width="2" height="4" />
        </g>

        {/* TORII gate silhouette far right */}
        <g fill="#2c1120" opacity="0.85">
          <rect x="710" y="180" width="4" height="45" />
          <rect x="750" y="180" width="4" height="45" />
          <path d="M 700 178 L 764 178 L 758 172 L 706 172 Z" />
          <rect x="708" y="188" width="48" height="3" />
        </g>

        {/* CHERRY-BLOSSOM TREE — foreground left */}
        <g>
          {/* trunk */}
          <path d="M 60 260 Q 55 210 70 180 Q 85 170 100 165" stroke="#3f1d1d" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 70 200 Q 45 190 30 175" stroke="#3f1d1d" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 85 175 Q 105 155 130 150" stroke="#3f1d1d" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* pink blossom clouds */}
          <g>
            <ellipse cx="30" cy="150" rx="45" ry="30" fill="#fbcfe8" opacity="0.85">
              <animate attributeName="cy" values="150;148;150" dur="6s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="70" cy="120" rx="55" ry="38" fill="#f9a8d4" opacity="0.9">
              <animate attributeName="cy" values="120;118;120" dur="5s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="120" cy="130" rx="42" ry="30" fill="#fbcfe8" opacity="0.85">
              <animate attributeName="cy" values="130;128;130" dur="7s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="90" cy="90" rx="40" ry="26" fill="#fda4af" opacity="0.7" />
            {/* highlight cluster */}
            <ellipse cx="70" cy="115" rx="18" ry="10" fill="#fce7f3" opacity="0.7" />
          </g>
        </g>

        {/* CHERRY-BLOSSOM TREE — right foreground, angled inward */}
        <g>
          <path d="M 770 260 Q 780 205 760 175 Q 745 165 730 158" stroke="#3f1d1d" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 760 180 Q 785 165 800 148" stroke="#3f1d1d" strokeWidth="5" fill="none" strokeLinecap="round" />
          <g>
            <ellipse cx="780" cy="120" rx="55" ry="38" fill="#f9a8d4" opacity="0.9">
              <animate attributeName="cy" values="120;118;120" dur="5.5s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="740" cy="145" rx="42" ry="28" fill="#fbcfe8" opacity="0.85">
              <animate attributeName="cy" values="145;143;145" dur="6.5s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="810" cy="140" rx="38" ry="25" fill="#fbcfe8" opacity="0.85" />
            <ellipse cx="770" cy="105" rx="30" ry="18" fill="#fda4af" opacity="0.7" />
            <ellipse cx="775" cy="118" rx="16" ry="9" fill="#fce7f3" opacity="0.7" />
          </g>
        </g>

        {/* BAMBOO stalks — swaying, mid-ground behind */}
        <g stroke="#166534" strokeWidth="3" strokeLinecap="round" fill="none">
          {[210, 225, 245, 720, 735, 755].map((x, i) => (
            <g key={i}>
              <animateTransform attributeName="transform" type="rotate" values={`-1 ${x} 260; 1.5 ${x} 260; -1 ${x} 260`} dur={`${4 + (i % 3)}s`} repeatCount="indefinite" />
              <line x1={x} y1="260" x2={x + (i % 2 ? 3 : -2)} y2="150" />
              {/* segment nodes */}
              {[220, 190, 160].map((y, j) => (
                <line key={j} x1={x - 3} y1={y} x2={x + 3} y2={y} strokeWidth="2" />
              ))}
              {/* leaves */}
              <path d={`M ${x + (i % 2 ? 3 : -2)} 155 L ${x + 12} 145 L ${x + (i % 2 ? 3 : -2) + 4} 158 Z`} fill="#22c55e" stroke="none" />
              <path d={`M ${x + (i % 2 ? 3 : -2)} 175 L ${x - 10} 165 L ${x + (i % 2 ? 3 : -2) - 4} 178 Z`} fill="#16a34a" stroke="none" />
            </g>
          ))}
        </g>

        {/* STONE LANTERNS — one either side */}
        <g fill="#57534e">
          {/* left lantern */}
          <g transform="translate(160 245)">
            <rect x="-9" y="0" width="18" height="6" rx="1" fill="#44403c" />
            <rect x="-6" y="-6" width="12" height="6" fill="#57534e" />
            <rect x="-10" y="-12" width="20" height="4" fill="#78716c" />
            <path d="M -11 -12 L -6 -22 L 6 -22 L 11 -12 Z" fill="#3f3f46" />
            <rect x="-6" y="-19" width="12" height="6" fill="#292524" />
            {/* lantern glow */}
            <rect x="-4" y="-18" width="8" height="4" fill="#fef3c7" opacity="0.85">
              <animate attributeName="opacity" values="0.6;0.95;0.6" dur="3.2s" repeatCount="indefinite" />
            </rect>
            <circle cx="0" cy="-16" r="14" fill="#fef3c7" filter="url(#smSoft)" opacity="0.3">
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3.2s" repeatCount="indefinite" />
            </circle>
            <path d="M -14 -22 L 14 -22 L 10 -25 L -10 -25 Z" fill="#3f3f46" />
          </g>
          {/* right lantern */}
          <g transform="translate(650 248)">
            <rect x="-9" y="0" width="18" height="6" rx="1" fill="#44403c" />
            <rect x="-6" y="-6" width="12" height="6" fill="#57534e" />
            <rect x="-10" y="-12" width="20" height="4" fill="#78716c" />
            <path d="M -11 -12 L -6 -22 L 6 -22 L 11 -12 Z" fill="#3f3f46" />
            <rect x="-6" y="-19" width="12" height="6" fill="#292524" />
            <rect x="-4" y="-18" width="8" height="4" fill="#fef3c7" opacity="0.85">
              <animate attributeName="opacity" values="0.6;0.95;0.6" dur="3.6s" repeatCount="indefinite" />
            </rect>
            <circle cx="0" cy="-16" r="14" fill="#fef3c7" filter="url(#smSoft)" opacity="0.3">
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3.6s" repeatCount="indefinite" />
            </circle>
            <path d="M -14 -22 L 14 -22 L 10 -25 L -10 -25 Z" fill="#3f3f46" />
          </g>
        </g>

        {/* FLOWING STREAM diagonal across the ground */}
        <path d="M -20 258 Q 180 268 400 264 T 820 262 L 820 275 Q 600 280 400 276 T -20 273 Z" fill="url(#smWater)" opacity="0.75" />
        {/* stream shimmer highlights */}
        <g stroke="#fef3c7" strokeWidth="1" opacity="0.6" fill="none">
          <path d="M 80 265 Q 120 262 160 266">
            <animate attributeName="d" values="M 80 265 Q 120 262 160 266; M 100 265 Q 140 262 180 266; M 80 265 Q 120 262 160 266" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M 300 268 Q 360 264 420 267">
            <animate attributeName="d" values="M 300 268 Q 360 264 420 267; M 320 268 Q 380 264 440 267; M 300 268 Q 360 264 420 267" dur="4s" repeatCount="indefinite" />
          </path>
          <path d="M 560 264 Q 620 260 690 264">
            <animate attributeName="d" values="M 560 264 Q 620 260 690 264; M 580 264 Q 640 260 710 264; M 560 264 Q 620 260 690 264" dur="3.5s" repeatCount="indefinite" />
          </path>
        </g>

        {/* MOSSY ROCKS scattered */}
        <g>
          <ellipse cx="190" cy="272" rx="18" ry="6" fill="#44403c" />
          <path d="M 176 268 Q 190 260 204 268 L 204 275 L 176 275 Z" fill="#57534e" />
          <path d="M 178 264 Q 190 258 202 264" stroke="#65a30d" strokeWidth="1.5" fill="none" opacity="0.7" />
          <ellipse cx="620" cy="275" rx="22" ry="7" fill="#44403c" />
          <path d="M 602 270 Q 620 260 638 270 L 638 278 L 602 278 Z" fill="#57534e" />
          <path d="M 604 265 Q 620 258 636 265" stroke="#65a30d" strokeWidth="1.5" fill="none" opacity="0.7" />
        </g>

        {/* GROUND — packed earth with warm gold light */}
        <rect x="-40" y="270" width="880" height="35" fill="#4a2f1f" />
        <rect x="-40" y="270" width="880" height="4" fill="#78350f" opacity="0.6" />
        {/* grass tufts */}
        <g stroke="#65a30d" strokeWidth="1" strokeLinecap="round" opacity="0.65">
          {Array.from({length: 25}).map((_, i) => (
            <g key={i}>
              <animateTransform attributeName="transform" type="rotate" values={`-4 ${20 + i * 32} 275; 4 ${20 + i * 32} 275; -4 ${20 + i * 32} 275`} dur="3s" repeatCount="indefinite" />
              <line x1={20 + i * 32} y1="276" x2={20 + i * 32 - 2} y2="270" />
              <line x1={20 + i * 32 + 2} y1="276" x2={20 + i * 32 + 4} y2="270" />
            </g>
          ))}
        </g>

        {/* VOLUMETRIC FOG — drifting across the ground */}
        <g opacity="0.6">
          <ellipse cx="200" cy="255" rx="200" ry="24" fill="url(#smFog)">
            <animate attributeName="cx" values="200;600;200" dur="30s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="500" cy="260" rx="220" ry="22" fill="url(#smFog)">
            <animate attributeName="cx" values="500;100;500" dur="34s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="700" cy="255" rx="180" ry="20" fill="url(#smFog)">
            <animate attributeName="cx" values="700;300;700" dur="28s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* CHERRY BLOSSOM PETALS — many, various sizes/speeds */}
        <g>
          {Array.from({length: 24}).map((_, i) => {
            const startX = -20 + (i * 37) % 840
            const speed = 6 + (i % 5) * 1.4
            const size = 1.5 + (i % 4) * 0.6
            const color = i % 3 === 0 ? '#fda4af' : (i % 3 === 1 ? '#fbcfe8' : '#f9a8d4')
            const delay = (i * 0.4) % 6
            return (
              <g key={i}>
                <ellipse cx="0" cy="-20" rx={size} ry={size * 0.6} fill={color} opacity="0.85">
                  <animate attributeName="cy" values="-20;310" dur={`${speed}s`} begin={`${delay}s`} repeatCount="indefinite" />
                  <animate attributeName="cx" values={`${startX};${startX - 40 - (i % 3) * 20}`} dur={`${speed}s`} begin={`${delay}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.1;0.85;1" dur={`${speed}s`} begin={`${delay}s`} repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="rotate" values="0;720" dur={`${speed * 0.4}s`} begin={`${delay}s`} repeatCount="indefinite" additive="sum" />
                </ellipse>
              </g>
            )
          })}
        </g>

        {/* WIND STREAKS — reacting to sword swings, appear on strikes */}
        <g stroke="#fde68a" strokeWidth="0.8" strokeLinecap="round" opacity="0">
          <animate attributeName="opacity" values="0;0;0.55;0;0;0.6;0;0;0.7;0" keyTimes="0;0.18;0.22;0.28;0.44;0.48;0.55;0.62;0.66;0.75" dur={D} repeatCount="indefinite" />
          {Array.from({length: 12}).map((_, i) => (
            <line key={i} x1={340 + (i - 6) * 8} y1={180 + (i % 4) * 15} x2={440 + (i - 6) * 8} y2={180 + (i % 4) * 15} />
          ))}
        </g>

        {/* ═════════════════════════════════════════════════ */}
        {/* RED SAMURAI — circles clockwise around center 400,240 */}
        {/* Poses: standoff → dash-in → parry → sidestep → spin-slash → leap back → standoff */}
        {/* ═════════════════════════════════════════════════ */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="280 0; 280 0; 340 0; 360 -10; 340 0; 300 0; 320 0; 380 -10; 400 -5; 340 0; 300 0; 260 -8; 280 0; 280 0"
            keyTimes="0; 0.13; 0.20; 0.23; 0.30; 0.38; 0.45; 0.58; 0.62; 0.72; 0.82; 0.88; 0.95; 1"
            dur={D} repeatCount="indefinite" />
          {/* facing-angle sway */}
          <g>
            <animateTransform attributeName="transform" type="rotate"
              values="0 0 240; 0 0 240; -6 0 240; 4 0 240; -4 0 240; 6 0 240; -8 0 240; 3 0 240; -3 0 240; -5 0 240; 3 0 240; 0 0 240"
              keyTimes="0; 0.13; 0.22; 0.30; 0.38; 0.48; 0.58; 0.65; 0.75; 0.85; 0.92; 1"
              dur={D} repeatCount="indefinite" />

            {/* motion blur trail during dashes */}
            <ellipse cx="0" cy="215" rx="0" ry="0" fill="#450a0a" opacity="0" filter="url(#smMotion)">
              <animate attributeName="rx" values="0;35;0;0;25;0;0;30;0" keyTimes="0;0.20;0.25;0.44;0.48;0.55;0.60;0.85;0.90" dur={D} repeatCount="indefinite" />
              <animate attributeName="ry" values="0;16;0;0;12;0;0;14;0" keyTimes="0;0.20;0.25;0.44;0.48;0.55;0.60;0.85;0.90" dur={D} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.55;0;0;0.45;0;0;0.55;0" keyTimes="0;0.20;0.25;0.44;0.48;0.55;0.60;0.85;0.90" dur={D} repeatCount="indefinite" />
            </ellipse>

            {/* the samurai body */}
            <g transform="translate(0 232)">
              {/* long red cape flowing behind (right side) */}
              <path d="M 4 -30 Q 30 -20 40 10 Q 26 12 4 -8 Z" fill="url(#smCapeRed)" opacity="0.9">
                <animate attributeName="d"
                  values="M 4 -30 Q 30 -20 40 10 Q 26 12 4 -8 Z;
                          M 4 -30 Q 38 -26 46 -2 Q 30 6 4 -8 Z;
                          M 4 -30 Q 30 -20 40 10 Q 26 12 4 -8 Z"
                  dur="1.6s" repeatCount="indefinite" />
              </path>
              {/* cape underside shadow */}
              <path d="M 4 -25 Q 28 -18 36 4 Q 20 4 4 -6 Z" fill="#450a0a" opacity="0.6" />

              {/* legs — planted stance, split slightly */}
              <path d="M -6 8 L -12 30 L -6 32 L 0 10 Z" fill="url(#smArmorRed)" />
              <path d="M 6 8 L 14 28 L 20 28 L 10 10 Z" fill="url(#smArmorRed)" />
              {/* leg armor plates */}
              <path d="M -10 22 L -6 30 L 0 28 L -4 20 Z" fill="#450a0a" />
              <path d="M 12 22 L 18 28 L 20 26 L 14 20 Z" fill="#450a0a" />
              {/* boots */}
              <ellipse cx="-9" cy="32" rx="7" ry="2.5" fill="#1c0505" />
              <ellipse cx="17" cy="29" rx="7" ry="2.5" fill="#1c0505" />

              {/* skirt/haidate armor panels */}
              <path d="M -14 -4 L -16 14 L 16 14 L 14 -4 Z" fill="url(#smArmorRed)" />
              <path d="M -14 0 L -14 12 M -8 -2 L -8 14 M 0 -2 L 0 14 M 8 -2 L 8 14 M 14 0 L 14 12" stroke="#7f1d1d" strokeWidth="0.6" opacity="0.7" />
              {/* belt sash */}
              <rect x="-15" y="-6" width="30" height="4" fill="#0a0a0a" />
              <rect x="-15" y="-6" width="30" height="1" fill="#fbbf24" opacity="0.6" />

              {/* CUIRASS (torso armor) — do (胴) */}
              <path d="M -14 -28 L -16 -4 L 16 -4 L 14 -28 Q 0 -34 -14 -28 Z" fill="url(#smArmorRed)" />
              {/* lamellar horizontal bands */}
              <path d="M -15 -22 L 15 -22 M -15 -16 L 15 -16 M -16 -10 L 16 -10" stroke="#450a0a" strokeWidth="0.8" opacity="0.7" />
              {/* rim highlight */}
              <path d="M -14 -28 Q 0 -34 14 -28" stroke="#fef3c7" strokeWidth="0.8" fill="none" opacity="0.5" />
              {/* clan emblem (mon) */}
              <circle cx="0" cy="-18" r="4" fill="#0a0a0a" />
              <circle cx="0" cy="-18" r="2.5" fill="#fbbf24" opacity="0.85" />

              {/* SHOULDER GUARDS (sode) */}
              <path d="M -16 -26 L -22 -18 L -22 -8 L -16 -10 Z" fill="#450a0a" />
              <path d="M -18 -22 L -18 -12" stroke="#7f1d1d" strokeWidth="0.6" />
              <path d="M 16 -26 L 22 -18 L 22 -8 L 16 -10 Z" fill="#450a0a" />
              <path d="M 18 -22 L 18 -12" stroke="#7f1d1d" strokeWidth="0.6" />

              {/* NECK GUARD & KABUTO (helmet) */}
              <ellipse cx="0" cy="-38" rx="10" ry="12" fill="#1c1917" />
              {/* helmet dome with ridges */}
              <path d="M -10 -38 Q 0 -52 10 -38 L 10 -32 L -10 -32 Z" fill="#292524" />
              <path d="M -6 -50 Q 0 -54 6 -50" stroke="#57534e" strokeWidth="0.7" fill="none" />
              {/* MAEDATE — golden crest ornament (crescent) */}
              <path d="M -6 -52 Q 0 -62 6 -52 Q 3 -54 0 -55 Q -3 -54 -6 -52 Z" fill="#fbbf24" />
              {/* helmet brim */}
              <path d="M -12 -34 L 12 -34 L 10 -32 L -10 -32 Z" fill="#0a0a0a" />
              {/* face mask (menpo) — dark, snarling */}
              <path d="M -8 -34 L -8 -26 Q 0 -22 8 -26 L 8 -34 Z" fill="#0a0a0a" />
              <path d="M -6 -30 L 6 -30" stroke="#7f1d1d" strokeWidth="0.5" />
              {/* eye slit — glowing */}
              <rect x="-6" y="-38" width="12" height="1.5" fill="#0a0208" />
              <rect x="-5" y="-37.7" width="4" height="1" fill="#fef3c7" opacity="0.9" />
              <rect x="1" y="-37.7" width="4" height="1" fill="#fef3c7" opacity="0.9" />

              {/* SWORD ARM — right, holding katana */}
              <g>
                {/* full-loop choreography: parry → strike → guard → strike → high-arc slash → recover */}
                <animateTransform attributeName="transform" type="rotate"
                  values="-40 12 -14; -40 12 -14; 55 12 -14; -20 12 -14; -60 12 -14; 45 12 -14; -30 12 -14; -180 12 -14; -180 12 -14; -40 12 -14; -40 12 -14"
                  keyTimes="0; 0.13; 0.22; 0.30; 0.40; 0.48; 0.55; 0.65; 0.72; 0.90; 1"
                  dur={D} repeatCount="indefinite" />
                {/* upper arm + forearm */}
                <path d="M 10 -18 L 20 -6 L 32 -8 L 22 -20 Z" fill="url(#smArmorRed)" />
                <path d="M 30 -8 L 44 -2 L 46 -8 L 32 -14 Z" fill="url(#smArmorRed)" />
                {/* gauntlet */}
                <path d="M 42 -6 L 50 -2 L 50 -8 L 42 -12 Z" fill="#0a0a0a" />
                {/* hand */}
                <circle cx="52" cy="-5" r="3.5" fill="#e5c9a0" />
                {/* katana tsuka (handle) */}
                <rect x="52" y="-8" width="14" height="6" rx="1" fill="#0a0a0a" />
                <path d="M 53 -8 L 65 -8 M 53 -6 L 65 -6 M 53 -4 L 65 -4 M 53 -2 L 65 -2" stroke="#78350f" strokeWidth="0.4" />
                {/* tsuba (guard) */}
                <rect x="66" y="-10" width="3" height="10" fill="#fbbf24" />
                {/* katana BLADE — long, slightly curved */}
                <g>
                  <path d="M 69 -8 Q 100 -14 140 -12 L 140 -6 Q 100 -8 69 -4 Z" fill="url(#smBlade)" />
                  <path d="M 69 -8 Q 100 -14 140 -12" stroke="#f8fafc" strokeWidth="0.6" opacity="0.9" />
                  {/* blade shine — flickers */}
                  <path d="M 74 -9 Q 95 -12 130 -11" stroke="#ffffff" strokeWidth="0.8" opacity="0" strokeLinecap="round">
                    <animate attributeName="opacity" values="0;0.9;0;0;0.9;0;0;0.9;0" keyTimes="0;0.05;0.10;0.30;0.35;0.40;0.60;0.65;0.70" dur={D} repeatCount="indefinite" />
                  </path>
                </g>
                {/* sword-arc streak on strike */}
                <path d="M 60 -8 Q 120 -50 160 -20" stroke="#fef3c7" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0" filter="url(#smMotion)">
                  <animate attributeName="opacity" values="0;0;0.85;0;0;0.85;0;0;0.95;0;0" keyTimes="0;0.20;0.24;0.30;0.46;0.50;0.55;0.65;0.70;0.75;1" dur={D} repeatCount="indefinite" />
                </path>
              </g>

              {/* OFF-HAND (left) — guard, then supports second grip */}
              <g>
                <animateTransform attributeName="transform" type="rotate"
                  values="30 -12 -14; -20 -12 -14; 40 -12 -14; -30 -12 -14; 20 -12 -14; 30 -12 -14"
                  keyTimes="0; 0.22; 0.40; 0.55; 0.75; 1" dur={D} repeatCount="indefinite" />
                <path d="M -10 -18 L -22 -6 L -18 0 L -8 -8 Z" fill="url(#smArmorRed)" />
                <circle cx="-24" cy="-4" r="3.5" fill="#e5c9a0" />
              </g>
            </g>
          </g>
        </g>

        {/* ═════════════════════════════════════════════════ */}
        {/* BLUE SAMURAI — circles counter-clockwise, mirror choreography */}
        {/* ═════════════════════════════════════════════════ */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="520 0; 520 0; 460 0; 440 -10; 460 0; 500 0; 480 0; 420 -10; 400 -5; 460 0; 500 0; 540 -8; 520 0; 520 0"
            keyTimes="0; 0.13; 0.20; 0.23; 0.30; 0.38; 0.45; 0.58; 0.62; 0.72; 0.82; 0.88; 0.95; 1"
            dur={D} repeatCount="indefinite" />
          <g>
            <animateTransform attributeName="transform" type="rotate"
              values="0 0 240; 0 0 240; 6 0 240; -4 0 240; 4 0 240; -6 0 240; 8 0 240; -3 0 240; 3 0 240; 5 0 240; -3 0 240; 0 0 240"
              keyTimes="0; 0.13; 0.22; 0.30; 0.38; 0.48; 0.58; 0.65; 0.75; 0.85; 0.92; 1"
              dur={D} repeatCount="indefinite" />

            <ellipse cx="0" cy="215" rx="0" ry="0" fill="#0a0a1f" opacity="0" filter="url(#smMotion)">
              <animate attributeName="rx" values="0;35;0;0;25;0;0;30;0" keyTimes="0;0.20;0.25;0.44;0.48;0.55;0.60;0.85;0.90" dur={D} repeatCount="indefinite" />
              <animate attributeName="ry" values="0;16;0;0;12;0;0;14;0" keyTimes="0;0.20;0.25;0.44;0.48;0.55;0.60;0.85;0.90" dur={D} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.55;0;0;0.45;0;0;0.55;0" keyTimes="0;0.20;0.25;0.44;0.48;0.55;0.60;0.85;0.90" dur={D} repeatCount="indefinite" />
            </ellipse>

            <g transform="translate(0 232)">
              {/* blue cape — on the left, mirror */}
              <path d="M -4 -30 Q -30 -20 -40 10 Q -26 12 -4 -8 Z" fill="url(#smCapeBlue)" opacity="0.9">
                <animate attributeName="d"
                  values="M -4 -30 Q -30 -20 -40 10 Q -26 12 -4 -8 Z;
                          M -4 -30 Q -38 -26 -46 -2 Q -30 6 -4 -8 Z;
                          M -4 -30 Q -30 -20 -40 10 Q -26 12 -4 -8 Z"
                  dur="1.6s" repeatCount="indefinite" />
              </path>
              <path d="M -4 -25 Q -28 -18 -36 4 Q -20 4 -4 -6 Z" fill="#0a0a1f" opacity="0.6" />

              {/* legs (mirrored) */}
              <path d="M 6 8 L 12 30 L 6 32 L 0 10 Z" fill="url(#smArmorBlue)" />
              <path d="M -6 8 L -14 28 L -20 28 L -10 10 Z" fill="url(#smArmorBlue)" />
              <path d="M 10 22 L 6 30 L 0 28 L 4 20 Z" fill="#0a0a1f" />
              <path d="M -12 22 L -18 28 L -20 26 L -14 20 Z" fill="#0a0a1f" />
              <ellipse cx="9" cy="32" rx="7" ry="2.5" fill="#050510" />
              <ellipse cx="-17" cy="29" rx="7" ry="2.5" fill="#050510" />

              {/* skirt */}
              <path d="M -14 -4 L -16 14 L 16 14 L 14 -4 Z" fill="url(#smArmorBlue)" />
              <path d="M -14 0 L -14 12 M -8 -2 L -8 14 M 0 -2 L 0 14 M 8 -2 L 8 14 M 14 0 L 14 12" stroke="#1e40af" strokeWidth="0.6" opacity="0.7" />
              <rect x="-15" y="-6" width="30" height="4" fill="#0a0a0a" />
              <rect x="-15" y="-6" width="30" height="1" fill="#cbd5e1" opacity="0.6" />

              {/* cuirass */}
              <path d="M -14 -28 L -16 -4 L 16 -4 L 14 -28 Q 0 -34 -14 -28 Z" fill="url(#smArmorBlue)" />
              <path d="M -15 -22 L 15 -22 M -15 -16 L 15 -16 M -16 -10 L 16 -10" stroke="#0a0a1f" strokeWidth="0.8" opacity="0.7" />
              <path d="M -14 -28 Q 0 -34 14 -28" stroke="#cbd5e1" strokeWidth="0.8" fill="none" opacity="0.5" />
              <circle cx="0" cy="-18" r="4" fill="#0a0a0a" />
              <path d="M -2.5 -18 L 2.5 -18 M 0 -20.5 L 0 -15.5" stroke="#e2e8f0" strokeWidth="0.8" />

              {/* shoulder guards */}
              <path d="M -16 -26 L -22 -18 L -22 -8 L -16 -10 Z" fill="#0a0a1f" />
              <path d="M -18 -22 L -18 -12" stroke="#1e40af" strokeWidth="0.6" />
              <path d="M 16 -26 L 22 -18 L 22 -8 L 16 -10 Z" fill="#0a0a1f" />
              <path d="M 18 -22 L 18 -12" stroke="#1e40af" strokeWidth="0.6" />

              {/* helmet */}
              <ellipse cx="0" cy="-38" rx="10" ry="12" fill="#0c0c1c" />
              <path d="M -10 -38 Q 0 -52 10 -38 L 10 -32 L -10 -32 Z" fill="#1e293b" />
              <path d="M -6 -50 Q 0 -54 6 -50" stroke="#334155" strokeWidth="0.7" fill="none" />
              {/* MAEDATE — silver horns */}
              <path d="M -5 -52 Q -8 -60 -4 -62 Q -2 -58 -2 -52 Z" fill="#e2e8f0" />
              <path d="M 5 -52 Q 8 -60 4 -62 Q 2 -58 2 -52 Z" fill="#e2e8f0" />
              <path d="M -12 -34 L 12 -34 L 10 -32 L -10 -32 Z" fill="#0a0a0a" />
              <path d="M -8 -34 L -8 -26 Q 0 -22 8 -26 L 8 -34 Z" fill="#0a0a0a" />
              <path d="M -6 -30 L 6 -30" stroke="#1e40af" strokeWidth="0.5" />
              <rect x="-6" y="-38" width="12" height="1.5" fill="#0a0208" />
              <rect x="-5" y="-37.7" width="4" height="1" fill="#7dd3fc" opacity="0.9" />
              <rect x="1" y="-37.7" width="4" height="1" fill="#7dd3fc" opacity="0.9" />

              {/* SWORD ARM — mirrored, cross-body strikes */}
              <g>
                <animateTransform attributeName="transform" type="rotate"
                  values="40 -12 -14; 40 -12 -14; -55 -12 -14; 20 -12 -14; 60 -12 -14; -45 -12 -14; 30 -12 -14; 180 -12 -14; 180 -12 -14; 40 -12 -14; 40 -12 -14"
                  keyTimes="0; 0.13; 0.22; 0.30; 0.40; 0.48; 0.55; 0.65; 0.72; 0.90; 1"
                  dur={D} repeatCount="indefinite" />
                <path d="M -10 -18 L -20 -6 L -32 -8 L -22 -20 Z" fill="url(#smArmorBlue)" />
                <path d="M -30 -8 L -44 -2 L -46 -8 L -32 -14 Z" fill="url(#smArmorBlue)" />
                <path d="M -42 -6 L -50 -2 L -50 -8 L -42 -12 Z" fill="#0a0a0a" />
                <circle cx="-52" cy="-5" r="3.5" fill="#e5c9a0" />
                <rect x="-66" y="-8" width="14" height="6" rx="1" fill="#0a0a0a" />
                <path d="M -65 -8 L -53 -8 M -65 -6 L -53 -6 M -65 -4 L -53 -4 M -65 -2 L -53 -2" stroke="#334155" strokeWidth="0.4" />
                <rect x="-69" y="-10" width="3" height="10" fill="#e2e8f0" />
                <g>
                  <path d="M -69 -8 Q -100 -14 -140 -12 L -140 -6 Q -100 -8 -69 -4 Z" fill="url(#smBlade)" />
                  <path d="M -69 -8 Q -100 -14 -140 -12" stroke="#f8fafc" strokeWidth="0.6" opacity="0.9" />
                  <path d="M -74 -9 Q -95 -12 -130 -11" stroke="#ffffff" strokeWidth="0.8" opacity="0" strokeLinecap="round">
                    <animate attributeName="opacity" values="0;0.9;0;0;0.9;0;0;0.9;0" keyTimes="0;0.08;0.13;0.35;0.40;0.45;0.62;0.67;0.72" dur={D} repeatCount="indefinite" />
                  </path>
                </g>
                <path d="M -60 -8 Q -120 -50 -160 -20" stroke="#fef3c7" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0" filter="url(#smMotion)">
                  <animate attributeName="opacity" values="0;0;0.85;0;0;0.85;0;0;0.95;0;0" keyTimes="0;0.20;0.24;0.30;0.46;0.50;0.55;0.65;0.70;0.75;1" dur={D} repeatCount="indefinite" />
                </path>
              </g>

              <g>
                <animateTransform attributeName="transform" type="rotate"
                  values="-30 12 -14; 20 12 -14; -40 12 -14; 30 12 -14; -20 12 -14; -30 12 -14"
                  keyTimes="0; 0.22; 0.40; 0.55; 0.75; 1" dur={D} repeatCount="indefinite" />
                <path d="M 10 -18 L 22 -6 L 18 0 L 8 -8 Z" fill="url(#smArmorBlue)" />
                <circle cx="24" cy="-4" r="3.5" fill="#e5c9a0" />
              </g>
            </g>
          </g>
        </g>

        {/* ═════ CLASH SPARKS — timed to strikes ═════ */}
        {[
          { t: 0.21, cx: 400, cy: 212 },
          { t: 0.47, cx: 400, cy: 215 },
          { t: 0.61, cx: 400, cy: 200 },
          { t: 0.68, cx: 400, cy: 195 },
        ].map((clash, idx) => (
          <g key={idx} transform={`translate(${clash.cx} ${clash.cy})`}>
            <circle r="0" fill="#fef3c7" filter="url(#smBlur)">
              <animate attributeName="r" values={`0;0;24;12;0`} keyTimes={`0;${(clash.t - 0.01).toFixed(3)};${clash.t.toFixed(3)};${(clash.t + 0.015).toFixed(3)};${(clash.t + 0.035).toFixed(3)}`} dur={D} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0;1;0.6;0" keyTimes={`0;${(clash.t - 0.01).toFixed(3)};${clash.t.toFixed(3)};${(clash.t + 0.015).toFixed(3)};${(clash.t + 0.035).toFixed(3)}`} dur={D} repeatCount="indefinite" />
            </circle>
            <circle r="0" fill="#ffffff">
              <animate attributeName="r" values={`0;0;10;0`} keyTimes={`0;${clash.t.toFixed(3)};${(clash.t + 0.01).toFixed(3)};${(clash.t + 0.025).toFixed(3)}`} dur={D} repeatCount="indefinite" />
            </circle>
            {/* spark shards */}
            {Array.from({length: 10}).map((_, i) => {
              const a = (i / 10) * Math.PI * 2
              const d = 40 + (i % 3) * 12
              return (
                <circle key={i} r="0" fill="#fbbf24">
                  <animate attributeName="cx" values={`0;0;${Math.cos(a) * d}`} keyTimes={`0;${clash.t.toFixed(3)};${(clash.t + 0.06).toFixed(3)}`} dur={D} repeatCount="indefinite" />
                  <animate attributeName="cy" values={`0;0;${Math.sin(a) * d}`} keyTimes={`0;${clash.t.toFixed(3)};${(clash.t + 0.06).toFixed(3)}`} dur={D} repeatCount="indefinite" />
                  <animate attributeName="r" values={`0;0;2.2;0`} keyTimes={`0;${clash.t.toFixed(3)};${(clash.t + 0.02).toFixed(3)};${(clash.t + 0.06).toFixed(3)}`} dur={D} repeatCount="indefinite" />
                </circle>
              )
            })}
            {/* shockwave ring on heavy clash */}
            {idx === 2 && (
              <circle r="0" fill="none" stroke="#fef3c7" strokeWidth="2">
                <animate attributeName="r" values="0;0;60;100" keyTimes={`0;${clash.t.toFixed(3)};${(clash.t + 0.04).toFixed(3)};${(clash.t + 0.10).toFixed(3)}`} dur={D} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0;0.75;0" keyTimes={`0;${clash.t.toFixed(3)};${(clash.t + 0.04).toFixed(3)};${(clash.t + 0.10).toFixed(3)}`} dur={D} repeatCount="indefinite" />
              </circle>
            )}
          </g>
        ))}

        {/* ═════ DUST PLUMES kicked up on ground impacts ═════ */}
        {[
          { t: 0.20, x: 340 },
          { t: 0.47, x: 460 },
          { t: 0.62, x: 400 },
          { t: 0.86, x: 300 },
          { t: 0.86, x: 500 },
        ].map((puff, idx) => (
          <ellipse key={idx} cx={puff.x} cy="262" rx="0" ry="0" fill="#d4a574" opacity="0" filter="url(#smSoft)">
            <animate attributeName="rx" values={`0;0;30;50;0`} keyTimes={`0;${(puff.t - 0.01).toFixed(3)};${puff.t.toFixed(3)};${(puff.t + 0.05).toFixed(3)};${(puff.t + 0.14).toFixed(3)}`} dur={D} repeatCount="indefinite" />
            <animate attributeName="ry" values={`0;0;10;16;0`} keyTimes={`0;${(puff.t - 0.01).toFixed(3)};${puff.t.toFixed(3)};${(puff.t + 0.05).toFixed(3)};${(puff.t + 0.14).toFixed(3)}`} dur={D} repeatCount="indefinite" />
            <animate attributeName="opacity" values={`0;0;0.6;0.3;0`} keyTimes={`0;${(puff.t - 0.01).toFixed(3)};${puff.t.toFixed(3)};${(puff.t + 0.05).toFixed(3)};${(puff.t + 0.14).toFixed(3)}`} dur={D} repeatCount="indefinite" />
          </ellipse>
        ))}

        {/* butterfly — occasionally flees the fight */}
        <g fill="#fef3c7">
          <g>
            <animateTransform attributeName="transform" type="translate"
              values="380 180; 380 180; 360 150; 320 130; 250 110; 180 90; 100 70; 40 60; -20 50" keyTimes="0;0.14;0.20;0.30;0.45;0.60;0.75;0.90;1" dur={D} repeatCount="indefinite" />
            <g>
              <animateTransform attributeName="transform" type="scale" values="1;1.15;1" dur="0.25s" repeatCount="indefinite" additive="sum" />
              <path d="M 0 0 L -5 -4 L -7 0 L -5 3 Z" />
              <path d="M 0 0 L 5 -4 L 7 0 L 5 3 Z" />
              <rect x="-0.5" y="-2" width="1" height="4" fill="#78350f" />
            </g>
          </g>
        </g>

        {/* golden-hour sunlight rays angling in from the sun */}
        <g stroke="#fef3c7" strokeWidth="1" opacity="0.18" strokeLinecap="round">
          {Array.from({length: 6}).map((_, i) => (
            <line key={i} x1="560" y1="130" x2={200 + i * 90} y2={310} />
          ))}
        </g>

        {/* faint film-grain / floating dust particles */}
        <g fill="#fef3c7" opacity="0.55">
          {Array.from({length: 20}).map((_, i) => (
            <circle key={i} r="0.8">
              <animate attributeName="cx" values={`${20 + (i * 43) % 780};${(20 + (i * 43) % 780) + 30}`} dur={`${8 + (i % 5)}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${140 + (i * 17) % 130};${140 + (i * 17) % 130 - 30}`} dur={`${8 + (i % 5)}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" dur={`${8 + (i % 5)}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>

        {/* subtle vignette — darkens edges for cinematic framing */}
        <radialGradient id="smVignette" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
        <rect x="-40" y="-20" width="880" height="340" fill="url(#smVignette)" />
      </g>
    </svg>
  )
}
