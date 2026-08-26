/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiBaseConfig, stripEmpty } from '@/utils/helper';

// type TbaseUrl =
// 	| 'https://content.guardianapis.com/search'
// 	| 'https://api.nytimes.com/svc/search/v2/articlesearch.json'
// 	| 'https://newsapi.org/v2/everything';
type Source = 'guardian' | 'new_times' | 'news_api';
const Fetch = async (url: Source, query: Record<string, any> = {}) => {
	const apiBase = apiBaseConfig[url];
	const uri = apiBase.uri;
	const strippedQuery = stripEmpty(query);
	console.log({ apiBase, strippedQuery, m: uri });
	const params = new URLSearchParams({
		[apiBase.apiParams]: apiBase?.value,
		...strippedQuery,
	});
	const response = await fetch(`${uri}?${params}`);
	const h = await response.json();
	return h;
};

export default Fetch;
