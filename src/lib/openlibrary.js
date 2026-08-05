// Open Library — free, no API key, CORS-enabled. Runs entirely in the browser.
// Gives us title, author, page count, publish year and cover art, which is the
// difference between "a form" and an actual book tracker.

const SEARCH = 'https://openlibrary.org/search.json'

export const coverUrl = (coverId, size = 'M') =>
  coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : null

export const coverFromIsbn = (isbn, size = 'M') =>
  isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg` : null

/**
 * Search Open Library. Returns a compact, already-normalised shape so the UI
 * doesn't have to know anything about their response format.
 */
export async function searchBooks(query, { limit = 8, signal } = {}) {
  const q = query.trim()
  if (q.length < 2) return []

  const params = new URLSearchParams({
    q,
    limit: String(limit),
    fields: 'key,title,author_name,first_publish_year,number_of_pages_median,cover_i,isbn,subject',
  })

  const res = await fetch(`${SEARCH}?${params}`, { signal })
  if (!res.ok) throw new Error(`Open Library returned ${res.status}`)
  const data = await res.json()

  return (data.docs || []).map((d) => ({
    olKey: d.key || null,
    title: d.title || 'Untitled',
    author: d.author_name?.[0] || null,
    year: d.first_publish_year || null,
    pages: d.number_of_pages_median || null,
    isbn: d.isbn?.[0] || null,
    cover: coverUrl(d.cover_i) || coverFromIsbn(d.isbn?.[0]),
    // Open Library subjects are noisy; the first few are usually the useful ones
    category: d.subject?.slice(0, 2).join(', ') || null,
  }))
}

/** Days left at the reader's recent pace, or null if we can't tell yet. */
export function estimateFinish(book, sessions) {
  if (!book.total_pages) return null
  const left = book.total_pages - (book.pages_read || 0)
  if (left <= 0) return 0

  const mine = sessions.filter((s) => s.book_id === book.id)
  if (mine.length < 2) return null

  const days = new Set(mine.map((s) => s.session_date)).size
  const pages = mine.reduce((a, s) => a + s.pages, 0)
  const perDay = pages / Math.max(1, days)
  if (perDay <= 0) return null
  return Math.ceil(left / perDay)
}

/**
 * Open Library serves S / M / L variants of the same cover. Requesting the
 * right size matters: an L cover behind a 44px thumbnail is wasted bytes,
 * and an S cover in the hero looks soft.
 */
export function coverAt(url, size = 'M') {
  if (!url) return null
  return url.replace(/-(S|M|L)\.jpg(\?.*)?$/i, `-${size}.jpg$2`)
}
