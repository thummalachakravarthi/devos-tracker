import { useMemo, useState } from 'react'
import {
  Wallet, ChevronLeft, ChevronRight, Plus, X, Trash2,
  TrendingUp, TrendingDown, Delete, Check,
} from 'lucide-react'
import { useData } from '../DataStore'
import { todayISO, fmtShort } from '../lib/dates'
import {
  fmtMoney, monthKey, shiftMonth, monthLabel, budgetPace, round2,
} from '../lib/money'

/* ── fast entry: amount first, then one tap on a category ── */
function QuickAdd({ onClose }) {
  const { categories, accounts, addTxn, settings } = useData()
  const cur = settings?.currency || '₹'
  const [kind, setKind] = useState('expense')
  const [raw, setRaw] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(todayISO())
  const [accountId, setAccountId] = useState('')

  const amount = Number(raw || 0) / 100      // entered in paise, shown as rupees
  const cats = categories.filter((c) => c.kind === kind && !c.archived)

  const press = (d) => setRaw((r) => (r + d).replace(/^0+/, '').slice(0, 9))
  const back = () => setRaw((r) => r.slice(0, -1))

  const save = (cat) => {
    if (amount <= 0) return
    addTxn({
      amount: round2(amount), kind, category_id: cat.id,
      account_id: accountId || accounts[0]?.id || null,
      note: note.trim() || null, txn_date: date,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}>
      <div className="w-full sm:max-w-md bg-[#11141e] border border-white/10 rounded-t-2xl sm:rounded-2xl
        p-4 max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1.5">
            {['expense', 'income'].map((k) => (
              <button key={k} onClick={() => setKind(k)}
                className="rounded-full px-3 py-1.5 text-xs border transition"
                style={{
                  background: kind === k ? (k === 'income' ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.18)') : 'rgba(255,255,255,.05)',
                  borderColor: kind === k ? (k === 'income' ? 'rgba(34,197,94,.5)' : 'rgba(239,68,68,.45)') : 'rgba(255,255,255,.1)',
                  color: kind === k ? (k === 'income' ? '#4ade80' : '#f87171') : undefined,
                }}>
                {k === 'income' ? 'Income' : 'Expense'}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="text-dim"><X size={18} /></button>
        </div>

        <div className="text-center py-4">
          <div className="font-display font-bold text-4xl tabular-nums"
            style={{ color: amount > 0 ? (kind === 'income' ? '#4ade80' : '#E9EEF8') : '#4a5265' }}>
            {cur}{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {['1','2','3','4','5','6','7','8','9','00','0'].map((d) => (
            <button key={d} onClick={() => press(d)}
              className="py-3 rounded-xl bg-white/6 border border-white/10 font-display font-bold text-lg
                active:bg-white/12 transition">{d}</button>
          ))}
          <button onClick={back}
            className="py-3 rounded-xl bg-white/6 border border-white/10 grid place-items-center
              active:bg-white/12 transition"><Delete size={18} /></button>
        </div>

        <div className="flex gap-2 mb-3">
          <input className="input flex-1 !py-1.5 text-sm" placeholder="Note (optional)"
            value={note} onChange={(e) => setNote(e.target.value)} />
          <input type="date" max={todayISO()} className="input !py-1.5 text-xs"
            value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {accounts.length > 1 && (
          <select className="input w-full !py-1.5 text-sm mb-3" value={accountId}
            onChange={(e) => setAccountId(e.target.value)}>
            <option value="">{accounts[0]?.name || 'Default account'}</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        )}

        <div className="text-[11px] text-dim mb-2">
          {amount > 0 ? 'Tap a category to save' : 'Enter an amount'}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {cats.map((c) => (
            <button key={c.id} onClick={() => save(c)} disabled={amount <= 0}
              className="p-2 rounded-xl border transition text-center disabled:opacity-40"
              style={{ background: `${c.color}18`, borderColor: `${c.color}44` }}>
              <div className="text-lg leading-none">{c.icon}</div>
              <div className="text-[9px] mt-1 leading-tight text-dim line-clamp-2">{c.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Money() {
  const { transactions, categories, removeTxn, upsertCategory, settings } = useData()
  const cur = settings?.currency || '₹'
  const [month, setMonth] = useState(monthKey(todayISO()))
  const [adding, setAdding] = useState(false)
  const [tab, setTab] = useState('overview')
  const [budgetEdit, setBudgetEdit] = useState({})

  const catById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])), [categories])

  const mtx = useMemo(
    () => transactions.filter((t) => monthKey(t.txn_date) === month),
    [transactions, month])

  const totals = useMemo(() => {
    let spent = 0, earned = 0
    for (const t of mtx) {
      if (t.kind === 'expense') spent += Number(t.amount)
      else if (t.kind === 'income') earned += Number(t.amount)
    }
    const prev = transactions.filter((t) => monthKey(t.txn_date) === shiftMonth(month, -1)
      && t.kind === 'expense').reduce((a, t) => a + Number(t.amount), 0)
    const days = new Set(mtx.filter((t) => t.kind === 'expense').map((t) => t.txn_date)).size
    return {
      spent: round2(spent), earned: round2(earned),
      net: round2(earned - spent),
      rate: earned > 0 ? Math.round(((earned - spent) / earned) * 100) : null,
      prev: round2(prev),
      change: prev > 0 ? Math.round(((spent - prev) / prev) * 100) : null,
      perDay: days ? round2(spent / days) : 0,
    }
  }, [mtx, transactions, month])

  const byCat = useMemo(() => {
    const m = {}
    for (const t of mtx) {
      if (t.kind !== 'expense') continue
      const k = t.category_id || 'none'
      m[k] = (m[k] || 0) + Number(t.amount)
    }
    return Object.entries(m)
      .map(([id, amt]) => ({
        id, amt: round2(amt),
        cat: catById[id] || { name: 'Uncategorised', icon: '❔', color: '#8B94A8' },
      }))
      .sort((a, b) => b.amt - a.amt)
  }, [mtx, catById])

  const totalBudget = useMemo(
    () => categories.filter((c) => c.kind === 'expense' && c.monthly_budget)
      .reduce((a, c) => a + Number(c.monthly_budget), 0), [categories])
  const pace = budgetPace(totals.spent, totalBudget, month, todayISO())

  // donut geometry
  const R = 54, C = 2 * Math.PI * R
  let offset = 0
  const arcs = byCat.slice(0, 8).map((s) => {
    const frac = totals.spent > 0 ? s.amt / totals.spent : 0
    const seg = { ...s, dash: frac * C, offset }
    offset += frac * C
    return seg
  })

  return (
    <div className="space-y-4">
      {/* ── month header ── */}
      <section className="card card-hover">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setMonth(shiftMonth(month, -1))} className="text-dim hover:text-text p-1">
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <div className="label flex items-center gap-1.5 justify-center">
              <Wallet size={12} /> {monthLabel(month)}
            </div>
            <div className="font-display font-bold text-3xl tabular-nums mt-1">
              {fmtMoney(totals.spent, cur)}
            </div>
            <div className="text-[11px] text-dim mt-0.5">
              spent
              {totals.change !== null && (
                <span className={totals.change > 0 ? 'text-red ml-1.5' : 'text-mint ml-1.5'}>
                  {totals.change > 0 ? <TrendingUp size={10} className="inline" /> : <TrendingDown size={10} className="inline" />}
                  {' '}{Math.abs(totals.change)}% vs last month
                </span>
              )}
            </div>
          </div>
          <button onClick={() => setMonth(shiftMonth(month, 1))}
            disabled={month >= monthKey(todayISO())}
            className="text-dim hover:text-text p-1 disabled:opacity-25">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            ['Earned', fmtMoney(totals.earned, cur, { compact: true }), '#22C55E'],
            ['Net', fmtMoney(totals.net, cur, { compact: true }), totals.net >= 0 ? '#22C55E' : '#EF4444'],
            ['Per day', fmtMoney(totals.perDay, cur, { compact: true }), '#8B94A8'],
          ].map(([k, v, tone]) => (
            <div key={k} className="rounded-xl bg-white/5 border border-white/8 p-2.5">
              <div className="text-[9px] uppercase tracking-wider text-dim">{k}</div>
              <div className="font-display font-bold text-base mt-0.5 tabular-nums" style={{ color: tone }}>{v}</div>
            </div>
          ))}
        </div>

        {totals.rate !== null && (
          <div className="mt-3 text-[11px] text-dim">
            Savings rate <span className="font-mono" style={{ color: totals.rate >= 20 ? '#22C55E' : '#F5A623' }}>
              {totals.rate}%
            </span> of what you earned this month.
          </div>
        )}

        {pace && (
          <div className="mt-3 rounded-xl bg-white/5 border border-white/8 p-3">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-dim">Budget {fmtMoney(totalBudget, cur, { compact: true })}</span>
              <span style={{ color: pace.diff > 0 ? '#EF4444' : '#22C55E' }}>
                {pace.diff > 0 ? 'over' : 'under'} pace by {fmtMoney(Math.abs(pace.diff), cur)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/8 overflow-hidden relative">
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (totals.spent / totalBudget) * 100)}%`,
                  background: totals.spent > totalBudget ? '#EF4444' : pace.diff > 0 ? '#F5A623' : '#22C55E',
                }} />
              <div className="absolute top-0 bottom-0 w-0.5 bg-white/60"
                style={{ left: `${(pace.dayOfMonth / pace.days) * 100}%` }} title="today" />
            </div>
          </div>
        )}
      </section>

      <div className="flex gap-1.5">
        {['overview', 'transactions', 'budgets'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="rounded-full px-3 py-1.5 text-xs border transition capitalize"
            style={{
              background: tab === t ? 'rgba(245,166,35,.18)' : 'rgba(255,255,255,.05)',
              borderColor: tab === t ? 'rgba(245,166,35,.45)' : 'rgba(255,255,255,.1)',
              color: tab === t ? '#F5A623' : undefined,
            }}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <section className="card">
          {!byCat.length ? (
            <div className="text-sm text-dim text-center py-8">
              Nothing logged this month. Tap + to add your first expense.
            </div>
          ) : (
            <>
              <div className="flex items-center gap-5">
                <svg viewBox="0 0 140 140" className="w-32 h-32 shrink-0 -rotate-90">
                  <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="18" />
                  {arcs.map((s) => (
                    <circle key={s.id} cx="70" cy="70" r={R} fill="none" stroke={s.cat.color}
                      strokeWidth="18" strokeDasharray={`${s.dash} ${C - s.dash}`}
                      strokeDashoffset={-s.offset} />
                  ))}
                </svg>
                <div className="min-w-0 flex-1 space-y-1.5">
                  {byCat.slice(0, 5).map((s) => (
                    <div key={s.id} className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.cat.color }} />
                      <span className="truncate">{s.cat.icon} {s.cat.name}</span>
                      <span className="ml-auto font-mono text-dim shrink-0">
                        {Math.round((s.amt / totals.spent) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {byCat.map((s) => {
                  const budget = s.cat.monthly_budget ? Number(s.cat.monthly_budget) : null
                  const pct = budget ? Math.min(100, (s.amt / budget) * 100) : null
                  return (
                    <div key={s.id}>
                      <div className="flex items-center gap-2 text-sm">
                        <span>{s.cat.icon}</span>
                        <span className="truncate">{s.cat.name}</span>
                        <span className="ml-auto font-mono tabular-nums">{fmtMoney(s.amt, cur)}</span>
                      </div>
                      {budget && (
                        <div className="h-1 rounded-full bg-white/8 overflow-hidden mt-1">
                          <div className="h-full rounded-full"
                            style={{ width: `${pct}%`, background: s.amt > budget ? '#EF4444' : s.cat.color }} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </section>
      )}

      {tab === 'transactions' && (
        <div className="space-y-2">
          {!mtx.length ? (
            <div className="card text-sm text-dim text-center py-8">No transactions this month.</div>
          ) : mtx.map((t) => {
            const c = catById[t.category_id] || { name: 'Uncategorised', icon: '❔', color: '#8B94A8' }
            return (
              <div key={t.id} className="card !p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl grid place-items-center shrink-0 text-base"
                  style={{ background: `${c.color}1e`, border: `1px solid ${c.color}44` }}>{c.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm truncate">{t.note || c.name}</div>
                  <div className="text-[11px] text-dim">{c.name} · {fmtShort(t.txn_date)}</div>
                </div>
                <div className="font-mono text-sm tabular-nums shrink-0"
                  style={{ color: t.kind === 'income' ? '#4ade80' : undefined }}>
                  {t.kind === 'income' ? '+' : '−'}{fmtMoney(t.amount, cur)}
                </div>
                <button className="text-dim hover:text-red shrink-0" onClick={() => removeTxn(t.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'budgets' && (
        <section className="card space-y-2">
          <div className="text-[11px] text-dim mb-1">
            Set a monthly cap per category. Leave blank for no limit.
          </div>
          {categories.filter((c) => c.kind === 'expense' && !c.archived).map((c) => {
            const spent = byCat.find((s) => s.id === c.id)?.amt || 0
            const editing = budgetEdit[c.id] !== undefined
            return (
              <div key={c.id} className="flex items-center gap-2 py-1.5 border-b border-white/6 last:border-0">
                <span>{c.icon}</span>
                <span className="text-sm truncate flex-1">{c.name}</span>
                <span className="font-mono text-[11px] text-dim shrink-0">
                  {fmtMoney(spent, cur, { compact: true })}
                </span>
                <input type="number" inputMode="numeric" placeholder="—"
                  className="input w-24 !py-1 text-sm text-right"
                  value={editing ? budgetEdit[c.id] : (c.monthly_budget ?? '')}
                  onChange={(e) => setBudgetEdit({ ...budgetEdit, [c.id]: e.target.value })}
                  onBlur={() => {
                    if (!editing) return
                    const v = budgetEdit[c.id]
                    const next = v === '' ? null : round2(v)
                    if (next !== (c.monthly_budget ?? null)) upsertCategory(c.id, { monthly_budget: next })
                    const { [c.id]: _, ...rest } = budgetEdit
                    setBudgetEdit(rest)
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} />
              </div>
            )
          })}
        </section>
      )}

      <button onClick={() => setAdding(true)}
        className="fixed bottom-24 right-5 z-30 w-14 h-14 rounded-full grid place-items-center
          shadow-lg transition active:scale-95"
        style={{ background: 'linear-gradient(135deg,#F5A623,#E8632B)' }}
        aria-label="Add transaction">
        <Plus size={24} className="text-black/80" />
      </button>

      {adding && <QuickAdd onClose={() => setAdding(false)} />}
    </div>
  )
}
