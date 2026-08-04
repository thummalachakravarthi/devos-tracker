// Original hero-tab art — vibrant, saturated, high-contrast.
import RiseCinematic, { } from './RiseCinematic'
import { useState } from 'react'
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
// RISE — Breathing-technique clash. Flame vs Water, ukiyo-e styling.
// The technique dwarfs the swordsman; that's the whole point.
// 3.5s loop.
//   0–14%   crouch, blades charge, embers and droplets gather
//  14–34%   god-speed dash with afterimages, techniques erupt
//  34–45%   COLLISION — screen-wide blowout, shockwave, shrapnel, shake
//  45–70%   deadlock: fire and water grind, steam boils off
//  70–86%   blowback, both hurled apart
//  86–100%  land, reset — seamless
// ═══════════════════════════════════════════════════════════════
function ArtRiseSvg() {
  const shards = Array.from({ length: 34 }, (_, i) => {
    const a = (i / 34) * Math.PI * 2
    const sp = 90 + ((i * 41) % 130)
    return {
      dx: (Math.cos(a) * sp).toFixed(0),
      dy: (Math.sin(a) * sp * 0.58).toFixed(0),
      d: (0.28 + ((i * 17) % 34) / 100).toFixed(2),
      r: (1.2 + ((i * 7) % 26) / 10).toFixed(1),
      hot: i % 2 === 0,
    }
  })
  const rays = Array.from({ length: 22 }, (_, i) => i * (360 / 22))

  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="rzSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#07070f" />
          <stop offset="0.45" stopColor="#1a0f26" />
          <stop offset="1" stopColor="#2b0a14" />
        </linearGradient>
        <linearGradient id="rzFire" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a0d0d" />
          <stop offset="0.35" stopColor="#e8321a" />
          <stop offset="0.7" stopColor="#ff8f2e" />
          <stop offset="1" stopColor="#ffe07a" />
        </linearGradient>
        <linearGradient id="rzWater" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#062a63" />
          <stop offset="0.35" stopColor="#1668d6" />
          <stop offset="0.7" stopColor="#4fc3f7" />
          <stop offset="1" stopColor="#d9f6ff" />
        </linearGradient>
        <radialGradient id="rzCore" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.3" stopColor="#ffe9a8" stopOpacity="0.95" />
          <stop offset="0.62" stopColor="#ff6a2a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7a1bd6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rzVig" cx="0.5" cy="0.5" r="0.72">
          <stop offset="0.42" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.8" />
        </radialGradient>
        <filter id="rzG" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="rzG2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        <style>{`
          .k-shake { animation: kShake 3.5s steps(1,end) infinite; }
          @keyframes kShake {
            0%,33.9% { transform: translate(0,0) }
            34%   { transform: translate(-13px,8px) scale(1.05) }
            35.4% { transform: translate(11px,-9px) scale(1.045) }
            36.8% { transform: translate(-9px,-4px) scale(1.04) }
            38.2% { transform: translate(7px,6px) scale(1.03) }
            39.6% { transform: translate(-5px,-3px) scale(1.02) }
            41%   { transform: translate(3px,2px) scale(1.01) }
            44%,100% { transform: translate(0,0) }
          }
          .k-flash { animation: kFlash 3.5s linear infinite; }
          @keyframes kFlash {
            0%,33% { opacity: 0 } 34% { opacity: 1 } 37% { opacity: .45 }
            41% { opacity: .12 } 47%,100% { opacity: 0 }
          }
          .k-fire { animation: kFire 3.5s cubic-bezier(.85,0,.2,1) infinite; transform-origin: 0px 190px; }
          @keyframes kFire {
            0%,14% { opacity: 0; transform: translateX(-320px) scaleX(.3) }
            22% { opacity: 1 }
            34% { opacity: 1; transform: translateX(0) scaleX(1) }
            62% { opacity: .95; transform: translateX(-14px) scaleX(.97) }
            76% { opacity: 0; transform: translateX(-260px) scaleX(.5) }
            100% { opacity: 0; transform: translateX(-320px) scaleX(.3) }
          }
          .k-water { animation: kWater 3.5s cubic-bezier(.85,0,.2,1) infinite; transform-origin: 800px 190px; }
          @keyframes kWater {
            0%,14% { opacity: 0; transform: translateX(320px) scaleX(.3) }
            22% { opacity: 1 }
            34% { opacity: 1; transform: translateX(0) scaleX(1) }
            62% { opacity: .95; transform: translateX(14px) scaleX(.97) }
            76% { opacity: 0; transform: translateX(260px) scaleX(.5) }
            100% { opacity: 0; transform: translateX(320px) scaleX(.3) }
          }
          .k-core { animation: kCore 3.5s linear infinite; transform-origin: 400px 186px; }
          @keyframes kCore {
            0%,32% { opacity: 0; transform: scale(.15) }
            34.5% { opacity: 1; transform: scale(1.5) }
            48% { opacity: .8; transform: scale(1.05) }
            68% { opacity: .55; transform: scale(1.15) }
            78% { opacity: 0; transform: scale(2) }
            100% { opacity: 0 }
          }
          .k-ring { animation: kRing 3.5s linear infinite; transform-origin: 400px 188px; }
          @keyframes kRing {
            0%,33% { opacity: 0; transform: scale(.08) }
            35% { opacity: 1 }
            52% { opacity: 0; transform: scale(4.2) }
            100% { opacity: 0; transform: scale(4.2) }
          }
          .k-shard { animation: kShard 3.5s linear infinite; }
          @keyframes kShard {
            0%,33.5% { opacity: 0; transform: translate(0,0) scale(1) }
            35% { opacity: 1 }
            56% { opacity: 0; transform: translate(var(--x), var(--y)) scale(.15) }
            100% { opacity: 0; transform: translate(var(--x), var(--y)) scale(.15) }
          }
          .k-rays { animation: kRays 3.5s linear infinite; transform-origin: 400px 188px; }
          @keyframes kRays {
            0%,32% { opacity: 0; transform: scale(.2) rotate(0deg) }
            35% { opacity: .9; transform: scale(1) rotate(6deg) }
            50% { opacity: 0; transform: scale(1.7) rotate(14deg) }
            100% { opacity: 0 }
          }
          .k-steam { animation: kSteam 3.5s ease-out infinite; }
          @keyframes kSteam {
            0%,44% { opacity: 0; transform: translateY(0) scale(.4) }
            54% { opacity: .5; transform: translateY(-26px) scale(1) }
            76% { opacity: 0; transform: translateY(-64px) scale(1.7) }
            100% { opacity: 0 }
          }
          .k-speed { animation: kSpeed 3.5s linear infinite; }
          @keyframes kSpeed {
            0%,15% { opacity: 0 } 22% { opacity: .9 } 32% { opacity: .5 }
            35%,100% { opacity: 0 }
          }
          .k-arc { animation: kArc 3.5s cubic-bezier(.8,0,.2,1) infinite; }
          @keyframes kArc {
            0%,16% { opacity: 0; stroke-dashoffset: 620 }
            26% { opacity: .95; stroke-dashoffset: 0 }
            36% { opacity: .6 }
            44%,100% { opacity: 0; stroke-dashoffset: 0 }
          }
          .k-pillar { animation: kPillar 3.5s linear infinite; transform-origin: 400px 188px; }
          @keyframes kPillar {
            0%,32% { opacity:0; transform: scaleY(.05) scaleX(.4) }
            35% { opacity:.95; transform: scaleY(1) scaleX(1) }
            50% { opacity:.35; transform: scaleY(1) scaleX(.6) }
            64%,100% { opacity:0; transform: scaleY(1) scaleX(.3) }
          }
          .k-bolt2 { animation: kBolt2 3.5s steps(1,end) infinite; }
          @keyframes kBolt2 {
            0%,33% { opacity:0 } 34.5% { opacity:.95 } 36% { opacity:.2 }
            37.5% { opacity:.8 } 39% { opacity:0 }
            56% { opacity:0 } 57% { opacity:.6 } 58.5% { opacity:0 } 100% { opacity:0 }
          }
          .k-quake { animation: kQuake 3.5s linear infinite; transform-origin: 400px 300px; }
          @keyframes kQuake {
            0%,33% { opacity:0; transform: scaleX(.2) }
            35% { opacity:1; transform: scaleX(1) }
            72% { opacity:.7 } 86%,100% { opacity:0 }
          }
          .k-debris { animation: kDebris 3.5s cubic-bezier(.2,.6,.4,1) infinite; }
          @keyframes kDebris {
            0%,33.5% { opacity:0; transform: translate(0,0) rotate(0deg) }
            35% { opacity:1 }
            70% { opacity:0; transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) }
            100% { opacity:0; transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) }
          }
          .k-ember { animation: kEmber linear infinite; }
          @keyframes kEmber {
            0% { opacity:0; transform: translate(0,0) }
            18% { opacity:.9 }
            100% { opacity:0; transform: translate(var(--ex), -190px) }
          }
          @media (prefers-reduced-motion: reduce) {
            .k-shake,.k-flash,.k-fire,.k-water,.k-core,
            .k-ring,.k-shard,.k-rays,.k-steam,.k-speed,.k-arc,
            .k-pillar,.k-bolt2,.k-quake,.k-debris,.k-ember { animation: none !important }
          }
        `}</style>

      </defs>

      <rect width="800" height="300" fill="url(#rzSky)" />

      {/* ukiyo-e sunburst behind the clash */}
      <g className="k-rays" opacity="0.85">
        {rays.map((a, i) => (
          <path key={i} d="M400,188 L392,-140 L408,-140 Z" fill={i % 2 ? '#ff7a2e' : '#4fc3f7'}
            opacity={i % 2 ? 0.32 : 0.24} transform={`rotate(${a} 400 188)`} />
        ))}
      </g>

      {/* horizontal god-speed streaks */}
      <g className="k-speed">
        {[96, 128, 158, 188, 218, 248].map((y, i) => (
          <g key={i}>
            <rect x="0" y={y} width="330" height={i % 2 ? 2 : 3.4} fill="#ffb36a" opacity="0.5" />
            <rect x="470" y={y + 6} width="330" height={i % 2 ? 2 : 3.4} fill="#7fd8ff" opacity="0.5" />
          </g>
        ))}
      </g>

      <g className="k-shake">
        {/* ─── FLAME BREATHING, left ─── */}
        <g className="k-fire">
          <path d="M-60,244 C60,236 150,196 250,170 C330,150 380,164 402,188
                   C356,178 300,192 240,214 C160,244 60,268 -60,268 Z"
            fill="url(#rzFire)" opacity="0.96" />
          <path d="M-40,222 C70,214 150,180 240,158 C310,142 356,154 380,178
                   C336,168 286,180 232,200 C160,226 60,246 -40,246 Z"
            fill="#ffb03a" opacity="0.7" filter="url(#rzG2)" />
          {[[70, 218, 34], [150, 196, 40], [232, 176, 32], [312, 172, 26]].map(([x, y, r], i) => (
            <path key={i} d={`M${x},${y} C${x - r * .5},${y - r} ${x + r * .4},${y - r * 1.5} ${x + r},${y - r * .6}
                              C${x + r * .5},${y - r * .2} ${x + r * .2},${y} ${x},${y} Z`}
              fill="#ffd166" opacity="0.85" />
          ))}
          <path d="M-60,250 C80,240 190,196 300,176" stroke="#fff3c4" strokeWidth="3" fill="none" opacity="0.9" />
          <ellipse cx="180" cy="196" rx="280" ry="104" fill="#ff5a1a" opacity="0.34" filter="url(#rzG)" />
          <path d="M-60,126 C90,120 200,150 300,178 C210,164 90,158 -60,166 Z" fill="#ff8f2e" opacity="0.55" />
          <path d="M-60,282 C100,272 210,240 320,206 C220,248 100,284 -60,296 Z" fill="#c2181a" opacity="0.6" />
        </g>

        {/* ─── WATER BREATHING, right ─── */}
        <g className="k-water">
          <path d="M860,244 C740,236 650,196 550,170 C470,150 420,164 398,188
                   C444,178 500,192 560,214 C640,244 740,268 860,268 Z"
            fill="url(#rzWater)" opacity="0.96" />
          <path d="M840,222 C730,214 650,180 560,158 C490,142 444,154 420,178
                   C464,168 514,180 568,200 C640,226 740,246 840,246 Z"
            fill="#7fd8ff" opacity="0.62" filter="url(#rzG2)" />
          {/* Hokusai foam crests */}
          {[[730, 218, 34], [650, 196, 40], [568, 176, 32], [488, 172, 26]].map(([x, y, r], i) => (
            <g key={i}>
              <path d={`M${x},${y} C${x + r * .5},${y - r} ${x - r * .4},${y - r * 1.5} ${x - r},${y - r * .6}
                        C${x - r * .5},${y - r * .2} ${x - r * .2},${y} ${x},${y} Z`}
                fill="#e6f9ff" opacity="0.9" />
              <circle cx={x - r * .75} cy={y - r * .78} r={r * .2} fill="#ffffff" opacity="0.95" />
              <circle cx={x - r * .3} cy={y - r * 1.05} r={r * .13} fill="#ffffff" opacity="0.8" />
            </g>
          ))}
          <path d="M860,250 C720,240 610,196 500,176" stroke="#eaffff" strokeWidth="3" fill="none" opacity="0.9" />
          <ellipse cx="620" cy="196" rx="280" ry="104" fill="#1f7ae0" opacity="0.36" filter="url(#rzG)" />
          <path d="M860,126 C710,120 600,150 500,178 C590,164 710,158 860,166 Z" fill="#4fc3f7" opacity="0.55" />
          <path d="M860,282 C700,272 590,240 480,206 C580,248 700,284 860,296 Z" fill="#0d3f96" opacity="0.6" />
        </g>

        {/* slash arcs carved by each technique */}
        <path className="k-arc" d="M120,54 C250,72 348,126 396,186" stroke="#ffd166" strokeWidth="6"
          fill="none" strokeLinecap="round" strokeDasharray="620" filter="url(#rzG2)" />
        <path className="k-arc" d="M680,54 C550,72 452,126 404,186" stroke="#9ee7ff" strokeWidth="6"
          fill="none" strokeLinecap="round" strokeDasharray="620" filter="url(#rzG2)"
          style={{ animationDelay: '.03s' }} />

        {/* collision core */}
        <circle className="k-core" cx="400" cy="186" r="120" fill="url(#rzCore)" />
        <circle className="k-ring" cx="400" cy="188" r="30" fill="none" stroke="#fff3c4" strokeWidth="4" />
        <circle className="k-ring" cx="400" cy="188" r="30" fill="none" stroke="#9ee7ff" strokeWidth="2"
          style={{ animationDelay: '0.08s' }} />

        {/* shrapnel */}
        <g>
          {shards.map((s, i) => (
            <circle key={i} className="k-shard" cx="400" cy="186" r={s.r}
              fill={s.hot ? '#ffcf6a' : '#9ee7ff'}
              style={{ '--x': `${s.dx}px`, '--y': `${s.dy}px`, animationDelay: `${s.d}s` }} />
          ))}
        </g>

        {/* steam boiling off the deadlock */}
        <g className="k-steam">
          {[[352, 176, 26], [400, 164, 34], [452, 178, 24], [378, 150, 20], [424, 148, 18]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#e9f4ff" opacity="0.35" filter="url(#rzG2)" />
          ))}
        </g>
      </g>

      <rect className="k-flash" width="800" height="300" fill="#ffffff" />
      <rect width="800" height="300" fill="url(#rzVig)" />
    </svg>
  )
}


// Prefer real artwork in /public/rise/ when it exists; otherwise draw the
// SVG duel. Swapping in art needs no code change — just add the files.
export function ArtRise() {
  const [noAssets, setNoAssets] = useState(false)
  return (
    <>
      {!noAssets && <RiseCinematic onNoAssets={() => setNoAssets(true)} />}
      {noAssets && <ArtRiseSvg />}
    </>
  )
}
