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
  5:  '🌻',
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
        {/* painted garden backdrop */}
        <img
          src="/heroes/life-garden.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          draggable="false"
        />
        {/* subtle sun glow overlay on top of the painted sun to make it breathe */}
        <div className="absolute pointer-events-none"
          style={{ left: '78%', top: '8%', width: '18%', height: '30%',
            background: 'radial-gradient(circle at 50% 40%, rgba(254,243,199,0.35) 0%, transparent 60%)',
            animation: 'sunPulse 5s ease-in-out infinite' }} />

        {/* live plant grid — anchored to the soil bed so plants grow FROM the ground */}
        <div className="absolute pointer-events-auto"
          style={{ left: '11%', right: '19%', top: '78%', bottom: '2%' }}>
          <div className="h-full grid grid-cols-10 sm:grid-cols-12 grid-rows-2 gap-x-1 gap-y-0 items-end">
            {plants.map((p, i) => {
              const isToday = i === plants.length - 1
              const emoji = STAGE_EMOJI[p.score]
              const seed = (i * 37) % 100
              const swayDur = 3 + (seed / 100) * 3
              const swayDelay = (seed / 50)
              const size = p.score === 5 ? 'text-xl sm:text-2xl'
                : p.score === 4 ? 'text-lg sm:text-xl'
                : p.score === 3 ? 'text-base sm:text-lg'
                : p.score === 2 ? 'text-sm sm:text-base'
                : p.score === 1 ? 'text-xs sm:text-sm'
                : 'text-xs'
              return (
                <div key={p.date}
                  title={`${p.date} · ${p.score === -1 ? 'wilted' : p.score === 0 ? 'no activity' : `growth stage ${p.score}/5`}`}
                  className="relative flex items-end justify-center">
                  {p.score === 0 ? (
                    <div className="w-3 h-1 rounded-full" style={{ background: '#5c3d1f', opacity: 0.5 }} />
                  ) : (
                    <span
                      className={`leading-none ${size}`}
                      style={{
                        display: 'inline-block',
                        transformOrigin: 'bottom center',
                        animation: p.score === -1 ? 'none' : `plantSway ${swayDur}s ease-in-out ${swayDelay}s infinite`,
                        filter: p.score === 5
                          ? 'drop-shadow(0 0 6px rgba(251,191,36,0.75)) drop-shadow(0 2px 3px rgba(0,0,0,0.4))'
                          : 'drop-shadow(0 2px 3px rgba(0,0,0,0.45))',
                      }}
                    >{emoji}</span>
                  )}
                  {isToday && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-bold text-amber uppercase tracking-widest bg-black/50 px-1 rounded backdrop-blur-sm whitespace-nowrap">
                      today
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* floating pollen/light sparkles drifting up from the bed for atmosphere */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[0,1,2,3,4,5].map(i => (
            <div key={i} className="absolute rounded-full"
              style={{
                left: `${15 + i * 12}%`,
                bottom: '20%',
                width: '3px', height: '3px',
                background: 'rgba(254, 243, 199, 0.9)',
                boxShadow: '0 0 6px rgba(254, 243, 199, 0.8)',
                animation: `pollenRise ${9 + i}s ease-in ${i * 1.5}s infinite`,
                opacity: 0,
              }} />
          ))}
        </div>
      </div>

      <div className="px-4 py-3 flex flex-wrap gap-3 text-[11px] text-dim border-t border-white/6">
        <span>🌱 sprout → 🌿 herb → 🪴 growing → 🌳 tree → 🌻 perfect day</span>
        <span className="ml-auto flex flex-wrap gap-3">
          <span>🌳 <span className="font-mono text-mint">{alive}</span> growing</span>
          {flowering > 0 && <span>🌻 <span className="font-mono text-pink-400">{flowering}</span> in bloom</span>}
          {wilted > 0 && <span>🥀 <span className="font-mono text-red">{wilted}</span> wilted</span>}
        </span>
      </div>

      <style>{`
        @keyframes plantSway {
          0%, 100% { transform: rotate(-2deg); }
          50%      { transform: rotate(2deg); }
        }
        @keyframes sunPulse {
          0%, 100% { opacity: 0.75; }
          50%      { opacity: 1; }
        }
        @keyframes pollenRise {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          15%  { opacity: 0.9; }
          85%  { opacity: 0.6; }
          100% { transform: translateY(-140px) translateX(20px); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
