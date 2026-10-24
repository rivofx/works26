import { lazy, Suspense, useMemo } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import LiquidChrome from './LiquidChrome'
import Drum from './Drum'
import projects from './projects'

// The chrome background lives here so it stays on screen (and keeps flowing) on every page.
function Backdrop() {
  return (
    <div className="backdrop">
      <LiquidChrome color="#ffffff" speed={0.2} amplitude={0.3} detail={4} thickness={1} interactive style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div className="veil" />
    </div>
  )
}

// A project opens in a framed window; the website background shows around it.
function Frame({ slug, embed, Page }) {
  return (
    <div className="stage-page">
      <Link to="/" className="back-mid">Back to works</Link>
      <main className="frame">
        {embed ? <iframe className="embed" title={slug} src={embed} /> : <Page />}
      </main>
    </div>
  )
}

export default function App() {
  const routes = useMemo(() => projects.map((p) => ({ slug: p.slug, embed: p.embed, Page: p.load ? lazy(p.load) : null })), [])
  return (
    <>
      <Backdrop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Drum />} />
          {routes.map((r) => <Route key={r.slug} path={`/p/${r.slug}`} element={<Frame {...r} />} />)}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}
