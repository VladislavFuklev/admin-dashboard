import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const lat = parseFloat(searchParams.get('lat') || '52.2297') // Warsaw
	const lon = parseFloat(searchParams.get('lon') || '21.0122')
	const pastDays = Number(searchParams.get('pastDays') || 6)
	const forecastDays = Number(searchParams.get('forecastDays') || 1)
	const timezone = searchParams.get('timezone') || 'Europe/Warsaw'

	const url = new URL('https://api.open-meteo.com/v1/forecast')
	url.searchParams.set('latitude', String(lat))
	url.searchParams.set('longitude', String(lon))
	url.searchParams.set(
		'hourly',
		[
			'temperature_2m',
			'wind_speed_10m',
			'relative_humidity_2m',
			'precipitation',
		].join(',')
	)
	url.searchParams.set('past_days', String(pastDays))
	url.searchParams.set('forecast_days', String(forecastDays))
	url.searchParams.set('timezone', timezone)

	const res = await fetch(url.toString(), { next: { revalidate: 300 } })
	if (!res.ok) {
		return Response.json({ error: 'Failed to fetch weather' }, { status: 502 })
	}
	const json = (await res.json()) as {
		hourly?: {
			time: string[]
			temperature_2m?: number[]
			wind_speed_10m?: number[]
			relative_humidity_2m?: number[]
			precipitation?: number[]
		}
	}

	const times = json.hourly?.time ?? []
	const temp = json.hourly?.temperature_2m ?? []
	const wind = json.hourly?.wind_speed_10m ?? []
	const humidity = json.hourly?.relative_humidity_2m ?? []
	const precip = json.hourly?.precipitation ?? []

	const data = times.map((t, i) => ({
		time: t,
		temperature: temp[i],
		wind: wind[i],
		humidity: humidity[i],
		precipitation: precip[i],
	}))

	return Response.json({ data })
}
