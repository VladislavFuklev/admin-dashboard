export type WeatherPoint = {
	time: string
	temperature?: number
	wind?: number
	humidity?: number
	precipitation?: number
}
export type WeatherResponse = { data: WeatherPoint[] }

export async function getWeather(params: {
	lat: number
	lon: number
	pastDays?: number
	forecastDays?: number
	timezone?: string
}): Promise<WeatherResponse> {
	const {
		lat,
		lon,
		pastDays = 6,
		forecastDays = 1,
		timezone = 'Europe/Warsaw',
	} = params
	const sp = new URLSearchParams({
		lat: String(lat),
		lon: String(lon),
		pastDays: String(pastDays),
		forecastDays: String(forecastDays),
		timezone,
	})
	const res = await fetch(`/api/weather?${sp.toString()}`)
	if (!res.ok) throw new Error('Failed to load weather')
	return res.json()
}
