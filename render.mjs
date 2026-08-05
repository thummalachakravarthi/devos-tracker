import { JSDOM } from 'jsdom'
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',
  { url: 'https://localhost/', pretendToBeVisual: true })
global.window = dom.window
global.document = dom.window.document
Object.defineProperty(global, "navigator", { value: dom.window.navigator, configurable: true })
global.HTMLElement = dom.window.HTMLElement
global.Image = dom.window.Image
global.localStorage = dom.window.localStorage
global.performance = dom.window.performance
global.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0)
global.cancelAnimationFrame = clearTimeout
global.fetch = async () => ({ ok: true, json: async () => ({ docs: [] }) })
window.matchMedia = () => ({ matches: false, addListener(){}, removeListener(){} })

const { renderToString } = await import('react-dom/server')
const React = (await import('react')).default
const { createRequire } = await import('module'); const req = createRequire(import.meta.url); const mod = req(process.argv[2])
try {
  renderToString(React.createElement(mod.default))
  console.log('RENDER OK')
} catch (e) {
  console.log('RENDER ERROR:', e.message)
  console.log((e.stack || '').split('\n').slice(1, 5).join('\n'))
}
