// Gemini client — browser-only, key from localStorage, tool-calling for write actions.
// Uses gemini-2.5-flash (free tier: 15 rpm / 1500 rpd).

const KEY_STORAGE = 'devos:geminiKey'
const CHAT_STORAGE = 'devos:copilotChat'
const MODEL = 'gemini-flash-lite-latest'

export const getKey = () => localStorage.getItem(KEY_STORAGE) || ''
export const setKey = (k) => localStorage.setItem(KEY_STORAGE, k.trim())
export const clearKey = () => localStorage.removeItem(KEY_STORAGE)

export const loadChat = () => {
  try { return JSON.parse(localStorage.getItem(CHAT_STORAGE) || '[]') } catch { return [] }
}
export const saveChat = (msgs) => {
  // keep only last 40 turns to bound storage and context
  const trimmed = msgs.slice(-40)
  localStorage.setItem(CHAT_STORAGE, JSON.stringify(trimmed))
}
export const clearChat = () => localStorage.removeItem(CHAT_STORAGE)

// Tools the agent can invoke — parsed from Gemini function calls
export const TOOLS = [
  {
    name: 'logJava',
    description: 'Log a Java study session for the user. minutes must be positive. optional note.',
    parameters: {
      type: 'OBJECT',
      properties: {
        minutes: { type: 'INTEGER', description: 'Duration in minutes (must be > 0)' },
        note: { type: 'STRING', description: 'Optional note about what was studied' },
      },
      required: ['minutes'],
    },
  },
  {
    name: 'logDsa',
    description: 'Log DSA problems solved by the user.',
    parameters: {
      type: 'OBJECT',
      properties: {
        problems: { type: 'INTEGER', description: 'Number of problems solved (must be > 0)' },
        topic: { type: 'STRING', description: 'Optional topic (e.g. "Arrays", "DP", "Trees")' },
      },
      required: ['problems'],
    },
  },
  {
    name: 'toggleHabit',
    description: 'Mark a habit as done for today. name should partial-match one of the user habits.',
    parameters: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING', description: 'Habit name to mark done, e.g. "meditation"' },
      },
      required: ['name'],
    },
  },
]

// System prompt: primer about the app + persona
export function buildSystemPrompt(snapshot) {
  return `You are Copilot, an in-app assistant for DevOS Tracker — a Java-prep + habit tracker web app the user built for their 240-day career mission.

WHAT THE APP DOES
- Today: mission control hero (XP, level, streak), habit check-ins, daily wins
- Focus: Pomodoro / custom timer / stopwatch, completed focus blocks auto-log as Java time
- Command: mission briefing with today's priorities, yesterday's debrief, roadmap, session notes, company targets
- Java HQ: coffee-cup ring, session log, weekly chart, 240-day heatmap, phases, DSA tracker
- Insights: interactive bar chart across 4 metrics with 7D moving average, KPIs, momentum, weekday patterns
- Habits: add/edit/reorder/archive habits, reset all data

XP RULES
- 1 minute of Java = 1 XP
- 1 DSA problem = 20 XP
- 1 habit completion = 5 XP
- Levels start at L1=0 XP, L2=200, L3=500, L5=1700, L10=8200

USER SNAPSHOT (live data, use these numbers):
${JSON.stringify(snapshot, null, 2)}

YOUR JOB
- Answer questions about the user's progress using the snapshot above. Cite real numbers.
- Be concise, warm, and direct. No preamble, no bullet-point walls unless asked.
- When the user asks how the app works, explain based on the sections above.
- When the user reports activity ("I studied 30 min", "solved 2 problems"), call the appropriate tool — logJava, logDsa, or toggleHabit.
- Never invent numbers not in the snapshot.
- If the user asks something you truly can't answer (like debugging their source code), say so briefly and offer what you can help with.
- Address the user as "Chakri" only if their name appears in the snapshot; otherwise just talk normally.`
}

// Build the compact snapshot sent to Gemini every turn
export function buildSnapshot({
  settings, activeHabits, javaSessions, dsaLogs, logs, xp, level, streak, todayIso
}) {
  const today = todayIso
  const dayNum = Math.min(settings.plan_days, Math.max(1, Math.round((new Date(today) - new Date(settings.plan_start_date)) / 86400000) + 1))

  const javaToday = javaSessions.filter(s => s.session_date === today).reduce((a, s) => a + s.minutes, 0)
  const dsaToday = dsaLogs.filter(l => l.log_date === today).reduce((a, l) => a + l.problems, 0)
  const habitsToday = activeHabits.filter(h => logs[h.id]?.[today]?.completed).length

  // last 7 days aggregate
  const last7 = { java: 0, dsa: 0, checkins: 0 }
  for (let i = 0; i < 7; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    last7.java += javaSessions.filter(s => s.session_date === iso).reduce((a, s) => a + s.minutes, 0)
    last7.dsa += dsaLogs.filter(l => l.log_date === iso).reduce((a, l) => a + l.problems, 0)
    last7.checkins += activeHabits.filter(h => logs[h.id]?.[iso]?.completed).length
  }

  const javaMinTotal = javaSessions.reduce((a, s) => a + s.minutes, 0)
  const dsaTotal = dsaLogs.reduce((a, l) => a + l.problems, 0)

  return {
    mission: { day: dayNum, total_days: settings.plan_days, days_left: settings.plan_days - dayNum, daily_java_target_min: settings.daily_java_minutes },
    level, xp_total: xp, streak_days: streak,
    today: { date: today, java_minutes: javaToday, dsa_problems: dsaToday, habits_done: habitsToday, habits_total: activeHabits.length },
    last_7_days: last7,
    lifetime: { java_hours: Math.round(javaMinTotal / 60 * 10) / 10, dsa_problems: dsaTotal },
    habits: activeHabits.map(h => ({ name: h.name, type: h.type })),
  }
}

// Send one chat turn to Gemini. Returns { text, toolCalls: [{ name, args }] }.
export async function callGemini({ apiKey, systemPrompt, history, userMessage }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`
  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }],
      })),
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    tools: [{ function_declarations: TOOLS }],
    generation_config: { temperature: 0.7, max_output_tokens: 800 },
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  const parts = data?.candidates?.[0]?.content?.parts || []
  const text = parts.filter(p => p.text).map(p => p.text).join('').trim()
  const toolCalls = parts
    .filter(p => p.functionCall)
    .map(p => ({ name: p.functionCall.name, args: p.functionCall.args || {} }))
  return { text, toolCalls }
}

// Streaming version — yields text chunks as they arrive.
// Tool calls come at the end (Gemini returns them in the final chunk with the aggregated content).
export async function callGeminiStream({ apiKey, systemPrompt, history, userMessage, onChunk }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`
  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }],
      })),
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    tools: [{ function_declarations: TOOLS }],
    generation_config: { temperature: 0.7, max_output_tokens: 800 },
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API ${res.status}: ${err.slice(0, 200)}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let fullText = ''
  const toolCalls = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    // Split into SSE events (lines starting with "data:")
    let idx
    while ((idx = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, idx).trim()
      buffer = buffer.slice(idx + 1)
      if (!line.startsWith('data:')) continue
      const payload = line.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      try {
        const data = JSON.parse(payload)
        const parts = data?.candidates?.[0]?.content?.parts || []
        for (const p of parts) {
          if (p.text) {
            fullText += p.text
            onChunk?.(p.text)
          } else if (p.functionCall) {
            toolCalls.push({ name: p.functionCall.name, args: p.functionCall.args || {} })
          }
        }
      } catch { /* partial JSON — ignore */ }
    }
  }
  return { text: fullText.trim(), toolCalls }
}
