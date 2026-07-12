import { useEffect, useRef, useState } from 'react'
import { Flame, Trophy, Zap, Target, Sparkles } from 'lucide-react'
import { useData } from '../DataStore'
import { ProgressRing, CountUp } from './Bits'
import { quoteForToday } from '../config/quotes'
import { todayISO } from '../lib/dates'
import {
  computeXp,
  levelFromXp,
  computeGlobalStreak,
  ACHIEVEMENTS,
  computeAchievementStats,
  fireConfetti,
} from '../lib/gamify'

// ═══════ MISSION CONTROL HERO ═══════
export function MissionControl() {
  const { settings, javaSessions, dsaLogs, logs: habitLogs, activeHabits } = useData()
  const today = todayISO()
  const xp = computeXp({ javaSessions, dsaLogs, habitLogs })
  const lvl = levelFromXp(xp.total)
  const streak = computeGlobalStreak({ javaSessions, dsaLogs, habitLogs }, today)
  const quote = quoteForToday(today)

  // level-up detection: confetti fires when Level increases (persisted in localStorage)
  const prevLvl = useRef(null)
  useEffect(() => {
    const key = 'devos:lastLevel'
    const stored = Number(localStorage.getItem(key) || 0)
    if (prevLvl.current === null) {
      prevLvl.current = lvl.level
      if (stored && lvl.level > stored) {
        fireConfetti(3000)
      }
      localStorage.setItem(key, String(lvl.level))
      return
    }
    if (lvl.level > prevLvl.current) {
      fireConfetti(3000)
    }
    prevLvl.current = lvl.level
    localStorage.setItem(key, String(lvl.level))
  }, [lvl.level])

  const nextLevelXp = lvl.ceil - xp.total

  // "Today's Mission" prompt = shortest unmet target
  const todayJavaMin = javaSessions.filter((s) => s.session_date === today)
    .reduce((a, s) => a + s.minutes, 0)
  const todayDsa = dsaLogs.filter((l) => l.log_date === today).reduce((a, l) => a + l.problems, 0)
  const missionText =
    todayJavaMin < settings.daily_java_minutes
      ? `${Math.ceil((settings.daily_java_minutes - todayJavaMin) / 60 * 10) / 10}h of Java left`
      : todayDsa < 3
      ? `Solve ${3 - todayDsa} more DSA problem${3 - todayDsa === 1 ? '' : 's'}`
      : 'You crushed it today. Keep the streak.'

  return (
    <section className="card g-border p-5 lg:p-6 anim-up">
      <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto] items-center">
        {/* level ring */}
        <div className="flex items-center gap-4 lg:gap-5">
          <ProgressRing pct={lvl.pct} size={100} stroke={9} color="#60a5fa">
            <div className="text-center">
              <div className="label mb-0.5">Level</div>
              <div className="font-mono font-bold text-2xl leading-none">
                <CountUp value={lvl.level} />
              </div>
            </div>
          </ProgressRing>
          <div className="hidden sm:block">
            <div className="label">XP</div>
            <div className="font-mono font-bold text-xl mt-0.5">
              <CountUp value={xp.total} />
            </div>
            <div className="text-[11px] text-dim mt-0.5">{nextLevelXp} to L{lvl.level + 1}</div>
          </div>
        </div>

        {/* headline + quote */}
        <div className="min-w-0">
          <div className="label mb-1 flex items-center gap-2">
            <Sparkles size={11} className="text-violet" />
            Welcome back, Commander
          </div>
          <h1 className="font-display font-bold text-3xl lg:text-5xl leading-tight text-grad">
            Mission Control
          </h1>
          <p className="text-sm text-dim mt-2 italic leading-snug">
            "{quote.q}" <span className="not-italic">— {quote.a}</span>
          </p>
        </div>

        {/* stats stack */}
        <div className="flex lg:flex-col gap-2 lg:gap-2 text-right">
          <Stat icon={<Flame size={13} className="text-amber" />} label="Streak" value={streak} suffix=" d" />
          <Stat icon={<Target size={13} className="text-mint" />} label="Today" value={missionText} isText />
          <Stat icon={<Zap size={13} className="text-violet" />} label="XP today" value={
            (javaSessions.filter((s) => s.session_date === today).reduce((a, s) => a + s.minutes, 0)) +
            (dsaLogs.filter((l) => l.log_date === today).reduce((a, l) => a + l.problems * 20, 0))
          } />
        </div>
      </div>

      {/* XP breakdown bar */}
      <div className="mt-5 pt-4 border-t border-white/6">
        <div className="flex justify-between text-[11px] text-dim mb-2 font-mono">
          <span>L{lvl.level}</span>
          <span>{xp.total} / {lvl.ceil} XP</span>
          <span>L{lvl.level + 1}</span>
        </div>
        <div className="progress-track h-2">
          <div className="progress-fill" style={{ width: `${lvl.pct * 100}%` }} />
        </div>
        <div className="flex gap-3 mt-2 text-[10px] text-dim font-mono">
          <span><span className="inline-block w-2 h-2 rounded-full bg-amber mr-1 align-middle" />{xp.javaXp} java</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-violet mr-1 align-middle" />{xp.dsaXp} dsa</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-mint mr-1 align-middle" />{xp.habitXp} habits</span>
        </div>
      </div>
    </section>
  )
}

function Stat({ icon, label, value, suffix = '', isText = false }) {
  return (
    <div className="flex-1 lg:flex-none">
      <div className="label flex items-center gap-1 justify-end">
        {icon} {label}
      </div>
      <div className={`font-mono font-bold ${isText ? 'text-xs mt-1' : 'text-lg mt-0.5'} whitespace-nowrap`}>
        {isText ? value : <><CountUp value={value} />{suffix}</>}
      </div>
    </div>
  )
}

// ═══════ ACHIEVEMENTS GRID ═══════
export function Achievements() {
  const { javaSessions, dsaLogs, logs: habitLogs, activeHabits } = useData()
  const xp = computeXp({ javaSessions, dsaLogs, habitLogs })
  const lvl = levelFromXp(xp.total)
  const streak = computeGlobalStreak({ javaSessions, dsaLogs, habitLogs }, todayISO())
  const stats = computeAchievementStats({
    javaSessions, dsaLogs, habitLogs, activeHabits, level: lvl.level, streak,
  })

  const results = ACHIEVEMENTS.map((a) => ({ ...a, unlocked: !!a.check(stats) }))
  const unlockedCount = results.filter((r) => r.unlocked).length

  return (
    <section className="card card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-amber" />
          <div className="label">Achievements</div>
        </div>
        <div className="font-mono text-xs text-dim">
          <span className="text-text font-bold">{unlockedCount}</span> / {results.length}
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {results.map((a) => (
          <div
            key={a.id}
            className={`text-center rounded-xl p-3 border transition ${
              a.unlocked
                ? 'bg-white/5 border-white/10 badge-unlocked'
                : 'bg-black/20 border-white/5 badge-locked'
            }`}
            title={`${a.name} — ${a.desc}`}
          >
            <div className="text-3xl leading-none">{a.icon}</div>
            <div className="text-[11px] font-medium mt-2 leading-tight">{a.name}</div>
            <div className="text-[9px] text-dim mt-1 leading-tight">{a.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
