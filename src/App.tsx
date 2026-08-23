import '@/App.css';
import DropDown from './ui/Dropdown';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useState } from 'react';
import { format } from 'date-fns';

function App() {
	const [range, setRange] = useState<DateRange | undefined>();
	console.log({ range });
	const { from = '', to = '' } = range || {};
	const formatStyle = "do 'of' MMMM, yyyy";
	return (
		<>
			<header className='header_ fixed inset-0 bg-black py-2 flex md:flex-row flex-col md:h-[56px] h-20 items-center z-500 s'>
				<div className='flex justify-between relative z-200 bg-black  page__pad'>
					<h1 className=' text-logo'>ClusterixNews</h1>
				</div>

				<div className=' relative  w-full bg-transparent '>
					<div className='marquee-scroll marque text-white inline-flex gap-7 items-center space-x-5   h-full absolute 	md:top-0  top-[14px] whitespace-nowrap'>
						<span>LIVE FROM BBC </span> <span>LIVE FROM BBC</span>
						<span>LIVE FROM BBC</span>
					</div>
				</div>
			</header>
			<main className='md:pt-14 pt-20'>
				<div className='flex lg:flex-nowrap flex-wrap items-center gap-4 mt-10 page__pad  '>
					<section className='flex gap-5 items-center lg:justify-start justify-between lg:w-auto w-full'>
						<DropDown
							triggerComp={
								<div className='flex border-slim border-primary-text rounded-3xl px-4 py-1.5 gap-2.5 items-center'>
									<span className='text-xs text-primary-text'>CATEGORY</span>
									<span className='text-sm text-brand subpixel-antialiased'>
										{' '}
										Tech
									</span>
								</div>
							}
						>
							<div>50000</div>
						</DropDown>
						<div className='h-5 border-l-2 border-l-grey hidden lg:block'></div>
						<div className='flex gap-2'>
							<button className='rounded-3xl border-slim border-primary-text px-2.5 h-8 inline-flex items-center text-sm text-primary-text cursor-pointer'>
								Reuters
							</button>
							<button className='rounded-3xl border-slim px-2.5 h-8 inline-flex items-center text-sm  cursor-pointer text-white bg-brand border-transparent '>
								BBC
							</button>
						</div>
					</section>

					<DropDown
						className='mx-auto lg:w-auto w-full'
						triggerComp={
							<input
								type='text'
								className='w-95 text-brand  '
								placeholder='Filter by date..'
								value={
									from
										? `${format(from, formatStyle)} - ${format(to, formatStyle)}`
										: ``
								}
							/>
						}
					>
						<DayPicker
							className='absolute pl-2.5'
							classNames={{
								day_button: 'focus:outline-none focus-visible:outline-none ',
								range_middle: 'text-blue-600',
								range_start:
									'bg-blue-600 rounded-full border-none [&>button]:text-white ',
								range_end: 'bg-blue-600 rounded-full [&>button]:text-white ',
								day: 'h-9 w-9 text-center text-lato',
							}}
							mode='range'
							selected={range}
							onSelect={setRange}
							numberOfMonths={2} // 👈 Renders two calendars side-by-side
							pagedNavigation // 👈 Forces next/prev buttons to flip exactly 2 months at a time
						/>
					</DropDown>
					<div className=' lg:ml-auto ml-0'>
						<input
							type='text'
							className='rounded-3xl  min-w-60'
							placeholder='Search headlines...'
						/>
					</div>
				</div>
				<hr className='mt-7   border-slim border-[#dfdfdf] ' />

				<section className='lg:w-4/5 w-full grid md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] mx-auto gap-5 mt-10 mb-20 '>
					{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
						<article className='shadow-md p-4  space-y-2 cursor-pointer hover:scale-105 transition-[scale] duration-1000'>
							<div className='flex text-xs items-center gap-2 text-primary-text'>
								<span>BUSINESS</span>
								<span>&#8226;</span>
								<span>12M AGO</span>
							</div>
							<h5 className='font-bold text-lg line-clamp-2 h-14'>
								Central banks signal coordinated pause as inflation cools faster
								than forecast Central banks signal coordinated pause as
								inflation cools faster than forecast
							</h5>
							<p className='line-clamp-3 h-18 text-primary-text'>
								Policymakers across three major economies hinted at holding
								rates steady, citing a sharper drop in core inflation.
							</p>
							<div className='flex justify-between text-base mt-2'>
								<span className='text-brand'>Reuters</span>
								<span className=' text-primary-text subpixel-antialiased italic'>
									Reuters
								</span>
							</div>
						</article>
					))}

					{/* <div className='animate-pulse space-y-3.5 h-56 flex  flex-col'>
						<div className='mt-2 h-4 w-1/2 rounded bg-gray-200'></div>
						<div className='h-8 w-full rounded bg-gray-200'></div>
						<div className='h-10 w-9/10 rounded bg-gray-200'></div>

						<div className='h-4 w-full rounded bg-gray-200'></div>

						<div className='mt-2 h-4 w-1/2 rounded bg-gray-200'></div>

						<div className='flex justify-between mt-auto'>
							<div className='mt-2 h-4 w-10 rounded bg-gray-200'></div>
							<div className='mt-2 h-4 w-12 rounded bg-gray-200'></div>
						</div>
					</div> */}
				</section>
			</main>
		</>
	);
}

export default App;
