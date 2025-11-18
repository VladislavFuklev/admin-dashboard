'use client'
import { searchCities } from '@/lib/client/geocoding'
import React from 'react'
import { useSettings } from './settings-provider'

export default function CitySwitcher() {
	const { setCurrentCity, addFavorite } = useSettings()
	const [q, setQ] = React.useState('')
	const [loading, setLoading] = React.useState(false)
	const [results, setResults] = React.useState<
		Array<{
			name: string
			lat: number
			lon: number
			tz?: string
			subtitle?: string
		}>
	>([])
	const debounced = useDebounce(q, 250)

	React.useEffect(() => {
		let aborted = false
		async function run() {
			if (!debounced.trim()) {
				setResults([])
				return
			}
			setLoading(true)
			try {
				const list = await searchCities(debounced, 6, 'en')
				if (aborted) return
				setResults(
					list.map(r => ({
						name: r.name,
						lat: r.latitude,
						lon: r.longitude,
						tz: r.timezone,
						subtitle: r.country,
					}))
				)
			} finally {
				if (!aborted) setLoading(false)
			}
		}
		run()
		return () => {
			aborted = true
		}
	}, [debounced])

	const onPick = (item: {
		name: string
		lat: number
		lon: number
		tz?: string
	}) => {
		addFavorite({ name: item.name, lat: item.lat, lon: item.lon, tz: item.tz })
		setCurrentCity(item.name)
	}

	return (
		<div className='flex items-center gap-2'>
			<div className='relative'>
				<input
					value={q}
					onChange={e => setQ(e.target.value)}
					placeholder='Поиск города (English)'
					className='h-9 w-56 rounded-md border bg-background px-3 text-sm'
				/>
				{q && (
					<div className='absolute left-0 right-0 mt-1 max-h-64 overflow-auto rounded-md border bg-popover p-1 shadow-md'>
						{loading && (
							<div className='px-2 py-1 text-sm text-muted-foreground'>
								Загрузка…
							</div>
						)}
						{!loading && results.length === 0 && (
							<div className='px-2 py-1 text-sm text-muted-foreground'>
								Ничего не найдено
							</div>
						)}
						{results.map(item => (
							<button
								key={`${item.name}-${item.lat}-${item.lon}`}
								onClick={() => {
									onPick(item)
									setQ('')
									setResults([])
								}}
								className='w-full text-left px-2 py-1.5 rounded hover:bg-accent'
							>
								<div className='text-sm'>{item.name}</div>
								{item.subtitle && (
									<div className='text-xs text-muted-foreground'>
										{item.subtitle}
									</div>
								)}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

function useDebounce<T>(value: T, delay = 200): T {
	const [v, setV] = React.useState(value)
	React.useEffect(() => {
		const id = setTimeout(() => setV(value), delay)
		return () => clearTimeout(id)
	}, [value, delay])
	return v
}
