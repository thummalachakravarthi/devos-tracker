import { useMemo } from 'react'
import { useData } from '../DataStore'
import { todayISO, addDays } from '../lib/dates'

// stage → emoji (real plants, not SVG shapes)
const STAGE_EMOJI = {
  0:  '',
  1:  '🌱',
  2:  '🌿',
  3:  '🪴',
  4:  '🌳',
  5:  '🌸',
  '-1': '🥀',
}

function scoreDay({ dayIso, javaSessions, dsaLogs, logs, activeHabits, target }) {
  const javaMin = javaSessions.filter(s => s.session_date === dayIso).reduce((a, s) => a + s.minutes, 0)
  const dsa = dsaLogs.filter(l => l.log_date === dayIso).reduce((a, l) => a + l.problems, 0)
  const habitsDone = activeHabits.filter(h => logs[h.id]?.[dayIso]?.completed).length
  const habitsTotal = activeHabits.length || 1
  if (javaMin === 0 && dsa === 0 && habitsDone === 0) return 0
  const habitPct = habitsDone / habitsTotal
  const javaPct = Math.min(1, javaMin / target)
  const total = (javaPct * 0.5) + (habitPct * 0.3) + (Math.min(1, dsa / 3) * 0.2)
  if (total < 0.25) return 1
  if (total < 0.5)  return 2
  if (total < 0.75) return 3
  if (total < 0.95) return 4
  return 5
}

