// All date math is done in LOCAL time (your timezone), never UTC —
// so a habit checked at 11:55 PM IST lands on the right day.

export const parseISO = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const localISO = (d = new Date()) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export const todayISO = () => localISO(new Date())

export const addDays = (iso, n) => {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return localISO(d)
}

// days from a to b (b - a)
export const dayDiff = (aIso, bIso) =>
  Math.round((parseISO(bIso) - parseISO(aIso)) / 86400000)

export const fmtNice = (iso) =>
  parseISO(iso).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

export const fmtShort = (iso) =>
  parseISO(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

export const weekdayShort = (iso) =>
  parseISO(iso).toLocaleDateString('en-IN', { weekday: 'short' })

export const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()

export const monthLabel = (y, m) =>
  new Date(y, m, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

// Monday-start week
export const startOfWeek = (iso) => {
  const d = parseISO(iso)
  const back = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - back)
  return localISO(d)
}
