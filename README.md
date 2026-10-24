# Works '26 portfolio

    npm install
    npm run dev

Home page: a single-screen 3D drum. Scrolling, dragging or arrow keys rotate it. Clicking a card opens that project.

## Adding or replacing a project
Each project is one folder in `src/projects/`:

    src/projects/01-northlight/
      meta.js    title, year, role
      Page.jsx   the dedicated page (default export a React component)
      cover.svg  the card image (svg, png, jpg or webp)

Put your project's files (images, components, CSS) in its folder. Folders are found automatically and
ordered by name. The URL is `/p/<folder name without the number prefix>`, e.g. `/p/northlight`.
To add a sixth project, copy a folder and rename it. No other file needs changing.

For hosting, serve `dist/` with an SPA fallback to `index.html` (or switch `BrowserRouter` to `HashRouter` in `src/main.jsx`).

## Dropping in a whole project (TSX / Next-style)
Copy the project folder into `src/projects/` as it is (for example `src/projects/00-dnx/`), then add `meta.js` and a `cover.svg`/`.png`.
If it has `app/page.tsx`, that file becomes the project's page and `app/globals.css` is loaded with it. `@/...` imports resolve inside that project's folder.
Run `npm install <package>` in the site for any library the project imports that is not already listed in `package.json`.
`next/link`, `next/image` and other Next-only imports are not supported; swap them for plain `<a>` / `<img>`.

## Embedded projects (current setup)
`meta.js` can hold `embed: '/projects/<name>/index.html'`. The site then shows that folder from `public/projects/<name>/` full-screen.
- Plain HTML/CSS/JS sites: copy the whole site into `public/projects/<name>/`.
- Next.js apps: copy the source into `project-sources/<name>/`, then run `scripts/build-next-project.sh <name>` (static export into `public/projects/<name>/`).
  Needs Node + npm. Optional `project-sources/<name>/export-patch.sh` can tweak the temp copy before the build (see gamebox).
