import { useEffect, useMemo, useState } from 'react'
import { RotateCcw, Check, X, Brain } from 'lucide-react'
import { useData } from '../DataStore'
import { todayISO, fmtShort } from '../lib/dates'
import { dueLogs, overdueBy, stageLabel, INTERVALS } from '../lib/dsa'

export default function ReviewQueue() {
  const { dsaLogs, reviewDsa, scheduleUnscheduled } = useData()
  const today = todayISO()
  const [done, setDone] = useState([])

  // give older problems a schedule the first time this mounts
  useEffect(() => { scheduleUnscheduled?.() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const due = useMemo(
    () => dueLogs(dsaLogs, today).filter((l) => !done.includes(l.id)),
    [dsaLogs, today, done]
  )
  const current = due[0]

  const answer = (recalled) => {
    if (!current) return
    setDone((d) => [...d, current.id])
    reviewDsa(current.id, recalled)
  }

  const upcoming = useMemo(() => {
    const future = dsaLogs.filter((l) => l.next_review && l.next_review > today)
    return future.sort((a, b) => (a.next_review < b.next_review ? -1 : 1))[0]
  }, [dsaLogs, today])

  if (!due.length) {
    return (
      <section className="card card-hover">
        <div className="flex items-center gap-2 mb-2">
          <Brain size={16} className="text-mint" />
          <div className="label">Review Queue</div>
        </div>
        <div className="text-sm text-dim">
          {done.length
            ? `Nice — ${done.length} reviewed. Nothing else due today.`
            : 'Nothing due for review today.'}
          {upcoming && (
            <> Next up <span className="text-text">{fmtShort(upcoming.next_review)}</span>.</>
          )}
        </div>
      </section>
    )
  }

  const late = overdueBy(current, today)

  return (
    <section className="card card-hover">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-mint" />
          <div className="label">Review Queue</div>
          {late > 0 && (
            <span className="chip !text-amber !border-amber/30">{late}d overdue</span>
          )}
        </div>
        <div className="font-mono text-xs text-dim">
          <span className="text-text font-bold">{due.length}</span> due
        </div>
      </div>

      <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-3">
        <div className="text-[11px] text-dim mb-1">
          solved {fmtShort(current.log_date)} · interval {stageLabel(current.review_stage || 0)}
        </div>
        <div className="font-display font-bold text-lg leading-snug">
          {current.title || current.topic || 'Untitled problem'}
        </div>
        {current.title && current.topic && (
          <div className="text-xs text-dim mt-1">{current.topic}</div>
        )}
        <div className="text-xs text-dim mt-3">
          Can you still explain the approach and write it out?
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => answer(false)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm
            bg-red-500/12 border border-red-500/30 text-red-200 hover:bg-red-500/20 transition">
          <X size={14} /> Forgot
        </button>
        <button
          onClick={() => answer(true)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm
            bg-mint/12 border border-mint/30 text-mint hover:bg-mint/20 transition">
          <Check size={14} /> Got it
        </button>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-dim">
        <RotateCcw size={11} />
        <span>Ladder: {INTERVALS.join(' · ')} days</span>
      </div>
    </section>
  )
}
