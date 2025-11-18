'use client'
import { useSettings } from '@/components/settings-provider'
import { City, formatTemp } from '@/lib/settings'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../../components/ui/card'
import { getWeather, WeatherPoint } from '../../lib/client/weather'

const CITIES: City[] = [
	{ name: 'Warsaw', lat: 52.2297, lon: 21.0122, tz: 'Europe/Warsaw' },
	{ name: 'Berlin', lat: 52.52, lon: 13.405, tz: 'Europe/Berlin' },
	{ name: 'Vilnius', lat: 54.6872, lon: 25.2797, tz: 'Europe/Vilnius' },
	{ name: 'Kyiv', lat: 50.4501, lon: 30.5234, tz: 'Europe/Kyiv' },
	{ name: 'Tallinn', lat: 59.437, lon: 24.7536, tz: 'Europe/Tallinn' },
]

export default function DashboardClient() {
	const { settings } = useSettings()

	const [city, setCity] = React.useState<City>(CITIES[3])

	React.useEffect(() => {
		const all: City[] = [...CITIES, ...(settings.favorites ?? [])]
		const target = settings.currentCity || settings.defaultCity
		const next = all.find(c => c.name === target)
		if (next) setCity(next)
	}, [settings.currentCity, settings.defaultCity, settings.favorites])

	const weatherQuery = useQuery({
		queryKey: [
			'weather',
			{ lat: city.lat, lon: city.lon, tz: city.tz, days: 7 },
		],
		queryFn: () =>
			getWeather({
				lat: city.lat,
				lon: city.lon,
				pastDays: 6,
				forecastDays: 1,
				timezone: city.tz,
			}),
		staleTime: 60_000,
	})

	const series = weatherQuery.data?.data ?? []
	const last = series.at(-1)?.temperature
	const last24 = series.slice(-24).map(p => p.temperature ?? 0)
	const min24 = last24.length ? Math.min(...last24) : undefined
	const max24 = last24.length ? Math.max(...last24) : undefined
	const avg7d = series.length
		? series.reduce((a, b) => a + (b.temperature ?? 0), 0) / series.length
		: undefined
	const delta24 =
		series.length > 24 &&
		last !== undefined &&
		series.at(-25)?.temperature !== undefined
			? last - (series.at(-25)!.temperature as number)
			: undefined

	type Metric = 'temperature' | 'wind' | 'humidity' | 'precipitation'
	const [metric, setMetric] = React.useState<Metric>('temperature')

	return (
		<div className='space-y-8'>
			<div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardHeader>
						<CardTitle>Сейчас</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-2xl font-semibold'>
							{last === undefined ? '—' : formatTemp(last, settings.units)}
						</p>
						{delta24 !== undefined && (
							<p
								className={`text-sm ${
									delta24 >= 0 ? 'text-emerald-600' : 'text-rose-600'
								}`}
							>
								{delta24 >= 0 ? '▲' : '▼'}{' '}
								{formatTemp(Math.abs(delta24), settings.units)} за 24ч
							</p>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Мин/Макс 24ч</CardTitle>
					</CardHeader>
					<CardContent className='flex items-baseline gap-2'>
						<span className='text-lg'>
							{min24 === undefined ? '—' : formatTemp(min24, settings.units)}
						</span>
						<span className='text-muted-foreground'>/</span>
						<span className='text-lg'>
							{max24 === undefined ? '—' : formatTemp(max24, settings.units)}
						</span>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Средняя 7д</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-2xl font-semibold'>
							{avg7d === undefined ? '—' : formatTemp(avg7d, settings.units)}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Город</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-2xl font-semibold'>{city.name}</p>
						<p className='text-sm text-muted-foreground'>
							{settings.defaultCity ? 'по умолчанию' : 'выбран вручную'}
						</p>
					</CardContent>
				</Card>
			</div>

			<div className='grid gap-4 sm:grid-cols-1'>
				<Card>
					<CardHeader>
						<div className='flex items-center justify-between gap-3'>
							<div className='flex items-center gap-3'>
								<CardTitle>
									{metric === 'temperature' && 'Температура'}
									{metric === 'wind' && 'Ветер'}
									{metric === 'humidity' && 'Влажность'}
									{metric === 'precipitation' && 'Осадки'}
									{' — '}
									{city.name} (последние 7 дней)
								</CardTitle>
								<div className='hidden sm:flex items-center gap-1'>
									{(
										[
											'temperature',
											'wind',
											'humidity',
											'precipitation',
										] as const
									).map(m => (
										<button
											key={m}
											onClick={() => setMetric(m)}
											className={`h-8 px-3 rounded-md border text-sm ${
												metric === m ? 'bg-accent' : 'bg-background'
											}`}
										>
											{m === 'temperature'
												? 'Температура'
												: m === 'wind'
												? 'Ветер'
												: m === 'humidity'
												? 'Влажность'
												: 'Осадки'}
										</button>
									))}
								</div>
							</div>
							<select
								className='h-9 px-2 rounded-md border bg-background'
								value={city.name}
								onChange={e => {
									const next =
										CITIES.find(c => c.name === e.target.value) || CITIES[0]
									setCity(next)
								}}
							>
								{CITIES.map(c => (
									<option key={c.name} value={c.name}>
										{c.name}
									</option>
								))}
								{(settings.favorites ?? []).map(c => (
									<option key={`fav-${c.name}`} value={c.name}>
										{c.name}
									</option>
								))}
							</select>
						</div>
					</CardHeader>
					<CardContent className='h-72'>
						{weatherQuery.isLoading ? (
							<p className='text-sm text-muted-foreground'>Загрузка графика…</p>
						) : weatherQuery.isError ? (
							<p className='text-sm text-destructive'>
								Не удалось загрузить данные
							</p>
						) : (
							<ResponsiveContainer width='100%' height='100%'>
								<AreaChart
									data={(weatherQuery.data?.data as WeatherPoint[]) ?? []}
									margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
								>
									<defs>
										<linearGradient id='temp' x1='0' y1='0' x2='0' y2='1'>
											<stop offset='5%' stopColor='#ef4444' stopOpacity={0.4} />
											<stop offset='95%' stopColor='#ef4444' stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid
										strokeDasharray='3 3'
										className='text-muted-foreground/20'
									/>
									<XAxis dataKey='time' hide tick={{ fontSize: 12 }} />
									<YAxis
										tick={{ fontSize: 12 }}
										width={40}
										tickFormatter={(v: number) => {
											if (metric === 'temperature') {
												const dv = settings.units === 'C' ? v : (v * 9) / 5 + 32
												return dv.toFixed(0)
											}
											if (metric === 'humidity') return `${v.toFixed(0)}`
											return v.toFixed(0)
										}}
										domain={['auto', 'auto']}
									/>
									<Tooltip
										formatter={(v: unknown) => {
											const val = Number(v as number)
											if (metric === 'temperature') {
												const c =
													settings.units === 'C' ? val : (val * 9) / 5 + 32
												return [
													`${c.toFixed(1)}°${settings.units}`,
													'Температура',
												]
											}
											if (metric === 'wind')
												return [`${val.toFixed(1)} м/с`, 'Ветер']
											if (metric === 'humidity')
												return [`${val.toFixed(0)}%`, 'Влажность']
											return [`${val.toFixed(1)} мм`, 'Осадки']
										}}
										labelFormatter={() => ''}
									/>
									<Area
										type='monotone'
										dataKey={(d: {
											[k in
												| 'temperature'
												| 'wind'
												| 'humidity'
												| 'precipitation']?: number
										}) => d[metric] as number}
										stroke={
											metric === 'temperature'
												? '#ef4444'
												: metric === 'wind'
												? '#3b82f6'
												: metric === 'humidity'
												? '#10b981'
												: '#8b5cf6'
										}
										fill='url(#temp)'
										strokeWidth={2}
									/>
								</AreaChart>
							</ResponsiveContainer>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
