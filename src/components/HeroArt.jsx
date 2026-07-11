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
