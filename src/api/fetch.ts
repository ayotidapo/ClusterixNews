/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiBaseConfig, stripEmpty } from '@/utils/helper';

// type TbaseUrl =
// 	| 'https://content.guardianapis.com/search'
// 	| 'https://api.nytimes.com/svc/search/v2/articlesearch.json'
// 	| 'https://newsapi.org/v2/everything';

const Fetch = async (url: string, query: Record<string, any> = {}) => {
	const apiBase = apiBaseConfig[url];
	const uri = apiBase.uri;
	const strippedQuery = stripEmpty(query);
	console.log({ apiBase });
	const params = new URLSearchParams({
		[apiBase.apiParams]: apiBase.value,
		...strippedQuery,
	});
	const response = await fetch(`${uri}?${params}`);
	const h = await response.json();
	return h;
};

export default Fetch;
