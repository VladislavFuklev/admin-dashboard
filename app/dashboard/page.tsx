import CitySwitcher from '@/components/city-switcher'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../lib/auth'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
	const session = await getServerSession(authOptions)
	if (!session) redirect('/signin')
	return (
		<div className='space-y-4'>
			<div className='flex justify-end'>
				<CitySwitcher />
			</div>
			<DashboardClient />
		</div>
	)
}
