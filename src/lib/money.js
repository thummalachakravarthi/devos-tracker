// Money helpers. Amounts are stored as numeric(14,2) and handled as numbers
// here; everything is rounded to paise on the way in to avoid float drift.

export const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100

/** Indian grouping (1,20,000) — matches how the numbers actually read here. */
export function fmtMoney(n, symbol = '₹', { compact = false } = {}) {
  const v = Number(n) || 0
  if (compact && Math.abs(v) >= 100000) return `${symbol}${(v / 100000).toFixed(1)}L`
  if (compact && Math.abs(v) >= 1000) return `${symbol}${(v / 1000).toFixed(1)}k`
  return symbol + v.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export const monthKey = (iso) => (iso || '').slice(0, 7)      // YYYY-MM
export const monthStart = (key) => `${key}-01`
export function monthEnd(key) {
  const [y, m] = key.split('-').map(Number)
  return `${key}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`
}
export function shiftMonth(key, delta) {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
export const monthLabel = (key) => {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

/**
 * Budget pace: are you ahead or behind for where you are in the month?
 * Returns { expected, diff } where a negative diff means under budget.
 */
export function budgetPace(spent, budget, key, todayIso) {
  if (!budget) return null
  const [y, m] = key.split('-').map(Number)
  const days = new Date(y, m, 0).getDate()
  const isThisMonth = monthKey(todayIso) === key
  const dayOfMonth = isThisMonth ? Number(todayIso.slice(8, 10)) : days
  const expected = round2((budget / days) * dayOfMonth)
  return { expected, diff: round2(spent - expected), days, dayOfMonth }
}

export const DEFAULT_CATEGORIES = [
  { name: 'Food & drink', icon: '🍜', color: '#FF8A5B', kind: 'expense' },
  { name: 'Groceries',    icon: '🛒', color: '#7ED957', kind: 'expense' },
  { name: 'Transport',    icon: '🛺', color: '#4C7BFF', kind: 'expense' },
  { name: 'Rent',         icon: '🏠', color: '#C084FC', kind: 'expense' },
  { name: 'Bills',        icon: '💡', color: '#F5A623', kind: 'expense' },
  { name: 'Shopping',     icon: '🛍️', color: '#FF6FA5', kind: 'expense' },
  { name: 'Health',       icon: '💊', color: '#22C55E', kind: 'expense' },
  { name: 'Fun',          icon: '🎬', color: '#38BDF8', kind: 'expense' },
  { name: 'Learning',     icon: '📚', color: '#A78BFA', kind: 'expense' },
  { name: 'Family',       icon: '👪', color: '#FBBF24', kind: 'expense' },
  { name: 'Other',        icon: '💸', color: '#8B94A8', kind: 'expense' },
  { name: 'Salary',       icon: '💰', color: '#22C55E', kind: 'income' },
  { name: 'Investment',   icon: '📈', color: '#4ADE80', kind: 'income' },
  { name: 'Other income', icon: '🪙', color: '#8B94A8', kind: 'income' },
]
