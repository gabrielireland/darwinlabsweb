#!/usr/bin/env bash
# ===========================================================================
# convert-hero-images.sh
# ---------------------------------------------------------------------------
# Converts hero PNG images to WebP for the Darwin Geospatial website.
#
# Requirements:
#   - cwebp  (install via: brew install webp)
#
# Usage:
#   ./scripts/convert-hero-images.sh          # default quality 80
#   ./scripts/convert-hero-images.sh -q 90    # custom quality (0-100)
#
# What it does:
#   1. Converts every PNG in assets/hero/ to WebP
#   2. Converts projects/guadarramaski/assets/acc_snow.png to WebP
#   3. Prints before/after file sizes and total savings
#
# After running, make sure your HTML/CSS references point to .webp files.
# ===========================================================================

set -euo pipefail

# Navigate to repo root (parent of scripts/)
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# Default quality
QUALITY=80

# Parse flags
while getopts "q:" opt; do
  case $opt in
    q) QUALITY="$OPTARG" ;;
    *) echo "Usage: $0 [-q quality]"; exit 1 ;;
  esac
done

# Check for cwebp
if ! command -v cwebp &>/dev/null; then
  echo "ERROR: cwebp not found. Install it with: brew install webp"
  exit 1
fi

echo "Converting hero images to WebP (quality: $QUALITY)"
echo "=================================================="

# Collect all hero source PNGs
HERO_PNGS=(
  assets/hero/habitat.png
  assets/hero/insolation.png
  assets/hero/ndvi.png
  assets/hero/aspect.png
  assets/hero/ch.png
  projects/guadarramaski/assets/acc_snow.png
)

TOTAL_BEFORE=0
TOTAL_AFTER=0

for png in "${HERO_PNGS[@]}"; do
  if [[ ! -f "$png" ]]; then
    echo "SKIP: $png (not found)"
    continue
  fi

  webp="${png%.png}.webp"
  size_before=$(stat -f%z "$png" 2>/dev/null || stat -c%s "$png")

  cwebp -q "$QUALITY" "$png" -o "$webp" -quiet

  size_after=$(stat -f%z "$webp" 2>/dev/null || stat -c%s "$webp")

  before_kb=$((size_before / 1024))
  after_kb=$((size_after / 1024))
  savings=$(( (size_before - size_after) * 100 / size_before ))

  printf "  %-50s %6d KB -> %6d KB  (%d%% smaller)\n" "$png" "$before_kb" "$after_kb" "$savings"

  TOTAL_BEFORE=$((TOTAL_BEFORE + size_before))
  TOTAL_AFTER=$((TOTAL_AFTER + size_after))
done

echo "=================================================="
total_before_kb=$((TOTAL_BEFORE / 1024))
total_after_kb=$((TOTAL_AFTER / 1024))
total_savings=$(( (TOTAL_BEFORE - TOTAL_AFTER) * 100 / TOTAL_BEFORE ))
printf "  TOTAL: %d KB -> %d KB  (%d%% smaller)\n" "$total_before_kb" "$total_after_kb" "$total_savings"
echo ""
echo "Done. Remember to update HTML/CSS references from .png to .webp if not already done."
