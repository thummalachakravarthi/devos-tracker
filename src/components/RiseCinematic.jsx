import { useEffect, useState } from 'react'

// ═══════════════════════════════════════════════════════════════
// RISE — image-driven cinematic rig.
//
// Drop these into /public/rise/ and this takes over automatically:
//
//   fighter-left.png   a swordsman mid-lunge, facing RIGHT, transparent bg
//   fighter-right.png  a swordsman mid-lunge, facing LEFT,  transparent bg
//   fx-left.png        the left fighter's technique (e.g. a flame wave),
//                      sweeping LEFT→RIGHT, transparent bg
//   fx-right.png       the right fighter's technique (e.g. a water wave),
//                      sweeping RIGHT→LEFT, transparent bg
//   bg.png             (optional) a backdrop — sky, cliffs, whatever
//
// Any missing file just doesn't render, so you can add them one at a
// time. If NO files are present the caller falls back to the SVG version.
//
// Art notes that matter for this to look right:
//  · transparent background, no drop shadow baked in
//  · fighters roughly 900px tall, techniques roughly 1600px wide
//  · keep each fighter's blade pointing toward the centre of the frame
//  · draw them lit from the centre — that's where the collision happens
// ═══════════════════════════════════════════════════════════════

const ASSETS = {
  bg: '/rise/bg.png',
  left: '/rise/fighter-left.png',
  right: '/rise/fighter-right.png',
  fxLeft: '/rise/fx-left.png',
  fxRight: '/rise/fx-right.png',
}

// Probe which assets actually exist so missing ones don't show a broken icon.
function useAvailable() {
  const [have, setHave] = useState(null)
  useEffect(() => {
    let alive = true
    const test = (src) =>
      new Promise((res) => {
        const img = new Image()
        img.onload = () => res(true)
        img.onerror = () => res(false)
        img.src = src
      })
    Promise.all(Object.values(ASSETS).map(test)).then((results) => {
      if (!alive) return
      const keys = Object.keys(ASSETS)
      setHave(Object.fromEntries(keys.map((k, i) => [k, results[i]])))
    })
    return () => { alive = false }
  }, [])
  return have
}

export function riseAssetsPresent(have) {
  return !!have && (have.left || have.right || have.fxLeft || have.fxRight)
}

