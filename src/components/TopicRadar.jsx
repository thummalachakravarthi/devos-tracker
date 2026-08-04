import { useMemo } from 'react'
import { Radar } from 'lucide-react'
import { useData } from '../DataStore'
import { todayISO, dayDiff } from '../lib/dates'

// Topics a Java backend interview actually covers. A problem's topic is
// matched loosely so free-text entries still land somewhere sensible.
const TOPICS = [
  { key: 'Arrays',      match: ['array', 'two pointer', 'sliding', 'prefix', 'sort'] },
  { key: 'Strings',     match: ['string', 'palindrom', 'anagram', 'substring'] },
  { key: 'Hashing',     match: ['hash', 'map', 'set', 'frequency'] },
  { key: 'Trees',       match: ['tree', 'bst', 'binary tree', 'trie'] },
  { key: 'Graphs',      match: ['graph', 'bfs', 'dfs', 'topolog', 'union'] },
  { key: 'DP',          match: ['dp', 'dynamic', 'knapsack', 'memo', 'subsequence'] },
  { key: 'Heap/Queue',  match: ['heap', 'priority', 'queue', 'stack', 'deque'] },
  { key: 'Linked List', match: ['linked', 'list node', 'cycle'] },
]

// A topic fades if untouched. Full credit for ~2 weeks, gone by ~8.
const FRESH_DAYS = 14
const STALE_DAYS = 56

function bucketFor(topic) {
  const t = (topic || '').toLowerCase()
  if (!t) return null
  return TOPICS.find((b) => b.match.some((m) => t.includes(m)))?.key || null
}

export default function TopicRadar() {
  const { dsaLogs } = useData()
  const today = todayISO()

  const rows = useMemo(() => {
    const acc = Object.fromEntries(TOPICS.map((t) => [t.key, { solved: 0, last: null, weighted: 0 }]))
    let unmatched = 0

    for (const log of dsaLogs) {
      const k = bucketFor(log.topic)
      if (!k) { unmatched += log.problems || 0; continue }
      const age = dayDiff(log.log_date, today)
      const decay = age <= FRESH_DAYS ? 1
        : age >= STALE_DAYS ? 0
        : 1 - (age - FRESH_DAYS) / (STALE_DAYS - FRESH_DAYS)
      acc[k].solved += log.problems || 0
      acc[k].weighted += (log.problems || 0) * decay
      if (!acc[k].last || log.log_date > acc[k].last) acc[k].last = log.log_date
    }

    const max = Math.max(1, ...Object.values(acc).map((v) => v.weighted))
    return {
      unmatched,
      list: TOPICS.map((t) => {
        const v = acc[t.key]
        return {
          key: t.key,
          solved: v.solved,
          pct: Math.round((v.weighted / max) * 100),
          daysAgo: v.last ? dayDiff(v.last, today) : null,
        }
      }).sort((a, b) => a.pct - b.pct),
    }
  }, [dsaLogs, today])

  const cold = rows.list.filter((r) => r.pct < 25)

  const tone = (pct) =>
    pct >= 60 ? '#22C55E' : pct >= 25 ? '#F5A623' : '#EF4444'

  return (
    <section className="card card-hover">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Radar size={16} className="text-amber" />
          <div className="label">Topic Coverage</div>
        </div>
        <div className="font-mono text-xs text-dim">
          <span className="text-text font-bold">{cold.length}</span> cold
        </div>
      </div>

      <div className="space-y-2">
        {rows.list.map((r) => (
          <div key={r.key} className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-xs text-dim truncate">{r.key}</div>
            <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(3, r.pct)}%`, background: tone(r.pct) }}
              />
            </div>
            <div className="w-16 shrink-0 text-right font-mono text-[11px] text-dim">
              {r.solved === 0
                ? 'never'
                : r.daysAgo === 0 ? 'today' : `${r.daysAgo}d ago`}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-[11px] text-dim">
        {cold.length
          ? <>Coldest: <span className="text-text">{cold.slice(0, 3).map((c) => c.key).join(', ')}</span>. Coverage fades after ~2 weeks untouched.</>
          : <>Every topic is warm. Coverage fades after ~2 weeks untouched.</>}
        {rows.unmatched > 0 && <> · {rows.unmatched} problems had no recognised topic.</>}
      </div>
    </section>
  )
}
