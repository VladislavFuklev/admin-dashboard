export type Units = 'C' | 'F'

export type Settings = {
	units: Units
	defaultCity?: string
}

const KEY = 'app-settings-v1'

export function loadSettings(): Settings {
	if (typeof window === 'undefined') return { units: 'C' }
	try {
		const raw = localStorage.getItem(KEY)
		if (!raw) return { units: 'C' }
		const parsed = JSON.parse(raw) as Partial<Settings>
		return { units: parsed.units ?? 'C', defaultCity: parsed.defaultCity }
	} catch {
		return { units: 'C' }
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
