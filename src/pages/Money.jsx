import { useMemo, useState } from 'react'
import {
  Wallet, ChevronLeft, ChevronRight, Plus, X, Trash2, Check,
  TrendingUp, TrendingDown, Delete, ArrowRightLeft, CreditCard,
  Banknote, PiggyBank, Landmark,
} from 'lucide-react'
import { useData } from '../DataStore'
import { todayISO, fmtShort } from '../lib/dates'
import { useCountUp } from '../components/Numeric'
import { fmtMoney, monthKey, shiftMonth, monthLabel, budgetPace, round2 } from '../lib/money'

/* Symbol and paise sit back; the rupees carry the weight. */
function Amount({ value, cur = '₹', size = 'text-3xl', animate = false, tone }) {
  // hook must run unconditionally; pick after
  const animated = useCountUp(Number(value) || 0)
  const shown = animate ? animated : Number(value) || 0
  const neg = shown < 0
  const abs = Math.abs(shown)
  const whole = Math.floor(abs).toLocaleString('en-IN')
  const paise = Math.round((abs - Math.floor(abs)) * 100).toString().padStart(2, '0')
  return (
    <span className={`font-display font-bold tabular-nums tracking-tight ${size}`} style={{ color: tone }}>
      {neg && '−'}
      <span className="opacity-55" style={{ fontSize: '0.62em' }}>{cur}</span>
      {whole}
      <span className="opacity-45" style={{ fontSize: '0.5em' }}>.{paise}</span>
    </span>
  )
}

