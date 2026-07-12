import { useEffect, useMemo, useRef, useState } from 'react'
import { MessageCircle, X, Send, Trash2, Key, Sparkles, Check } from 'lucide-react'
import { useData } from '../DataStore'
import { todayISO } from '../lib/dates'
import { computeXp, levelFromXp, computeGlobalStreak } from '../lib/gamify'
import {
  getKey, setKey, clearKey,
  loadChat, saveChat, clearChat,
  buildSystemPrompt, buildSnapshot, callGemini, callGeminiStream,
} from '../lib/copilot'

// Match user-typed habit fuzzy → real habit
function findHabit(name, habits) {
  const q = name.toLowerCase().trim()
  return habits.find(h => h.name.toLowerCase() === q)
    || habits.find(h => h.name.toLowerCase().includes(q))
    || habits.find(h => q.includes(h.name.toLowerCase()))
}

export default function CopilotWidget() {
  const {
    settings, activeHabits, javaSessions, dsaLogs, logs,
    logJava, logDsa, toggleCheck,
  } = useData()

  const [open, setOpen] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [keyDraft, setKeyDraft] = useState('')
  const [messages, setMessages] = useState(loadChat)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState(null) // { name, args } — needs user confirm
  const listRef = useRef(null)

  const key = getKey()
  useEffect(() => { if (open && !key) setShowKey(true) }, [open, key])
  useEffect(() => { saveChat(messages) }, [messages])
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, pending, busy])

  const snapshot = useMemo(() => {
    const xpData = computeXp({ javaSessions, dsaLogs, habitLogs: logs })
    const lvl = levelFromXp(xpData.total)
    const streak = computeGlobalStreak({ javaSessions, dsaLogs, habitLogs: logs }, todayISO())
    return buildSnapshot({
      settings, activeHabits, javaSessions, dsaLogs, logs,
      xp: xpData.total, level: lvl.level, streak, todayIso: todayISO(),
    })
  }, [settings, activeHabits, javaSessions, dsaLogs, logs])

  async function send(msg) {
    if (!msg.trim() || busy) return
    const currentKey = getKey()
    if (!currentKey) { setShowKey(true); return }
    const next = [...messages, { role: 'user', text: msg }]
    setMessages(next)
    setInput('')
    setBusy(true)
    // Insert an empty assistant bubble we\'ll stream into
    setMessages((m) => [...m, { role: 'assistant', text: '', streaming: true }])
    try {
      const sys = buildSystemPrompt(snapshot)
      let acc = ''
      const { toolCalls } = await callGeminiStream({
        apiKey: currentKey,
        systemPrompt: sys,
        history: messages,
        userMessage: msg,
        onChunk: (chunk) => {
          acc += chunk
          setMessages((m) => {
            const copy = m.slice()
            const last = copy[copy.length - 1]
            if (last && last.streaming) copy[copy.length - 1] = { ...last, text: acc }
            return copy
          })
        },
      })
      // finalize streaming flag
      setMessages((m) => {
        const copy = m.slice()
        const last = copy[copy.length - 1]
        if (last && last.streaming) copy[copy.length - 1] = { role: 'assistant', text: acc || last.text }
        return copy
      })
      if (toolCalls.length) setPending(toolCalls[0])
    } catch (e) {
      setMessages((m) => {
        const copy = m.slice()
        const last = copy[copy.length - 1]
        if (last && last.streaming) copy.pop()
        return [...copy, { role: 'assistant', text: `⚠️ ${e.message}`, error: true }]
      })
    } finally {
      setBusy(false)
    }
  }

  async function runTool(call) {
    const today = todayISO()
    let result = ''
    try {
      if (call.name === 'logJava') {
        const min = Math.max(1, Math.floor(call.args.minutes || 0))
        await logJava(min, call.args.note || null, today)
        result = `✅ Logged ${min} min of Java${call.args.note ? ` · "${call.args.note}"` : ''}.`
      } else if (call.name === 'logDsa') {
        const n = Math.max(1, Math.floor(call.args.problems || 0))
        await logDsa(n, call.args.topic || null, today)
        result = `✅ Logged ${n} DSA problem${n === 1 ? '' : 's'}${call.args.topic ? ` (${call.args.topic})` : ''}.`
      } else if (call.name === 'toggleHabit') {
        const h = findHabit(call.args.name || '', activeHabits)
        if (!h) { result = `⚠️ No habit matching "${call.args.name}".` }
        else if (logs[h.id]?.[today]?.completed) { result = `⚠️ "${h.name}" is already done today.` }
        else { await toggleCheck(h, today); result = `✅ Marked "${h.name}" done.` }
      } else {
        result = `⚠️ Unknown tool: ${call.name}`
      }
    } catch (e) {
      result = `⚠️ Action failed: ${e.message}`
    }
    setMessages((m) => [...m, { role: 'system', text: result }])
    setPending(null)
  }

  function saveKey() {
    if (!keyDraft.trim()) return
    setKey(keyDraft)
    setKeyDraft('')
    setShowKey(false)
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed z-40 right-4 lg:right-6 bottom-24 lg:bottom-6 w-14 h-14 rounded-full grid place-items-center transition-all
          ${open ? 'bg-white/10 border border-white/20' : 'btn-amber !border-0 shadow-[0_10px_28px_-6px_rgba(96,165,250,.6)]'}
        `}
        title="Chat with Copilot"
        aria-label="Toggle Copilot"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Slide-up panel */}
      {open && (
        <div className="fixed z-40 right-4 lg:right-6 bottom-40 lg:bottom-24 w-[calc(100vw-2rem)] sm:w-[400px] max-w-[95vw] h-[70vh] max-h-[620px] flex flex-col rounded-2xl border border-white/10 bg-black/85 backdrop-blur-xl shadow-2xl anim-up">
          {/* header */}
          <div className="flex items-center gap-2 p-3 border-b border-white/8">
            <div className="w-8 h-8 rounded-lg grid place-items-center bg-white/8">
              <Sparkles size={15} className="text-amber" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">Copilot</div>
              <div className="text-[10px] text-dim">Gemini · knows your data</div>
            </div>
            <button className="btn !p-1.5 !py-1 !px-2" title="Set API key" onClick={() => setShowKey(true)}>
              <Key size={13} />
            </button>
            <button className="btn !p-1.5 !py-1 !px-2" title="Clear chat"
              onClick={() => { setMessages([]); clearChat() }}>
              <Trash2 size={13} />
            </button>
          </div>

          {/* messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && !showKey && (
              <div className="text-center py-8">
                <Sparkles size={28} className="text-amber mx-auto mb-3" />
                <p className="text-sm text-dim leading-relaxed max-w-[280px] mx-auto">
                  Ask me about your progress, the app, or tell me what you just studied and I'll log it.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {['How am I doing?', 'What is XP for?', "Log 30m Java on streams"].map(s => (
                    <button key={s} className="chip !text-[11px]" onClick={() => send(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-amber text-black'
                    : m.role === 'system'
                    ? 'bg-mint/15 border border-mint/30 text-text text-xs'
                    : m.error
                    ? 'bg-red/15 border border-red/30 text-text'
                    : 'bg-white/6 text-text'
                }`}>{m.text}</div>
              </div>
            ))}

            {busy && (
              <div className="flex justify-start">
                <div className="bg-white/6 rounded-xl px-3 py-2">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-dim animate-pulse" style={{ animationDelay: '0s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-dim animate-pulse" style={{ animationDelay: '.2s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-dim animate-pulse" style={{ animationDelay: '.4s' }} />
                  </span>
                </div>
              </div>
            )}

            {pending && (
              <div className="rounded-xl border border-amber/40 bg-amber/10 p-3 text-sm">
                <div className="text-xs text-dim mb-1">Copilot wants to:</div>
                <div className="font-medium mb-2">
                  {pending.name === 'logJava' && `Log ${pending.args.minutes} min of Java${pending.args.note ? ` (${pending.args.note})` : ''}`}
                  {pending.name === 'logDsa' && `Log ${pending.args.problems} DSA problem${pending.args.problems === 1 ? '' : 's'}${pending.args.topic ? ` (${pending.args.topic})` : ''}`}
                  {pending.name === 'toggleHabit' && `Mark habit "${pending.args.name}" done for today`}
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-amber !py-1.5 flex-1"
                    onClick={() => runTool(pending)}>
                    <Check size={13} /> Yes, do it
                  </button>
                  <button className="btn !py-1.5"
                    onClick={() => { setPending(null); setMessages(m => [...m, { role: 'system', text: 'Cancelled.' }]) }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* input row */}
          <div className="p-3 border-t border-white/8">
            <div className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="Ask anything…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send(input))}
                disabled={busy || !!pending}
              />
              <button
                className="btn btn-amber !px-3"
                onClick={() => send(input)}
                disabled={!input.trim() || busy || !!pending}
              >
                <Send size={15} />
              </button>
            </div>
            {!key && <div className="text-[10px] text-dim mt-2 flex items-center gap-1">
              <Key size={10} /> No API key set — tap the key icon to add one.
            </div>}
          </div>
        </div>
      )}

      {/* Key modal */}
      {showKey && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4 anim-up"
          onClick={() => setShowKey(false)}>
          <div className="w-full max-w-md card !p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <Key size={16} className="text-amber" />
              <div className="font-medium">Google Gemini API key</div>
            </div>
            <p className="text-xs text-dim leading-relaxed mb-3">
              Get one free at{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-amber underline">
                aistudio.google.com/apikey
              </a>
              . Key starts with <code className="text-text">AIzaSy…</code>. Saved only in this browser — direct browser→Google requests, nothing goes through my servers.
            </p>
            <input
              className="input font-mono text-xs"
              placeholder="AIzaSy…"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveKey()}
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <button className="btn btn-amber flex-1" disabled={!keyDraft.trim()} onClick={saveKey}>
                Save
              </button>
              {getKey() && (
                <button className="btn !text-red !border-red/30" onClick={() => { clearKey(); setKeyDraft('') }}>
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
