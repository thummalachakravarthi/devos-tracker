import { useEffect, useMemo, useRef, useState } from 'react'
import { useData } from '../DataStore'
import { todayISO } from '../lib/dates'

// Life Garden — today's tasks planted in a garden bed.
// Each completed habit = a flower, each DSA problem = a berry bush,
// each Java session = a sapling. Sky follows the real clock.

const W = 1000, H = 640
const SKY_BOT = 214, FENCE_TOP = 196, FENCE_BOT = 316, BED_TOP = 336, LAWN_EDGE = 468

const G = ['#1e6b28', '#2a8034', '#369640', '#45ac4e', '#59c162', '#74d67a']
const GF = ['#5c8f62', '#68a06e', '#76b07c', '#84c08a']

function rng(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const pick = (pal, lf, r) =>
  pal[Math.max(0, Math.min(pal.length - 1, Math.round((lf + (r() - .5) * .2) * (pal.length - 1))))]

function bigLeaf(len, wid, col, dark) {
  return `<g><path d="M0,0 C${(len*.3).toFixed(1)},${(-wid).toFixed(1)} ${(len*.75).toFixed(1)},${(-wid*.9).toFixed(1)} ${len.toFixed(1)},0
    C${(len*.75).toFixed(1)},${(wid*.9).toFixed(1)} ${(len*.3).toFixed(1)},${wid.toFixed(1)} 0,0 Z" fill="${col}"/>
    <path d="M0,0 C${(len*.35).toFixed(1)},${(-wid*.18).toFixed(1)} ${(len*.7).toFixed(1)},${(-wid*.14).toFixed(1)} ${len.toFixed(1)},0"
      stroke="${dark}" stroke-width="1.6" fill="none" opacity=".8"/></g>`
}
function basalLeaves(seed, sc) {
  const r = rng(seed); let s = ''
  for (const a of [-168, -150, -30, -12, -110, -70]) {
    const len = (26 + r() * 14) * sc, wid = (10 + r() * 4) * sc
    s += `<g transform="rotate(${(a + (r()*2-1)*8).toFixed(0)})">${bigLeaf(len, wid, pick(G, a > -90 ? .8 : .32, r), '#1a5a22')}</g>`
  }
  return s
}

function flowerPlant(seed, sc) {
  const r = rng(seed), hg = (118 + r()*34) * sc, lean = (r()*2-1) * 13 * sc
  const P = [['#b31f5e','#e8348a','#ff8cc0'],['#c2510c','#f57c1f','#ffb060'],
    ['#6a1fa8','#9b3fd6','#c98cf0'],['#a81f2e','#e04050','#ff7c88'],
    ['#b8901a','#f0c02e','#ffe680'],['#1f5fa8','#3f8fe0','#8cc4f5']][Math.floor(r()*6)]
  const d = `M0,0 C${(-4*sc).toFixed(1)},${(-hg*.4).toFixed(1)} ${(lean*.7).toFixed(1)},${(-hg*.7).toFixed(1)} ${lean.toFixed(1)},${(-hg).toFixed(1)}`
  let s = `<path d="${d}" stroke="#2a8034" stroke-width="${(6*sc).toFixed(1)}" fill="none" stroke-linecap="round"/>
           <path d="${d}" stroke="#45ac4e" stroke-width="${(2.6*sc).toFixed(1)}" fill="none" stroke-linecap="round" opacity=".85"/>`
  for (let i = 0; i < 2; i++) {
    const t = .34 + i*.26, ly = -hg*t, lx = lean*t*.7
    for (const dir of [1, -1])
      s += `<g transform="translate(${lx.toFixed(1)},${ly.toFixed(1)}) scale(${dir},1) rotate(${(-24-r()*14).toFixed(0)})">
             ${bigLeaf((38-i*7)*sc, (14-i*3)*sc, pick(G, dir>0?.78:.3, r), '#1a5a22')}</g>`
  }
  const N = 11, pr = (21 + r()*7) * sc
  for (let i = 0; i < N; i++) {
    const a = i*(360/N), rad = a*Math.PI/180
    const lf = Math.max(0, Math.min(1, (Math.sin(rad)*.8 + Math.cos(rad)*.6 + 1.05)/2))
    s += `<ellipse cx="0" cy="${(-pr*.55).toFixed(1)}" rx="${(pr*.32).toFixed(1)}" ry="${(pr*.6).toFixed(1)}"
           fill="${P[Math.round(lf*2)]}" transform="translate(${lean.toFixed(1)},${(-hg).toFixed(1)}) rotate(${a})"/>`
  }
  s += `<circle cx="${lean.toFixed(1)}" cy="${(-hg).toFixed(1)}" r="${(pr*.36).toFixed(1)}" fill="#8a6a14"/>
        <circle cx="${(lean-pr*.1).toFixed(1)}" cy="${(-hg-pr*.1).toFixed(1)}" r="${(pr*.19).toFixed(1)}" fill="#f0cc3a"/>`
  return s
}
function shrubPlant(seed, sc) {
  const r = rng(seed), R = 52 * sc; let s = ''
  s += `<path d="M0,0 L${(-3*sc).toFixed(1)},${(-R*.5).toFixed(1)}" stroke="#5a4028" stroke-width="${(7*sc).toFixed(1)}" stroke-linecap="round"/>`
  s += `<ellipse cx="0" cy="${(-R*.62).toFixed(1)}" rx="${(R*.92).toFixed(1)}" ry="${(R*.72).toFixed(1)}" fill="#2a8034"/>`
  for (let i = 0; i < 30; i++) {
    const a = r()*Math.PI*2, rad = Math.sqrt(r())*R*.9
    const x = Math.cos(a)*rad, y = -R*.62 + Math.sin(a)*rad*.78
    const lf = Math.max(0, Math.min(1, (x/R*.8 - (y+R*.62)/R*-.6 + 1.05)/2))
    s += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(r()*360).toFixed(0)})">
           ${bigLeaf((14+r()*9)*sc, (6+r()*3.5)*sc, pick(G, lf, r), '#1a5a22')}</g>`
  }
  for (let i = 0; i < 9; i++) {
    const a = r()*Math.PI*2, rad = Math.sqrt(r())*R*.75
    const x = Math.cos(a)*rad, y = -R*.62 + Math.sin(a)*rad*.75
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(5*sc).toFixed(1)}" fill="#26429c"/>
          <circle cx="${(x-1.6*sc).toFixed(1)}" cy="${(y-1.7*sc).toFixed(1)}" r="${(2*sc).toFixed(1)}" fill="#9cc0ff"/>`
  }
  return s
}
function treePlant(seed, sc) {
  const r = rng(seed), hg = 168 * sc, R = 66 * sc
  let s = `<path d="M0,0 C${(-5*sc).toFixed(1)},${(-hg*.36).toFixed(1)} ${(7*sc).toFixed(1)},${(-hg*.56).toFixed(1)} ${(3*sc).toFixed(1)},${(-hg*.7).toFixed(1)}"
      stroke="#5a4028" stroke-width="${(12*sc).toFixed(1)}" fill="none" stroke-linecap="round"/>
    <path d="M${(3*sc).toFixed(1)},${(-hg*.6).toFixed(1)} L${(-22*sc).toFixed(1)},${(-hg*.76).toFixed(1)}"
      stroke="#5a4028" stroke-width="${(5*sc).toFixed(1)}" stroke-linecap="round"/>
    <path d="M${(3*sc).toFixed(1)},${(-hg*.62).toFixed(1)} L${(25*sc).toFixed(1)},${(-hg*.8).toFixed(1)}"
      stroke="#5a4028" stroke-width="${(5*sc).toFixed(1)}" stroke-linecap="round"/>`
  s += `<ellipse cx="0" cy="${(-hg*.82).toFixed(1)}" rx="${(R*.95).toFixed(1)}" ry="${(R*.74).toFixed(1)}" fill="#2a8034"/>`
  for (let i = 0; i < 40; i++) {
    const a = r()*Math.PI*2, rad = Math.sqrt(r())*R*.92
    const x = Math.cos(a)*rad, y = -hg*.82 + Math.sin(a)*rad*.76
    const lf = Math.max(0, Math.min(1, (x/R*.8 - (y+hg*.82)/R*-.6 + 1.05)/2))
    s += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(r()*360).toFixed(0)})">
           ${bigLeaf((15+r()*10)*sc, (7+r()*4)*sc, pick(G, lf, r), '#1a5a22')}</g>`
  }
  return s
}

function skyFor(mins) {
  const h = mins / 60
  const P = [
    { t:0,   n:'Night',       z:'#0d1a44', m:'#22376e', star:1,   sun:0, warm:'#4a63a8' },
    { t:5,   n:'Dawn',        z:'#4a6ab0', m:'#f0a878', star:.4,  sun:0, warm:'#ffb37a' },
    { t:7,   n:'Morning',     z:'#3d9fda', m:'#d3eefb', star:0,   sun:1, warm:'#ffe9b8' },
    { t:12,  n:'Daylight',    z:'#3aa3e0', m:'#cdeefc', star:0,   sun:1, warm:'#fff6dc' },
    { t:16.5,n:'Afternoon',   z:'#48a6dc', m:'#f3e6bd', star:0,   sun:1, warm:'#ffe8b0' },
    { t:18.5,n:'Golden hour', z:'#6a6fa8', m:'#ffbe72', star:.12, sun:1, warm:'#ffc078' },
    { t:20,  n:'Dusk',        z:'#222c62', m:'#a06a90', star:.65, sun:0, warm:'#a2779e' },
    { t:22,  n:'Night',       z:'#0d1a44', m:'#22376e', star:1,   sun:0, warm:'#4a63a8' },
    { t:24,  n:'Night',       z:'#0d1a44', m:'#22376e', star:1,   sun:0, warm:'#4a63a8' },
  ]
  let i = 0; while (i < P.length-2 && h >= P[i+1].t) i++
  const a = P[i], b = P[i+1], f = Math.min(1, Math.max(0, (h-a.t)/(b.t-a.t)))
  const mix = (c1, c2) => {
    const p = c => [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)]
    const [r1,g1,b1] = p(c1), [r2,g2,b2] = p(c2)
    return `rgb(${Math.round(r1+(r2-r1)*f)},${Math.round(g1+(g2-g1)*f)},${Math.round(b1+(b2-b1)*f)})`
  }
  const sun = a.sun + (b.sun-a.sun)*f
  return { name: f<.5?a.n:b.n, z: mix(a.z,b.z), m: mix(a.m,b.m), warm: mix(a.warm,b.warm),
    star: a.star + (b.star-a.star)*f, sun, isNight: sun < .35 }
}
function bodyPos(mins) {
  const h = mins/60, day = h >= 6 && h <= 18.5
  const t = Math.min(1, Math.max(0, day ? (h-6)/12.5 : ((h<6?h+24:h)-18.5)/11.5))
  return { x: 90 + t*(W-180), y: SKY_BOT - 20 - Math.sin(Math.PI*t)*165, isSun: day }
}
function clouds() {
  return [[190,52,1],[560,32,.76],[860,64,1.08]].map(([x,y,s],i) => {
    const p = [[0,0,32],[27,-10,24],[-26,-6,22],[48,5,19],[-46,5,17],[12,8,22]]
      .map(([dx,dy,r]) => `<circle cx="${(dx*s).toFixed(1)}" cy="${(dy*s).toFixed(1)}" r="${(r*s).toFixed(1)}" fill="#fff"/>`).join('')
    const sh = [[5,10,27],[30,5,20],[-21,8,19]]
      .map(([dx,dy,r]) => `<circle cx="${(dx*s).toFixed(1)}" cy="${(dy*s).toFixed(1)}" r="${(r*s).toFixed(1)}" fill="#d6ecf8"/>`).join('')
    return `<g class="lg-cloud lg-c${i}" style="--cy:${y}px" opacity=".95"><g transform="translate(${x},0)">${sh}${p}</g></g>`
  }).join('')
}
function farTrees() {
  const r = rng(12); let s = ''
  for (let i = 0; i < 9; i++) {
    const x = -30 + i*124 + r()*40, R = 44 + r()*30, y = SKY_BOT - 58 - r()*30
    s += `<rect x="${(x-5).toFixed(0)}" y="${y.toFixed(0)}" width="10" height="${(SKY_BOT-y+30).toFixed(0)}" fill="#6a7a66"/>`
    s += `<ellipse cx="${x.toFixed(0)}" cy="${(y-R*.3).toFixed(0)}" rx="${R.toFixed(0)}" ry="${(R*.8).toFixed(0)}" fill="${GF[1]}"/>`
    for (let k = 0; k < 26; k++) {
      const a = r()*Math.PI*2, rad = Math.sqrt(r())*R
      s += `<ellipse cx="${(x+Math.cos(a)*rad).toFixed(1)}" cy="${(y-R*.3+Math.sin(a)*rad*.8).toFixed(1)}"
             rx="${(R*.2).toFixed(1)}" ry="${(R*.14).toFixed(1)}" fill="${pick(GF, .3+r()*.6, r)}"/>`
    }
  }
  return s
}
function fence() {
  const r = rng(88); let s = ''
  for (let y = FENCE_TOP; y < FENCE_BOT; y += 24) {
    s += `<rect x="0" y="${y}" width="${W}" height="23" fill="${['#d2a568','#c69a5e','#dcb073','#bd9053'][Math.floor(r()*4)]}"/>
          <rect x="0" y="${y+21}" width="${W}" height="3" fill="#9d7440" opacity=".8"/>`
    for (let k = 0; k < 12; k++)
      s += `<rect x="${(r()*W).toFixed(0)}" y="${(y+3+r()*16).toFixed(0)}" width="${(35+r()*80).toFixed(0)}"
             height="1.6" fill="${r()>.5?'#ab7f46':'#e8c48c'}" opacity=".45"/>`
  }
  for (let x = 46; x < W; x += 176)
    s += `<rect x="${x-8}" y="${FENCE_TOP}" width="8" height="${FENCE_BOT-FENCE_TOP}" fill="#8a6234" opacity=".4"/>
          <rect x="${x}" y="${FENCE_TOP-6}" width="28" height="${FENCE_BOT-FENCE_TOP+6}" fill="#d8ad70"/>
          <rect x="${x+21}" y="${FENCE_TOP-6}" width="7" height="${FENCE_BOT-FENCE_TOP+6}" fill="#ab7f46" opacity=".6"/>`
  return s
}
function hedge() {
  const r = rng(23); let s = ''
  for (let x = -16; x < W+32; x += 22)
    s += `<ellipse cx="${x}" cy="${(FENCE_BOT-10+r()*16).toFixed(0)}" rx="${(24+r()*12).toFixed(0)}"
           ry="${(20+r()*9).toFixed(0)}" fill="#1e6b28"/>`
  for (let i = 0; i < 150; i++) {
    const x = r()*W, y = FENCE_BOT - 26 + r()*54
    s += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(r()*360).toFixed(0)})">
           ${bigLeaf(12+r()*9, 5+r()*4, pick(G, .25+r()*.6, r), '#164d1c')}</g>`
  }
  return s
}
function bedSoil() {
  const r = rng(59)
  let s = `<path d="M0,${BED_TOP} C240,${BED_TOP-14} 600,${BED_TOP+12} ${W},${BED_TOP-6} L${W},${LAWN_EDGE+16} L0,${LAWN_EDGE+16} Z" fill="#4a3325"/>
    <path d="M0,${BED_TOP+12} C240,${BED_TOP-2} 600,${BED_TOP+24} ${W},${BED_TOP+6} L${W},${LAWN_EDGE+16} L0,${LAWN_EDGE+16} Z" fill="#5e422f"/>`
  for (let i = 0; i < 300; i++) {
    const x = r()*W, y = BED_TOP + 6 + r()*(LAWN_EDGE-BED_TOP+8)
    s += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(1.6+r()*5).toFixed(1)}" ry="${(1.1+r()*2.6).toFixed(1)}"
           fill="${['#3a2a1d','#6b4c37','#7d5c42','#553b2b'][Math.floor(r()*4)]}" opacity=".85"/>`
  }
  return s
}
// soil ridge drawn OVER the back row so their stems sink into the ground
function soilRidge() {
  const r = rng(91)
  const Y = BED_TOP + 78
  let s = `<path d="M0,${Y} C220,${Y-10} 580,${Y+9} ${W},${Y-5} L${W},${Y+70} L0,${Y+70} Z" fill="#543b2a"/>
    <path d="M0,${Y+7} C220,${Y-3} 580,${Y+16} ${W},${Y+2} L${W},${Y+70} L0,${Y+70} Z" fill="#66492f"/>`
  for (let i = 0; i < 170; i++) {
    const x = r()*W, y = Y + 2 + r()*62
    s += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(2+r()*6).toFixed(1)}" ry="${(1.3+r()*3).toFixed(1)}"
           fill="${['#3a2a1d','#7d5c42','#8a6a4c','#553b2b'][Math.floor(r()*4)]}" opacity=".8"/>`
  }
  return s
}

