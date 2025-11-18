export type Units = 'C' | 'F'

export type City = { name: string; lat: number; lon: number; tz?: string }

export type Settings = {
	units: Units
	defaultCity?: string
	currentCity?: string
	favorites?: City[]
}

const KEY = 'app-settings-v2'

export function loadSettings(): Settings {
	if (typeof window === 'undefined') return { units: 'C' }
	try {
		const rawV2 = localStorage.getItem(KEY)
		if (rawV2) {
			const parsed = JSON.parse(rawV2) as Partial<Settings>
			return {
				units: parsed.units ?? 'C',
				defaultCity: parsed.defaultCity,
				currentCity: parsed.currentCity ?? parsed.defaultCity,
				favorites: parsed.favorites ?? [],
			}
		}
		// migrate from v1
		const rawV1 = localStorage.getItem('app-settings-v1')
		if (rawV1) {
			const prev = JSON.parse(rawV1) as { units?: Units; defaultCity?: string }
			const migrated: Settings = {
				units: prev.units ?? 'C',
				defaultCity: prev.defaultCity,
				currentCity: prev.defaultCity,
				favorites: [],
			}
			saveSettings(migrated)
			return migrated
		}
		return { units: 'C', favorites: [] }
	} catch {
		return { units: 'C', favorites: [] }
	}
}

export function saveSettings(s: Settings) {
	if (typeof window === 'undefined') return
	localStorage.setItem(KEY, JSON.stringify(s))
}

export function toDisplayTemp(valueC: number, units: Units) {
	return units === 'C' ? valueC : (valueC * 9) / 5 + 32
}

export function formatTemp(valueC: number, units: Units) {
	const v = toDisplayTemp(valueC, units)
	const num = Number.isFinite(v) ? v : 0
	return `${num.toFixed(1)}°${units}`
}