export default function RiseCinematic({ onNoAssets }) {
  const have = useAvailable()

  useEffect(() => {
    if (have && !riseAssetsPresent(have)) onNoAssets?.()
  }, [have, onNoAssets])

  if (!have || !riseAssetsPresent(have)) return null

  const shards = Array.from({ length: 30 }, (_, i) => {
    const a = (i / 30) * Math.PI * 2
    const sp = 12 + ((i * 37) % 22)
    return {
      x: (Math.cos(a) * sp).toFixed(1),
      y: (Math.sin(a) * sp * 0.6).toFixed(1),
      d: (0.28 + ((i * 13) % 30) / 100).toFixed(2),
      s: (2 + ((i * 7) % 26) / 10).toFixed(1),
      hot: i % 2 === 0,
    }
  })

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#07070f]">
      <style>{`
        .rc-stage { position:absolute; inset:0; animation: rcShake 3.5s steps(1,end) infinite; }
        @keyframes rcShake {
          0%,33.9% { transform: translate(0,0) scale(1.02) }
          34%   { transform: translate(-1.6%,1%)   scale(1.07) }
          35.4% { transform: translate(1.4%,-1.1%) scale(1.065) }
          36.8% { transform: translate(-1.1%,-.5%) scale(1.06) }
          38.2% { transform: translate(.8%,.7%)    scale(1.05) }
          39.6% { transform: translate(-.5%,-.4%)  scale(1.04) }
          41%   { transform: translate(.3%,.2%)    scale(1.03) }
          44%,100% { transform: translate(0,0) scale(1.02) }
        }
        .rc-bg { position:absolute; inset:-4%; width:108%; height:108%;
          object-fit:cover; animation: rcPush 3.5s ease-out infinite; }
        @keyframes rcPush { 0%,30% { transform:scale(1) } 36% { transform:scale(1.06) } 100% { transform:scale(1) } }

        .rc-fig { position:absolute; bottom:-4%; height:104%; object-fit:contain; will-change:transform; }
        .rc-left  { left:0;  transform-origin:left bottom;  animation: rcLeft 3.5s cubic-bezier(.85,0,.2,1) infinite; }
        .rc-right { right:0; transform-origin:right bottom; animation: rcRight 3.5s cubic-bezier(.85,0,.2,1) infinite; }
        @keyframes rcLeft {
          0%   { transform: translateX(-18%) rotate(-5deg) }
          14%  { transform: translateX(-24%) rotate(-9deg) }
          30%  { transform: translateX(6%)   rotate(4deg) }
          34%  { transform: translateX(10%)  rotate(6deg) }
          62%  { transform: translateX(4%)   rotate(2deg) }
          76%  { transform: translateX(-32%) rotate(-13deg) }
          88%,100% { transform: translateX(-18%) rotate(-5deg) }
        }
        @keyframes rcRight {
          0%   { transform: translateX(18%)  rotate(5deg) }
          14%  { transform: translateX(24%)  rotate(9deg) }
          30%  { transform: translateX(-6%)  rotate(-4deg) }
          34%  { transform: translateX(-10%) rotate(-6deg) }
          62%  { transform: translateX(-4%)  rotate(-2deg) }
          76%  { transform: translateX(32%)  rotate(13deg) }
          88%,100% { transform: translateX(18%) rotate(5deg) }
        }

        /* afterimages: same art, offset and tinted, fading during the dash */
        .rc-ghost { opacity:0; animation: rcGhost 3.5s linear infinite; }
        @keyframes rcGhost {
          0%,15% { opacity:0 } 20% { opacity:.5 } 30% { opacity:.22 } 34%,100% { opacity:0 }
        }

        .rc-fx { position:absolute; top:50%; height:150%; object-fit:contain;
          transform:translateY(-50%); pointer-events:none; }
        .rc-fx-l { left:-10%; animation: rcFxL 3.5s cubic-bezier(.85,0,.2,1) infinite; }
        .rc-fx-r { right:-10%; animation: rcFxR 3.5s cubic-bezier(.85,0,.2,1) infinite; }
        @keyframes rcFxL {
          0%,14% { opacity:0; transform:translate(-45%,-50%) scaleX(.4) }
          24% { opacity:1 }
          34% { opacity:1; transform:translate(0,-50%) scaleX(1) }
          62% { opacity:.95; transform:translate(-2%,-50%) scaleX(.97) }
          76% { opacity:0; transform:translate(-38%,-50%) scaleX(.6) }
          100% { opacity:0; transform:translate(-45%,-50%) scaleX(.4) }
        }
        @keyframes rcFxR {
          0%,14% { opacity:0; transform:translate(45%,-50%) scaleX(.4) }
          24% { opacity:1 }
          34% { opacity:1; transform:translate(0,-50%) scaleX(1) }
          62% { opacity:.95; transform:translate(2%,-50%) scaleX(.97) }
          76% { opacity:0; transform:translate(38%,-50%) scaleX(.6) }
          100% { opacity:0; transform:translate(45%,-50%) scaleX(.4) }
        }

        .rc-core { position:absolute; left:50%; top:52%; width:60%; aspect-ratio:1;
          transform:translate(-50%,-50%); border-radius:50%; pointer-events:none;
          background: radial-gradient(circle, #fff 0%, rgba(255,233,168,.95) 26%,
            rgba(255,106,42,.5) 58%, rgba(122,27,214,0) 100%);
          animation: rcCore 3.5s linear infinite; }
        @keyframes rcCore {
          0%,32% { opacity:0; transform:translate(-50%,-50%) scale(.12) }
          34.5% { opacity:1; transform:translate(-50%,-50%) scale(1.5) }
          48% { opacity:.8; transform:translate(-50%,-50%) scale(1) }
          70% { opacity:.5; transform:translate(-50%,-50%) scale(1.15) }
          80% { opacity:0; transform:translate(-50%,-50%) scale(2) }
          100% { opacity:0 }
        }
        .rc-ring { position:absolute; left:50%; top:52%; width:14%; aspect-ratio:1;
          transform:translate(-50%,-50%); border-radius:50%; border:3px solid #fff3c4;
          animation: rcRing 3.5s linear infinite; pointer-events:none; }
        @keyframes rcRing {
          0%,33% { opacity:0; transform:translate(-50%,-50%) scale(.1) }
          35% { opacity:1 }
          52% { opacity:0; transform:translate(-50%,-50%) scale(6) }
          100% { opacity:0; transform:translate(-50%,-50%) scale(6) }
        }
        .rc-shard { position:absolute; left:50%; top:52%; border-radius:50%;
          animation: rcShard 3.5s linear infinite; pointer-events:none; }
        @keyframes rcShard {
          0%,33.5% { opacity:0; transform:translate(-50%,-50%) }
          35% { opacity:1 }
          56%,100% { opacity:0;
            transform:translate(calc(-50% + var(--x) * 1%), calc(-50% + var(--y) * 1%)) scale(.15) }
        }
        .rc-flash { position:absolute; inset:0; background:#fff; pointer-events:none;
          animation: rcFlash 3.5s linear infinite; }
        @keyframes rcFlash {
          0%,33% { opacity:0 } 34% { opacity:1 } 37% { opacity:.45 }
          41% { opacity:.12 } 47%,100% { opacity:0 }
        }
        .rc-speed { position:absolute; inset:0; pointer-events:none;
          animation: rcSpeed 3.5s linear infinite;
          background: repeating-linear-gradient(90deg,
            rgba(255,255,255,.18) 0 2px, transparent 2px 22px); }
        @keyframes rcSpeed { 0%,15% { opacity:0 } 24% { opacity:.7 } 33%,100% { opacity:0 } }
        .rc-vig { position:absolute; inset:0; pointer-events:none;
          background: radial-gradient(circle at 50% 50%, transparent 42%, rgba(0,0,0,.8) 100%); }

        @media (prefers-reduced-motion: reduce) {
          .rc-stage,.rc-bg,.rc-left,.rc-right,.rc-ghost,.rc-fx-l,.rc-fx-r,
          .rc-core,.rc-ring,.rc-shard,.rc-flash,.rc-speed { animation:none !important }
          .rc-flash,.rc-core,.rc-ring,.rc-shard { opacity:0 !important }
        }
      `}</style>

      {have.bg && <img className="rc-bg" src={ASSETS.bg} alt="" />}

      <div className="rc-stage">
        {have.left && (
          <>
            <img className="rc-fig rc-left rc-ghost" src={ASSETS.left} alt=""
              style={{ filter: 'brightness(1.6) saturate(.4)', transform: 'translateX(-30%)' }} />
            <img className="rc-fig rc-left" src={ASSETS.left} alt="" />
          </>
        )}
        {have.right && (
          <>
            <img className="rc-fig rc-right rc-ghost" src={ASSETS.right} alt=""
              style={{ filter: 'brightness(1.6) saturate(.4)', transform: 'translateX(30%)' }} />
            <img className="rc-fig rc-right" src={ASSETS.right} alt="" />
          </>
        )}

        {have.fxLeft && <img className="rc-fx rc-fx-l" src={ASSETS.fxLeft} alt="" />}
        {have.fxRight && <img className="rc-fx rc-fx-r" src={ASSETS.fxRight} alt="" />}

        <div className="rc-core" />
        <div className="rc-ring" />
        <div className="rc-ring" style={{ animationDelay: '.08s', borderColor: '#9ee7ff' }} />

        {shards.map((s, i) => (
          <span key={i} className="rc-shard"
            style={{
              width: `${s.s}px`, height: `${s.s}px`,
              background: s.hot ? '#ffcf6a' : '#9ee7ff',
              '--x': s.x, '--y': s.y, animationDelay: `${s.d}s`,
            }} />
        ))}
      </div>

      <div className="rc-speed" />
      <div className="rc-flash" />
      <div className="rc-vig" />
    </div>
  )
}
