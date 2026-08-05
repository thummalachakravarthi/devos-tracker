import { todayISO } from './dates'

// A full, human-readable snapshot of everything the app stores.
// Re-importable by hand, and cheap insurance before a reset.
export function buildBackup({ settings, habits, logs, javaSessions, dsaLogs, books, bookSessions, bookNotes, accounts, categories, transactions }) {
  return {
    format: 'devos-tracker-backup',
    version: 1,
    exported_at: new Date().toISOString(),
    counts: {
      habits: habits?.length || 0,
      java_sessions: javaSessions?.length || 0,
      dsa_logs: dsaLogs?.length || 0,
      books: books?.length || 0,
      book_sessions: bookSessions?.length || 0,
      book_notes: bookNotes?.length || 0,
      transactions: transactions?.length || 0,
      habit_log_days: Object.values(logs || {}).reduce((a, m) => a + Object.keys(m).length, 0),
    },
    settings: settings || null,
    habits: habits || [],
    habit_logs: logs || {},
    java_sessions: javaSessions || [],
    dsa_logs: dsaLogs || [],
    books: books || [],
    book_sessions: bookSessions || [],
    book_notes: bookNotes || [],
    accounts: accounts || [],
    expense_categories: categories || [],
    transactions: transactions || [],
  }
}

export function downloadBackup(payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `devos-backup-${todayISO()}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  // revoke on the next tick so mobile Safari has time to start the download
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
