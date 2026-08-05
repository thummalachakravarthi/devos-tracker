import { useMemo, useState } from 'react'
import {
  Wallet, ChevronLeft, ChevronRight, Plus, X, Trash2, Check,
  TrendingUp, TrendingDown, Delete, ArrowRightLeft, CreditCard,
  Banknote, PiggyBank, Landmark, Pencil,
} from 'lucide-react'
import { useData } from '../DataStore'
import { todayISO, fmtShort } from '../lib/dates'
import { fmtMoney, monthKey, shiftMonth, monthLabel, budgetPace, round2 } from '../lib/money'

const ACCOUNT_KINDS = [
  { id: 'bank', label: 'Bank', Icon: Landmark, color: '#4C7BFF' },
  { id: 'cash', label: 'Cash', Icon: Banknote, color: '#22C55E' },
  { id: 'card', label: 'Card', Icon: CreditCard, color: '#C084FC' },
  { id: 'wallet', label: 'Wallet', Icon: Wallet, color: '#F5A623' },
  { id: 'savings', label: 'Savings', Icon: PiggyBank, color: '#38BDF8' },
]

/* ═══ Add / edit an account ═══ */
function AccountSheet({ onClose }) {
  const { addAccount, settings } = useData()
  const cur = settings?.currency || '₹'
  const [name, setName] = useState('')
  const [kind, setKind] = useState('bank')
  const [balance, setBalance] = useState('')

  const save = () => {
    if (!name.trim()) return
    addAccount({
      name: name.trim(), kind,
      opening_balance: round2(balance || 0),
      color: ACCOUNT_KINDS.find((k) => k.id === kind)?.color || '#4C7BFF',
    })
    onClose()
  }

  return (
    <Sheet onClose={onClose} title="New account">
      <div className="p-4 space-y-4">
        <div>
          <div className="label mb-2">Type</div>
          <div className="grid grid-cols-5 gap-2">
            {ACCOUNT_KINDS.map(({ id, label, Icon, color }) => (
              <button key={id} onClick={() => setKind(id)}
                className="py-2.5 rounded-xl border transition grid place-items-center gap-1"
                style={{
                  background: kind === id ? `${color}22` : 'rgba(255,255,255,.05)',
                  borderColor: kind === id ? `${color}66` : 'rgba(255,255,255,.1)',
                }}>
                <Icon size={16} style={{ color: kind === id ? color : '#8B94A8' }} />
                <span className="text-[9px] text-dim">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="label mb-1.5">Name</div>
          <input className="input w-full" autoFocus placeholder="HDFC Savings, Cash in hand…"
            value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()} />
        </div>

        <div>
          <div className="label mb-1.5">Current balance</div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dim">{cur}</span>
            <input type="number" inputMode="decimal" className="input w-full !pl-8" placeholder="0"
              value={balance} onChange={(e) => setBalance(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && save()} />
          </div>
          <div className="text-[11px] text-dim mt-1.5">
            What's in it right now. Every transaction adjusts it from here.
          </div>
        </div>

        <button className="btn w-full !py-3 !border-amber/40 !bg-amber/15 !text-amber"
          disabled={!name.trim()} onClick={save}>
          <Check size={15} /> Add account
        </button>
      </div>
    </Sheet>
  )
}

/* ═══ Reusable bottom sheet — header never scrolls away ═══ */
function Sheet({ onClose, title, children, headerExtra }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}>
      <div className="w-full sm:max-w-md bg-[#0f121b] border border-white/12 rounded-t-3xl sm:rounded-2xl
        flex flex-col max-h-[92vh] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="shrink-0 px-4 pt-3 pb-3 border-b border-white/8">
          <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-3 sm:hidden" />
          <div className="flex items-center justify-between gap-3">
            {headerExtra || <div className="font-display font-bold">{title}</div>}
            <button onClick={onClose}
              className="w-8 h-8 rounded-full grid place-items-center bg-white/8 border border-white/12
                text-dim hover:text-text hover:bg-white/14 transition shrink-0"
              aria-label="Close">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}

/* ═══ Fast transaction entry ═══ */
function QuickAdd({ onClose }) {
  const { categories, accounts, addTxn, settings } = useData()
  const cur = settings?.currency || '₹'
  const [kind, setKind] = useState('expense')
  const [raw, setRaw] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(todayISO())
  const [accountId, setAccountId] = useState(accounts[0]?.id || '')
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || '')
  const [catId, setCatId] = useState(null)

  const amount = Number(raw || 0) / 100
  const cats = categories.filter((c) => c.kind === (kind === 'income' ? 'income' : 'expense') && !c.archived)
  const canSave = amount > 0 && (kind === 'transfer' ? accountId && toAccountId && accountId !== toAccountId : !!catId)

  const press = (d) => setRaw((r) => (r + d).replace(/^0+/, '').slice(0, 9))

  const save = () => {
    if (!canSave) return
    addTxn({
      amount: round2(amount), kind,
      category_id: kind === 'transfer' ? null : catId,
      account_id: accountId || accounts[0]?.id || null,
      to_account_id: kind === 'transfer' ? toAccountId : null,
      note: note.trim() || null, txn_date: date,
    })
    onClose()
  }

  const tone = kind === 'income' ? '#22C55E' : kind === 'transfer' ? '#38BDF8' : '#F5A623'

  const header = (
    <div className="flex gap-1 p-0.5 rounded-full bg-white/6 border border-white/10 flex-1">
      {[
        { id: 'expense', label: 'Expense', c: '#EF4444' },
        { id: 'income', label: 'Income', c: '#22C55E' },
        { id: 'transfer', label: 'Transfer', c: '#38BDF8' },
      ].map((k) => (
        <button key={k.id} onClick={() => { setKind(k.id); setCatId(null) }}
          className="flex-1 rounded-full py-1.5 text-xs font-medium transition"
          style={{
            background: kind === k.id ? `${k.c}26` : 'transparent',
            color: kind === k.id ? k.c : '#8B94A8',
          }}>
          {k.label}
        </button>
      ))}
    </div>
  )

  return (
    <Sheet onClose={onClose} headerExtra={header}>
      <div className="px-4 pb-4">
        {/* amount */}
        <div className="text-center py-5">
          <div className="font-display font-bold text-[42px] leading-none tabular-nums"
            style={{ color: amount > 0 ? tone : '#3d4456' }}>
            {cur}{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* numpad */}
        <div className="grid grid-cols-3 gap-2">
          {['1','2','3','4','5','6','7','8','9','00','0'].map((d) => (
            <button key={d} onClick={() => press(d)}
              className="py-3.5 rounded-2xl bg-white/[.07] border border-white/10 font-display font-bold text-xl
                active:scale-95 active:bg-white/14 transition">{d}</button>
          ))}
          <button onClick={() => setRaw((r) => r.slice(0, -1))}
            onDoubleClick={() => setRaw('')}
            className="py-3.5 rounded-2xl bg-white/[.07] border border-white/10 grid place-items-center
              active:scale-95 active:bg-white/14 transition"><Delete size={19} /></button>
        </div>

        {/* note + date */}
        <div className="flex gap-2 mt-3">
          <input className="input flex-1 !py-2 text-sm" placeholder="Note (optional)"
            value={note} onChange={(e) => setNote(e.target.value)} />
          <input type="date" max={todayISO()} className="input !py-2 text-xs w-[8.5rem]"
            value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {/* accounts */}
        {accounts.length > 0 && (
          <div className="flex gap-2 mt-2 items-center">
            <select className="input flex-1 !py-2 text-sm" value={accountId}
              onChange={(e) => setAccountId(e.target.value)}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            {kind === 'transfer' && (
              <>
                <ArrowRightLeft size={14} className="text-dim shrink-0" />
                <select className="input flex-1 !py-2 text-sm" value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}>
                  <option value="">To…</option>
                  {accounts.filter((a) => a.id !== accountId)
                    .map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </>
            )}
          </div>
        )}

        {/* categories */}
        {kind !== 'transfer' && (
          <>
            <div className="text-[11px] text-dim mt-4 mb-2">Category</div>
            <div className="grid grid-cols-4 gap-2">
              {cats.map((c) => {
                const on = catId === c.id
                return (
                  <button key={c.id} onClick={() => setCatId(on ? null : c.id)}
                    className="p-2 rounded-2xl border transition text-center active:scale-95"
                    style={{
                      background: on ? `${c.color}30` : `${c.color}12`,
                      borderColor: on ? c.color : `${c.color}33`,
                      boxShadow: on ? `0 0 0 1px ${c.color}55` : 'none',
                    }}>
                    <div className="text-lg leading-none">{c.icon}</div>
                    <div className="text-[9px] mt-1 leading-tight line-clamp-2"
                      style={{ color: on ? c.color : '#8B94A8' }}>{c.name}</div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* save bar */}
      <div className="sticky bottom-0 p-4 pt-3 bg-[#0f121b] border-t border-white/8">
        <button onClick={save} disabled={!canSave}
          className="w-full py-3.5 rounded-2xl font-display font-bold transition
            disabled:opacity-30 active:scale-[.98]"
          style={{ background: canSave ? tone : 'rgba(255,255,255,.08)', color: canSave ? '#0b0b10' : '#8B94A8' }}>
          {amount <= 0 ? 'Enter an amount'
            : kind === 'transfer' ? (canSave ? `Transfer ${fmtMoney(amount, cur)}` : 'Pick both accounts')
            : catId ? `Save ${fmtMoney(amount, cur)}` : 'Pick a category'}
        </button>
      </div>
    </Sheet>
  )
}

export default function Money() {
  const { transactions, categories, accounts, removeTxn, upsertCategory, settings } = useData()
  const cur = settings?.currency || '₹'
  const [month, setMonth] = useState(monthKey(todayISO()))
  const [adding, setAdding] = useState(false)
  const [addingAccount, setAddingAccount] = useState(false)
  const [tab, setTab] = useState('overview')
  const [budgetEdit, setBudgetEdit] = useState({})

  const catById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories])
  const mtx = useMemo(() => transactions.filter((t) => monthKey(t.txn_date) === month),
    [transactions, month])

  // running balance per account, from opening balance + every transaction
  const balances = useMemo(() => {
    const b = Object.fromEntries(accounts.map((a) => [a.id, Number(a.opening_balance) || 0]))
    for (const t of transactions) {
      const amt = Number(t.amount)
      if (t.kind === 'expense' && b[t.account_id] !== undefined) b[t.account_id] -= amt
      if (t.kind === 'income' && b[t.account_id] !== undefined) b[t.account_id] += amt
      if (t.kind === 'transfer') {
        if (b[t.account_id] !== undefined) b[t.account_id] -= amt
        if (b[t.to_account_id] !== undefined) b[t.to_account_id] += amt
      }
    }
    return b
  }, [accounts, transactions])

  const netWorth = round2(Object.values(balances).reduce((a, n) => a + n, 0))

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
      spent: round2(spent), earned: round2(earned), net: round2(earned - spent),
      rate: earned > 0 ? Math.round(((earned - spent) / earned) * 100) : null,
      change: prev > 0 ? Math.round(((spent - prev) / prev) * 100) : null,
      perDay: days ? round2(spent / days) : 0,
    }
  }, [mtx, transactions, month])

  const byCat = useMemo(() => {
    const m = {}
    for (const t of mtx) {
      if (t.kind !== 'expense') continue
      m[t.category_id || 'none'] = (m[t.category_id || 'none'] || 0) + Number(t.amount)
    }
    return Object.entries(m).map(([id, amt]) => ({
      id, amt: round2(amt),
      cat: catById[id] || { name: 'Uncategorised', icon: '❔', color: '#8B94A8' },
    })).sort((a, b) => b.amt - a.amt)
  }, [mtx, catById])

  const totalBudget = useMemo(() => categories
    .filter((c) => c.kind === 'expense' && c.monthly_budget)
    .reduce((a, c) => a + Number(c.monthly_budget), 0), [categories])
  const pace = budgetPace(totals.spent, totalBudget, month, todayISO())

  const R = 54, C = 2 * Math.PI * R
  let off = 0
  const arcs = byCat.slice(0, 8).map((s) => {
    const frac = totals.spent > 0 ? s.amt / totals.spent : 0
    const seg = { ...s, dash: frac * C, off }
    off += frac * C
    return seg
  })

  return (
    <div className="space-y-4">
      {/* ── balances ── */}
      <section className="card card-hover">
        <div className="flex items-center justify-between mb-3">
          <div className="label flex items-center gap-1.5"><Wallet size={12} /> Balance</div>
          <button className="btn !py-1 !px-2.5 text-[11px]" onClick={() => setAddingAccount(true)}>
            <Plus size={12} /> Account
          </button>
        </div>

        {!accounts.length ? (
          <button onClick={() => setAddingAccount(true)}
            className="w-full py-6 rounded-xl border border-dashed border-white/15 text-sm text-dim
              hover:border-amber/40 hover:text-text transition">
            Add your first account to start tracking balances
          </button>
        ) : (
          <>
            <div className="font-display font-bold text-3xl tabular-nums"
              style={{ color: netWorth >= 0 ? '#E9EEF8' : '#EF4444' }}>
              {fmtMoney(netWorth, cur)}
            </div>
            <div className="text-[11px] text-dim mt-0.5">across {accounts.length} account{accounts.length > 1 ? 's' : ''}</div>
            <div className="mt-3 space-y-1.5">
              {accounts.map((a) => {
                const K = ACCOUNT_KINDS.find((k) => k.id === a.kind) || ACCOUNT_KINDS[0]
                const bal = balances[a.id] ?? 0
                return (
                  <div key={a.id} className="flex items-center gap-2.5 py-1.5">
                    <div className="w-8 h-8 rounded-xl grid place-items-center shrink-0"
                      style={{ background: `${a.color}1e`, border: `1px solid ${a.color}44` }}>
                      <K.Icon size={14} style={{ color: a.color }} />
                    </div>
                    <span className="text-sm truncate">{a.name}</span>
                    <span className="ml-auto font-mono text-sm tabular-nums"
                      style={{ color: bal < 0 ? '#EF4444' : undefined }}>
                      {fmtMoney(bal, cur)}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </section>

      {/* ── month ── */}
      <section className="card card-hover">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setMonth(shiftMonth(month, -1))} className="text-dim hover:text-text p-1">
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <div className="label">{monthLabel(month)}</div>
            <div className="font-display font-bold text-3xl tabular-nums mt-1">{fmtMoney(totals.spent, cur)}</div>
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
          <button onClick={() => setMonth(shiftMonth(month, 1))} disabled={month >= monthKey(todayISO())}
            className="text-dim hover:text-text p-1 disabled:opacity-25"><ChevronRight size={18} /></button>
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
              {totals.rate}%</span> of what you earned.
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
              <div className="absolute top-0 bottom-0 w-0.5 bg-white/70"
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
              Nothing logged this month. Tap + to add something.
            </div>
          ) : (
            <>
              <div className="flex items-center gap-5">
                <svg viewBox="0 0 140 140" className="w-32 h-32 shrink-0 -rotate-90">
                  <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="18" />
                  {arcs.map((s) => (
                    <circle key={s.id} cx="70" cy="70" r={R} fill="none" stroke={s.cat.color}
                      strokeWidth="18" strokeDasharray={`${s.dash} ${C - s.dash}`} strokeDashoffset={-s.off} />
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
                  return (
                    <div key={s.id}>
                      <div className="flex items-center gap-2 text-sm">
                        <span>{s.cat.icon}</span><span className="truncate">{s.cat.name}</span>
                        <span className="ml-auto font-mono tabular-nums">{fmtMoney(s.amt, cur)}</span>
                      </div>
                      {budget && (
                        <div className="h-1 rounded-full bg-white/8 overflow-hidden mt-1">
                          <div className="h-full rounded-full"
                            style={{ width: `${Math.min(100, (s.amt / budget) * 100)}%`,
                              background: s.amt > budget ? '#EF4444' : s.cat.color }} />
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
            const c = catById[t.category_id] || { name: t.kind === 'transfer' ? 'Transfer' : 'Uncategorised', icon: t.kind === 'transfer' ? '🔄' : '❔', color: '#8B94A8' }
            return (
              <div key={t.id} className="card !p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl grid place-items-center shrink-0 text-base"
                  style={{ background: `${c.color}1e`, border: `1px solid ${c.color}44` }}>{c.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm truncate">{t.note || c.name}</div>
                  <div className="text-[11px] text-dim">{c.name} · {fmtShort(t.txn_date)}</div>
                </div>
                <div className="font-mono text-sm tabular-nums shrink-0"
                  style={{ color: t.kind === 'income' ? '#4ade80' : t.kind === 'transfer' ? '#38BDF8' : undefined }}>
                  {t.kind === 'income' ? '+' : t.kind === 'transfer' ? '' : '−'}{fmtMoney(t.amount, cur)}
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
          <div className="text-[11px] text-dim mb-1">Monthly cap per category. Blank means no limit.</div>
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
          shadow-xl transition active:scale-95"
        style={{ background: 'linear-gradient(135deg,#F5A623,#E8632B)' }} aria-label="Add transaction">
        <Plus size={24} className="text-black/80" />
      </button>

      {adding && <QuickAdd onClose={() => setAdding(false)} />}
      {addingAccount && <AccountSheet onClose={() => setAddingAccount(false)} />}
    </div>
  )
}
