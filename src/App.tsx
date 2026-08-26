/* eslint-disable react-hooks/set-state-in-effect */
import '@/App.css';
import { useQueryClient } from '@tanstack/react-query';
import NewsCard, { NewsSkeleton } from './components/NewsCard';
import DatePicker from './components/DatePicker';
import Icon from './ui/Icon';

import { useEffect, useMemo, useState } from 'react';
import Checkbox from './ui/CheckBox';

import type { IPreferences, TOptions } from './utils/types';
import type { DateRange } from 'react-day-picker';
import { dedupeBy } from './utils/helper';

import PreferencesModal from './views/PreferencesModal';
import useGetNewsAggregator from './hooks/useGetNewsAggregator';
import DropDownFilter from './views/DropDownFilter';
import EmptyState from './views/EmptyState';

function App() {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);
	const [category, setCategory] = useState('');
	const [initialized, setInitialized] = useState(false);
	const [allCategories, setAllCategories] = useState<TOptions[]>([]);
	const [allSources, setAllSources] = useState<string[]>([]);
	const [allAuthors, setAllAuthors] = useState<string[]>([]);
	const [sources, setSources] = useState<string[]>([]);
	const [date, setDate] = useState<DateRange | undefined>();
	const [search, setSearch] = useState<string>('');
	const [debouncedSearch, setDebouncedSearch] = useState<string>('');

	const [preferences, setPreferences] = useState<IPreferences>({});

	const { from, to } = date || {};

	const hasPreference = Object.keys(preferences).some(
		key => preferences[key]?.length > 0
	);

	const onChangePreferences = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked, name, value } = e.target;
		const pref = { ...preferences };
		if (checked) {
			pref[name] = [...(pref?.[name] ?? []), value];
		} else {
			pref[name] = pref[name]?.filter((pf: string) => pf !== value);
		}
		setDate(undefined);
		setPreferences({ ...pref });
	};

	const nAggregator = useGetNewsAggregator({
		category,
		sources,
		from,
		to,
		debouncedSearch,
		preferences,
	});

	const {
		guardianData,
		guardianLoading,
		guardianFetching,
		newTimesData,
		newTimesLoading,
		newTimesFetching,
		newApiData,
		newApiLoading,
		newApiFetching,
	} = nAggregator;

	const memoisedData = useMemo(
		() =>
			[
				...(guardianData?.items ?? []),
				...(newTimesData?.items ?? []),
				...(newApiData?.items ?? []),
			].sort(
				(a, b) =>
					new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
			),
		[guardianData, newTimesData, newApiData]
	);
	const memoisedSources = useMemo(() => {
		const uniqueSources = memoisedData.map(item => item?.source); // itemType

		return [...new Set(uniqueSources)];
	}, [memoisedData]);

	const memoisedCategories = useMemo(() => {
		const mappedCategory = memoisedData.map(item => ({
			label: item?.category,
			value: item.itemName === 'guardian' ? item?.sectionId : item?.category,
		})); // itemType

		return dedupeBy(mappedCategory, 'value');
	}, [memoisedData]);

	const memoisedAuthors = useMemo(() => {
		const uniqueAuthors = memoisedData.map(item => item?.author || 'Anonymous'); // itemType

		return [...new Set(uniqueAuthors)];
	}, [memoisedData]);

	const onChangeDate = (date: DateRange | undefined) => {
		setDate(date);
	};

	const onSetSources = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked, value } = e.target;

		if (checked) {
			setSources(prev => [...prev, value]);
		} else {
			setSources([...sources.filter(source => source !== value)]);
		}
	};

	const onSelectCategory = (value: string) => {
		setCategory(value);
	};

	const isLoading = guardianLoading || newTimesLoading || newApiLoading;
	const isFetching = guardianFetching || newTimesFetching || newApiFetching;

	useEffect(() => {
		if (isLoading || initialized) return;

		if (memoisedSources.length > 0) {
			setAllSources(memoisedSources);
		}

		if (memoisedCategories.length > 0) {
			setAllCategories(memoisedCategories as TOptions[]);
		}

		if (memoisedAuthors.length > 0) {
			setAllAuthors(memoisedAuthors);
		}

		setInitialized(true);
	}, [
		isLoading,
		initialized,
		memoisedSources,
		memoisedCategories,
		memoisedAuthors,
	]);

	useEffect(() => {
		const handler = setTimeout(() => setDebouncedSearch(search), 2000);
		return () => clearTimeout(handler);
	}, [search]);

	const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSearch(value);
	};

	const onSavePreferences = () => {
		if (!hasPreference) return alert('Select atleast one preference');
		localStorage.setItem('saved_preferences', JSON.stringify(preferences));
		alert('Preference saved to localstorage');
		setOpen(false);
	};

	const onClearPreference = () => {
		setOpen(false);
		localStorage.removeItem('saved_preferences');
		setPreferences({});
		// setSources([]);

		queryClient.invalidateQueries({
			predicate: query =>
				['guardian', 'new_times', 'news_api'].includes(
					query.queryKey[0] as string
				),
		});

		alert('Preference clered from localstorage');
	};

	const onReset = () => {
		setSources([]);
		setCategory('');
		setDate(undefined);
		setSearch('');
	};

	useEffect(() => {
		const savedPreferences = localStorage.getItem('saved_preferences');
		const initPrefernces = savedPreferences ? JSON.parse(savedPreferences) : {};

		setSources(initPrefernces?.sources || []);
		setCategory(initPrefernces?.category?.[0] || '');
		setPreferences(initPrefernces);
	}, []);

	return (
		<div className=' h-full '>
			<PreferencesModal
				open={open}
				setOpen={setOpen}
				allCategories={allCategories}
				allAuthors={allAuthors}
				allSources={allSources}
				preferences={preferences}
				setPreferences={setPreferences}
				onClearPreference={onClearPreference}
				onSavePreferences={onSavePreferences}
				onChangePreferences={onChangePreferences}
			/>

			<header className='header_ fixed inset-0 bg-black py-2 flex md:h-[56px] h-20 md:items-center items-baseline z-500 md:text-base text-xs'>
				<div className='flex justify-between relative z-200 bg-black  page__pad'>
					<h1 className=' text-logo '>ClusterixNews</h1>
				</div>

				<div className=' relative  w-full bg-transparent translate-y-2.5 md:translate-y-0'>
					<div className='marquee-scroll marque text-white inline-flex gap-7 items-center space-x-5  h-full absolute md:top-0  top-[14px] whitespace-nowrap'>
						<span>LIVE FROM GUARDIAN</span>
						<span>LIVE FROM NEWS API </span>
						<span>LIVE FROM NEW YORK TIMES</span>
					</div>
				</div>
				<div
					className='flex justify-between relative z-200 bg-black text-white md:pr-8 pr-4 gap-1 cursor-pointer'
					onClick={() => setOpen(true)}
				>
					<Icon id='gear' />
					<small className='md:text-base text-sm'>Preferences</small>
				</div>
			</header>
			<main className='md:pt-14 pt-20 flex flex-col min-h-full pb-20'>
				<div className='flex lg:flex-nowrap flex-wrap items-start gap-4 mt-10 page__pad justify-between'>
					<section className='flex lg:flex-row flex-col gap-7 items-center lg:justify-start justify-between lg:max-w-1/2 flex-wrap'>
						<DropDownFilter
							options={allCategories}
							onSelect={onSelectCategory}
							value={category}
						/>
					</section>

					<div className='relative flex items-center '>
						<DatePicker onChangeDate={onChangeDate} />
						<Icon
							id='calendar'
							className='absolute top-1/2 -translate-y-1/2 right-1'
						/>
					</div>
					<div className='ml-0 relative'>
						<input
							type='text'
							className='rounded-3xl md:w-80 min-w-60 text-brand'
							placeholder='Type to search...'
							value={search}
							onChange={onChangeText}
						/>
						{search && (
							<Icon
								id='x'
								width={18}
								height={18}
								className='absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer'
								onClick={() => setSearch('')}
							/>
						)}
					</div>
				</div>
				<div className='p-2.5 pt-0.5 rouded-sm shadow-sm w-full page__pad mt-7 pb-4'>
					<h6 className='subpixel-antialiased'>Sources:</h6>
					<div className='flex gap-2 flex-wrap max-h-18 lg:w-3/5 overflow-auto mt-1'>
						{allSources.map((source: string) => (
							<Checkbox
								name='sources'
								key={source}
								label={source}
								value={source}
								onChange={onSetSources}
								checked={sources.includes(source)}
							/>
						))}
					</div>
				</div>

				<section className='lg:w-4/5 w-full grid md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] mx-auto gap-5 mt-10  '>
					{isFetching || isLoading
						? [...new Array(10).fill('')].map((_x: string, i: number) => (
								<NewsSkeleton key={i} />
							))
						: memoisedData.map(item => (
								<NewsCard item={item} key={item?.id} category={category} />
							))}
				</section>
				{!isFetching && !isLoading && memoisedData?.length < 1 && (
					<EmptyState onReset={onReset} />
				)}
			</main>
		</div>
	);
}

export default App;
