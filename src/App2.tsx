/* eslint-disable react-hooks/set-state-in-effect */
import '@/App.css';
import DropDown from './ui/Dropdown';
import { useQueryClient } from '@tanstack/react-query';
import NewsCard, { NewsSkeleton } from './components/NewsCard';
import DatePicker from './components/DatePicker';
import Icon from './ui/Icon';
import Modal from './ui/Modal';
import { useEffect, useMemo, useState } from 'react';
import Checkbox from './ui/CheckBox';
import { useQuery } from '@tanstack/react-query';
import Fetch from './api/fetch';
import type {
	GuardianResponse,
	INewsItems,
	IPreferences,
	NewsApiResponse,
	NewTimesResponse,
	TOptions,
} from './utils/types';
import type { DateRange } from 'react-day-picker';
import { dedupeBy } from './utils/helper';
import { format } from 'date-fns';
import PreferencesModal from './views/PreferencesModal';

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

	const qKeys = { category, sources, from, to, debouncedSearch, preferences };

	const hasPreference = Object.keys(preferences).some(
		key => preferences[key]?.length > 0
	);

	console.log({ hasPreference, preferences });

	const onChangePreferences = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked, name, value } = e.target;
		const pref = { ...preferences };
		if (checked) {
			pref[name] = [...(pref?.[name] ?? []), value];
		} else {
			pref[name] = pref[name]?.filter((pf: string) => pf !== value);
		}

		setPreferences({ ...pref });
	};

	const {
		data: guardianData,
		isPending: guardianLoading,
		isFetching: guardianFetching,
		// refetch: refetchGuardian,
	} = useQuery<GuardianResponse, Error, INewsItems>({
		queryKey: ['guardian', qKeys],
		queryFn: () => {
			let _preferences = { ...preferences };
			const { author, ...rest } = preferences;
			if (hasPreference) _preferences = { ...rest, tag: author };

			return Fetch('guardian', {
				'show-fields': 'headline,trailText,thumbnail,byline',
				section: category || _preferences?.category,
				sources: '', //sources.join(','),
				'from-date': from ? format(from, 'yyyy-MM-dd') : '',
				'to-date': to ? format(to, 'yyyy-MM-dd') : '',
				q: debouncedSearch,
				author:
				..._preferences,
			});
		},
		select: data => ({
			limit: data?.pageSize,
			totalItems: data?.total,
			items: data?.response?.results?.map(item => ({
				itemName: 'guardian',
				id: item?.id,
				publishDate: item?.webPublicationDate,
				title: item?.webTitle,
				summary: item?.fields?.trailText,
				detailsUrl: item?.webUrl,
				category: item?.sectionId,
				source: 'The Guardian',
				sectionId: item?.sectionId, //use this q=
				author: item?.fields?.byline,
			})),
		}),
	});

	const {
		data: newTimesData,
		isPending: newTimesLoading,
		isFetching: newTimesFetching,
		// refetch: refetchNewTimes,
	} = useQuery<NewTimesResponse, Error, INewsItems>({
		queryKey: ['new_times', qKeys],
		queryFn: () => {
			let _preferences = { ...preferences };
			const { author, ...rest } = preferences;
			if (hasPreference)
				_preferences = { ...rest, fq: author ? `byline${author}` : '' };

			return Fetch('new_times', {
				fq: category ? `section_name:${category}` : '',
				sources: sources.join(','),
				begin_date: from ? format(from, 'yyyyMMdd') : '',
				end_date: from ? format(from, 'yyyyMMdd') : '',
				q: debouncedSearch,
				..._preferences,
			});
		},
		select: data => ({
			limit: 10,
			totalItems: data?.metadata?.hits,
			items: data?.response?.docs?.map(item => ({
				itemName: 'new times',
				id: item?._id,
				publishDate: item?.pub_date,
				title: item?.headline?.main,
				summary: item?.abstract,
				detailsUrl: item?.web_url,
				category: item?.section_name,
				source: item?.source,
				author: item?.byline?.original,
			})),
		}),
	});

	const {
		data: newApiData,
		isPending: newApiLoading,
		isFetching: newApiFetching,
		// refetch: refetchNewsApi,
	} = useQuery<NewsApiResponse, Error, INewsItems>({
		queryKey: ['news_api', qKeys],
		queryFn: () => {
			let _preferences = { ...preferences };
			const { sources, category, ...rest } = preferences;
			if (hasPreference)
				_preferences = { ...rest, domains: sources?.join(','), q: category };

			return Fetch('news_api', {
				q: debouncedSearch || category || 'technology',
				pageSize: 10,
				page: 1,
				domains: sources?.join(','),
				from: from ? format(from, 'yyyy-MM-dd') : '',
				to: to ? format(to, 'yyyy-MM-dd') : '',
				..._preferences,
			});
		},
		select: data => ({
			limit: 10,
			totalItems: data?.totalResults,
			items: data?.articles?.map(item => ({
				itemName: 'new api',
				id: item?.title,
				publishDate: item?.publishedAt,
				title: item?.title,
				summary: item?.content,
				detailsUrl: item?.url,
				category: item?.section_name,
				source: new URL(item.url).hostname.replace(/^www\./, ''),
				author: item?.author,
			})),
		}),
	});

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

	const onSavePrefernces = () => {
		localStorage.setItem('saved_preferences', JSON.stringify(preferences));
		alert('Preference saved to localstorage');
		setOpen(false);
	};

	const onReset = () => {
		setOpen(false);
		localStorage.removeItem('saved_preferences');
		setPreferences({});
		setSources([]);

		queryClient.invalidateQueries({
			predicate: query =>
				['guardian', 'new_times', 'news_api'].includes(
					query.queryKey[0] as string
				),
		});
		// refetchGuardian();
		// refetchNewTimes();
		// refetchNewsApi();
		alert('Preference clered from localstorage');
	};

	useEffect(() => {
		const savedPreferences = localStorage.getItem('saved_preferences');
		const initPrefernces = savedPreferences ? JSON.parse(savedPreferences) : {};
		// console.log({ initPrefernces });
		setSources(initPrefernces?.sources || []);
		setCategory(initPrefernces?.category?.[0] || '');
		setPreferences(initPrefernces);
	}, []);

	return (
		<>
			<PreferencesModal
				allCategories={allCategories}
				allAuthors={allAuthors}
				allSources={allSources}
				hasPreference={hasPreference}
				preferences={preferences}
				setPreferences={setPreferences}
				onReset={onReset}
				onSavePreferences={onSavePrefernces}
				onChangePreferences={onChangePreferences}
			/>
			{open && (
				<Modal onClose={() => setOpen(false)}>
					{/* <div className='p-5 rounded-xl  bg-white lg:w-[40vw]  w-[90vw]'>
						<h5 className='text-lg font-bold subpixel-antialiased'>
							Feed preferences
						</h5>
						<small className='text-primary-text text-base'>
							Choose what shows up in yourfeed by default
						</small>
						<section className='space-y-3.5 mt-3.5'>
							<div className='space-y-1'>
								<h6 className='font-semibold'>Sources</h6>
								<div className='flex gap-2 flex-wrap max-h-50 overflow-y-auto border-slim border-mauve-300 p-2 rounded-md'>
									{allSources?.map((source: string) => (
										<Checkbox
											name='sources'
											key={source}
											label={source}
											value={source}
											onChange={onChangePreferences}
											checked={preferences?.sources?.includes(source)}
										/>
									))}
								</div>
							</div>
							<div className='space-y-1'>
								<h6 className='font-semibold'>Categories</h6>
								<div className='flex gap-2 flex-wrap max-h-50 overflow-y-auto border-slim border-mauve-300 p-2 rounded-md'>
									{allCategories?.map(item => (
										<Checkbox
											name='category'
											key={item?.value}
											label={item?.label}
											value={item?.value}
											onChange={onChangePreferences}
											checked={preferences?.category?.includes(item?.value)}
										/>
									))}
								</div>
							</div>
							<div className='space-y-1'>
								<h6 className='font-semibold'>Authors</h6>
								<div className='flex gap-2 flex-wrap max-h-50 overflow-y-auto border-slim border-mauve-300 p-2 rounded-md'>
									{allAuthors?.map(author => (
										<Checkbox
											label={author}
											value={author}
											name='author'
											onChange={onChangePreferences}
											checked={preferences?.author?.includes(author)}
										/>
									))}
								</div>
							</div>
						</section>
						<div className='flex justify-end gap-2 mt-4'>
							<button className='btn' onClick={onReset}>
								Cancel
							</button>
							<button
								className='btn active'
								onClick={onSavePrefernces}
								disabled={!hasPreference}
							>
								Save preferences
							</button>
						</div>
					</div> */}
				</Modal>
			)}
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
			<main className='md:pt-14 pt-20'>
				<div className='flex lg:flex-nowrap flex-wrap items-center gap-4 mt-10 page__pad   '>
					<section className='flex lg:flex-row flex-col gap-5 items-center lg:justify-start justify-between lg:w-auto w-full'>
						<DropDown
							triggerComp={
								<div className='flex border-slim border-primary-text rounded-3xl px-4 py-1.5 gap-2.5 items-center'>
									<span className='text-xs text-primary-text'>CATEGORY</span>
									<span className='text-sm text-brand subpixel-antialiased capitalize'>
										{category || 'All'}
									</span>
								</div>
							}
						>
							<div className='flex flex-col w-50 max-h-80 overflow-auto '>
								<button
									key='all'
									className='inline-flex hover:bg-[#cde2fb] px-3.5 py-1 cursor-pointer'
									onClick={() => setCategory('')}
								>
									All
								</button>
								{allCategories?.map(item => (
									<button
										key={item?.value}
										className='inline-flex hover:bg-[#cde2fb] px-3.5 py-1 cursor-pointer'
										onClick={() => setCategory(item?.value)}
									>
										{item?.label}
									</button>
								))}
							</div>
						</DropDown>

						<div className='p-2.5 pt-0.5 rouded-sm shadow-sm'>
							<h6 className=''>Sources:</h6>
							<div className='flex gap-2 flex-wrap max-h-18 overflow-auto'>
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
					</section>

					<DatePicker onChangeDate={onChangeDate} />
					<div className=' lg:ml-auto ml-0'>
						<input
							type='text'
							className='rounded-3xl  min-w-60 text-brand'
							placeholder='Type to search...'
							value={search}
							onChange={onChangeText}
						/>
					</div>
				</div>
				<hr className='mt-7   border-slim border-[#dfdfdf] ' />

				<section className='lg:w-4/5 w-full grid md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] mx-auto gap-5 mt-10 mb-20 '>
					{isFetching &&
						[...new Array(10).fill('')].map((_x: string, i: number) => (
							<NewsSkeleton key={i} />
						))}
					{memoisedData.map(item => (
						<NewsCard item={item} key={item?.id} category={category} />
					))}
				</section>
			</main>
		</>
	);
}

export default App;
