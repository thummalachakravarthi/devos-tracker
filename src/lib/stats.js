import { addDays } from './dates'

// doneSet: Set of 'YYYY-MM-DD' strings where the habit was completed
export function currentStreak(doneSet, todayIso) {
  let streak = 0
  let d = doneSet.has(todayIso) ? todayIso : addDays(todayIso, -1)
  while (doneSet.has(d)) {
    streak++
    d = addDays(d, -1)
  }
  return streak
}

export function bestStreak(doneSet) {
  let best = 0
  for (const d of doneSet) {
    if (!doneSet.has(addDays(d, -1))) {
      let len = 1
      let n = addDays(d, 1)
      while (doneSet.has(n)) {
        len++
        n = addDays(n, 1)
      }
      if (len > best) best = len
    }
  }
  return best
}
