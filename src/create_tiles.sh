#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

INPUT="$SCRIPT_DIR/../data/clean/merged.geojson"
GRID="$SCRIPT_DIR/../data/clean/geohash_2.geojson"
OUTDIR="$SCRIPT_DIR/../public/regions"

mkdir -p "$OUTDIR"

CLEANED_WORLD="$SCRIPT_DIR/world_regions.cleaned.geojson"

echo "Preprocessing world_regions.geojson (remove provenance + fill internal slivers)..."

# 1. Remove provenance and fill internal slivers (safe: no new polygons created)
mapshaper \
  -i "$INPUT" \
  -each 'delete path, delete layer, delete layername, delete geometrytype, delete uniqueGeometryType' \
  -clean gap-fill-area=100km2 \
  -o format=geojson rfc7946 precision=0.000001 "$CLEANED_WORLD"

# 2. Tile using geohash-2 grid
HASHES=$(jq -r '.features[].properties.hash' "$GRID")

for HASH in $HASHES; do
  echo "Processing tile $HASH..."

  mapshaper \
    -i name=world "$CLEANED_WORLD" \
    -i name=grid "$GRID" \
    -target grid \
    -filter "hash === '$HASH'" \
    -target world \
    -clip grid \
    -o format=geojson rfc7946 target=world precision=0.000001 "$OUTDIR/$HASH.geojson"

  if [ ! -s "$OUTDIR/$HASH.geojson" ]; then
    rm "$OUTDIR/$HASH.geojson"
  fi
done

rm "$CLEANED_WORLD"

echo "Done (slivers removed, geometry preserved, tiles correct)."
