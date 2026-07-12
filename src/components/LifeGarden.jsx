import { useMemo } from 'react'
import { useData } from '../DataStore'
import { todayISO, addDays } from '../lib/dates'

// ─── plant growth stages ────────────────────────────────────
// 0 = bare soil, 1 = sprout, 2 = sapling, 3 = young tree, 4 = mature tree
// 5 = flowering tree (streak bonus). -1 = wilting (missed streak)
const STAGES = 6
const WILT = -1

// Score a day: 0..4 based on how productive you were.
// Emerges from real data — no separate tracking needed.
function scoreDay({ dayIso, javaSessions, dsaLogs, logs, activeHabits, target }) {
  const javaMin = javaSessions.filter(s => s.session_date === dayIso).reduce((a, s) => a + s.minutes, 0)
  const dsa = dsaLogs.filter(l => l.log_date === dayIso).reduce((a, l) => a + l.problems, 0)
  const habitsDone = activeHabits.filter(h => logs[h.id]?.[dayIso]?.completed).length
  const habitsTotal = activeHabits.length || 1

  // Nothing at all → 0 (bare soil)
  if (javaMin === 0 && dsa === 0 && habitsDone === 0) return 0
  // Something small → 1 (sprout)
  const habitPct = habitsDone / habitsTotal
  const javaPct = Math.min(1, javaMin / target)
  const total = (javaPct * 0.5) + (habitPct * 0.3) + (Math.min(1, dsa / 3) * 0.2)
  if (total < 0.25) return 1
  if (total < 0.5) return 2
  if (total < 0.75) return 3
  if (total < 0.95) return 4
  return 5 // perfect
}

