import DropDown from '@/ui/Dropdown';
import Icon from '@/ui/Icon';
import type { TOptions } from '@/utils/types';
import React from 'react';
interface Props {
	options: TOptions[];
	onSelect: (value: string) => void;
	value: string;
}

const DropDownFilter: React.FC<Props> = ({ value, onSelect, options }) => {
	return (
		<DropDown
			triggerComp={
				<div className='flex border-slim border-primary-text rounded-3xl pl-4 pr-1 py-1.5 gap-2.5 items-center min-w-50 justify-between'>
					<span className=' text-black subpixel-antialiased text-sm font-medium'>
						CATEGORY
					</span>
					<div className='flex gap-1 items-center'>
						<span className='text-sm text-brand subpixel-antialiased capitalize'>
							{value || 'All'}
						</span>
						<Icon id='caret' width={18} height={18} />
					</div>
				</div>
			}
		>
			<div className='flex flex-col w-50 max-h-80 overflow-auto '>
				<button
					key='all'
					className='inline-flex hover:bg-[#cde2fb] px-3.5 py-1 cursor-pointer'
					onClick={() => onSelect('')}
				>
					All
				</button>
				{options?.map(item => (
					<button
						key={item?.value}
						className='inline-flex hover:bg-[#cde2fb] px-3.5 py-1 cursor-pointer'
						onClick={() => onSelect(item.value)}
					>
						{item?.label}
					</button>
				))}
			</div>
		</DropDown>
	);
};
export default DropDownFilter;
