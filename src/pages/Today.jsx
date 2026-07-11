import { useState } from 'react'
import { ChevronLeft, ChevronRight, Flame, Check, Plus, Minus, Coffee, Brain } from 'lucide-react'
import { useData } from '../DataStore'
import { ProgressRing } from '../components/Bits'
import { todayISO, addDays, fmtNice } from '../lib/dates'
import { currentStreak } from '../lib/stats'

function StreakBadge({ habit, logs }) {
  const done = new Set(
    Object.entries(logs[habit.id] || {})
      .filter(([, v]) => v.completed)
      .map(([d]) => d)
  )
  const s = currentStreak(done, todayISO())
  if (s < 2) return null
  return (
    <span className="chip !text-amber !border-amber/30">
      <Flame size={12} /> {s}
    </span>
  )
}

function CheckRow({ habit, date }) {
  const { getLog, toggleCheck, logs } = useData()
  const log = getLog(habit.id, date)
  const done = !!log?.completed
  return (
    <button
      onClick={() => toggleCheck(habit, date)}
      className={`card w-full flex items-center gap-3 text-left transition ${
        done ? 'border-mint/40' : ''
      }`}
    >
      <span className="text-xl w-8 text-center">{habit.icon}</span>
      <span className={`flex-1 text-sm font-medium ${done ? 'text-dim line-through' : ''}`}>
        {habit.name}
      </span>
      <StreakBadge habit={habit} logs={logs} />
      <span
        className={`w-7 h-7 rounded-lg grid place-items-center border transition ${
          done ? 'bg-mint border-mint text-black scale-105' : 'border-line text-transparent'
        }`}
      >
        <Check size={16} strokeWidth={3} />
      </span>
    </button>
  )
}

function StepsRow({ habit, date }) {
  const { getLog, setLogValue, logs } = useData()
  const log = getLog(habit.id, date)
  const value = log?.value || 0
  const [draft, setDraft] = useState('')
  const pct = Math.min(1, value / Number(habit.target))
  return (
    <div className={`card ${log?.completed ? 'border-mint/40' : ''}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl w-8 text-center">{habit.icon}</span>
        <div className="flex-1">
          <div className="text-sm font-medium">{habit.name}</div>
          <div className="font-mono text-xs text-dim mt-0.5">
            {value.toLocaleString('en-IN')} / {Number(habit.target).toLocaleString('en-IN')}
          </div>
        </div>
        <StreakBadge habit={habit} logs={logs} />
        {log?.completed && (
          <span className="w-7 h-7 rounded-lg grid place-items-center bg-mint text-black">
            <Check size={16} strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="h-2 rounded-full bg-surface2 mt-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct * 100}%`, background: habit.color }}
        />
      </div>
      <div className="flex gap-2 mt-3">
        <input
          className="input flex-1"
          type="number"
          inputMode="numeric"
          placeholder="Today's steps…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && draft && (setLogValue(habit, date, Number(draft)), setDraft(''))}
        />
        <button
          className="btn btn-mint"
          disabled={!draft}
          onClick={() => {
            setLogValue(habit, date, Number(draft))
            setDraft('')
          }}
        >
          Save
        </button>
      </div>
    </div>
  )
}

