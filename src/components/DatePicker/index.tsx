import { format } from 'date-fns';
import { useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import DropDown from '@/ui/Dropdown';

const DatePicker = () => {
	const [range, setRange] = useState<DateRange | undefined>();
	const { from = '', to = '' } = range || {};
	const formatStyle = "do 'of' MMMM, yyyy";
	return (
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
	);
};

export default DatePicker;
