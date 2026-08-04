// ═══════════════════════════════════════════════════════════════════
// DevOS gamification layer — reads real data from the DataStore, no schema change.
// XP formula: 1 min of Java = 1 XP, 1 DSA problem = 20 XP, 1 habit completion = 5 XP.
// Levels: cumulative thresholds get a bit steeper each level.
// ═══════════════════════════════════════════════════════════════════

const LEVEL_THRESHOLDS = [
  0,       // L1 starts here
  200,     // L2
  500,     // L3
  1000,    // L4
  1700,    // L5
  2600,    // L6
  3700,    // L7
  5000,    // L8
  6500,    // L9
  8200,    // L10
  10100,   // L11
  12200,   // L12
  14500,   // L13
  17000,   // L14
  19700,   // L15
  22600,   // L16
  25700,   // L17
  29000,   // L18
  32500,   // L19
  36200,   // L20
]

export function levelFromXp(xp) {
  let lvl = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) lvl = i + 1
  }
  const floor = LEVEL_THRESHOLDS[lvl - 1] || 0
  const ceil = LEVEL_THRESHOLDS[lvl] ?? floor + 4000
  const into = xp - floor
  const span = ceil - floor
  return { level: lvl, into, span, floor, ceil, pct: Math.min(1, into / span) }
}

export function computeXp({ javaSessions = [], dsaLogs = [], habitLogs = {} }) {
  const javaXp = javaSessions.reduce((a, s) => a + (Number(s.minutes) || 0), 0)
  const dsaXp = dsaLogs.reduce((a, l) => a + (Number(l.problems) || 0) * 20, 0)
  let habitXp = 0
  for (const habitId in habitLogs) {
    for (const date in habitLogs[habitId]) {
      if (habitLogs[habitId][date]?.completed) habitXp += 5
    }
  }
  return { javaXp, dsaXp, habitXp, total: javaXp + dsaXp + habitXp }
}

