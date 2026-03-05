import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import ngeohash from 'ngeohash'

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'
const features = []

for (const a of BASE32) {
  for (const b of BASE32) {
    const hash = a + b

    // ngeohash.decode_bbox returns [minLat, minLon, maxLat, maxLon]
    const [minLat, minLon, maxLat, maxLon] = ngeohash.decode_bbox(hash)

    const poly = {
      type: 'Feature',
      properties: { hash },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [minLon, minLat],
          [minLon, maxLat],
          [maxLon, maxLat],
          [maxLon, minLat],
          [minLon, minLat]
        ]]
      }
    }

    features.push(poly)
  }
}

const geojson = {
  type: 'FeatureCollection',
  features
}

const outputPath = path.join(__dirname, '../data/clean/geohash_2.geojson')
fs.writeFileSync(outputPath, JSON.stringify(geojson))

console.log('Generated geohash_2.geojson at', outputPath)
