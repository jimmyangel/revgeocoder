#!/usr/bin/env bash

echo "Using mapshaper at: $(which mapshaper)"
mapshaper -v

set -e

echo "Merging land and ocean…"

LAND="data/clean/land_clean.geojson"
OCEAN="data/clean/ocean_clean.geojson"
OUT="data/clean/merged.geojson"

mapshaper \
  -i "$LAND" "$OCEAN" combine-files \
  -rename-layers land,ocean \
  -merge-layers target=land,ocean name=merged-layers \
  -o "$OUT" target=merged-layers force

echo "Merged dataset written to $OUT"
