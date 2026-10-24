#!/usr/bin/env bash
# The sandbox/build machine may be offline, so drop next/font/google and use the CSS font stack instead.
sed -i "/next\/font\/google/d; /const inter = /d; s/inter\.className/'font-sans'/" app/layout.tsx
