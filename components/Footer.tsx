export default function Footer() {
	return (
		<footer className='border-t border-slate-200 mt-8'>
			<div className='max-w-6xl mx-auto p-6 md:px-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500'>
				<p>
					© {new Date().getFullYear()} Владислав Фуклев — Frontend Developer
				</p>
			</div>
		</footer>
	)
}
