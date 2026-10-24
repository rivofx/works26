#!/usr/bin/env bash
# Usage: scripts/build-next-project.sh <slug>
# Builds project-sources/<slug> (a Next.js app) as a static export into public/projects/<slug>.
set -e
slug=$1; root=$(cd "$(dirname "$0")/.." && pwd); tmp=$(mktemp -d)
cp -r "$root/project-sources/$slug/." "$tmp"; cd "$tmp"
rm -f next.config.* src/app/sitemap.ts src/app/robots.ts
grep -rl '<source src="/' src | xargs -r sed -i "s#<source src=\"/#<source src=\"/projects/$slug/#g"
echo "export default function loader({ src }) { return src.startsWith('/') ? '/projects/$slug' + src : src }" > image-loader.js
echo "export default { output: 'export', basePath: '/projects/$slug', trailingSlash: true, images: { loader: 'custom', loaderFile: './image-loader.js' }, typescript: { ignoreBuildErrors: true }, eslint: { ignoreDuringBuilds: true } }" > next.config.mjs
[ -f export-patch.sh ] && bash export-patch.sh
npm install --no-audit --no-fund --legacy-peer-deps >/dev/null 2>&1
npx next build
rm -rf "$root/public/projects/$slug"; cp -r out "$root/public/projects/$slug"
