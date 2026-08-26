/* eslint-disable @typescript-eslint/no-explicit-any */
export type ObjectType = Record<string, any>;

export type TOptions = {
	label: string;
	value: string;
};

export interface IPreferences {
	sources?: string[];
	category?: string[];
	author?: string[];
	[key: string]: any;
}

export interface INewItem {
	itemName: string;
	id: string;
	publishDate: string;
	title: string;
	summary?: string;
	detailsUrl: string;
	category: string;
	source: string;
	sectionId?: string; //use this q=
	author?: string;
}
export interface INewsItems {
	limit: number;
	totalItems: number;
	items: INewItem[];
}

interface GuardianResult {
	id: string;
	webPublicationDate: string;
	webTitle: string;
	webUrl: string;
	sectionId: string;
	fields?: {
		trailText?: string;
		byline?: string;
	};
	[key: string]: any;
}

export interface GuardianResponse {
	pageSize: number;
	total: number;
	response: {
		results: GuardianResult[];
	};
}

export interface NewTimesResult {
	id: string;
	pub_date: string;
	headline: { main: string };
	abstract: string;
	web_url: string;
	section_name: string;
	source: string;
	byline: { original: string };
	[key: string]: any;
}

export interface NewTimesResponse {
	metadata: { hits: number };
	response: {
		docs: NewTimesResult[];
	};
}

export interface NewsApiResult {
	title: string;
	publishedAt: string;
	content: string;
	url: string;
	section_name: string;
	author: string;
	[key: string]: any;
}

export interface NewsApiResponse {
	totalResults: number;
	articles: NewsApiResult[];
}