function WaterRow({ habit, date }) {
  const { getLog, setLogValue, logs } = useData()
  const log = getLog(habit.id, date)
  const value = log?.value || 0
  const target = Number(habit.target)
  return (
    <div className={`card ${log?.completed ? 'border-mint/40' : ''}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl w-8 text-center">{habit.icon}</span>
        <div className="flex-1">
          <div className="text-sm font-medium">{habit.name}</div>
          <div className="flex gap-1.5 mt-1.5">
            {Array.from({ length: target }).map((_, i) => (
              <span
                key={i}
                className="w-5 h-6 rounded-b-lg rounded-t-sm border border-line transition"
                style={{ background: i < value ? '#4FA9F5' : 'transparent' }}
              />
            ))}
          </div>
        </div>
        <StreakBadge habit={habit} logs={logs} />
        <button className="btn !px-2.5" onClick={() => setLogValue(habit, date, value - 1)} disabled={value <= 0}>
          <Minus size={16} />
        </button>
        <button className="btn btn-mint !px-2.5" onClick={() => setLogValue(habit, date, value + 1)} disabled={value >= target}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}

function HoursRow({ habit, date }) {
  const { getLog, setLogValue, logs } = useData()
  const log = getLog(habit.id, date)
  const value = log?.value || 0
  const target = Number(habit.target)
  const pct = Math.min(1, value / target)
  return (
    <div className={`card ${log?.completed ? 'border-mint/40' : ''}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl w-8 text-center">{habit.icon}</span>
        <div className="flex-1">
          <div className="text-sm font-medium">{habit.name}</div>
          <div className="font-mono text-xs text-dim mt-0.5">
            {value}h / {target}h
          </div>
        </div>
        <StreakBadge habit={habit} logs={logs} />
        {log?.completed && (
          <span className="w-7 h-7 rounded-lg grid place-items-center bg-mint text-black">
            <Check size={16} strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="h-2 rounded-full bg-surface2 mt-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct * 100}%`, background: habit.color }}
        />
      </div>
      <div className="flex gap-2 mt-3">
        <button className="btn flex-1" onClick={() => setLogValue(habit, date, +(value + 0.5).toFixed(1))}>
          +30 min
        </button>
        <button className="btn flex-1" onClick={() => setLogValue(habit, date, +(value + 1).toFixed(1))}>
          +1 hr
        </button>
        <button className="btn !px-2.5" onClick={() => setLogValue(habit, date, 0)} disabled={value === 0}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default function Today({ setTab }) {
  const {
    activeHabits,
    getLog,
    uiDate,
    setUiDate,
    settings,
    javaMinutesOn,
    logJava,
    dsaProblemsOn,
    logDsa,
  } = useData()
  const date = uiDate
  const isToday = date === todayISO()

  const javaMin = javaMinutesOn(date)
  const javaTarget = settings.daily_java_minutes
  const javaDone = javaMin >= javaTarget
  const dsaCount = dsaProblemsOn(date)
  const dsaDone = dsaCount > 0

  const habitDone = activeHabits.filter((h) => getLog(h.id, date)?.completed).length
  const total = activeHabits.length + 2 // + Java + DSA
  const done = habitDone + (javaDone ? 1 : 0) + (dsaDone ? 1 : 0)

  return (
    <div className="space-y-3">
      {/* date nav + ring */}
      <div className="card flex items-center gap-4">
        <ProgressRing pct={total ? done / total : 0} size={84} color={done === total ? '#43D6B5' : '#F2A33C'}>
          <div className="text-center">
            <div className="font-mono font-bold text-lg leading-none">
              {done}
              <span className="text-dim text-sm">/{total}</span>
            </div>
            <div className="text-[9px] uppercase tracking-widest text-dim mt-0.5">done</div>
          </div>
        </ProgressRing>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button className="btn !p-1.5" onClick={() => setUiDate(addDays(date, -1))}>
              <ChevronLeft size={16} />
            </button>
            <div className="flex-1 text-center">
              <div className="font-display font-bold">{isToday ? 'Today' : fmtNice(date)}</div>
              {!isToday && (
                <button className="text-xs text-amber" onClick={() => setUiDate(todayISO())}>
                  back to today
                </button>
              )}
            </div>
            <button
              className="btn !p-1.5"
              onClick={() => setUiDate(addDays(date, 1))}
              disabled={isToday}
            >
              <ChevronRight size={16} />
            </button>
          </div>
          {done === total && total > 0 && (
            <div className="text-center text-mint text-xs mt-2 font-medium">Perfect day. Monster. 🏆</div>
          )}
        </div>
      </div>

      {/* Java quick card */}
      <div className={`card border-l-4 ${javaDone ? 'border-l-mint' : 'border-l-amber'}`}>
        <div className="flex items-center gap-3">
          <Coffee size={22} className={javaDone ? 'text-mint' : 'text-amber'} />
          <div className="flex-1">
            <div className="text-sm font-medium">Java · 3-hour target</div>
            <div className="font-mono text-xs text-dim mt-0.5">
              {Math.floor(javaMin / 60)}h {javaMin % 60}m / {Math.floor(javaTarget / 60)}h
            </div>
          </div>
          <button className="btn" onClick={() => logJava(30, null, date)}>
            +30m
          </button>
          <button className="btn" onClick={() => logJava(60, null, date)}>
            +1h
          </button>
        </div>
        <div className="h-2 rounded-full bg-surface2 mt-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-amber transition-all duration-500"
            style={{ width: `${Math.min(100, (javaMin / javaTarget) * 100)}%` }}
          />
        </div>
        <button className="text-xs text-amber mt-2" onClick={() => setTab('java')}>
          Open Java HQ →
        </button>
      </div>

      {/* DSA quick card */}
      <div className={`card border-l-4 ${dsaDone ? 'border-l-mint' : 'border-l-violet'}`}>
        <div className="flex items-center gap-3">
          <Brain size={22} className={dsaDone ? 'text-mint' : 'text-violet'} />
          <div className="flex-1">
            <div className="text-sm font-medium">DSA problems</div>
            <div className="font-mono text-xs text-dim mt-0.5">{dsaCount} solved this day</div>
          </div>
          <button className="btn" onClick={() => logDsa(1, null, date)}>
            +1 problem
          </button>
        </div>
      </div>

      {/* habits */}
      {activeHabits.map((h) => {
        if (h.type === 'steps') return <StepsRow key={h.id} habit={h} date={date} />
        if (h.type === 'water') return <WaterRow key={h.id} habit={h} date={date} />
        if (h.type === 'hours') return <HoursRow key={h.id} habit={h} date={date} />
        return <CheckRow key={h.id} habit={h} date={date} />
      })}
    </div>
  )
}
