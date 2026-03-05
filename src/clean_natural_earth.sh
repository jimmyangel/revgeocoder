#!/usr/bin/env bash
set -e

echo "Cleaning Natural Earth datasets…"

LAND_SRC="data/natural_earth/ne_10m_admin_1_states_provinces.json"
OCEAN_SRC="data/natural_earth/ne_10m_geography_marine_polys.json"

OUT_DIR="data/clean"
mkdir -p "$OUT_DIR"

LAND_OUT="$OUT_DIR/land_clean.geojson"
OCEAN_OUT="$OUT_DIR/ocean_clean.geojson"

echo "Processing land polygons…"
mapshaper \
  "$LAND_SRC" \
  -filter-fields admin,name \
  -each 'country = admin; region = name; type = "land"' \
  -filter-fields country,region,type \
  -o "$LAND_OUT"

echo "Processing ocean polygons…"
mapshaper \
  "$OCEAN_SRC" \
  -filter-fields name \
  -each 'country = "Ocean"; region = name; type = "ocean"' \
  -filter-fields country,region,type \
  -o "$OCEAN_OUT"

echo "Done. Clean datasets written to $OUT_DIR"
