
// Auto-discovers every folder in src/projects/. Each needs meta.js + cover image, plus EITHER:
//   Page.tsx / Page.jsx   (a custom page), OR
//   app/page.tsx          (a whole Next-style project dropped in as-is; app/globals.css is loaded too)
const metas = import.meta.glob('./projects/*/meta.{js,ts}', { eager: true, import: 'default' })
const covers = import.meta.glob('./projects/*/cover.{svg,png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' })
const entries = import.meta.glob('./projects/*/{Page.tsx,Page.jsx,app/page.tsx}')
const styles = import.meta.glob('./projects/*/app/globals.css')
const projects = Object.keys(metas).sort().map((path) => {
  const dir = path.split('/')[2]
  const base = './projects/' + dir
  const coverKey = Object.keys(covers).find((k) => k.startsWith(base + '/'))
  const entryKey = Object.keys(entries).sort().find((k) => k.startsWith(base + '/'))
  const css = styles[base + '/app/globals.css']
  return {
    ...metas[path],
    slug: dir.replace(/^\d+-/, ''),
    cover: coverKey && covers[coverKey],
    raw: !!entryKey && entryKey.endsWith('app/page.tsx'),
    load: entryKey ? async () => { if (css) await css(); return entries[entryKey]() } : null,
  }
})
export default projects
