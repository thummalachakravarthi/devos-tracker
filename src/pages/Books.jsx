import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BookOpen, Search, Trash2, Star, Check, Plus, Heart,
  Quote, StickyNote, X, Loader2, Grid2X2, List,
} from 'lucide-react'
import { useData } from '../DataStore'
import { todayISO, fmtShort, weekdayShort, addDays } from '../lib/dates'
import { searchBooks, estimateFinish } from '../lib/openlibrary'
import { CountUp, Ring, Curve } from '../components/Numeric'

const SHELVES = [
  { id: 'reading', label: 'Reading', tone: '#4C7BFF' },
  { id: 'finished', label: 'Finished', tone: '#22C55E' },
  { id: 'want', label: 'Want to read', tone: '#8B94A8' },
  { id: 'abandoned', label: 'Abandoned', tone: '#EF4444' },
]

/* A book should look like an object: spine, a little gloss, a shadow under it. */
function Cover({ book, size = 'h-24 w-16', flat = false }) {
  const [failed, setFailed] = useState(false)
  const shadow = flat ? '' : 'shadow-[0_6px_16px_-4px_rgba(0,0,0,.7)]'
  const inner = (
    <>
      {/* spine */}
      <span className="absolute inset-y-0 left-0 w-[7%] rounded-l-[3px]"
        style={{ background: 'linear-gradient(90deg, rgba(0,0,0,.45), rgba(255,255,255,.06))' }} />
      {/* gloss */}
      <span className="absolute inset-0 rounded-[3px] pointer-events-none"
        style={{ background: 'linear-gradient(115deg, rgba(255,255,255,.16) 0%, transparent 38%)' }} />
    </>
  )
  if (book.cover_url && !failed) {
    return (
      <div className={`${size} relative shrink-0 rounded-[3px] overflow-hidden ${shadow}`}>
        <img src={book.cover_url} alt="" onError={() => setFailed(true)}
          className="w-full h-full object-cover" />
        {inner}
      </div>
    )
  }
  return (
    <div className={`${size} relative shrink-0 rounded-[3px] overflow-hidden ${shadow}
      grid place-items-center text-center p-1.5
      bg-gradient-to-br from-[#2b3145] to-[#171a26] border border-white/10`}>
      <span className="text-[8px] leading-tight text-dim line-clamp-4 font-display">{book.title}</span>
      {inner}
    </div>
  )
}

function Stars({ value, onPick, size = 13 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onPick(value === n ? null : n)} className="p-0.5">
          <Star size={size} className={n <= (value || 0) ? 'text-amber' : 'text-dim/40'}
            fill={n <= (value || 0) ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  )
}

