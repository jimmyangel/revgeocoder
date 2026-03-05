const fs = require('fs')
const geohash = require('ngeohash')

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'
const features = []

for (const a of BASE32) {
  for (const b of BASE32) {
    const hash = a + b
    const [minLat, minLon, maxLat, maxLon] = geohash.decode_bbox(hash)

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

fs.writeFileSync('geohash_2.geojson', JSON.stringify(geojson))
console.log('Generated geohash_2.geojson')
