import { reverseGeocode } from './reverseGeocode.js'
import { performance } from 'node:perf_hooks'

const tests = [
	{ lat: 45.523, lon: -122.676, label: 'Portland' },
	{ lat: 37.7749, lon: -122.4194, label: 'San Francisco' },
	{ lat: 34.0522, lon: -118.2437, label: 'Los Angeles' },
	{ lat: 40.7128, lon: -74.0060, label: 'New York' },
	{ lat: 41.8781, lon: -87.6298, label: 'Chicago' },
	{ lat: 29.7604, lon: -95.3698, label: 'Houston' },

	{ lat: 48.8566, lon: 2.3522, label: 'Paris' },
	{ lat: 51.5074, lon: -0.1278, label: 'London' },
	{ lat: 52.52, lon: 13.405, label: 'Berlin' },
	{ lat: 41.9028, lon: 12.4964, label: 'Rome' },
	{ lat: 40.4168, lon: -3.7038, label: 'Madrid' },

	{ lat: 35.6895, lon: 139.6917, label: 'Tokyo' },
	{ lat: 31.2304, lon: 121.4737, label: 'Shanghai' },
	{ lat: 28.6139, lon: 77.2090, label: 'New Delhi' },
	{ lat: -33.8688, lon: 151.2093, label: 'Sydney' },
	{ lat: -37.8136, lon: 144.9631, label: 'Melbourne' },

	{ lat: -23.5505, lon: -46.6333, label: 'São Paulo' },
	{ lat: -34.6037, lon: -58.3816, label: 'Buenos Aires' },
	{ lat: -22.9068, lon: -43.1729, label: 'Rio de Janeiro' },

	{ lat: 21.3069, lon: -157.8583, label: 'Honolulu' },
	{ lat: 64.1265, lon: -21.8174, label: 'Reykjavik' },
	{ lat: 35.8964, lon: 14.4477, label: 'Malta' },
	{ lat: 1.3521, lon: 103.8198, label: 'Singapore' },
	{ lat: 13.4443, lon: 144.7937, label: 'Guam' },
	{ lat: -17.7134, lon: 178.0650, label: 'Fiji' },
	{ lat: -20.3484, lon: 57.5522, label: 'Mauritius' },

	{ lat: 49.0000, lon: -122.7570, label: 'US–Canada border' },
	{ lat: 32.5449, lon: -117.0293, label: 'US–Mexico border' },
	{ lat: 46.1512, lon: 14.9955, label: 'Slovenia–Croatia border' },
	{ lat: 50.1109, lon: 8.6821, label: 'Frankfurt' },
	{ lat: 47.4979, lon: 19.0402, label: 'Budapest' },
	{ lat: 55.9533, lon: -3.1883, label: 'Edinburgh' },

	{ lat: 0, lon: -160, label: 'Pacific Ocean' },
	{ lat: 10, lon: -30, label: 'Mid-Atlantic Ocean' },
	{ lat: -40, lon: 20, label: 'South Atlantic Ocean' },
	{ lat: 15, lon: 90, label: 'Bay of Bengal' },
	{ lat: -30, lon: 100, label: 'Indian Ocean' },

	{ lat: 25.276987, lon: 55.296249, label: 'Dubai' },
	{ lat: 24.7136, lon: 46.6753, label: 'Riyadh' },
	{ lat: 15.5007, lon: 32.5599, label: 'Khartoum' },
	{ lat: 9.0820, lon: 8.6753, label: 'Nigeria (central)' },
	{ lat: -25.7461, lon: 28.1881, label: 'Pretoria' },

	{ lat: 0, lon: 0, label: 'Null Island' },
	{ lat: 89.9, lon: 0, label: 'Near North Pole' },
	{ lat: -89.9, lon: 0, label: 'Near South Pole' },
	{ lat: 0.0001, lon: 179.9999, label: 'IDL east' },
	{ lat: 0.0001, lon: -179.9999, label: 'IDL west' },

	// New Zealand
	{ lat: -36.8485, lon: 174.7633, label: 'Auckland' },
	{ lat: -41.2865, lon: 174.7762, label: 'Wellington' },
	{ lat: -43.5321, lon: 172.6362, label: 'Christchurch' },
	{ lat: -45.8788, lon: 170.5028, label: 'Dunedin' },
	{ lat: -39.0556, lon: 174.0752, label: 'New Plymouth' },
	{ lat: -38.6857, lon: 176.0702, label: 'Rotorua' },
	{ lat: -46.4132, lon: 168.3538, label: 'Invercargill' },
	{ lat: -36.8410, lon: 175.7900, label: 'Coromandel Peninsula' },
	{ lat: -34.4263, lon: 172.6800, label: 'Northland (Far North)' },
	{ lat: -40.9006, lon: 174.8860, label: 'Cook Strait (ocean)' },

	// South Korea
	{ lat: 37.5665, lon: 126.9780, label: 'Seoul' },
	{ lat: 35.1796, lon: 129.0756, label: 'Busan' },
	{ lat: 35.9078, lon: 127.7669, label: 'South Korea (central)' },
	{ lat: 35.1595, lon: 126.8526, label: 'Gwangju' },
	{ lat: 36.3504, lon: 127.3845, label: 'Daejeon' },
	{ lat: 33.4996, lon: 126.5312, label: 'Jeju City' },
	{ lat: 37.4563, lon: 126.7052, label: 'Incheon' },
	{ lat: 38.2030, lon: 128.5910, label: 'Gangwon coast' },
	{ lat: 34.9500, lon: 128.2500, label: 'South coast islands' },

	// Balkans
	{ lat: 45.8150, lon: 15.9819, label: 'Zagreb' },
	{ lat: 44.7866, lon: 20.4489, label: 'Belgrade' },
	{ lat: 43.8563, lon: 18.4131, label: 'Sarajevo' },
	{ lat: 42.6977, lon: 23.3219, label: 'Sofia' },
	{ lat: 41.9981, lon: 21.4254, label: 'Skopje' },
	{ lat: 42.4410, lon: 19.2636, label: 'Podgorica' },
	{ lat: 41.3275, lon: 19.8187, label: 'Tirana' },
	{ lat: 45.3271, lon: 14.4422, label: 'Rijeka' },
	{ lat: 43.5081, lon: 16.4402, label: 'Split' },
	{ lat: 42.6507, lon: 18.0944, label: 'Dubrovnik' },
	{ lat: 42.6629, lon: 21.1655, label: 'Pristina' },
	{ lat: 44.1194, lon: 15.2314, label: 'Zadar' },
	{ lat: 44.0165, lon: 21.0059, label: 'Central Serbia' },
	{ lat: 43.3438, lon: 17.8078, label: 'Mostar' },
	{ lat: 41.1125, lon: 20.8016, label: 'Ohrid' },
	// Hawaii
	{ lat: 21.3069, lon: -157.8583, label: 'Honolulu (Oahu)' },
	{ lat: 19.7297, lon: -155.0900, label: 'Hilo (Big Island)' },
	{ lat: 20.8893, lon: -156.4729, label: 'Kahului (Maui)' },
	{ lat: 21.9811, lon: -159.3711, label: 'Lihue (Kauai)' },

	// Malta
	{ lat: 35.8989, lon: 14.5146, label: 'Valletta (Malta)' },
	{ lat: 35.8850, lon: 14.4033, label: 'Mdina (Malta)' },
	{ lat: 36.0444, lon: 14.2397, label: 'Victoria (Gozo)' },

	// Iceland
	{ lat: 64.1466, lon: -21.9426, label: 'Reykjavik (Iceland)' },
	{ lat: 65.6885, lon: -18.1262, label: 'Akureyri (Iceland)' },

	// Japan islands
	{ lat: 26.2124, lon: 127.6809, label: 'Naha (Okinawa)' },
	{ lat: 43.0618, lon: 141.3545, label: 'Sapporo (Hokkaido)' },

	// Philippines
	{ lat: 14.5995, lon: 120.9842, label: 'Manila (Luzon)' },
	{ lat: 10.3157, lon: 123.8854, label: 'Cebu City (Cebu)' },
	{ lat: 7.1907, lon: 125.4553, label: 'Davao City (Mindanao)' },

	// Indonesia
	{ lat: -8.6500, lon: 115.2167, label: 'Denpasar (Bali)' },
	{ lat: -3.6547, lon: 128.1900, label: 'Ambon (Maluku)' },

	// Fiji
	{ lat: -18.1248, lon: 178.4501, label: 'Suva (Fiji)' },

	// Mauritius
	{ lat: -20.1609, lon: 57.5012, label: 'Port Louis (Mauritius)' },

	// Seychelles
	{ lat: -4.6191, lon: 55.4513, label: 'Victoria (Seychelles)' },

	// Cape Verde
	{ lat: 14.9331, lon: -23.5133, label: 'Praia (Cape Verde)' },

	// Azores
	{ lat: 37.7412, lon: -25.6756, label: 'Ponta Delgada (Azores)' },

	// Canary Islands
	{ lat: 28.1235, lon: -15.4363, label: 'Las Palmas (Canary Islands)' },

	// New Zealand offshore
	{ lat: -46.8990, lon: 168.1000, label: 'Oban (Stewart Island)' }

]

async function run() {
	for (const t of tests) {
		const t0 = performance.now()
		const result = await reverseGeocode(t.lat, t.lon)
		const t1 = performance.now()

	console.log({
		label: t.label,
		result,
		ms: (t1 - t0).toFixed(3)
	})
	}

	// Stress test: 10k lookups in the same tile
	const lat = 45.523, lon = -122.676
	const N = 10000
	const t0 = performance.now()
	for (let i = 0; i < N; i++) {
		await reverseGeocode(lat, lon)
	}
	const t1 = performance.now()

	console.log(`10k cached lookups: ${(t1 - t0).toFixed(2)} ms`)
}

run()
