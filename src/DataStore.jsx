import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'
import { todayISO } from './lib/dates'

const Ctx = createContext(null)
export const useData = () => useContext(Ctx)

// Habits seeded on first login — pulled from your Excel checklist.
const SEED_HABITS = [
  { name: 'Meditation & Yoga', icon: '🧘', color: '#8B7CF6', type: 'check', target: 1, monthly_goal: 30 },
  { name: 'Walk 10,000 steps', icon: '🚶', color: '#43D6B5', type: 'steps', target: 10000, monthly_goal: 30 },
  { name: 'Read a book chapter', icon: '📖', color: '#F2A33C', type: 'check', target: 1, monthly_goal: 30 },
  { name: 'Drink 4L water', icon: '💧', color: '#4FA9F5', type: 'water', target: 4, monthly_goal: 30 },
  { name: 'Course · 2 hours', icon: '🎓', color: '#F2A33C', type: 'hours', target: 2, monthly_goal: 30 },
  { name: 'Learn something new', icon: '💡', color: '#43D6B5', type: 'check', target: 1, monthly_goal: 10 },
  { name: 'Study 6-hour block', icon: '📚', color: '#8B7CF6', type: 'check', target: 1, monthly_goal: 3 },
  { name: 'Savings & Investment', icon: '💰', color: '#43D6B5', type: 'check', target: 1, monthly_goal: 10 },
  { name: 'Protein powder · 2 spoons', icon: '🥄', color: '#8E9AAE', type: 'check', target: 1, monthly_goal: 30 },
  { name: 'Serum', icon: '🧴', color: '#8E9AAE', type: 'check', target: 1, monthly_goal: 30 },
  { name: 'Tablets', icon: '💊', color: '#8E9AAE', type: 'check', target: 1, monthly_goal: 30 },
]

