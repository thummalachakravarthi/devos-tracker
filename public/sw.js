// DevOS service worker — app-shell cache so the app opens instantly and
// still opens at all on a dead connection. Data always comes from network.
const V = 'devos-v1'
const SHELL = ['/', '/index.html', '/icon.svg', '/manifest.webmanifest']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== V).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  // never cache Supabase or the Gemini API — always live
  if (url.hostname.endsWith('supabase.co') || url.hostname.includes('googleapis')) return

  // book covers: cache-first, they never change
  if (url.hostname === 'covers.openlibrary.org') {
    e.respondWith(
      caches.open(V + '-img').then(async (c) => {
        const hit = await c.match(request)
        if (hit) return hit
        try {
          const res = await fetch(request)
          if (res.ok) c.put(request, res.clone())
          return res
        } catch { return hit || Response.error() }
      })
    )
    return
  }

  // app shell + built assets: network-first, fall back to cache offline
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(V).then((c) => c.put(request, copy)).catch(() => {})
          return res
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match('/index.html')))
    )
  }
})
