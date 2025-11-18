'use client'
import { Settings, Units, loadSettings, saveSettings } from '@/lib/settings'
import React from 'react'

type SettingsContextShape = {
	settings: Settings
	setUnits: (u: Units) => void
	setDefaultCity: (name?: string) => void
}

const SettingsContext = React.createContext<SettingsContextShape | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = React.useState<Settings>({ units: 'C' })

	React.useEffect(() => {
		setSettings(loadSettings())
	}, [])

	const setUnits = React.useCallback((u: Units) => {
		setSettings(prev => {
			const next = { ...prev, units: u }
			saveSettings(next)
			return next
		})
	}, [])

	const setDefaultCity = React.useCallback((name?: string) => {
		setSettings(prev => {
			const next = { ...prev, defaultCity: name }
			saveSettings(next)
			return next
		})
	}, [])

	const value = React.useMemo(
		() => ({ settings, setUnits, setDefaultCity }),
		[settings, setUnits, setDefaultCity]
	)

	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	)
}

export function useSettings() {
	const ctx = React.useContext(SettingsContext)
	if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
	return ctx
}
