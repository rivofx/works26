import { Link } from 'react-router-dom'
// Shared frame for project pages. Remove it from a Page.jsx if you want a fully custom page.
export default function ProjectShell({ meta, children }) {
  return (
    <main className="shell">
      <Link to="/" className="back">Back to works</Link>
      <h1>{meta.title}</h1>
      <p className="sub">{meta.year} · {meta.role}</p>
      <div className="body">{children}</div>
    </main>
  )
}
