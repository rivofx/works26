#!/usr/bin/env bash
# Runs inside the temp copy before the static export. GameBox's game page is a client component,
# so a tiny server wrapper supplies the list of game ids that static export needs.
d="src/app/games/[id]"
mv "$d/page.tsx" "$d/client.tsx"
cat > "$d/page.tsx" <<'EOF'
import Client from './client';
export function generateStaticParams() { return ['tic-tac-toe', 'connect-four', 'uno', 'trivia', 'draw-guess', 'snake'].map((id) => ({ id })); }
export default function Page() { return <Client />; }
EOF
sed -i "s#register('/sw.js')#register('/projects/gamebox/sw.js')#" src/components/GameBox.tsx
