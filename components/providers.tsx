'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { SettingsProvider } from './settings-provider'
import { ThemeProvider } from './theme-provider'
import { ToastProvider } from './toast'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60_000,
			refetchOnWindowFocus: false,
		},
	},
})

export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider>
					<SettingsProvider>
						<ToastProvider>{children}</ToastProvider>
					</SettingsProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</SessionProvider>
	)
}