// Simple current-streak: count consecutive days where at least one XP-earning event happened.
export function computeGlobalStreak({ javaSessions = [], dsaLogs = [], habitLogs = {} }, todayIso) {
  const active = new Set()
  for (const s of javaSessions) if (s.session_date) active.add(s.session_date)
  for (const l of dsaLogs) if (l.log_date) active.add(l.log_date)
  for (const habitId in habitLogs) {
    for (const date in habitLogs[habitId]) {
      if (habitLogs[habitId][date]?.completed) active.add(date)
    }
  }
  const parse = (iso) => {
    const [y, m, d] = iso.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  const iso = (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${dd}`
  }
  let streak = 0
  const start = parse(todayIso)
  // if today has no activity yet, start from yesterday so a fresh morning doesn't zero out
  let cursor = active.has(todayIso) ? new Date(start) : new Date(start.getTime() - 86400000)
  while (active.has(iso(cursor))) {
    streak++
    cursor = new Date(cursor.getTime() - 86400000)
  }
  return streak
}

// Achievements — derived, not stored. Each unlock is computed from live data.
export const ACHIEVEMENTS = [
  { id: 'first_step',    icon: '👣', name: 'First Step',        desc: 'Log your first Java minute',       check: (s) => s.javaMin >= 1 },
  { id: 'first_hour',    icon: '⏱️', name: 'One Hour Deep',      desc: 'One hour of Java in a single day', check: (s) => s.maxJavaDay >= 60 },
  { id: 'first_target',  icon: '🎯', name: 'On Target',          desc: 'Hit the 3-hour Java target once',  check: (s) => s.daysOnTarget >= 1 },
  { id: 'ten_hours',     icon: '☕', name: 'Ten Hour Grind',     desc: '10 hours of Java total',           check: (s) => s.javaMin >= 600 },
  { id: 'fifty_hours',   icon: '🔥', name: 'Half Century',       desc: '50 hours of Java total',           check: (s) => s.javaMin >= 3000 },
  { id: 'hundred_hours', icon: '💯', name: 'Century',            desc: '100 hours of Java total',          check: (s) => s.javaMin >= 6000 },
  { id: 'first_dsa',     icon: '🧠', name: 'DSA Awakened',       desc: 'Solve your first DSA problem',     check: (s) => s.dsaTotal >= 1 },
  { id: 'dsa_ten',       icon: '🎓', name: 'Ten Problems Down',  desc: 'Solve 10 DSA problems',            check: (s) => s.dsaTotal >= 10 },
  { id: 'dsa_fifty',     icon: '⚔️', name: 'DSA Warrior',        desc: '50 DSA problems solved',           check: (s) => s.dsaTotal >= 50 },
  { id: 'dsa_hundred',   icon: '👑', name: 'Century of Code',    desc: '100 DSA problems solved',          check: (s) => s.dsaTotal >= 100 },
  { id: 'streak_3',      icon: '🔗', name: 'Consistent',         desc: '3-day activity streak',            check: (s) => s.streak >= 3 },
  { id: 'streak_7',      icon: '📆', name: 'Full Week',          desc: '7-day activity streak',            check: (s) => s.streak >= 7 },
  { id: 'streak_14',     icon: '💪', name: 'Two Weeks Strong',   desc: '14-day activity streak',           check: (s) => s.streak >= 14 },
  { id: 'streak_30',     icon: '🏆', name: 'Month Unbroken',     desc: '30-day activity streak',           check: (s) => s.streak >= 30 },
  { id: 'perfect_day',   icon: '⭐', name: 'Perfect Day',        desc: 'Complete every habit in one day',  check: (s) => s.perfectDays >= 1 },
  { id: 'perfect_5',     icon: '🌟', name: 'High Five',          desc: '5 perfect days',                   check: (s) => s.perfectDays >= 5 },
  { id: 'level_5',       icon: '🚀', name: 'Level 5',            desc: 'Reach Level 5',                    check: (s) => s.level >= 5 },
  { id: 'level_10',      icon: '💎', name: 'Level 10',           desc: 'Reach Level 10',                   check: (s) => s.level >= 10 },
]

// `habits` is the FULL list (including archived). A day is judged against the
// habits that actually existed on that date, so archiving or adding a habit
// can never retroactively grant or revoke a past perfect day.
export function computeAchievementStats({ javaSessions, dsaLogs, habitLogs, activeHabits, habits, level, streak }) {
  const javaMin = javaSessions.reduce((a, s) => a + (Number(s.minutes) || 0), 0)
  const byDay = {}
  for (const s of javaSessions) byDay[s.session_date] = (byDay[s.session_date] || 0) + (Number(s.minutes) || 0)
  const daysArr = Object.values(byDay)
  const maxJavaDay = daysArr.length ? Math.max(...daysArr) : 0
  const daysOnTarget = daysArr.filter((m) => m >= 180).length
  const dsaTotal = dsaLogs.reduce((a, l) => a + (Number(l.problems) || 0), 0)

  // perfect days: pick every date any habit was completed, then check ALL active habits completed that day
  const allDates = new Set()
  for (const hid in habitLogs) for (const d in habitLogs[hid]) allDates.add(d)
  let perfectDays = 0
  const roster = (habits && habits.length ? habits : activeHabits) || []
  if (roster.length) {
    // habit existed on date d if it was created on/before d
    const bornOn = new Map(
      roster.map((h) => [h.id, h.created_at ? String(h.created_at).slice(0, 10) : '0000-01-01'])
    )
    for (const d of allDates) {
      const live = roster.filter((h) => bornOn.get(h.id) <= d)
      if (live.length && live.every((h) => habitLogs[h.id]?.[d]?.completed)) perfectDays++
    }
  }
  return { javaMin, maxJavaDay, daysOnTarget, dsaTotal, perfectDays, level, streak }
}

// Fire confetti for `ms` milliseconds. Cheap, no deps.
export function fireConfetti(ms = 2500) {
  const colors = ['#60a5fa', '#a78bfa', '#22c55e', '#f59e0b', '#f43f5e', '#38bdf8']
  const N = 90
  const host = document.body
  const nodes = []
  for (let i = 0; i < N; i++) {
    const el = document.createElement('div')
    el.className = 'confetti-piece'
    el.style.left = `${Math.random() * 100}vw`
    el.style.background = colors[i % colors.length]
    el.style.animationDuration = `${1.6 + Math.random() * 1.6}s`
    el.style.animationDelay = `${Math.random() * 0.5}s`
    el.style.transform = `rotate(${Math.random() * 360}deg)`
    host.appendChild(el)
    nodes.push(el)
  }
  setTimeout(() => nodes.forEach((n) => n.remove()), ms + 500)
}
