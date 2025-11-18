'use client'
import {
	City,
	Settings,
	Units,
	loadSettings,
	saveSettings,
} from '@/lib/settings'
import React from 'react'

type SettingsContextShape = {
	settings: Settings
	setUnits: (u: Units) => void
	setDefaultCity: (name?: string) => void
	setCurrentCity: (name?: string) => void
	addFavorite: (city: City) => void
	removeFavorite: (name: string) => void
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

	const setCurrentCity = React.useCallback((name?: string) => {
		setSettings(prev => {
			const next = { ...prev, currentCity: name }
			saveSettings(next)
			return next
		})
	}, [])

	const addFavorite = React.useCallback((city: City) => {
		setSettings(prev => {
			const list = prev.favorites ?? []
			const exists = list.some(c => c.name === city.name)
			const next = { ...prev, favorites: exists ? list : [...list, city] }
			saveSettings(next)
			return next
		})
	}, [])

	const removeFavorite = React.useCallback((name: string) => {
		setSettings(prev => {
			const list = prev.favorites ?? []
			const next = { ...prev, favorites: list.filter(c => c.name !== name) }
			saveSettings(next)
			return next
		})
	}, [])

	const value = React.useMemo(
		() => ({
			settings,
			setUnits,
			setDefaultCity,
			setCurrentCity,
			addFavorite,
			removeFavorite,
		}),
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
