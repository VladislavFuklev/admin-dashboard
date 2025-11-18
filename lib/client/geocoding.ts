export type GeoResult = {
	id: number
	name: string
	latitude: number
	longitude: number
	timezone?: string
	country?: string
}

export async function searchCities(name: string, count = 5, language = 'en') {
	const sp = new URLSearchParams({
		name,
		count: String(count),
		language,
		format: 'json',
	})
	const res = await fetch(
		`https://geocoding-api.open-meteo.com/v1/search?${sp.toString()}`
	)
	if (!res.ok) throw new Error('Failed to search cities')
	const json = (await res.json()) as { results?: GeoResult[] }
	return json.results ?? []
}

export async function reverseGeocode(
	lat: number,
	lon: number,
	language = 'en'
) {
	const sp = new URLSearchParams({
		latitude: String(lat),
		longitude: String(lon),
		language,
		format: 'json',
	})
	const res = await fetch(
		`https://geocoding-api.open-meteo.com/v1/reverse?${sp.toString()}`
	)
	if (!res.ok) throw new Error('Failed to reverse geocode')
	const json = (await res.json()) as { results?: GeoResult[] }
	return (json.results ?? [])[0]
}
