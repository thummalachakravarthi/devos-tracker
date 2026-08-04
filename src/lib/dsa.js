import { addDays, todayISO, dayDiff } from './dates'

// Spaced repetition ladder. Stage 0 is "just solved"; each successful
// recall pushes the problem further out. A failed recall drops it back
// a step rather than all the way to zero, so one bad day doesn't erase
// weeks of retention.
export const INTERVALS = [1, 3, 7, 21, 45]

export const nextReviewFor = (stage, fromIso = todayISO()) =>
  addDays(fromIso, INTERVALS[Math.min(stage, INTERVALS.length - 1)])

export const isDue = (log, today = todayISO()) =>
  !!log.next_review && log.next_review <= today

export const dueLogs = (dsaLogs, today = todayISO()) =>
  dsaLogs
    .filter((l) => isDue(l, today))
    .sort((a, b) => (a.next_review < b.next_review ? -1 : 1))

// How overdue, in days (0 = due today).
export const overdueBy = (log, today = todayISO()) =>
  log.next_review ? Math.max(0, dayDiff(log.next_review, today)) : 0

export const stageLabel = (stage) => {
  const n = INTERVALS[Math.min(stage, INTERVALS.length - 1)]
  return stage >= INTERVALS.length ? 'mastered' : `${n}d`
}
