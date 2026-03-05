import fs from 'node:fs/promises'
import path from 'node:path'

const tileCache = new Map()

// Absolute path to the tile directory
const TILE_DIR = path.join(process.cwd(), 'public', 'regions')

export async function loadTile(hash) {
  if (tileCache.has(hash)) return tileCache.get(hash)

  const file = path.join(TILE_DIR, `${hash}.geojson`)

  let raw
  try {
    raw = await fs.readFile(file, 'utf8')
  } catch (err) {
    // Tile doesn't exist → return empty FeatureCollection
    const empty = { type: 'FeatureCollection', features: [] }
    tileCache.set(hash, empty)
    return empty
  }

  const json = JSON.parse(raw)

  // Normalize empty GeometryCollection tiles
  if (json.type === 'GeometryCollection') {
    const empty = { type: 'FeatureCollection', features: [] }
    tileCache.set(hash, empty)
    return empty
  }

  // Precompute bboxes for each feature
  for (const f of json.features) {
    f.bbox = computeFeatureBbox(f.geometry)
  }

  tileCache.set(hash, json)
  return json
}

function computeFeatureBbox(geom) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

  const processRing = ring => {
    for (const [x, y] of ring) {
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }

  if (geom.type === 'Polygon') {
    for (const ring of geom.coordinates) processRing(ring)
  } else if (geom.type === 'MultiPolygon') {
    for (const poly of geom.coordinates) {
      for (const ring of poly) processRing(ring)
    }
  }

  return [minX, minY, maxX, maxY]
}
