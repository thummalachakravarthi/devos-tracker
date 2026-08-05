import { Component } from 'react'

/**
 * Without this, any render error anywhere unmounts the whole tree and you get
 * a white screen with nothing to go on. This catches it, shows what actually
 * broke, and offers a way back.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    this.setState({ info })
    console.error('[crash]', error, info?.componentStack)
  }

  render() {
    const { error, info } = this.state
    if (!error) return this.props.children

    const detail = [
      error?.message || String(error),
      info?.componentStack?.split('\n').slice(0, 6).join('\n'),
    ].filter(Boolean).join('\n\n')

    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="max-w-lg w-full">
          <div className="text-4xl mb-3">😵</div>
          <h1 className="font-display font-bold text-xl">Something broke</h1>
          <p className="text-sm text-dim mt-1.5">
            Your data is safe — this is a display error, not a data one. The details
            below say what went wrong.
          </p>

          <pre className="mt-4 p-3 rounded-xl bg-black/40 border border-red-500/25
            text-[11px] text-red-200 whitespace-pre-wrap break-words max-h-64 overflow-auto">
            {detail}
          </pre>

          <div className="flex flex-wrap gap-2 mt-4">
            <button className="btn" onClick={() => window.location.reload()}>
              Reload
            </button>
            <button className="btn" onClick={() => this.setState({ error: null, info: null })}>
              Try again
            </button>
            <button className="btn"
              onClick={() => navigator.clipboard?.writeText(detail)}>
              Copy error
            </button>
          </div>

          <p className="text-[11px] text-dim mt-4">
            If it keeps happening, a hard refresh clears a stale cached build:
            Ctrl/Cmd + Shift + R.
          </p>
        </div>
      </div>
    )
  }
}