export function DataProvider({ session, children }) {
  const uid = session.user.id
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [settings, setSettings] = useState(null)
  const [habits, setHabits] = useState([])
  const [logs, setLogs] = useState({}) // { [habitId]: { [dateIso]: {id, value, completed} } }
  const [javaSessions, setJavaSessions] = useState([])
  const [dsaLogs, setDsaLogs] = useState([])
  const [uiDate, setUiDate] = useState(todayISO()) // date being viewed/edited on Today

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        // settings — create default row on first login
        let { data: s } = await supabase.from('settings').select('*').eq('user_id', uid).maybeSingle()
        if (!s) {
          const { data: created, error: e1 } = await supabase
            .from('settings')
            .insert({ user_id: uid })
            .select()
            .single()
          if (e1) throw e1
          s = created
        }

        // habits — seed defaults on first login
        let { data: h, error: e2 } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', uid)
          .order('sort_order')
        if (e2) throw e2
        if (!h || h.length === 0) {
          const rows = SEED_HABITS.map((x, i) => ({ ...x, user_id: uid, sort_order: i }))
          const { data: seeded, error: e3 } = await supabase.from('habits').insert(rows).select()
          if (e3) throw e3
          h = seeded.sort((a, b) => a.sort_order - b.sort_order)
        }

        const [{ data: hl, error: e4 }, { data: js, error: e5 }, { data: dl, error: e6 }] =
          await Promise.all([
            supabase.from('habit_logs').select('*').eq('user_id', uid),
            supabase.from('java_sessions').select('*').eq('user_id', uid).order('created_at'),
            supabase.from('dsa_logs').select('*').eq('user_id', uid).order('created_at'),
          ])
        if (e4 || e5 || e6) throw e4 || e5 || e6

        const logMap = {}
        for (const row of hl || []) {
          if (!logMap[row.habit_id]) logMap[row.habit_id] = {}
          logMap[row.habit_id][row.log_date] = {
            id: row.id,
            value: Number(row.value),
            completed: row.completed,
          }
        }

        if (cancelled) return
        setSettings(s)
        setHabits(h)
        setLogs(logMap)
        setJavaSessions(js || [])
        setDsaLogs(dl || [])
        setLoading(false)
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          setError(err.message || 'Failed to load data')
          setLoading(false)
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [uid])

  // ---------- habit log mutations ----------
  async function setLogValue(habit, dateIso, value) {
    const v = Math.max(0, value)
    const completed = v >= Number(habit.target)
    // optimistic update
    setLogs((prev) => ({
      ...prev,
      [habit.id]: {
        ...(prev[habit.id] || {}),
        [dateIso]: { ...(prev[habit.id]?.[dateIso] || {}), value: v, completed },
      },
    }))
    const { data, error: e } = await supabase
      .from('habit_logs')
      .upsert(
        { user_id: uid, habit_id: habit.id, log_date: dateIso, value: v, completed },
        { onConflict: 'habit_id,log_date' }
      )
      .select()
      .single()
    if (e) {
      console.error(e)
      return
    }
    setLogs((prev) => ({
      ...prev,
      [habit.id]: {
        ...(prev[habit.id] || {}),
        [dateIso]: { id: data.id, value: Number(data.value), completed: data.completed },
      },
    }))
  }

  const toggleCheck = (habit, dateIso) => {
    const cur = logs[habit.id]?.[dateIso]
    return setLogValue(habit, dateIso, cur?.completed ? 0 : Number(habit.target))
  }

  const getLog = (habitId, dateIso) => logs[habitId]?.[dateIso] || null

  // ---------- java sessions ----------
  async function logJava(minutes, note, dateIso) {
    const { data, error: e } = await supabase
      .from('java_sessions')
      .insert({ user_id: uid, session_date: dateIso, minutes, note: note || null })
      .select()
      .single()
    if (e) return console.error(e)
    setJavaSessions((p) => [...p, data])
  }
  async function removeJava(id) {
    setJavaSessions((p) => p.filter((s) => s.id !== id))
    await supabase.from('java_sessions').delete().eq('id', id)
  }
  const javaMinutesOn = (dateIso) =>
    javaSessions.filter((s) => s.session_date === dateIso).reduce((a, s) => a + s.minutes, 0)

  // ---------- dsa ----------
  async function logDsa(problems, topic, dateIso) {
    const { data, error: e } = await supabase
      .from('dsa_logs')
      .insert({ user_id: uid, log_date: dateIso, problems, topic: topic || null })
      .select()
      .single()
    if (e) return console.error(e)
    setDsaLogs((p) => [...p, data])
  }
  async function removeDsa(id) {
    setDsaLogs((p) => p.filter((s) => s.id !== id))
    await supabase.from('dsa_logs').delete().eq('id', id)
  }
  const dsaProblemsOn = (dateIso) =>
    dsaLogs.filter((s) => s.log_date === dateIso).reduce((a, s) => a + s.problems, 0)
  const dsaTotal = useMemo(() => dsaLogs.reduce((a, s) => a + s.problems, 0), [dsaLogs])

  // ---------- habits CRUD ----------
  async function addHabit(fields) {
    const sort_order = habits.length ? Math.max(...habits.map((h) => h.sort_order)) + 1 : 0
    const { data, error: e } = await supabase
      .from('habits')
      .insert({ ...fields, user_id: uid, sort_order })
      .select()
      .single()
    if (e) return console.error(e)
    setHabits((p) => [...p, data])
  }
  async function updateHabit(id, patch) {
    setHabits((p) => p.map((h) => (h.id === id ? { ...h, ...patch } : h)))
    await supabase.from('habits').update(patch).eq('id', id)
  }
  async function moveHabit(id, dir) {
    const list = [...habits].sort((a, b) => a.sort_order - b.sort_order)
    const i = list.findIndex((h) => h.id === id)
    const j = i + dir
    if (j < 0 || j >= list.length) return
    const a = list[i]
    const b = list[j]
    setHabits((p) =>
      p.map((h) =>
        h.id === a.id ? { ...h, sort_order: b.sort_order } : h.id === b.id ? { ...h, sort_order: a.sort_order } : h
      )
    )
    await Promise.all([
      supabase.from('habits').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('habits').update({ sort_order: a.sort_order }).eq('id', b.id),
    ])
  }

  // ---------- settings ----------
  async function updateSettings(patch) {
    setSettings((s) => ({ ...s, ...patch }))
    await supabase.from('settings').update(patch).eq('user_id', uid)
  }

  const activeHabits = useMemo(
    () => habits.filter((h) => !h.archived).sort((a, b) => a.sort_order - b.sort_order),
    [habits]
  )

  const value = {
    loading,
    error,
    settings,
    habits,
    activeHabits,
    logs,
    javaSessions,
    dsaLogs,
    uiDate,
    setUiDate,
    getLog,
    setLogValue,
    toggleCheck,
    logJava,
    removeJava,
    javaMinutesOn,
    logDsa,
    removeDsa,
    dsaProblemsOn,
    dsaTotal,
    addHabit,
    updateHabit,
    moveHabit,
    updateSettings,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