// ─── plant SVG at a given stage ─────────────────────────────
function Plant({ stage, size = 60, id }) {
  const w = size, h = size
  // Deterministic sway per plant using its id
  const sway = ((id * 37) % 100) / 100 // 0..1
  const swayDur = 3 + sway * 2
  const swayDelay = sway * 2

  if (stage === 0) {
    // bare dirt patch
    return (
      <svg width={w} height={h} viewBox="0 0 60 60">
        <ellipse cx="30" cy="50" rx="15" ry="3" fill="#3f2a1a" opacity="0.7" />
      </svg>
    )
  }
  if (stage === WILT) {
    // wilted / dead plant
    return (
      <svg width={w} height={h} viewBox="0 0 60 60">
        <ellipse cx="30" cy="52" rx="16" ry="3" fill="#2a1a10" />
        <path d="M30 52 L28 42 L22 38" stroke="#6b5540" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M30 52 L32 42 L38 40" stroke="#6b5540" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="22" cy="38" rx="4" ry="2" fill="#5a4028" transform="rotate(-25 22 38)" />
        <ellipse cx="38" cy="40" rx="4" ry="2" fill="#5a4028" transform="rotate(35 38 40)" />
      </svg>
    )
  }

  // Living plant — trunk + canopy scaling with stage
  const trunkH = 6 + stage * 6         // 12 to 36
  const canopyR = 4 + stage * 4        // 8 to 24
  const canopyY = 50 - trunkH
  const canopyColor = stage === 5 ? '#f472b6' : ['#7ed957', '#5eb85c', '#4ade80', '#22c55e', '#16a34a'][Math.min(stage - 1, 4)]
  const trunkColor = '#8b5a3c'

  return (
    <svg width={w} height={h} viewBox="0 0 60 60">
      <ellipse cx="30" cy="52" rx="16" ry="3" fill="#4a3020" opacity="0.7" />
      <g style={{ transformOrigin: '30px 50px', animation: `plantSway ${swayDur}s ease-in-out ${swayDelay}s infinite` }}>
        {/* trunk */}
        <rect x={28.5} y={canopyY} width="3" height={trunkH} fill={trunkColor} rx="1" />
        {/* canopy — multi-blob for organic feel */}
        <circle cx="30" cy={canopyY - 2} r={canopyR} fill={canopyColor} />
        {stage >= 2 && <circle cx={30 - canopyR * 0.6} cy={canopyY + 2} r={canopyR * 0.75} fill={canopyColor} opacity="0.9" />}
        {stage >= 2 && <circle cx={30 + canopyR * 0.6} cy={canopyY + 2} r={canopyR * 0.75} fill={canopyColor} opacity="0.9" />}
        {stage >= 3 && <circle cx="30" cy={canopyY - canopyR * 0.4} r={canopyR * 0.55} fill={canopyColor} opacity="0.85" />}
        {/* highlights */}
        <circle cx={30 - canopyR * 0.35} cy={canopyY - canopyR * 0.4} r={canopyR * 0.3} fill="#ffffff" opacity="0.22" />
        {/* stage 5 flowers */}
        {stage === 5 && (
          <g>
            {[[24, canopyY - 4], [36, canopyY + 2], [30, canopyY - canopyR * 0.7], [26, canopyY + 4]].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="1.4" fill="#fef08a" />
                <circle cx={cx} cy={cy} r="0.6" fill="#fef3c7" />
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  )
}

// ─── the garden grid ────────────────────────────────────────
export default function LifeGarden() {
  const { javaSessions, dsaLogs, logs, activeHabits, settings } = useData()
  const target = settings.daily_java_minutes || 180
  const today = todayISO()

  // 60-day garden: 12 cols x 5 rows
  const DAYS = 60
  const plants = useMemo(() => {
    const arr = []
    for (let i = 0; i < DAYS; i++) {
      const d = addDays(today, -(DAYS - 1 - i)) // oldest first, today last
      const score = scoreDay({ dayIso: d, javaSessions, dsaLogs, logs, activeHabits, target })
      arr.push({ date: d, score })
    }
    // WILT propagation: if last 3+ days were 0, mark them as wilted (dead plants)
    // Only past days can wilt (not today — you still have time).
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i].score === 0) {
        // wilted if the whole streak (3+ consecutive zeros ending here) is dead
        let dead = 1
        for (let j = i - 1; j >= 0; j--) {
          if (arr[j].score === 0) dead++
          else break
        }
        if (dead >= 3) arr[i].score = WILT
      }
    }
    return arr
  }, [javaSessions, dsaLogs, logs, activeHabits, target, today])

  // stats
  const alive = plants.filter(p => p.score > 0).length
  const flowering = plants.filter(p => p.score === 5).length
  const wilted = plants.filter(p => p.score === WILT).length
  const forestHealth = Math.round((alive / DAYS) * 100)

  return (
    <section className="card card-hover">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="label mb-0.5">🌱 Life Garden · last 60 days</div>
          <div className="text-xs text-dim">Every productive day plants a tree. Skip too many and it wilts.</div>
        </div>
        <div className="text-right">
          <div className="font-mono font-bold text-2xl" style={{ color: forestHealth >= 70 ? '#22c55e' : forestHealth >= 40 ? '#f59e0b' : '#f43f5e' }}>
            {forestHealth}%
          </div>
          <div className="text-[10px] text-dim">forest health</div>
        </div>
      </div>

      {/* the garden — grass background + plants grid */}
      <div className="mt-3 relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #082032 0%, #0b3a30 60%, #08281e 100%)',
        }}>
        {/* soft glow overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(96,165,250,0.15), transparent 60%), radial-gradient(circle at 70% 90%, rgba(34,197,94,0.15), transparent 60%)',
          }} />
        {/* grid */}
        <div className="relative grid grid-cols-10 sm:grid-cols-12 gap-0 p-2">
          {plants.map((p, i) => {
            const isToday = i === plants.length - 1
            return (
              <div
                key={p.date}
                title={`${p.date} · ${p.score === WILT ? 'wilted' : p.score === 0 ? 'no activity' : `stage ${p.score}/5`}`}
                className={`aspect-square grid place-items-center relative ${isToday ? 'ring-1 ring-amber/50 rounded' : ''}`}
              >
                <Plant stage={p.score} size={44} id={i} />
                {isToday && (
                  <div className="absolute -bottom-0.5 text-[7px] text-amber font-mono uppercase tracking-widest">
                    today
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* legend */}
      <div className="flex flex-wrap gap-3 mt-3 text-[11px] text-dim">
        <span className="flex items-center gap-1">🌿 <span className="font-mono">{alive}</span> growing</span>
        {flowering > 0 && <span className="flex items-center gap-1">🌸 <span className="font-mono text-pink-400">{flowering}</span> in bloom (perfect day)</span>}
        {wilted > 0 && <span className="flex items-center gap-1">🥀 <span className="font-mono text-red">{wilted}</span> wilted (3+ days off)</span>}
      </div>

      <style>{`
        @keyframes plantSway {
          0%, 100% { transform: rotate(-1.5deg); }
          50%      { transform: rotate(1.5deg); }
        }
      `}</style>
    </section>
  )
}
