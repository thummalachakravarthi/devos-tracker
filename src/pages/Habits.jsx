import { useState } from 'react'
import { Plus, ArrowUp, ArrowDown, Archive, ArchiveRestore, Pencil, X } from 'lucide-react'
import LifeGarden from '../components/LifeGarden'
import { useData } from '../DataStore'

const COLORS = ['#0284C7', '#0EA5E9', '#2E7D32', '#1F5FD6', '#6366F1', '#1E2635']
const TYPES = [
  { id: 'check', label: 'Checkbox', targetLabel: null },
  { id: 'steps', label: 'Steps count', targetLabel: 'Daily steps target' },
  { id: 'water', label: 'Water litres', targetLabel: 'Litres per day' },
  { id: 'hours', label: 'Hours', targetLabel: 'Hours per day' },
]

function HabitForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(
    initial || { name: '', icon: '✅', color: COLORS[0], type: 'check', target: 1, monthly_goal: 30 }
  )
  const type = TYPES.find((t) => t.id === f.type)
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  return (
    <div className="card space-y-3 border-amber/40">
      <div className="flex gap-2">
        <div className="w-20">
          <label className="label">Icon</label>
          <input className="input mt-1 text-center" value={f.icon} maxLength={4} onChange={(e) => set('icon', e.target.value)} />
        </div>
        <div className="flex-1">
          <label className="label">Name</label>
          <input className="input mt-1" placeholder="e.g. Certification prep" value={f.name} onChange={(e) => set('name', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">Type</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {TYPES.map((t) => (
            <button
              key={t.id}
              className={`chip ${f.type === t.id ? '!border-amber !text-amber' : ''}`}
              onClick={() => set('type', t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        {type.targetLabel && (
          <div className="flex-1">
            <label className="label">{type.targetLabel}</label>
            <input
              className="input mt-1"
              type="number"
              inputMode="numeric"
              value={f.target}
              onChange={(e) => set('target', e.target.value)}
            />
          </div>
        )}
        <div className="flex-1">
          <label className="label">Times per month</label>
          <input
            className="input mt-1"
            type="number"
            inputMode="numeric"
            value={f.monthly_goal}
            onChange={(e) => set('monthly_goal', e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="label">Colour</label>
        <div className="flex gap-2 mt-1">
          {COLORS.map((c) => (
            <button
              key={c}
              className="w-7 h-7 rounded-lg transition"
              style={{ background: c, outline: f.color === c ? '2px solid #E9EEF6' : 'none', outlineOffset: 2 }}
              onClick={() => set('color', c)}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          className="btn btn-amber flex-1"
          disabled={!f.name.trim()}
          onClick={() =>
            onSave({
              name: f.name.trim(),
              icon: f.icon || '✅',
              color: f.color,
              type: f.type,
              target: Number(f.target) || 1,
              monthly_goal: Number(f.monthly_goal) || 30,
            })
          }
        >
          Save habit
        </button>
        <button className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function Habits() {
  const { habits, addHabit, updateHabit, moveHabit, settings } = useData()

  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const active = habits.filter((h) => !h.archived).sort((a, b) => a.sort_order - b.sort_order)
  const archived = habits.filter((h) => h.archived)

  return (
    <div className="space-y-3">
      {settings?.show_garden !== false && <LifeGarden />}
      {adding ? (
        <HabitForm
          onCancel={() => setAdding(false)}
          onSave={(f) => {
            addHabit(f)
            setAdding(false)
          }}
        />
      ) : (
        <button className="btn btn-spidey w-full" onClick={() => setAdding(true)}>
          <Plus size={16} /> New habit
        </button>
      )}

      {active.map((h) =>
        editingId === h.id ? (
          <HabitForm
            key={h.id}
            initial={h}
            onCancel={() => setEditingId(null)}
            onSave={(f) => {
              updateHabit(h.id, f)
              setEditingId(null)
            }}
          />
        ) : (
          <div key={h.id} className="card flex items-center gap-3">
            <span className="text-xl w-8 text-center">{h.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{h.name}</div>
              <div className="text-xs text-dim">
                {TYPES.find((t) => t.id === h.type)?.label}
                {h.type !== 'check' && ` · target ${Number(h.target).toLocaleString('en-IN')}`} · {h.monthly_goal}×/month
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: h.color }} />
            <button className="btn !p-1.5" onClick={() => moveHabit(h.id, -1)}>
              <ArrowUp size={14} />
            </button>
            <button className="btn !p-1.5" onClick={() => moveHabit(h.id, 1)}>
              <ArrowDown size={14} />
            </button>
            <button className="btn !p-1.5" onClick={() => setEditingId(h.id)}>
              <Pencil size={14} />
            </button>
            <button className="btn !p-1.5" title="Archive" onClick={() => updateHabit(h.id, { archived: true })}>
              <Archive size={14} />
            </button>
          </div>
        )
      )}

      {archived.length > 0 && (
        <div className="pt-2">
          <div className="label mb-2">Archived</div>
          {archived.map((h) => (
            <div key={h.id} className="card flex items-center gap-3 opacity-60 mb-2">
              <span className="text-xl w-8 text-center">{h.icon}</span>
              <span className="flex-1 text-sm">{h.name}</span>
              <button className="btn !p-1.5" title="Restore" onClick={() => updateHabit(h.id, { archived: false })}>
                <ArchiveRestore size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-dim">
        Archiving keeps all history — the habit just stops showing on Today. History stays in Stats forever.
      </p>

    </div>
  )
}
