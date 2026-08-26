/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiBaseConfig, stripEmpty } from '@/utils/helper';

type Source = 'guardian' | 'new_times' | 'news_api';
const Fetch = async (url: Source, query: Record<string, any> = {}) => {
	const apiBase = apiBaseConfig[url];
	const uri = apiBase.uri;
	const strippedQuery = stripEmpty(query);

	const params = new URLSearchParams({
		[apiBase.apiParams]: apiBase?.value,
		...strippedQuery,
	});
	const response = await fetch(`${uri}?${params}`);
	const h = await response.json();
	return h;
};

export default Fetch;
