import Checkbox from '@/ui/CheckBox';
import Modal from '@/ui/Modal';
import type { IPreferences, TOptions } from '@/utils/types';

import React from 'react';

interface Props {
	allCategories: TOptions[];
	allSources: string[];
	allAuthors: string[];
	preferences: IPreferences;
	open: boolean;
	setPreferences: React.Dispatch<React.SetStateAction<IPreferences>>;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onSavePreferences: () => void;
	onReset: () => void;
	onChangePreferences: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PreferencesModal: React.FC<Props> = props => {
	const { allCategories, allSources, allAuthors, preferences } = props;

	if (!props.open) return null;
	return (
		<Modal onClose={() => props.setOpen(false)}>
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
						<div className='prefer__box'>
							{allSources?.map((source: string) => (
								<Checkbox
									name='sources'
									key={source}
									label={source}
									value={source}
									onChange={props.onChangePreferences}
									checked={preferences?.sources?.includes(source)}
								/>
							))}
						</div>
					</div>
					<div className='space-y-1'>
						<h6 className='font-semibold'>Categories</h6>
						<div className='prefer_box'>
							{allCategories?.map(item => (
								<Checkbox
									name='category'
									key={item?.value}
									label={item?.label}
									value={item?.value}
									onChange={props.onChangePreferences}
									checked={preferences?.category?.includes(item?.value)}
								/>
							))}
						</div>
					</div>
					<div className='space-y-1'>
						<h6 className='font-semibold'>Authors</h6>
						<div className='prefer_box'>
							{allAuthors?.map(author => (
								<Checkbox
									label={author}
									value={author}
									name='author'
									onChange={props.onChangePreferences}
									checked={preferences?.author?.includes(author)}
								/>
							))}
						</div>
					</div>
				</section>
				<div className='flex justify-end gap-2 mt-4'>
					<button className='btn' onClick={props.onReset}>
						Cancel
					</button>
					<button className='btn active' onClick={props.onSavePreferences}>
						Save preferences
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default PreferencesModal;