export default function Books() {
  const {
    books, addBook, updateBook, removeBook,
    bookSessions, logReading, removeReading, bookNotes, addNote, removeNote,
    settings,
  } = useData()

  const [shelf, setShelf] = useState('reading')
  const [view, setView] = useState('list')
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchErr, setSearchErr] = useState(null)
  const [open, setOpen] = useState(null)
  const [pagesInput, setPagesInput] = useState({})
  const [noteDraft, setNoteDraft] = useState({ body: '', kind: 'note', page: '' })
  const [logDate, setLogDate] = useState({})   // per-book, defaults to today
  const abortRef = useRef(null)

  // debounced live search against Open Library
  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); setSearchErr(null); return }
    const t = setTimeout(async () => {
      abortRef.current?.abort()
      const ctrl = new AbortController()
      abortRef.current = ctrl
      setSearching(true); setSearchErr(null)
      try {
        setResults(await searchBooks(q, { signal: ctrl.signal }))
      } catch (e) {
        if (e.name !== 'AbortError') setSearchErr("Couldn't reach Open Library")
      } finally {
        setSearching(false)
      }
    }, 350)
    return () => clearTimeout(t)
  }, [q])

  const year = new Date().getFullYear()
  const goal = settings?.yearly_book_goal ?? 12

  const stats = useMemo(() => {
    const done = books.filter((b) => b.status === 'finished')
    const thisYear = done.filter((b) => (b.finished_on || '').startsWith(String(year)))
    const rated = done.filter((b) => b.rating)
    const byDay = {}
    for (const s of bookSessions) byDay[s.session_date] = (byDay[s.session_date] || 0) + s.pages
    const today = todayISO()
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const d = addDays(today, -i)
      if (byDay[d]) streak++
      else if (i > 0) break
    }
    const week = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(today, -(6 - i))
      return { d, pages: byDay[d] || 0 }
    })
    const daysLogged = Object.keys(byDay).length
    const totalPages = Object.values(byDay).reduce((a, n) => a + n, 0)
    return {
      done: done.length,
      thisYear: thisYear.length,
      avg: rated.length ? (rated.reduce((a, b) => a + b.rating, 0) / rated.length).toFixed(1) : null,
      today: byDay[today] || 0,
      streak, week,
      max: Math.max(1, ...week.map((w) => w.pages)),
      perDay: daysLogged ? Math.round(totalPages / daysLogged) : 0,
      totalPages,
    }
  }, [books, bookSessions, year])

  const counts = useMemo(() => {
    const c = Object.fromEntries(SHELVES.map((s) => [s.id, 0]))
    for (const b of books) if (c[b.status] !== undefined) c[b.status]++
    return c
  }, [books])

  const shown = useMemo(
    () => books.filter((b) => b.status === shelf)
      .sort((a, b) => (b.is_favourite ? 1 : 0) - (a.is_favourite ? 1 : 0)
        || (b.created_at || '').localeCompare(a.created_at || '')),
    [books, shelf]
  )

  const addFromSearch = (r, status = 'reading') => {
    addBook({
      title: r.title, author: r.author || null, category: r.category || null,
      total_pages: r.pages || null, cover_url: r.cover || null, isbn: r.isbn || null,
      published_year: r.year || null, ol_key: r.olKey || null,
      status, started_on: status === 'reading' ? todayISO() : null,
    })
    setQ(''); setResults([]); setShelf(status)
  }

  const setStatus = (b, status) => {
    const patch = { status }
    if (status === 'finished') {
      patch.finished_on = todayISO()
      if (b.total_pages) patch.pages_read = b.total_pages
    }
    if (status === 'reading' && !b.started_on) patch.started_on = todayISO()
    updateBook(b.id, patch)
  }

  const logPages = (b, amount) => {
    const n = Number(amount ?? pagesInput[b.id])
    if (!(n > 0)) return
    logReading(b.id, n, logDate[b.id] || todayISO())
    if (amount == null) setPagesInput({ ...pagesInput, [b.id]: '' })
  }

  const saveNote = (b) => {
    if (!noteDraft.body.trim()) return
    addNote(b.id, noteDraft.body.trim(), noteDraft.kind,
      noteDraft.page ? Number(noteDraft.page) : null)
    setNoteDraft({ body: '', kind: noteDraft.kind, page: '' })
  }

  const todaysPages = (id) => bookSessions
    .filter((s) => s.book_id === id && s.session_date === todayISO())
    .reduce((a, s) => a + s.pages, 0)

  const goalPct = Math.min(100, Math.round((stats.thisYear / Math.max(1, goal)) * 100))

  return (
    <div className="space-y-4">
      {/* ── currently reading ── */}
      {(() => {
        const current = books
          .filter((b) => b.status === 'reading')
          .sort((a, b) => (b.pages_read || 0) - (a.pages_read || 0))[0]
        if (!current) return null
        const pct = current.total_pages
          ? Math.min(100, Math.round(((current.pages_read || 0) / current.total_pages) * 100)) : 0
        const eta = estimateFinish(current, bookSessions)
        return (
          <section className="relative overflow-hidden rounded-2xl border border-white/10 p-5"
            style={{ background: 'radial-gradient(120% 140% at 100% 0%, #2b2440 0%, #171a2a 48%, #0f1119 100%)' }}>
            <div className="pointer-events-none absolute -top-24 -right-12 w-64 h-64 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(245,166,35,.2), transparent 70%)' }} />
            <div className="relative flex gap-4">
              <Cover book={current} size="h-32 w-[5.5rem]" />
              <div className="min-w-0 flex-1 flex flex-col">
                <div className="text-[10px] uppercase tracking-[.18em] text-dim">Currently reading</div>
                <div className="font-display font-bold text-lg leading-snug mt-1 line-clamp-2">
                  {current.title}
                </div>
                <div className="text-[11px] text-dim mt-0.5 truncate">
                  {current.author || 'Unknown author'}
                </div>

                <div className="mt-auto pt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-bold text-2xl tabular-nums">
                      <CountUp value={pct} />%
                    </span>
                    {current.total_pages && (
                      <span className="text-[11px] text-dim">
                        {current.pages_read || 0} of {current.total_pages}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#F5A623,#7ED957)' }} />
                  </div>
                  {eta !== null && eta > 0 && (
                    <div className="text-[11px] text-dim mt-1.5">
                      ~{eta} day{eta === 1 ? '' : 's'} left at your pace
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )
      })()}

      {/* ── search ── */}
      <section className="card card-hover">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-amber" />
          <div className="label">Add a book</div>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
          <input className="input w-full !pl-9" placeholder="Search by title, author or ISBN…"
            value={q} onChange={(e) => setQ(e.target.value)} />
          {searching && (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-dim animate-spin" />
          )}
          {q && !searching && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-dim"
              onClick={() => { setQ(''); setResults([]) }}><X size={14} /></button>
          )}
        </div>

        {searchErr && <div className="text-xs text-red mt-2">{searchErr}</div>}

        {!!results.length && (
          <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
            {results.map((r, i) => (
              <div key={r.olKey || i}
                className="flex gap-3 p-2 rounded-lg bg-white/5 border border-white/8">
                <Cover book={{ cover_url: r.cover, title: r.title }} size="h-16 w-11" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium leading-snug line-clamp-2">{r.title}</div>
                  <div className="text-[11px] text-dim mt-0.5 truncate">
                    {r.author || 'Unknown'}{r.year ? ` · ${r.year}` : ''}{r.pages ? ` · ${r.pages}p` : ''}
                  </div>
                  <div className="flex gap-1.5 mt-1.5">
                    <button className="btn !py-0.5 !px-2 text-[11px]"
                      onClick={() => addFromSearch(r, 'reading')}>
                      <Plus size={11} /> Reading
                    </button>
                    <button className="btn !py-0.5 !px-2 text-[11px]"
                      onClick={() => addFromSearch(r, 'want')}>Want to read</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {q.trim().length >= 2 && !searching && !results.length && !searchErr && (
          <button className="btn w-full mt-3 text-xs"
            onClick={() => addFromSearch({ title: q.trim() }, 'reading')}>
            Nothing found — add “{q.trim()}” manually
          </button>
        )}
      </section>

      {/* ── yearly goal + stats ── */}
      <section className="card">
        <div className="flex items-center gap-5">
          <Ring pct={goalPct} tone={goalPct >= 100 ? '#22C55E' : '#F5A623'}>
            <div>
              <div className="font-display font-bold text-xl tabular-nums leading-none">
                <CountUp value={stats.thisYear} />
              </div>
              <div className="text-[9px] text-dim mt-0.5">of {goal}</div>
            </div>
          </Ring>
          <div className="min-w-0 flex-1">
            <div className="label">{year} reading goal</div>
            <div className="text-xs text-dim mt-1">
              {goalPct >= 100
                ? 'Goal met. Anything now is a bonus.'
                : `${goal - stats.thisYear} more to go this year.`}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                ['Pages', stats.totalPages],
                ['Per day', stats.perDay],
                ['Streak', stats.streak],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[9px] uppercase tracking-wider text-dim">{k}</div>
                  <div className="font-display font-bold text-base tabular-nums">
                    <CountUp value={v} suffix={k === 'Streak' ? 'd' : ''} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {stats.week.some((w) => w.pages > 0) && (
          <div className="mt-4">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-[10px] uppercase tracking-wider text-dim">Pages this week</span>
              <span className="font-mono text-[11px] text-dim">{stats.today} today</span>
            </div>
            <Curve points={stats.week.map((w) => w.pages)} id="bkCurve" tone="#7ED957" height={52} />
            <div className="flex justify-between mt-0.5">
              {stats.week.map(({ d }) => (
                <span key={d} className="text-[9px] text-dim">{weekdayShort(d)[0]}</span>
              ))}
            </div>
          </div>
        )}

        {stats.avg && (
          <div className="text-[11px] text-dim mt-3">
            Average rating <span className="text-text font-mono">{stats.avg}</span> across
            {' '}{stats.done} finished book{stats.done === 1 ? '' : 's'}.
          </div>
        )}
      </section>

      {/* ── shelves ── */}
      <div className="flex flex-wrap items-center gap-1.5">
        {SHELVES.map((s) => (
          <button key={s.id} onClick={() => setShelf(s.id)}
            className="rounded-full px-3 py-1.5 text-xs border transition"
            style={{
              background: shelf === s.id ? `${s.tone}22` : 'rgba(255,255,255,.05)',
              borderColor: shelf === s.id ? `${s.tone}66` : 'rgba(255,255,255,.1)',
              color: shelf === s.id ? s.tone : undefined,
            }}>
            {s.label} <span className="font-mono opacity-70">{counts[s.id]}</span>
          </button>
        ))}
        <button className="ml-auto btn !py-1 !px-2"
          onClick={() => setView((v) => (v === 'list' ? 'grid' : 'list'))}
          aria-label="Toggle view">
          {view === 'list' ? <Grid2X2 size={14} /> : <List size={14} />}
        </button>
      </div>

      {!shown.length ? (
        <div className="card text-sm text-dim text-center py-8">
          {shelf === 'reading' ? 'Nothing on the go. Search above to add one.' : 'No books on this shelf.'}
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {shown.map((b) => {
            const pct = b.total_pages
              ? Math.min(100, Math.round(((b.pages_read || 0) / b.total_pages) * 100)) : null
            return (
              <button key={b.id} onClick={() => { setView('list'); setOpen(b.id) }}
                className="text-left group transition-transform duration-300 hover:-translate-y-1">
                <Cover book={b} size="h-40 w-full" />
                <div className="text-[11px] mt-1.5 leading-tight line-clamp-2">{b.title}</div>
                {pct !== null && (
                  <div className="h-1 rounded-full bg-white/10 mt-1 overflow-hidden">
                    <div className="h-full bg-mint rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((b) => {
            const pct = b.total_pages
              ? Math.min(100, Math.round(((b.pages_read || 0) / b.total_pages) * 100)) : null
            const eta = estimateFinish(b, bookSessions)
            const notes = bookNotes.filter((n) => n.book_id === b.id)
            const isOpen = open === b.id

            return (
              <div key={b.id} className="card !p-4">
                <div className="flex gap-3">
                  <Cover book={b} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-display font-bold leading-snug line-clamp-2">{b.title}</div>
                        <div className="text-[11px] text-dim mt-0.5 truncate">
                          {b.author || 'Unknown author'}
                          {b.published_year ? ` · ${b.published_year}` : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => updateBook(b.id, { is_favourite: !b.is_favourite })}
                          aria-label="Favourite">
                          <Heart size={14} className={b.is_favourite ? 'text-red' : 'text-dim'}
                            fill={b.is_favourite ? 'currentColor' : 'none'} />
                        </button>
                        <button className="text-dim hover:text-red" onClick={() => removeBook(b.id)}
                          aria-label="Remove"><Trash2 size={14} /></button>
                      </div>
                    </div>

                    {b.status === 'reading' && b.total_pages && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 text-[11px] text-dim">
                          <span><span className="text-text font-mono">{b.pages_read || 0}</span> / {b.total_pages}</span>
                          <span className="ml-auto font-mono">{pct}%</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                          <div className="h-full rounded-full bg-mint transition-all duration-500"
                            style={{ width: `${pct}%` }} />
                        </div>
                        {eta !== null && eta > 0 && (
                          <div className="text-[11px] text-dim mt-1">
                            ~{eta} day{eta === 1 ? '' : 's'} left at your pace
                          </div>
                        )}
                      </div>
                    )}

                    {b.status === 'finished' && (
                      <div className="mt-2 flex items-center gap-3">
                        <Stars value={b.rating} onPick={(r) => updateBook(b.id, { rating: r })} />
                        {b.finished_on && (
                          <span className="text-[11px] text-dim">{fmtShort(b.finished_on)}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {b.status === 'reading' && (
                  <div className="mt-3 rounded-xl bg-white/5 border border-white/8 p-2.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] text-dim">
                        Add pages for{' '}
                        {(logDate[b.id] || todayISO()) === todayISO()
                          ? 'today' : fmtShort(logDate[b.id])}
                      </span>
                      {todaysPages(b.id) > 0 && (
                        <span className="text-[11px] text-mint">+{todaysPages(b.id)} today</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {[5, 10, 25, 50].map((n) => (
                        <button key={n} className="rounded-lg px-2.5 py-1 text-[11px]
                          bg-white/8 border border-white/12 hover:bg-mint/20 hover:border-mint/40 transition"
                          onClick={() => logPages(b, n)}>+{n}</button>
                      ))}
                      <input type="number" inputMode="numeric" min="1"
                        className="input w-16 !py-1 text-sm" placeholder="+"
                        value={pagesInput[b.id] || ''}
                        onChange={(e) => setPagesInput({ ...pagesInput, [b.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && logPages(b)} />
                      <button className="btn !py-1 !px-3 text-xs"
                        disabled={!(Number(pagesInput[b.id]) > 0)} onClick={() => logPages(b)}>
                        Add
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <input type="date" max={todayISO()}
                        className="input !py-1 text-[11px]"
                        value={logDate[b.id] || todayISO()}
                        onChange={(e) => setLogDate({ ...logDate, [b.id]: e.target.value })} />
                      {(logDate[b.id] || todayISO()) !== todayISO() && (
                        <button className="text-[11px] text-dim underline"
                          onClick={() => setLogDate({ ...logDate, [b.id]: todayISO() })}>
                          back to today
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {SHELVES.filter((s) => s.id !== b.status).map((s) => (
                    <button key={s.id} onClick={() => setStatus(b, s.id)}
                      className="rounded-full px-2.5 py-1 text-[11px] border border-white/12
                        bg-white/5 text-dim hover:text-text hover:bg-white/10 transition
                        flex items-center gap-1">
                      {s.id === 'finished' && <Check size={11} />}{s.label}
                    </button>
                  ))}
                  <button className="ml-auto text-[11px] text-dim hover:text-text flex items-center gap-1"
                    onClick={() => setOpen(isOpen ? null : b.id)}>
                    <StickyNote size={11} /> Notes{notes.length ? ` (${notes.length})` : ''}
                  </button>
                </div>

                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-white/8 space-y-2">
                    {(() => {
                      const mine = bookSessions
                        .filter((x) => x.book_id === b.id)
                        .sort((x, y) => y.session_date.localeCompare(x.session_date))
                      if (!mine.length) return null
                      return (
                        <div className="mb-3">
                          <div className="text-[10px] uppercase tracking-wider text-dim mb-1.5">
                            Reading log
                          </div>
                          <div className="space-y-1 max-h-40 overflow-y-auto">
                            {mine.slice(0, 20).map((x) => (
                              <div key={x.id} className="flex items-center gap-2 text-[11px]">
                                <span className="text-dim w-16 shrink-0">
                                  {x.session_date === todayISO() ? 'Today' : fmtShort(x.session_date)}
                                </span>
                                <span className="font-mono text-mint">+{x.pages}</span>
                                <span className="text-dim">pages</span>
                                <button className="ml-auto text-dim hover:text-red"
                                  onClick={() => removeReading(x.id)} aria-label="Delete entry">
                                  <X size={11} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })()}

                    {notes.map((n) => (
                      <div key={n.id} className="flex gap-2 text-xs">
                        {n.kind === 'quote'
                          ? <Quote size={12} className="text-amber shrink-0 mt-0.5" />
                          : <StickyNote size={12} className="text-dim shrink-0 mt-0.5" />}
                        <div className="min-w-0 flex-1">
                          <div className={n.kind === 'quote' ? 'italic text-text/90' : 'text-text/90'}>
                            {n.body}
                          </div>
                          {n.page != null && <div className="text-[10px] text-dim mt-0.5">p.{n.page}</div>}
                        </div>
                        <button className="text-dim hover:text-red" onClick={() => removeNote(n.id)}>
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    <div className="flex gap-2 pt-1">
                      <select className="input !py-1 text-xs !w-auto" value={noteDraft.kind}
                        onChange={(e) => setNoteDraft({ ...noteDraft, kind: e.target.value })}>
                        <option value="note">Note</option>
                        <option value="quote">Quote</option>
                      </select>
                      <input className="input w-16 !py-1 text-xs" placeholder="page" type="number"
                        value={noteDraft.page}
                        onChange={(e) => setNoteDraft({ ...noteDraft, page: e.target.value })} />
                    </div>
                    <div className="flex gap-2">
                      <input className="input flex-1 !py-1 text-xs" placeholder="Write something…"
                        value={noteDraft.body}
                        onChange={(e) => setNoteDraft({ ...noteDraft, body: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && saveNote(b)} />
                      <button className="btn !py-1 !px-3 text-xs" disabled={!noteDraft.body.trim()}
                        onClick={() => saveNote(b)}>Add</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
