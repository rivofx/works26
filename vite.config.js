import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// "@/..." inside a project folder points at THAT project's root, like in its original tsconfig.
const projectAlias = () => ({
  name: 'project-alias',
  enforce: 'pre',
  async resolveId(source, importer, opts) {
    if (!source.startsWith('@/') || !importer) return null
    const m = importer.replace(/\\/g, '/').match(/^(.*\/src\/projects\/[^/]+)\//)
    if (!m) return null
    return this.resolve(path.join(m[1], source.slice(2)), importer, { ...opts, skipSelf: true })
  },
})

export default defineConfig({
  plugins: [projectAlias(), react()],
  css: { postcss: { plugins: [tailwindcss({ config: './tailwind.config.cjs' }), autoprefixer()] } },
})
