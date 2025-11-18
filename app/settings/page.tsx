'use client'
import { useSettings } from '@/components/settings-provider'
import { useToast } from '@/components/toast'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
	units: z.enum(['C', 'F']),
	defaultCity: z.string().optional(),
})

type Values = z.infer<typeof schema>

const CITIES = ['Warsaw', 'Berlin', 'Vilnius', 'Kyiv', 'Tallinn']

export default function SettingsPage() {
	const { settings, setUnits, setDefaultCity } = useSettings()
	const router = useRouter()
	const { toast } = useToast()
	const form = useForm<Values>({
		resolver: zodResolver(schema),
		defaultValues: { units: settings.units, defaultCity: settings.defaultCity },
		values: { units: settings.units, defaultCity: settings.defaultCity },
	})

	const onSubmit = (values: Values) => {
		setUnits(values.units)
		setDefaultCity(values.defaultCity)
		toast('Сохранено')
		setTimeout(() => router.push('/'), 600)
	}

	return (
		<div className='max-w-xl mx-auto p-4 space-y-6'>
			<h1 className='text-2xl font-semibold'>Настройки</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<FormField
						control={form.control}
						name='units'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Единицы температуры</FormLabel>
								<FormControl>
									<select
										className='h-9 px-3 rounded-md border bg-background'
										{...field}
									>
										<option value='C'>Цельсий (°C)</option>
										<option value='F'>Фаренгейт (°F)</option>
									</select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='defaultCity'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Город по умолчанию</FormLabel>
								<FormControl>
									<select
										className='h-9 px-3 rounded-md border bg-background'
										{...field}
									>
										<option value=''>— не выбран —</option>
										{CITIES.map(c => (
											<option key={c} value={c}>
												{c}
											</option>
										))}
									</select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex gap-2'>
						<Button type='submit'>Сохранить</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}
