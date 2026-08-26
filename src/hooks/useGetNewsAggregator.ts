import Fetch from '@/api/fetch';
import type {
	GuardianResponse,
	INewsItems,
	NewsApiResponse,
	NewTimesResponse,
} from '@/utils/types';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

const useGetNewsAggregator = ({
	category,
	sources,
	from,
	to,
	debouncedSearch,
	preferences,
}) => {
	const qKeys = {
		category,
		sources,
		from,
		to,
		debouncedSearch,
		preferences,
	};
	const {
		data: guardianData,
		isPending: guardianLoading,
		isFetching: guardianFetching,
	} = useQuery<GuardianResponse, Error, INewsItems>({
		queryKey: ['guardian', qKeys],
		queryFn: () => {
			return Fetch('guardian', {
				'show-fields': 'headline,trailText,thumbnail,byline',
				section: category || preferences?.category,
				sources: '', //Guardian has no source field or its equivalent,
				'from-date': from ? format(from, 'yyyy-MM-dd') : '',
				'to-date': to ? format(to, 'yyyy-MM-dd') : '',
				q: debouncedSearch,
				tag: preferences?.author,
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
			const category_ = category || preferences?.category;
			const author = preferences?.author;
			const filters = [
				category_ && `section_name:"${category}"`,
				author && `byline:"${author}"`,
			].filter(Boolean);

			return Fetch('new_times', {
				fq: filters.join(' AND '),
				sources: (sources || preferences.sources)?.join(','),
				begin_date: from ? format(from, 'yyyyMMdd') : '',
				end_date: from ? format(from, 'yyyyMMdd') : '',
				q: debouncedSearch,
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
	} = useQuery<NewsApiResponse, Error, INewsItems>({
		queryKey: ['news_api', qKeys],
		queryFn: () => {
			const category_ = category || preferences?.category;

			return Fetch('news_api', {
				q: debouncedSearch || category_ || 'technology',
				pageSize: 10,
				page: 1,
				domains: (sources || preferences.sources)?.join(','),
				from: from ? format(from, 'yyyy-MM-dd') : '',
				to: to ? format(to, 'yyyy-MM-dd') : '',
				author: preferences?.author,
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
	return {
		guardianData,
		guardianLoading,
		guardianFetching,
		newTimesData,
		newTimesLoading,
		newTimesFetching,
		newApiData,
		newApiLoading,
		newApiFetching,
	};
};

export default useGetNewsAggregator;
