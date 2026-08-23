import '@/App.css';
import DropDown from './ui/Dropdown';

import NewsCard from './components/NewsCard';
import DatePicker from './components/DatePicker';
import Icon from './ui/Icon';
import Modal from './ui/Modal';
import { useState } from 'react';
import Checkbox from './ui/CheckBox';
//import.meta.env.VITE_API_URL
function App() {
	const [open, setOpen] = useState(false);
	return (
		<>
			{open && (
				<Modal onClose={() => setOpen(false)}>
					<div className='p-5 rounded-xl  bg-white lg:w-[40vw]  w-[90vw]'>
						<h5 className='text-lg font-bold subpixel-antialiased'>
							Feed preferences
						</h5>
						<small className='text-primary-text text-base'>
							Choose what shows up in yourfeed by default
						</small>
						<section className='space-y-3.5 mt-3.5'>
							<div className='space-y-1'>
								<h6 className='font-semibold'>Sources</h6>
								<div className='flex gap-2'>
									<Checkbox label='bbc' value='bbc' />
									<Checkbox label='news api' value='bbc' />
									<Checkbox label='new york times' value='bbc' />
								</div>
							</div>
							<div className='space-y-1'>
								<h6 className='font-semibold'>Categories</h6>
								<div className='flex gap-2'>
									<Checkbox label='tech' value='bbc' />
									<Checkbox label='politics' value='bbc' />
									<Checkbox label='business' value='bbc' />
								</div>
							</div>
							<div className='space-y-1'>
								<h6 className='font-semibold'>Authors</h6>
								<div className='flex gap-2'>
									<Checkbox label='donald trump' value='bbc' />
									<Checkbox label='ayomide oti' value='bbc' />
									<Checkbox label='mark zuckerberg' value='bbc' />
								</div>
							</div>
						</section>
						<div className='flex justify-end gap-2 mt-4'>
							<button className='btn'>Cancel</button>
							<button className='btn active'>Save preferences</button>
						</div>
					</div>
				</Modal>
			)}
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
				<div
					className='flex justify-between relative z-200 bg-black text-white pr-5 gap-1 cursor-pointer'
					onClick={() => setOpen(true)}
				>
					<Icon id='gear' />
					<small>Preferences</small>
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

					<DatePicker />
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
						<NewsCard />
					))}
				</section>
			</main>
		</>
	);
}

export default App;
