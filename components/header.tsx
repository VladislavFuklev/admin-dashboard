'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import ModeToggle from './mode-toggle'
import { Button } from './ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default function Header() {
	const { status } = useSession()
	return (
		<header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60'>
			<div className='mx-auto max-w-7xl px-4 py-3 flex items-center justify-between'>
				<Link
					href='/'
					aria-label='Главная'
					className='w-10 h-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold'
				>
					VF
				</Link>
				<div className='flex items-center gap-3'>
					<ModeToggle />
					{status === 'authenticated' ? <UserMenu /> : null}
				</div>
			</div>
		</header>
	)
}

function UserMenu() {
	const { data } = useSession()
	const email = data?.user?.email ?? ''
	const initials = (email?.[0] || 'U').toUpperCase()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='icon' aria-label='Открыть профиль'>
					<div className='size-6 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-white grid place-items-center text-xs font-semibold'>
						{initials}
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuLabel>{email || 'Профиль'}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href='/settings'>Настройки</Link>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => signOut({ callbackUrl: '/signin' })}>
					Выйти
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
