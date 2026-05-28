#!/usr/bin/env bash
# Record DeInject judge demo → demo/deinject-demo.gif
# Requires: dev server on :3000, playwright, ffmpeg
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BASE_URL="${1:-http://localhost:3000}"
RUN_DIR="demo/reel-$(date +%Y%m%d-%H%M%S)"
OUT_GIF="demo/deinject-demo.gif"
STITCH="/Users/Rohithn/.cursor/plugins/cache/cursor-public/compound-engineering/253dba80dd08c111edae3f7fdc8fac998ec0d5cb/skills/ce-demo-reel/scripts/capture-demo.py"

if ! curl -sf "$BASE_URL" >/dev/null; then
  echo "Dev server not reachable at $BASE_URL — run: npm run dev"
  exit 1
fi

if ! node -e "require('playwright')" 2>/dev/null; then
  echo "Installing playwright (one-time)..."
  npm install --no-save playwright
  npx playwright install chromium
fi

node scripts/record-demo.mjs "$RUN_DIR" "$BASE_URL"

python3 "$STITCH" stitch --duration 2.5 "$OUT_GIF" "$RUN_DIR"/frame-*.png
echo ""
echo "Demo saved: $OUT_GIF ($(du -h "$OUT_GIF" | cut -f1))"
