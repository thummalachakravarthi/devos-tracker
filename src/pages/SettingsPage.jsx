import { useEffect, useState } from 'react'
import {
  Settings as Cog, Target, Calendar, Eye, Database, AlertTriangle,
  RotateCcw, Download, KeyRound, Check, LogOut,
} from 'lucide-react'
import { useData } from '../DataStore'
import { supabase } from '../lib/supabase'
import { todayISO, fmtNice, dayDiff } from '../lib/dates'
import { buildBackup, downloadBackup } from '../lib/backup'
import { getKey, setKey, clearKey } from '../lib/copilot'

function Row({ icon: Icon, label, hint, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/6 last:border-0">
      <div className="min-w-0">
        <div className="text-sm flex items-center gap-1.5">
          {Icon && <Icon size={13} className="text-dim shrink-0" />}
          {label}
        </div>
        {hint && <div className="text-[11px] text-dim mt-0.5">{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className="w-11 h-6 rounded-full transition relative"
      style={{ background: on ? 'rgba(34,197,94,.5)' : 'rgba(255,255,255,.12)' }}>
      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
        style={{ left: on ? '22px' : '2px' }} />
    </button>
  )
}

function NumberField({ value, onCommit, suffix, min = 0, max = 100000, width = 'w-20' }) {
  const [v, setV] = useState(String(value ?? ''))
  useEffect(() => { setV(String(value ?? '')) }, [value])
  const commit = () => {
    const n = Math.max(min, Math.min(max, Number(v) || 0))
    setV(String(n))
    if (n !== value) onCommit(n)
  }
  return (
    <div className="flex items-center gap-1.5">
      <input type="number" inputMode="numeric" className={`input ${width} !py-1 text-sm text-right`}
        value={v} onChange={(e) => setV(e.target.value)} onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} />
      {suffix && <span className="text-xs text-dim">{suffix}</span>}
    </div>
  )
}

export default function SettingsPage() {
  const {
    settings, updateSettings, resetAllData,
    habits, logs, javaSessions, dsaLogs, books, bookSessions, bookNotes, accounts, categories, transactions,
  } = useData()

  const [confirming, setConfirming] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [exported, setExported] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [keySaved, setKeySaved] = useState(false)
  const hasKey = !!getKey()

  const s = settings || {}
  const set = (patch) => updateSettings(patch)

  const doExport = () => {
    downloadBackup(buildBackup({ settings, habits, logs, javaSessions, dsaLogs, books, bookSessions, bookNotes, accounts, categories, transactions }))
    setExported(true)
    setTimeout(() => setExported(false), 3000)
  }

  const dayNum = s.plan_start_date
    ? Math.max(1, dayDiff(s.plan_start_date, todayISO()) + 1)
    : 1

  return (
    <div className="space-y-4">
      <section className="card card-hover">
        <div className="flex items-center gap-2 mb-1">
          <Cog size={16} className="text-amber" />
          <div className="label">Settings</div>
        </div>
        <div className="text-xs text-dim">
          Mission day <span className="text-text font-mono">{dayNum}</span> of {s.plan_days || 240}
          {s.plan_start_date && <> · started {fmtNice(s.plan_start_date)}</>}
        </div>
      </section>

      {/* ── Daily targets ── */}
      <section className="card">
        <div className="label mb-1 flex items-center gap-1.5"><Target size={12} /> Daily targets</div>
        <Row label="Java study" hint="Minutes of focused Java work per day">
          <NumberField value={s.daily_java_minutes ?? 180} suffix="min" max={1440}
            onCommit={(n) => set({ daily_java_minutes: n })} />
        </Row>
        <Row label="DSA problems" hint="Problems to solve each day">
          <NumberField value={s.daily_dsa_target ?? 2} suffix="/day" max={50}
            onCommit={(n) => set({ daily_dsa_target: n })} />
        </Row>
        <Row label="Books this year" hint="Your annual reading goal">
          <NumberField value={s.yearly_book_goal ?? 12} suffix="books" max={999}
            onCommit={(n) => set({ yearly_book_goal: n })} />
        </Row>
        <Row label="Reading" hint="Pages to read each day">
          <NumberField value={s.daily_pages_target ?? 20} suffix="pages" max={2000}
            onCommit={(n) => set({ daily_pages_target: n })} />
        </Row>
      </section>

      {/* ── Mission ── */}
      <section className="card">
        <div className="label mb-1 flex items-center gap-1.5"><Calendar size={12} /> Mission</div>
        <Row label="Your name" hint="Shown in greetings">
          <input className="input w-40 !py-1 text-sm" placeholder="Optional"
            defaultValue={s.display_name || ''}
            onBlur={(e) => {
              const v = e.target.value.trim()
              if (v !== (s.display_name || '')) set({ display_name: v || null })
            }} />
        </Row>
        <Row label="Plan length" hint="Total days in the mission">
          <NumberField value={s.plan_days ?? 240} suffix="days" min={1} max={3650}
            onCommit={(n) => set({ plan_days: n })} />
        </Row>
        <Row label="Start date" hint="Day 1 of the mission">
          <input type="date" className="input !py-1 text-sm"
            value={s.plan_start_date || todayISO()}
            onChange={(e) => e.target.value && set({ plan_start_date: e.target.value })} />
        </Row>
        <Row label="Week starts Monday" hint="Affects weekly charts and streaks">
          <Toggle on={s.week_starts_monday !== false}
            onChange={(v) => set({ week_starts_monday: v })} />
        </Row>
      </section>

      {/* ── Appearance ── */}
      <section className="card">
        <div className="label mb-1 flex items-center gap-1.5"><Eye size={12} /> Appearance</div>
        <Row label="Show Life Garden" hint="The garden on the Habits tab">
          <Toggle on={s.show_garden !== false} onChange={(v) => set({ show_garden: v })} />
        </Row>
        <Row label="Show Copilot" hint="The floating AI chat button">
          <Toggle on={s.show_copilot !== false} onChange={(v) => set({ show_copilot: v })} />
        </Row>
        <Row label="Reduce motion" hint="Turns off animations across the app">
          <Toggle on={!!s.reduce_motion} onChange={(v) => set({ reduce_motion: v })} />
        </Row>
      </section>

      {/* ── Copilot key ── */}
      <section className="card">
        <div className="label mb-1 flex items-center gap-1.5"><KeyRound size={12} /> Copilot</div>
        <div className="text-[11px] text-dim py-2">
          Your Gemini API key is stored in this browser only — it never reaches a server.
          Clear it on any device you don't control.
        </div>
        <div className="flex gap-2">
          <input className="input flex-1 !py-1 text-sm" type="password"
            placeholder={hasKey ? '•••••••••• saved' : 'Paste Gemini API key'}
            value={keyInput} onChange={(e) => setKeyInput(e.target.value)} />
          <button className="btn !py-1 !px-3 text-xs" disabled={!keyInput.trim()}
            onClick={() => {
              setKey(keyInput); setKeyInput(''); setKeySaved(true)
              setTimeout(() => setKeySaved(false), 2500)
            }}>
            {keySaved ? <Check size={13} /> : 'Save'}
          </button>
          {hasKey && (
            <button className="btn !py-1 !px-3 text-xs !text-red !border-red/30"
              onClick={() => { clearKey(); setKeyInput('') }}>
              Clear
            </button>
          )}
        </div>
      </section>

      {/* ── Data ── */}
      <section className="card">
        <div className="label mb-1 flex items-center gap-1.5"><Database size={12} /> Your data</div>
        <Row label="Export a backup" hint="Everything as one JSON file you can keep">
          <button className="btn !py-1 !px-3 text-xs flex items-center gap-1" onClick={doExport}>
            <Download size={13} /> {exported ? 'Saved ✓' : 'Export'}
          </button>
        </Row>
        <Row label="Sign out">
          <button className="btn !py-1 !px-3 text-xs flex items-center gap-1"
            onClick={() => supabase.auth.signOut()}>
            <LogOut size={13} /> Sign out
          </button>
        </Row>
      </section>

      {/* ── Danger zone ── */}
      <section className="card !border-red/25">
        <div className="label mb-2 flex items-center gap-1.5 !text-red">
          <AlertTriangle size={12} /> Danger zone
        </div>
        {!confirming ? (
          <button className="btn w-full !border-red/30 !text-red hover:!border-red/60"
            onClick={() => setConfirming(true)}>
            <RotateCcw size={14} /> Reset all my logged data
          </button>
        ) : (
          <div className="space-y-3">
            <div className="text-sm">
              <p className="font-medium text-red">Wipe every log and restart at Day 1?</p>
              <p className="text-dim text-xs mt-1">
                Deletes every habit check-in, Java session, DSA log, reading session and
                transaction, resets in-progress books to page 0, and restarts the mission
                clock at today. Keeps your login, habits, books, accounts and settings.
                <br /><span className="text-red">This cannot be undone.</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn flex-1" disabled={resetting}
                onClick={() => setConfirming(false)}>Cancel</button>
              <button className="btn flex-1" disabled={resetting} onClick={doExport}>
                {exported ? 'Saved ✓' : 'Back up first'}
              </button>
              <button className="btn flex-1 !border-red !bg-red !text-white" disabled={resetting}
                onClick={async () => {
                  setResetting(true)
                  try { await resetAllData(); setConfirming(false) }
                  finally { setResetting(false) }
                }}>
                {resetting ? 'Wiping…' : 'Yes, wipe everything'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