export default function LifeGarden() {
  const { javaSessions, dsaLogs, logs, activeHabits, settings } = useData()
  const target = settings.daily_java_minutes || 180
  const today = todayISO()

  const DAYS = 60
  const plants = useMemo(() => {
    const arr = []
    for (let i = 0; i < DAYS; i++) {
      const d = addDays(today, -(DAYS - 1 - i))
      arr.push({ date: d, score: scoreDay({ dayIso: d, javaSessions, dsaLogs, logs, activeHabits, target }) })
    }
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i].score === 0) {
        let dead = 1
        for (let j = i - 1; j >= 0; j--) {
          if (arr[j].score === 0) dead++; else break
        }
        if (dead >= 3) arr[i].score = -1
      }
    }
    return arr
  }, [javaSessions, dsaLogs, logs, activeHabits, target, today])

  const alive = plants.filter(p => p.score > 0).length
  const flowering = plants.filter(p => p.score === 5).length
  const wilted = plants.filter(p => p.score === -1).length
  const forestHealth = Math.round((alive / DAYS) * 100)

  const clouds = [
    { x: 8,  y: 12, s: 22, dur: 90, delay: 0 },
    { x: 45, y: 18, s: 18, dur: 120, delay: -40 },
    { x: 78, y: 10, s: 24, dur: 105, delay: -75 },
  ]

  return (
    <section className="card card-hover overflow-hidden !p-0">
      <div className="p-4 pb-3 flex items-center justify-between">
        <div>
          <div className="label mb-0.5 flex items-center gap-1.5">🌳 Life Garden · last 60 days</div>
          <div className="text-xs text-dim">Every productive day plants something. Skip too many and it wilts.</div>
        </div>
        <div className="text-right">
          <div className="font-mono font-bold text-2xl" style={{ color: forestHealth >= 70 ? '#22c55e' : forestHealth >= 40 ? '#f59e0b' : '#f43f5e' }}>
            {forestHealth}%
          </div>
          <div className="text-[10px] text-dim">forest health</div>
        </div>
      </div>

      <div className="relative w-full aspect-[3/2] sm:aspect-[16/7] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[62%]"
          style={{ background: 'linear-gradient(180deg, #7dd3fc 0%, #bae6fd 60%, #e0f2fe 100%)' }} />

        <div className="absolute" style={{ left: '82%', top: '10%' }}>
          <div className="w-14 h-14 rounded-full"
            style={{
              background: 'radial-gradient(circle, #fef3c7 0%, #fbbf24 55%, transparent 75%)',
              boxShadow: '0 0 40px 10px rgba(251, 191, 36, 0.35)',
              animation: 'sunPulse 5s ease-in-out infinite',
            }} />
        </div>

        <svg viewBox="0 0 200 40" preserveAspectRatio="none"
          className="absolute inset-x-0" style={{ top: '38%', height: '15%' }}>
          <path d="M0 30 Q 30 5 60 18 T 120 15 T 200 22 L 200 40 L 0 40 Z" fill="#5eb85c" opacity="0.55" />
          <path d="M0 34 Q 40 20 80 27 T 160 24 T 200 30 L 200 40 L 0 40 Z" fill="#4a9b4a" opacity="0.7" />
        </svg>

        {clouds.map((c, i) => (
          <div key={i} className="absolute pointer-events-none"
            style={{
              top: `${c.y}%`,
              width: `${c.s}%`,
              animation: `cloudDrift ${c.dur}s linear infinite`,
              animationDelay: `${c.delay}s`,
            }}>
            <svg viewBox="0 0 100 40" className="w-full">
              <ellipse cx="30" cy="25" rx="20" ry="12" fill="#ffffff" opacity="0.9" />
              <ellipse cx="55" cy="20" rx="22" ry="14" fill="#ffffff" opacity="0.95" />
              <ellipse cx="75" cy="26" rx="18" ry="11" fill="#ffffff" opacity="0.85" />
            </svg>
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-0 h-[42%]"
          style={{ background: 'linear-gradient(180deg, #86efac 0%, #22c55e 45%, #15803d 100%)' }} />

        <svg className="absolute inset-x-0 bottom-0 h-[42%] w-full" viewBox="0 0 200 40" preserveAspectRatio="none">
          <defs>
            <pattern id="blades" x="0" y="0" width="4" height="12" patternUnits="userSpaceOnUse">
              <path d="M 2 12 L 2 6 M 0 12 L 0 8 M 3.5 12 L 3.5 9" stroke="#166534" strokeOpacity="0.28" strokeWidth="0.4" strokeLinecap="round" />
            </pattern>
          </defs>
          <rect width="200" height="40" fill="url(#blades)" />
        </svg>

        <div className="absolute inset-x-0 bottom-0 h-[42%] px-[2%] pb-[2%] pt-[8%]">
          <div className="h-full grid grid-cols-10 sm:grid-cols-12 grid-rows-5 gap-x-1 gap-y-1">
            {plants.map((p, i) => {
              const isToday = i === plants.length - 1
              const emoji = STAGE_EMOJI[p.score]
              const seed = (i * 37) % 100
              const swayDur = 3 + (seed / 100) * 3
              const swayDelay = (seed / 50)
              const size = p.score === 5 ? 'text-2xl sm:text-3xl'
                : p.score === 4 ? 'text-xl sm:text-2xl'
                : p.score === 3 ? 'text-lg sm:text-xl'
                : p.score === 2 ? 'text-base sm:text-lg'
                : p.score === 1 ? 'text-sm sm:text-base'
                : 'text-xs'
              return (
                <div key={p.date}
                  title={`${p.date} · ${p.score === -1 ? 'wilted' : p.score === 0 ? 'no activity' : `growth stage ${p.score}/5`}`}
                  className="relative flex items-end justify-center">
                  {p.score === 0 ? (
                    <div className="w-3 h-1 rounded-full" style={{ background: '#5c3d1f', opacity: 0.6 }} />
                  ) : (
                    <span
                      className={`leading-none drop-shadow-sm ${size}`}
                      style={{
                        display: 'inline-block',
                        transformOrigin: 'bottom center',
                        animation: p.score === -1 ? 'none' : `plantSway ${swayDur}s ease-in-out ${swayDelay}s infinite`,
                        filter: p.score === 5 ? 'drop-shadow(0 0 6px rgba(244,114,182,0.65))' : undefined,
                      }}
                    >{emoji}</span>
                  )}
                  {isToday && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-bold text-amber uppercase tracking-widest bg-black/40 px-1 rounded backdrop-blur-sm whitespace-nowrap">
                      today
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="absolute pointer-events-none text-2xl"
          style={{ left: '20%', top: '30%', animation: 'butterflyFly 22s ease-in-out infinite' }}>🦋</div>
      </div>

      <div className="px-4 py-3 flex flex-wrap gap-3 text-[11px] text-dim border-t border-white/6">
        <span>🌱 sprout → 🌿 herb → 🪴 growing → 🌳 tree → 🌸 perfect day</span>
        <span className="ml-auto flex flex-wrap gap-3">
          <span>🌳 <span className="font-mono text-mint">{alive}</span> growing</span>
          {flowering > 0 && <span>🌸 <span className="font-mono text-pink-400">{flowering}</span> in bloom</span>}
          {wilted > 0 && <span>🥀 <span className="font-mono text-red">{wilted}</span> wilted</span>}
        </span>
      </div>

      <style>{`
        @keyframes plantSway {
          0%, 100% { transform: rotate(-2deg); }
          50%      { transform: rotate(2deg); }
        }
        @keyframes cloudDrift {
          0%   { transform: translateX(-30%); }
          100% { transform: translateX(130vw); }
        }
        @keyframes sunPulse {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.06); }
        }
        @keyframes butterflyFly {
          0%   { transform: translate(0, 0) rotate(-5deg); }
          25%  { transform: translate(80px, -20px) rotate(10deg); }
          50%  { transform: translate(160px, 30px) rotate(-10deg); }
          75%  { transform: translate(60px, 60px) rotate(15deg); }
          100% { transform: translate(0, 0) rotate(-5deg); }
        }
      `}</style>
    </section>
  )
}
