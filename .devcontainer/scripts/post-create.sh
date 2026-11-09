#!/usr/bin/env bash
# ─── Post-Create Setup Script ───────────────────────────────────────────────
set -euo pipefail

WORKSPACE="$1"
cd "$WORKSPACE"
git config --global --add safe.directory "$WORKSPACE"

echo "📦  Installing Node dependencies..."
npm ci

echo "🪝  Installing prek hooks..."
prek install --overwrite --install-hooks

echo ""
echo "✅  Setup done: npm run dev → http://localhost:5173"
