import { useState } from 'react'
import { ChevronLeft, ChevronRight, Flame, Check, Plus, Minus, Coffee, Brain } from 'lucide-react'
import { useData } from '../DataStore'
import { ProgressRing, CountUp } from '../components/Bits'
import { MissionControl, Achievements } from '../components/MissionControl'
import { Quote as QuoteIcon } from 'lucide-react'
import { quoteForToday } from '../config/quotes'
import { todayISO, addDays, fmtNice, dayDiff } from '../lib/dates'
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
      className="habit-card card card-hover w-full flex items-center gap-3 text-left"
    >
      <span className="habit-icon w-10 h-10 rounded-xl grid place-items-center text-xl shrink-0 bg-white/70 shadow-inner border border-sky-200/60">{habit.icon}</span>
      <span className={`flex-1 text-sm font-medium ${done ? 'text-dim line-through' : ''}`}>
        {habit.name}
      </span>
      <StreakBadge habit={habit} logs={logs} />
      <span
        key={String(done)}
        className={`w-7 h-7 rounded-lg grid place-items-center border ${
          done ? 'bg-mint border-mint text-black check-pop glow-mint' : 'border-line text-transparent'
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
    <div className="habit-card card card-hover">
      <div className="flex items-center gap-3">
        <span className="habit-icon w-10 h-10 rounded-xl grid place-items-center text-xl shrink-0 bg-white/70 shadow-inner border border-sky-200/60">{habit.icon}</span>
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
      <div className="progress-track h-2 mt-3">
        <div className="progress-fill" style={{ width: `${pct * 100}%` }} />
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
          className="btn btn-cap"
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
    <div className="habit-card card card-hover">
      <div className="flex items-center gap-3">
        <span className="habit-icon w-10 h-10 rounded-xl grid place-items-center text-xl shrink-0 bg-white/70 shadow-inner border border-sky-200/60">{habit.icon}</span>
        <div className="flex-1">
          <div className="text-sm font-medium">{habit.name}</div>
          <div className="flex gap-1.5 mt-1.5">
            {Array.from({ length: target }).map((_, i) => (
              <span
                key={i}
                className="w-5 h-6 rounded-b-lg rounded-t-sm border border-line transition"
                style={{ background: i < value ? '#4FC3F7' : 'transparent' }}
              />
            ))}
          </div>
        </div>
        <StreakBadge habit={habit} logs={logs} />
        <button className="btn btn-widow !px-2.5" onClick={() => setLogValue(habit, date, value - 1)} disabled={value <= 0}>
          <Minus size={16} />
        </button>
        <button className="btn btn-cap !px-2.5" onClick={() => setLogValue(habit, date, value + 1)} disabled={value >= target}>
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
    <div className="habit-card card card-hover">
      <div className="flex items-center gap-3">
        <span className="habit-icon w-10 h-10 rounded-xl grid place-items-center text-xl shrink-0 bg-white/70 shadow-inner border border-sky-200/60">{habit.icon}</span>
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
      <div className="progress-track h-2 mt-3">
        <div className="progress-fill" style={{ width: `${pct * 100}%` }} />
      </div>
      <div className="flex gap-2 mt-3">
        <button className="btn btn-strange flex-1" onClick={() => setLogValue(habit, date, +(value + 0.5).toFixed(1))}>
          +30 min
        </button>
        <button className="btn btn-strange flex-1" onClick={() => setLogValue(habit, date, +(value + 1).toFixed(1))}>
          +1 hr
        </button>
        <button className="btn btn-widow !px-2.5" onClick={() => setLogValue(habit, date, 0)} disabled={value === 0}>
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

  const dayNum = Math.min(settings.plan_days, Math.max(1, dayDiff(settings.plan_start_date, todayISO()) + 1))
  const allDone = total > 0 && done === total

  const dq = quoteForToday(todayISO())
  return (
    <div>
      {/* MISSION CONTROL */}
      <MissionControl />

      {/* HERO */}
      <section className="card card-hover g-border relative overflow-hidden p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-10">
          <div className={allDone ? 'glow-mint rounded-full' : ''}>
            <ProgressRing pct={total ? done / total : 0} size={132} stroke={10} color={allDone ? '#38BDF8' : '#0284C7'}>
              <div className="text-center">
                <div className="font-mono font-bold text-3xl leading-none">
                  <CountUp value={done} />
                  <span className="text-dim text-lg">/{total}</span>
                </div>
                <div className="text-[9px] uppercase tracking-widest text-dim mt-1">done</div>
              </div>
            </ProgressRing>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="label">Daily ops</div>
            <div className="font-display font-bold text-4xl lg:text-6xl mt-1 text-grad">
              {isToday ? 'Today' : fmtNice(date)}
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
              <button className="btn !p-2" onClick={() => setUiDate(addDays(date, -1))}>
                <ChevronLeft size={16} />
              </button>
              <button
                className="btn !p-2"
                onClick={() => setUiDate(addDays(date, 1))}
                disabled={isToday}
              >
                <ChevronRight size={16} />
              </button>
              {!isToday && (
                <button className="btn text-amber" onClick={() => setUiDate(todayISO())}>
                  back to today
                </button>
              )}
              {allDone && <span className="chip !text-mint !border-mint/40">Perfect day 🏆</span>}
            </div>
          </div>

          <div className="hidden md:block text-right">
            <div className="label">Mission clock</div>
            <div className="font-mono font-bold text-3xl mt-1">
              Day <CountUp value={dayNum} />
              <span className="text-dim text-lg"> / {settings.plan_days}</span>
            </div>
            <div className="progress-track h-1.5 w-44 mt-2 ml-auto">
              <div className="progress-fill bg-amber" style={{ width: `${(dayNum / settings.plan_days) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* JAVA + DSA */}
      <div className="grid lg:grid-cols-2 gap-3 mt-3 stagger">
        <div className={`card card-hover border-l-4 ${javaDone ? 'border-l-mint' : 'border-l-amber'}`}>
          <div className="flex items-center gap-3">
            <Coffee size={22} className={javaDone ? 'text-mint' : 'text-amber'} />
            <div className="flex-1">
              <div className="text-sm font-medium">Java · 3-hour target</div>
              <div className="font-mono text-xs text-dim mt-0.5">
                {Math.floor(javaMin / 60)}h {javaMin % 60}m / {Math.floor(javaTarget / 60)}h
              </div>
            </div>
            <button className="btn btn-amber" onClick={() => logJava(30, null, date)}>
              +30m
            </button>
            <button className="btn btn-amber" onClick={() => logJava(60, null, date)}>
              +1h
            </button>
          </div>
          <div className="progress-track h-2 mt-3">
            <div
              className="progress-fill bg-amber"
              style={{ width: `${Math.min(100, (javaMin / javaTarget) * 100)}%` }}
            />
          </div>
          <button className="text-xs text-amber mt-2" onClick={() => setTab('java')}>
            Open Java HQ →
          </button>
        </div>

        <div className={`card card-hover border-l-4 ${dsaDone ? 'border-l-mint' : 'border-l-violet'}`}>
          <div className="flex items-center gap-3">
            <Brain size={22} className={dsaDone ? 'text-mint' : 'text-violet'} />
            <div className="flex-1">
              <div className="text-sm font-medium">DSA problems</div>
              <div className="font-mono text-xs text-dim mt-0.5">{dsaCount} solved this day</div>
            </div>
            <button className="btn btn-mint" onClick={() => logDsa(1, null, date)}>
              +1 problem
            </button>
          </div>
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div className="mt-3">
        <Achievements />
      </div>

      {/* HABITS GRID */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-3 stagger">
        {activeHabits.map((h) => {
          if (h.type === 'steps') return <StepsRow key={h.id} habit={h} date={date} />
          if (h.type === 'water') return <WaterRow key={h.id} habit={h} date={date} />
          if (h.type === 'hours') return <HoursRow key={h.id} habit={h} date={date} />
          return <CheckRow key={h.id} habit={h} date={date} />
        })}
      </div>
    </div>
  )
}
