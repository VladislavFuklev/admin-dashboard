'use client'
import React from 'react'

type Toast = { id: number; message: string }

type ToastContextShape = {
	toast: (message: string) => void
}

const ToastContext = React.createContext<ToastContextShape | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = React.useState<Toast[]>([])
	const idRef = React.useRef(1)

	const toast = React.useCallback((message: string) => {
		const id = idRef.current++
		setItems(prev => [...prev, { id, message }])
		setTimeout(() => {
			setItems(prev => prev.filter(t => t.id !== id))
		}, 2000)
	}, [])

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}
			<Toaster items={items} />
		</ToastContext.Provider>
	)
}

export function useToast() {
	const ctx = React.useContext(ToastContext)
	if (!ctx) throw new Error('useToast must be used within ToastProvider')
	return ctx
}

function Toaster({ items }: { items: Toast[] }) {
	return (
		<div className='fixed bottom-4 right-4 z-60 flex flex-col gap-2'>
			{items.map(t => (
				<div
					key={t.id}
					className='rounded-md border bg-background/90 backdrop-blur shadow-md px-3 py-2 text-sm'
				>
					{t.message}
				</div>
			))}
		</div>
	)
}