/* Daily spend through the month — shape matters more than exact values here. */
function SpendCurve({ days, tone = '#F5A623' }) {
  if (!days.length) return null
  const max = Math.max(1, ...days.map((d) => d.amt))
  const W = 300, H = 56
  const pts = days.map((d, i) => [
    (i / Math.max(1, days.length - 1)) * W,
    H - (d.amt / max) * (H - 6) - 3,
  ])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${W},${H} L0,${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-14" preserveAspectRatio="none">
      <defs>
        <linearGradient id="scFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tone} stopOpacity="0.32" />
          <stop offset="1" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#scFill)" />
      <path d={line} fill="none" stroke={tone} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function Empty({ icon, title, body, action, onAction }) {
  return (
    <div className="py-10 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl mx-auto grid place-items-center mb-3"
        style={{ background: 'rgba(245,166,35,.1)', border: '1px solid rgba(245,166,35,.25)' }}>
        {icon}
      </div>
      <div className="font-display font-bold text-sm">{title}</div>
      <div className="text-xs text-dim mt-1.5 max-w-[16rem] mx-auto leading-relaxed">{body}</div>
      {action && (
        <button className="btn mt-4 !py-2 !px-4 text-xs" onClick={onAction}>{action}</button>
      )}
    </div>
  )
}

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

  // cumulative-free daily series for the curve
  const dailySpend = useMemo(() => {
    const [y, m] = month.split('-').map(Number)
    const n = new Date(y, m, 0).getDate()
    const by = {}
    for (const t of mtx) if (t.kind === 'expense') by[t.txn_date] = (by[t.txn_date] || 0) + Number(t.amount)
    return Array.from({ length: n }, (_, i) => {
      const d = `${month}-${String(i + 1).padStart(2, '0')}`
      return { d, amt: round2(by[d] || 0) }
    })
  }, [mtx, month])

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
      {/* ── balance: a physical payment card ── */}
      <section className="mny-enter" style={{ animationDelay: '0ms' }}>
        <div className="relative w-full rounded-[22px] overflow-hidden border border-white/[.14]
          shadow-[0_24px_60px_-18px_rgba(0,0,0,.85)]"
          style={{ aspectRatio: '1.62 / 1', maxHeight: 232 }}>

          {/* mesh gradient base */}
          <div className="absolute inset-0" style={{
            background:
              'radial-gradient(120% 120% at 8% 0%, #3a2f6e 0%, transparent 55%),' +
              'radial-gradient(110% 130% at 100% 10%, #7a3a2a 0%, transparent 50%),' +
              'radial-gradient(140% 160% at 60% 110%, #123044 0%, transparent 60%),' +
              'linear-gradient(150deg, #1b1c30 0%, #0d0e16 100%)',
          }} />

          {/* woven texture */}
          <div className="absolute inset-0 opacity-[.16] mix-blend-overlay" style={{
            backgroundImage:
              'repeating-linear-gradient(115deg, rgba(255,255,255,.9) 0 1px, transparent 1px 4px)',
          }} />

          {/* light sweep */}
          <div className="mny-sweep absolute inset-y-0 w-1/3 pointer-events-none" style={{
            background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.14), transparent)',
          }} />

          {/* top edge highlight */}
          <div className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent)' }} />

          <div className="relative h-full p-5 flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                {/* chip */}
                <div className="w-10 h-7 rounded-md relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg,#e8c87a,#b8923f 45%,#f0dca2)' }}>
                  <div className="absolute inset-0"
                    style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 1px, transparent 1px 6px)' }} />
                  <div className="absolute inset-y-1 left-1/2 w-px bg-black/30" />
                </div>
                <div className="text-[10px] uppercase tracking-[.22em] text-white/45 mt-3">
                  Total balance
                </div>
              </div>
              <button className="rounded-full px-3 py-1.5 text-[11px] bg-white/12 border border-white/20
                hover:bg-white/20 transition flex items-center gap-1 shrink-0 backdrop-blur-sm"
                onClick={() => setAddingAccount(true)}>
                <Plus size={12} /> Account
              </button>
            </div>

            <div className="mt-auto">
              {accounts.length ? (
                <Amount value={netWorth} cur={cur} size="text-[38px]" animate
                  tone={netWorth < 0 ? '#ff7a7a' : '#F7F9FF'} />
              ) : (
                <span className="font-display font-bold text-[38px] text-white/25">—</span>
              )}

              <div className="flex items-end justify-between mt-3">
                <div className="flex gap-3">
                  {accounts.slice(0, 3).map((a) => {
                    const K = ACCOUNT_KINDS.find((k) => k.id === a.kind) || ACCOUNT_KINDS[0]
                    return (
                      <div key={a.id} className="min-w-0">
                        <div className="flex items-center gap-1">
                          <K.Icon size={10} style={{ color: a.color }} />
                          <span className="text-[9px] uppercase tracking-wider text-white/40 truncate max-w-[5.5rem]">
                            {a.name}
                          </span>
                        </div>
                        <div className="font-mono text-[13px] tabular-nums text-white/85 mt-0.5">
                          {fmtMoney(balances[a.id] ?? 0, cur, { compact: true })}
                        </div>
                      </div>
                    )
                  })}
                  {accounts.length > 3 && (
                    <div className="text-[11px] text-white/40 self-end">
                      +{accounts.length - 3} more
                    </div>
                  )}
                </div>
                <div className="font-display font-bold text-sm text-white/30 tracking-widest shrink-0">
                  DEVOS
                </div>
              </div>
            </div>
          </div>
        </div>

        {!accounts.length && (
          <button onClick={() => setAddingAccount(true)}
            className="w-full mt-3 py-3.5 rounded-2xl border border-dashed border-white/18 text-sm
              text-dim hover:border-amber/50 hover:text-text transition">
            Add an account to start tracking balances
          </button>
        )}
      </section>

      {/* ── month ── */}
      <section className="mny-enter relative overflow-hidden rounded-2xl border border-white/10 p-5"
        style={{
          animationDelay: '70ms',
          background: 'linear-gradient(160deg, #171a28 0%, #12141d 60%, #0e1017 100%)',
        }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setMonth(shiftMonth(month, -1))} className="text-dim hover:text-text p-1">
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <div className="label">{monthLabel(month)}</div>
            <div className="mt-1"><Amount value={totals.spent} cur={cur} size="text-[32px]" animate /></div>
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

        {dailySpend.filter((d) => d.amt > 0).length >= 2 && (
          <div className="mt-3 -mx-1">
            <SpendCurve days={dailySpend} />
          </div>
        )}

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

      <div className="mny-enter flex p-1 rounded-2xl bg-white/[.05] border border-white/8"
        style={{ animationDelay: '130ms' }}>
        {['overview', 'transactions', 'budgets'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 rounded-xl py-2 text-xs font-medium capitalize transition"
            style={{
              background: tab === t ? 'rgba(245,166,35,.16)' : 'transparent',
              color: tab === t ? '#F5A623' : '#8B94A8',
              boxShadow: tab === t ? 'inset 0 0 0 1px rgba(245,166,35,.35)' : 'none',
            }}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <section className="card">
          {!byCat.length ? (
            <Empty icon={<Wallet size={22} className="text-amber" />}
              title="Nothing logged this month"
              body="Add a few expenses and this fills with a breakdown by category and your spending curve."
              action="Add an expense" onAction={() => setAdding(true)} />
          ) : (
            <>
              <div className="flex items-center gap-5">
                <div className="relative w-32 h-32 shrink-0">
                  <svg viewBox="0 0 140 140" className="w-32 h-32 -rotate-90">
                    <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="15" />
                    {arcs.map((a) => (
                      <circle key={a.id} cx="70" cy="70" r={R} fill="none" stroke={a.cat.color}
                        strokeWidth="15" strokeLinecap="round"
                        strokeDasharray={`${Math.max(0, a.dash - 3)} ${C - Math.max(0, a.dash - 3)}`}
                        strokeDashoffset={-a.off}
                        style={{ transition: 'stroke-dasharray .7s ease, stroke-dashoffset .7s ease' }} />
                    ))}
                  </svg>
                  <div className="absolute inset-0 grid place-items-center text-center">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-dim">spent</div>
                      <div className="font-display font-bold text-sm tabular-nums">
                        {fmtMoney(totals.spent, cur, { compact: true })}
                      </div>
                    </div>
                  </div>
                </div>
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
        <div className="space-y-4">
          {!mtx.length ? (
            <div className="card !p-0">
              <Empty icon={<Plus size={22} className="text-amber" />}
                title="No transactions yet"
                body={month === monthKey(todayISO())
                  ? 'Every expense, income and transfer you log this month shows up here, grouped by day.'
                  : 'Nothing was logged in this month.'}
                action={month === monthKey(todayISO()) ? 'Add one' : null}
                onAction={() => setAdding(true)} />
            </div>
          ) : (() => {
            const groups = {}
            for (const t of mtx) (groups[t.txn_date] ||= []).push(t)
            return Object.keys(groups).sort((a, b) => b.localeCompare(a)).map((day) => {
              const rows = groups[day]
              const spent = rows.filter((t) => t.kind === 'expense')
                .reduce((a, t) => a + Number(t.amount), 0)
              return (
                <div key={day}>
                  <div className="flex items-baseline justify-between px-1 mb-1.5">
                    <div className="text-[11px] uppercase tracking-wider text-dim">
                      {day === todayISO() ? 'Today' : fmtShort(day)}
                    </div>
                    {spent > 0 && (
                      <div className="font-mono text-[11px] text-dim">
                        {fmtMoney(spent, cur, { compact: true })}
                      </div>
                    )}
                  </div>
                  <div className="rounded-2xl border border-white/8 overflow-hidden bg-white/[.03]">
                    {rows.map((t, i) => {
                      const c = catById[t.category_id] || {
                        name: t.kind === 'transfer' ? 'Transfer' : 'Uncategorised',
                        icon: t.kind === 'transfer' ? '🔄' : '❔', color: '#8B94A8',
                      }
                      return (
                        <div key={t.id}
                          className={`flex items-center gap-3 px-3 py-2.5 group
                            ${i ? 'border-t border-white/6' : ''}`}>
                          <div className="w-9 h-9 rounded-xl grid place-items-center shrink-0 text-base"
                            style={{ background: `${c.color}1e`, border: `1px solid ${c.color}3a` }}>
                            {c.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm truncate">{t.note || c.name}</div>
                            <div className="text-[11px] text-dim truncate">{c.name}</div>
                          </div>
                          <div className="shrink-0 font-mono text-sm tabular-nums"
                            style={{ color: t.kind === 'income' ? '#4ade80'
                              : t.kind === 'transfer' ? '#38BDF8' : '#E9EEF8' }}>
                            {t.kind === 'income' ? '+' : t.kind === 'transfer' ? '' : '−'}
                            {fmtMoney(t.amount, cur)}
                          </div>
                          <button
                            className="text-dim hover:text-red shrink-0 opacity-0 group-hover:opacity-100
                              focus:opacity-100 transition"
                            onClick={() => removeTxn(t.id)} aria-label="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          })()}
        </div>
      )}

      {tab === 'budgets' && (
        <section className="card space-y-2">
          {!totalBudget && (
            <div className="rounded-xl p-3 mb-3"
              style={{ background: 'rgba(245,166,35,.08)', border: '1px solid rgba(245,166,35,.22)' }}>
              <div className="text-xs text-amber font-medium">Set your first budget</div>
              <div className="text-[11px] text-dim mt-1 leading-relaxed">
                Once a category has a cap, the month view shows whether you're ahead or behind
                pace for today's date — not just how much is left.
              </div>
            </div>
          )}
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
        className="mny-fab fixed bottom-24 right-5 z-30 w-14 h-14 rounded-full grid place-items-center"
        style={{
          background: 'linear-gradient(135deg,#FFC65B,#E8632B)',
          boxShadow: '0 10px 30px -6px rgba(232,99,43,.6), inset 0 1px 0 rgba(255,255,255,.45)',
        }} aria-label="Add transaction">
        <Plus size={24} className="text-black/80" />
      </button>

      {adding && <QuickAdd onClose={() => setAdding(false)} />}
      {addingAccount && <AccountSheet onClose={() => setAddingAccount(false)} />}
    </div>
  )
}