function lawn() {
  const r = rng(37)
  let s = `<path d="M0,${LAWN_EDGE} C260,${LAWN_EDGE-16} 620,${LAWN_EDGE+14} ${W},${LAWN_EDGE-8} L${W},${H} L0,${H} Z" fill="#3f9c42"/>
    <rect x="0" y="${LAWN_EDGE-10}" width="${W}" height="${H-LAWN_EDGE+10}" fill="url(#lgGrad)"/>`
  s += `<ellipse cx="${W*.45}" cy="${LAWN_EDGE+16}" rx="${W*.6}" ry="26" fill="#1e5c22" opacity=".28" filter="url(#lgS1)"/>`
  for (let i = 0; i < 6; i++)
    s += `<ellipse cx="${(r()*W).toFixed(0)}" cy="${(LAWN_EDGE+40+r()*(H-LAWN_EDGE-70)).toFixed(0)}"
           rx="${(70+r()*100).toFixed(0)}" ry="${(22+r()*32).toFixed(0)}" fill="#c8f078"
           opacity="${(.1+r()*.09).toFixed(2)}" filter="url(#lgS1)"/>`
  for (let i = 0; i < 420; i++) {
    const x = r()*W, y = LAWN_EDGE + 3 + Math.pow(r(), .72)*(H-LAWN_EDGE-3)
    const d = (y-LAWN_EDGE)/(H-LAWN_EDGE)
    const hg = (5+r()*9)*(.6+d*1.4), ln = (r()*2-1)*5*(.6+d)
    s += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q${(ln/2).toFixed(1)},${(-hg*.6).toFixed(1)} ${ln.toFixed(1)},${(-hg).toFixed(1)}"
           stroke="${pick(G, .3+r()*.65, r)}" stroke-width="${(1.2+d*1.8).toFixed(1)}" fill="none"
           stroke-linecap="round" opacity="${(.75+d*.25).toFixed(2)}"/>`
  }
  return s
}
function stones() {
  const P = [[520,624,60,19],[476,576,55,17],[446,530,50,15],[434,492,45,14]]
  const r = rng(70); let s = ''
  for (const [x,y,rx,ry] of P) {
    s += `<ellipse cx="${x-rx*.14}" cy="${y+ry*.44}" rx="${rx*1.02}" ry="${ry*.86}" fill="#1c5320" opacity=".42" filter="url(#lgS2)"/>
          <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#a89c86"/>
          <ellipse cx="${x+rx*.1}" cy="${y-ry*.18}" rx="${rx*.88}" ry="${ry*.76}" fill="#c6bca6"/>
          <ellipse cx="${x+rx*.22}" cy="${y-ry*.34}" rx="${rx*.5}" ry="${ry*.4}" fill="#ded5c0" opacity=".8"/>`
    for (let k = 0; k < 10; k++) {
      const a = r()*Math.PI*2, rad = Math.sqrt(r())
      s += `<circle cx="${(x+Math.cos(a)*rad*rx*.8).toFixed(1)}" cy="${(y+Math.sin(a)*rad*ry*.8).toFixed(1)}"
             r="${(.9+r()*1.8).toFixed(1)}" fill="${r()>.5?'#94886f':'#e8dfc8'}" opacity=".45"/>`
    }
  }
  return s
}

function rainLayer() {
  const r = rng(103); let s = ''
  for (let i = 0; i < 90; i++) {
    const x = r()*W*1.15 - 60, len = 16 + r()*22, dur = (.5 + r()*.4).toFixed(2)
    s += `<line x1="${x.toFixed(0)}" y1="0" x2="${(x-9).toFixed(0)}" y2="${len.toFixed(0)}"
           stroke="#cfe4f5" stroke-width="${(1+r()*1.1).toFixed(1)}" stroke-linecap="round"
           opacity="${(.28+r()*.34).toFixed(2)}" class="lg-drop"
           style="animation-duration:${dur}s; animation-delay:-${(r()*1.2).toFixed(2)}s; --dx:${(-90).toFixed(0)}px"/>`
  }
  return `<g>${s}</g>`
}
function bird(sc) {
  return `<g transform="scale(${sc})">
    <g class="lg-wingF"><path d="M-1,-3 Q-11,-19 3,-17 Q9,-9 3,-2 Z" fill="#3d4a63"/></g>
    <path d="M-11,0 L-22,-6 L-19,3 Z" fill="#4a5872"/>
    <ellipse cx="0" cy="0" rx="12" ry="6.4" fill="#55647f"/>
    <ellipse cx="-1" cy="2.4" rx="9" ry="3.6" fill="#8593ab"/>
    <circle cx="10.5" cy="-5" r="5.2" fill="#55647f"/>
    <path d="M15,-5.4 L22.5,-3.4 L15,-1.6 Z" fill="#e8a33d"/>
    <circle cx="12" cy="-6.2" r="1.3" fill="#1b2230"/>
    <g class="lg-wingN"><path d="M0,-2 Q-9,-21 6,-18 Q13,-9 5,-1 Z" fill="#6b7a96"/></g>
  </g>`
}

function birdsLayer() {
  const r = rng(117)
  // three flocks, each a staggered V, drifting left -> right
  const flocks = [
    { y: 44,  n: 5, sc: .62, dur: 26 },
    { y: 104, n: 4, sc: .82, dur: 34 },
    { y: 158, n: 6, sc: .5,  dur: 21 },
  ]
  let s = ''
  flocks.forEach((f, fi) => {
    let members = ''
    for (let i = 0; i < f.n; i++) {
      // V formation: each bird trails back and alternates above/below the leader
      const side = i % 2 === 0 ? 1 : -1
      const rank = Math.ceil(i / 2)
      const dx = -rank * (30 + r() * 10)
      const dy = side * rank * (13 + r() * 6)
      members += `<g transform="translate(${dx.toFixed(0)},${dy.toFixed(0)})"
          class="lg-bob" style="animation-delay:-${(r()*2).toFixed(2)}s;
          animation-duration:${(2.6 + r()*1.4).toFixed(1)}s">
          <g class="lg-flap" style="--fd:${(.34 + r()*.16).toFixed(2)}s">${bird(1)}</g></g>`
    }
    s += `<g class="lg-flock" style="--fy:${f.y}px; animation-duration:${f.dur}s;
            animation-delay:-${(fi * 7 + r() * 6).toFixed(1)}s">
        <g transform="scale(${f.sc})">${members}</g></g>`
  })
  return s
}

function windLeaves() {
  const r = rng(131); let s = ''
  for (let i = 0; i < 14; i++) {
    const y = FENCE_BOT + r()*(H - FENCE_BOT - 40)
    s += `<g class="lg-blown" style="--wy:${y.toFixed(0)}px; animation-duration:${(3.4+r()*3).toFixed(1)}s;
            animation-delay:-${(r()*6).toFixed(1)}s">
        <g transform="scale(${(.7+r()*.6).toFixed(2)})">
          ${bigLeaf(13, 6, pick(G, .4+r()*.5, r), '#1a5a22')}</g></g>`
  }
  return s
}

const SLOTS = (() => {
  const out = [], r = rng(77)
  const rows = [{ y: BED_TOP+100, n: 5, sc: .72 }, { y: BED_TOP+164, n: 5, sc: .98 }]
  rows.forEach((row, ri) => {
    const pad = 98 + ri*54, span = (W - pad*2)/(row.n - 1)
    for (let i = 0; i < row.n; i++)
      out.push({ x: pad + span*i + (r()*2-1)*12, y: row.y + (r()*2-1)*7, sc: row.sc })
  })
  return out
})()
const CAP = SLOTS.length

const load = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v) } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export default function LifeGarden() {
  const { javaSessions, dsaLogs, logs, activeHabits } = useData()
  const today = todayISO()
  const clockMins = () => { const d = new Date(); return d.getHours()*60 + d.getMinutes() }
  const [autoTime, setAutoTime] = useState(() => load('lg:autoTime', true))
  const [manualMins, setManualMins] = useState(() => load('lg:manualMins', clockMins()))
  const [tick, setTick] = useState(clockMins())
  const [rain, setRain] = useState(() => load('lg:rain', false))
  const [birds, setBirds] = useState(() => load('lg:birds', true))
  const [wind, setWind] = useState(() => load('lg:wind', false))
  const [showTime, setShowTime] = useState(false)
  const mins = autoTime ? tick : manualMins

  useEffect(() => { const id = setInterval(() => setTick(clockMins()), 60000); return () => clearInterval(id) }, [])
  useEffect(() => { save('lg:autoTime', autoTime) }, [autoTime])
  useEffect(() => { save('lg:manualMins', manualMins) }, [manualMins])
  useEffect(() => { save('lg:rain', rain) }, [rain])
  useEffect(() => { save('lg:birds', birds) }, [birds])
  useEffect(() => { save('lg:wind', wind) }, [wind])

  // today's completed tasks → plant types, round-robin so the bed mixes
  const tasks = useMemo(() => {
    const habits = activeHabits.filter(h => logs[h.id]?.[today]?.completed).length
    const dsa = dsaLogs.filter(l => l.log_date === today).reduce((a, l) => a + l.problems, 0)
    const java = javaSessions.filter(s => s.session_date === today).length
    const pools = [Array(habits).fill('habit'), Array(dsa).fill('dsa'), Array(java).fill('java')]
    const out = []
    while (out.length < CAP && pools.some(p => p.length)) {
      for (const p of pools) { if (p.length && out.length < CAP) out.push(p.pop()) }
    }
    return { list: out, habits, dsa, java }
  }, [activeHabits, logs, dsaLogs, javaSessions, today])

  // only animate the plant that just appeared
  const prevCount = useRef(tasks.list.length)
  const newIndex = tasks.list.length > prevCount.current ? tasks.list.length - 1 : -1
  useEffect(() => { prevCount.current = tasks.list.length }, [tasks.list.length])

  const svg = useMemo(() => {
    const sky = skyFor(mins), body = bodyPos(mins)
    let stars = ''
    if (sky.star > .02) {
      const r = rng(7)
      for (let i = 0; i < 44; i++)
        stars += `<circle cx="${(r()*W).toFixed(1)}" cy="${(r()*180).toFixed(1)}"
          r="${(r()*1.1+.35).toFixed(2)}" fill="#fff" opacity="${(sky.star*(.3+r()*.7)).toFixed(2)}"/>`
    }
    const bodySvg = body.isSun
      ? `<g><circle cx="${body.x.toFixed(0)}" cy="${body.y.toFixed(0)}" r="96" fill="${sky.warm}" opacity=".22" filter="url(#lgS1)"/>
           <circle cx="${body.x.toFixed(0)}" cy="${body.y.toFixed(0)}" r="36" fill="${sky.warm}" opacity=".55" filter="url(#lgS1)"/>
           <circle cx="${body.x.toFixed(0)}" cy="${body.y.toFixed(0)}" r="17" fill="#fffdf5"/></g>`
      : `<g><circle cx="${body.x.toFixed(0)}" cy="${body.y.toFixed(0)}" r="44" fill="#c8d6ff" opacity=".16" filter="url(#lgS1)"/>
           <circle cx="${body.x.toFixed(0)}" cy="${body.y.toFixed(0)}" r="12" fill="#f0f4ff"/>
           <circle cx="${(body.x+4).toFixed(0)}" cy="${(body.y-3.5).toFixed(0)}" r="10.5" fill="${sky.z}"/></g>`

    let backRow = '', frontRow = ''
    tasks.list.forEach((type, i) => {
      const sl = SLOTS[i], seed = i*57 + 13
      const art = type === 'habit' ? flowerPlant(seed, sl.sc)
        : type === 'dsa' ? shrubPlant(seed, sl.sc) : treePlant(seed, sl.sc)
      const isNew = i === newIndex, delay = (sl.x/W)*1.4
      const chunk = `<g transform="translate(${sl.x.toFixed(1)},${sl.y.toFixed(1)})">
        <ellipse cx="${(-8*sl.sc).toFixed(1)}" cy="${(3*sl.sc).toFixed(1)}" rx="${(36*sl.sc).toFixed(1)}"
          ry="${(9*sl.sc).toFixed(1)}" fill="#2a1c11" opacity=".55" filter="url(#lgS2)"/>
        <ellipse cx="0" cy="${(2*sl.sc).toFixed(1)}" rx="${(24*sl.sc).toFixed(1)}" ry="${(7*sl.sc).toFixed(1)}" fill="#3d2a1c"/>
        <ellipse cx="0" cy="0" rx="${(15*sl.sc).toFixed(1)}" ry="${(4.6*sl.sc).toFixed(1)}" fill="#1c1209" opacity=".8"/>
        <g class="lg-plant${isNew ? ' lg-new' : ''}" style="animation-delay:-${delay.toFixed(2)}s">${art}</g>
        <g>${basalLeaves(seed+5, sl.sc)}</g>
      </g>`
      if (i < 5) backRow += chunk; else frontRow += chunk
    })

    const wet = rain
      ? `<rect width="${W}" height="${H}" fill="#48586b" opacity=".3" style="mix-blend-mode:multiply"/>` : ''
    const grade = sky.isNight
      ? `<rect width="${W}" height="${H}" fill="#0f1c4a" opacity=".46" style="mix-blend-mode:multiply"/>`
      : `<rect width="${W}" height="${H}" fill="${sky.warm}" opacity="${(.04+sky.sun*.07).toFixed(2)}" style="mix-blend-mode:soft-light"/>`

    return { name: sky.name, markup: `
      <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="block w-full h-auto"
           role="img" aria-label="Garden that fills as today's tasks are completed">
        <defs>
          <linearGradient id="lgSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${sky.z}"/><stop offset="100%" stop-color="${sky.m}"/></linearGradient>
          <linearGradient id="lgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1e5c22" stop-opacity=".45"/>
            <stop offset="45%" stop-color="#3f9c42" stop-opacity="0"/>
            <stop offset="100%" stop-color="#7ad46a" stop-opacity=".26"/></linearGradient>
          <radialGradient id="lgVig" cx="50%" cy="46%" r="76%">
            <stop offset="66%" stop-color="#000" stop-opacity="0"/>
            <stop offset="100%" stop-color="#000" stop-opacity=".22"/></radialGradient>
          <filter id="lgS1" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="10"/></filter>
          <filter id="lgS2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4"/></filter>
          <filter id="lgFar" x="-8%" y="-8%" width="116%" height="116%"><feGaussianBlur stdDeviation="1.8"/></filter>
          <clipPath id="lgCp"><rect width="${W}" height="${H}"/></clipPath>
        </defs>
        <g clip-path="url(#lgCp)">
          <rect width="${W}" height="${SKY_BOT+10}" fill="url(#lgSky)"/>
          ${stars}${bodySvg}${sky.isNight ? '' : clouds()}
          <g filter="url(#lgFar)" opacity=".9">${farTrees()}</g>
          ${fence()}${hedge()}
          ${bedSoil()}
          ${backRow}
          ${soilRidge()}
          ${frontRow}
          ${lawn()}${stones()}
          ${wind ? windLeaves() : ''}
          ${birds && !rain ? birdsLayer() : ''}
          ${rain ? rainLayer() : ''}
          ${wet}${grade}
          <rect width="${W}" height="${H}" fill="url(#lgVig)"/>
        </g>
      </svg>` }
  }, [mins, tasks, newIndex, rain, birds, wind])

  return (
    <section className="card card-hover overflow-hidden !p-0">
      <div className="p-4 pb-3 flex items-start justify-between gap-3">
        <div>
          <div className="label mb-0.5">🌳 Life Garden · today</div>
          <div className="font-display font-bold text-base">{svg.name}</div>
          <div className="text-xs text-dim mt-0.5">Every task you finish plants something in the bed.</div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono font-bold text-2xl leading-none"
            style={{ color: tasks.list.length >= 7 ? '#22c55e' : tasks.list.length >= 3 ? '#f59e0b' : '#8B94A8' }}>
            {tasks.list.length}
          </div>
          <div className="text-[10px] text-dim">of {CAP} planted</div>
        </div>
      </div>

      <div dangerouslySetInnerHTML={{ __html: svg.markup }} />

      <div className="px-4 pt-3 pb-2 flex flex-wrap items-center gap-1.5 border-t border-white/6">
        <button onClick={() => setShowTime(v => !v)} className={`lg-pill ${!autoTime ? 'lg-on' : ''}`}>
          {mins/60 >= 6 && mins/60 < 18.5 ? '☀️' : '🌙'} time
        </button>
        <button onClick={() => setRain(v => !v)} className={`lg-pill ${rain ? 'lg-on' : ''}`}>🌧️ rain</button>
        <button onClick={() => setBirds(v => !v)} className={`lg-pill ${birds ? 'lg-on' : ''}`}>🐦 birds</button>
        <button onClick={() => setWind(v => !v)} className={`lg-pill ${wind ? 'lg-on' : ''}`}>🍃 wind</button>
      </div>

      {showTime && (
        <div className="px-4 pb-3 flex items-center gap-3">
          <button onClick={() => setAutoTime(v => !v)} className={`lg-pill ${autoTime ? 'lg-on' : ''}`}>
            {autoTime ? '● live' : 'manual'}
          </button>
          <input
            type="range" min="0" max="1439" step="5" value={mins}
            onChange={e => { setAutoTime(false); setManualMins(+e.target.value) }}
            className="flex-1 accent-amber"
            aria-label="Time of day"
          />
          <span className="font-mono text-xs text-dim w-11 text-right">
            {String(Math.floor(mins/60)).padStart(2,'0')}:{String(mins%60).padStart(2,'0')}
          </span>
        </div>
      )}

      <div className="px-4 py-3 flex flex-wrap gap-3 text-[11px] text-dim">
        <span>flower = habit · bush = DSA · sapling = Java</span>
        <span className="ml-auto flex flex-wrap gap-3">
          <span>habits <span className="font-mono text-pink-400">{tasks.habits}</span></span>
          <span>dsa <span className="font-mono text-sky-300">{tasks.dsa}</span></span>
          <span>java <span className="font-mono text-mint">{tasks.java}</span></span>
        </span>
      </div>

      <style>{`
        .lg-plant { transform-origin: bottom center;
          animation: lgSway ${wind ? '1.9s' : '6s'} ease-in-out infinite; }
        @keyframes lgSway { 0%,100% { transform: rotate(${wind ? -5 : -1.4}deg); }
          50% { transform: rotate(${wind ? 5 : 1.4}deg); } }
        .lg-new { animation: lgSprout .9s cubic-bezier(.2,.9,.25,1) both, lgSway 6s ease-in-out .9s infinite; }
        @keyframes lgSprout { 0% { transform: scale(.05) translateY(10px); opacity: 0; }
          55% { transform: scale(1.09) translateY(-3px); opacity: 1; } 100% { transform: none; opacity: 1; } }
        .lg-cloud { animation: lgDrift 120s linear infinite; }
        .lg-c1 { animation-duration: 155s; } .lg-c2 { animation-duration: 135s; }
        @keyframes lgDrift { 0% { transform: translate(-280px, var(--cy)); } 100% { transform: translate(1160px, var(--cy)); } }
        .lg-pill { font-family: ui-monospace, monospace; font-size: 11px; color: #E9EEF8;
          background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12);
          border-radius: 999px; padding: 5px 11px; cursor: pointer; transition: .15s; }
        .lg-pill:hover { background: rgba(255,255,255,.1); }
        .lg-on { background: rgba(34,197,94,.18); border-color: rgba(34,197,94,.5); color: #8ff0b0; }

        .lg-drop { animation: lgRain linear infinite; }
        @keyframes lgRain { 0% { transform: translate(0,-40px); } 100% { transform: translate(var(--dx), 700px); } }

        .lg-flock { animation: lgCross linear infinite; }
        @keyframes lgCross {
          0%   { transform: translate(-240px, var(--fy)); }
          100% { transform: translate(1240px, var(--fy)); } }
        .lg-bob { animation: lgBob ease-in-out infinite; }
        @keyframes lgBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        .lg-wingN { animation: lgWingN var(--fd, .4s) ease-in-out infinite; transform-origin: 2px -2px; }
        @keyframes lgWingN { 0%,100% { transform: rotate(-26deg); } 50% { transform: rotate(46deg); } }
        .lg-wingF { animation: lgWingF var(--fd, .4s) ease-in-out infinite;
          transform-origin: 0px -3px; animation-delay: -.06s; }
        @keyframes lgWingF { 0%,100% { transform: rotate(-14deg); } 50% { transform: rotate(34deg); } }

        .lg-blown { animation: lgBlow linear infinite; }
        @keyframes lgBlow { 0% { transform: translate(-40px, var(--wy)) rotate(0deg); opacity: 0; }
          10% { opacity: .9; } 90% { opacity: .9; }
          100% { transform: translate(1080px, calc(var(--wy) - 40px)) rotate(720deg); opacity: 0; } }

        @media (prefers-reduced-motion: reduce) {
          .lg-plant, .lg-new, .lg-cloud, .lg-drop, .lg-blown,
          .lg-flock, .lg-bob, .lg-wingN, .lg-wingF { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
