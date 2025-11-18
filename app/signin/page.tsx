'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../components/ui/form'
import { Input } from '../../components/ui/input'

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(4),
})

type Values = z.infer<typeof schema>

export default function SignInPage() {
	const router = useRouter()
	const [error, setError] = useState<string | null>(null)
	const form = useForm<Values>({
		resolver: zodResolver(schema),
		defaultValues: { email: '', password: '' },
	})

	const onSubmit = async (values: Values) => {
		setError(null)
		const res = await signIn('credentials', {
			email: values.email,
			password: values.password,
			redirect: false,
		})
		if (res?.error) {
			setError('Неверные учетные данные')
		} else if (res?.ok) {
			router.push('/dashboard')
		}
	}

	return (
		<div className='max-w-sm mx-auto mt-24'>
			<h1 className='text-2xl font-semibold mb-6'>Вход</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type='email' placeholder='email' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Пароль</FormLabel>
								<FormControl>
									<Input type='password' placeholder='пароль' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{error && <p className='text-sm text-red-600'>{error}</p>}
					<Button
						type='submit'
						className='w-full'
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting ? 'Входим...' : 'Войти'}
					</Button>
				</form>
			</Form>
			<p className='text-xs text-muted-foreground mt-4'>
				Email из https://reqres.in/api/users(если нет доступа то charles.morris@reqres.in) Пароль: "cityslicka" (login)
				или "pistol" (register). Оба допустимы.
			</p>
		</div>
	)
}
