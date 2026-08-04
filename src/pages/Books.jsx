import { useMemo, useState } from 'react'
import { BookOpen, Plus, Trash2, Star, Check } from 'lucide-react'
import { useData } from '../DataStore'
import { todayISO, fmtShort } from '../lib/dates'

const STATUSES = [
  { id: 'reading', label: 'Reading', tone: '#4C7BFF' },
  { id: 'finished', label: 'Finished', tone: '#22C55E' },
  { id: 'want', label: 'Want to read', tone: '#8B94A8' },
  { id: 'abandoned', label: 'Abandoned', tone: '#EF4444' },
]

function Stars({ value, onPick }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onPick(value === n ? null : n)}
          className="p-0.5" aria-label={`${n} star${n > 1 ? 's' : ''}`}>
          <Star size={13}
            className={n <= (value || 0) ? 'text-amber' : 'text-dim/40'}
            fill={n <= (value || 0) ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  )
}

export default function Books() {
  const { books, addBook, updateBook, removeBook } = useData()
  const [filter, setFilter] = useState('reading')
  const [adding, setAdding] = useState(false)
  const [f, setF] = useState({ title: '', author: '', total_pages: '', category: '' })

  const counts = useMemo(() => {
    const c = Object.fromEntries(STATUSES.map((s) => [s.id, 0]))
    for (const b of books) if (c[b.status] !== undefined) c[b.status]++
    return c
  }, [books])

  const stats = useMemo(() => {
    const done = books.filter((b) => b.status === 'finished')
    const pages = books.reduce((a, b) => a + (b.pages_read || 0), 0)
    const rated = done.filter((b) => b.rating)
    const avg = rated.length
      ? (rated.reduce((a, b) => a + b.rating, 0) / rated.length).toFixed(1)
      : null
    const thisYear = done.filter((b) => (b.finished_on || '').startsWith(String(new Date().getFullYear())))
    return { done: done.length, pages, avg, thisYear: thisYear.length }
  }, [books])

  const shown = useMemo(
    () => books.filter((b) => b.status === filter)
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')),
    [books, filter]
  )

  const submit = () => {
    if (!f.title.trim()) return
    addBook({
      title: f.title.trim(),
      author: f.author.trim() || null,
      category: f.category.trim() || null,
      total_pages: f.total_pages ? Number(f.total_pages) : null,
      status: 'reading',
      started_on: todayISO(),
    })
    setF({ title: '', author: '', total_pages: '', category: '' })
    setAdding(false)
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

  return (
    <div className="space-y-4">
      <section className="card card-hover">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-amber" />
            <div className="label">Reading</div>
          </div>
          <button className="btn !py-1.5 !px-3 text-xs flex items-center gap-1"
            onClick={() => setAdding((v) => !v)}>
            <Plus size={13} /> Add book
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            ['Finished', stats.done],
            ['This year', stats.thisYear],
            ['Pages read', stats.pages.toLocaleString('en-IN')],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-[10px] uppercase tracking-wider text-dim">{k}</div>
              <div className="font-display font-bold text-xl mt-1 tabular-nums">{v}</div>
            </div>
          ))}
        </div>
        {stats.avg && (
          <div className="mt-3 text-xs text-dim">
            Average rating <span className="text-text font-mono">{stats.avg}</span> across your finished books.
          </div>
        )}

        {adding && (
          <div className="mt-4 space-y-2">
            <input className="input w-full" placeholder="Title" value={f.title} autoFocus
              onChange={(e) => setF({ ...f, title: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && submit()} />
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="Author" value={f.author}
                onChange={(e) => setF({ ...f, author: e.target.value })} />
              <input className="input w-24" placeholder="Pages" type="number" inputMode="numeric"
                value={f.total_pages} onChange={(e) => setF({ ...f, total_pages: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="Category (e.g. Java, system design)"
                value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} />
              <button className="btn" onClick={submit} disabled={!f.title.trim()}>Add</button>
            </div>
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-1.5">
        {STATUSES.map((s) => (
          <button key={s.id} onClick={() => setFilter(s.id)}
            className="rounded-full px-3 py-1.5 text-xs border transition"
            style={{
              background: filter === s.id ? `${s.tone}22` : 'rgba(255,255,255,.05)',
              borderColor: filter === s.id ? `${s.tone}66` : 'rgba(255,255,255,.1)',
              color: filter === s.id ? s.tone : undefined,
            }}>
            {s.label} <span className="font-mono opacity-70">{counts[s.id]}</span>
          </button>
        ))}
      </div>

      {!shown.length ? (
        <div className="card text-sm text-dim text-center py-8">
          {filter === 'reading'
            ? 'Nothing on the go. Add a book to start tracking.'
            : `No books here yet.`}
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((b) => {
            const pct = b.total_pages
              ? Math.min(100, Math.round(((b.pages_read || 0) / b.total_pages) * 100))
              : null
            return (
              <div key={b.id} className="card card-hover !p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-display font-bold leading-snug truncate">{b.title}</div>
                    <div className="text-xs text-dim mt-0.5 truncate">
                      {b.author || 'Unknown author'}
                      {b.category && <> · {b.category}</>}
                    </div>
                  </div>
                  <button className="text-dim hover:text-red shrink-0"
                    onClick={() => removeBook(b.id)} aria-label="Remove book">
                    <Trash2 size={14} />
                  </button>
                </div>

                {b.status === 'reading' && b.total_pages && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <input type="number" inputMode="numeric" className="input w-20 !py-1 text-sm"
                        value={b.pages_read || 0} min="0" max={b.total_pages}
                        onChange={(e) => updateBook(b.id, {
                          pages_read: Math.max(0, Math.min(b.total_pages, Number(e.target.value) || 0)),
                        })} />
                      <span className="text-xs text-dim">of {b.total_pages} pages</span>
                      <span className="ml-auto font-mono text-xs text-dim">{pct}%</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <div className="h-full rounded-full bg-mint transition-all duration-500"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )}

                {b.status === 'finished' && (
                  <div className="mt-3 flex items-center gap-3">
                    <Stars value={b.rating} onPick={(r) => updateBook(b.id, { rating: r })} />
                    {b.finished_on && (
                      <span className="text-[11px] text-dim">finished {fmtShort(b.finished_on)}</span>
                    )}
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {STATUSES.filter((s) => s.id !== b.status).map((s) => (
                    <button key={s.id} onClick={() => setStatus(b, s.id)}
                      className="rounded-full px-2.5 py-1 text-[11px] border border-white/12
                        bg-white/5 text-dim hover:text-text hover:bg-white/10 transition
                        flex items-center gap-1">
                      {s.id === 'finished' && <Check size={11} />}
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
