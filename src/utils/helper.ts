import { formatDistanceToNow } from 'date-fns';
import type { ObjectType } from './types';
export const apiBaseConfig = {
	guardian: {
		uri: `https://content.guardianapis.com/search`,
		url: `guardian`,
		apiParams: 'api-key',
		value: import.meta.env.VITE_GUARDIAN_KEY,
	},
	new_times: {
		uri: `https://api.nytimes.com/svc/search/v2/articlesearch.json`,
		url: `new_times`,
		apiParams: 'api-key',
		value: import.meta.env.VITE_NEWTIMES_KEY,
	},
	news_api: {
		uri: `https://newsapi.org/v2/everything`,
		url: `news_api`,
		apiParams: 'apiKey',
		value: import.meta.env.VITE_NEWSAPI_KEY,
	},
};

export const timeAgo = (dateString: string) => {
	return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

// ('https://content.guardianapis.com/search');
// 	| 'https://api.nytimes.com/svc/search/v2/articlesearch.json'
// 	| 'https://newsapi.org/v2/everything';

export const dedupeBy = (arr: ObjectType[], key: string) => {
	return [...new Map(arr.map(item => [item[key], item])).values()];
};

export const stripEmpty = (obj: ObjectType) => {
	return Object.fromEntries(
		Object.entries(obj).filter(
			([, value]) => value !== null && value !== undefined && value !== ''
		)
	);
};
