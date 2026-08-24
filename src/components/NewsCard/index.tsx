import { timeAgo } from '@/utils/helper';
import type { ObjectType } from '@/utils/types';

interface Props {
	item: ObjectType;
	category?: string;
}

// publishDate: item?.publishedAt,
// 				title: item?.title,
// 				summary: item?.content,
// 				detailsUrl: item?.url,
// 				category: item?.section_name,
// 				source: item?.source?.name,
// 				author: item?.author,
const NewsCard: React.FC<Props> = ({ item, category }) => {
	return (
		<article className='shadow-md p-4  space-y-2 cursor-pointer hover:scale-105 transition-[scale] duration-1000'>
			<div className='flex text-xs items-center gap-2 text-primary-text'>
				<span className='capitalize'>
					{item?.category || category?.replace('-', ' ') || 'News'}
				</span>
				<span>&#8226;</span>
				<span>{timeAgo(item?.publishDate)}</span>
			</div>
			<h5 className='font-bold text-lg line-clamp-2 h-14'>{item?.title}</h5>
			<p className='line-clamp-3 h-18 text-primary-text'>{item?.summary}</p>
			<div className='flex justify-between text-base mt-2'>
				<span className='text-brand'>{item?.source}</span>
				<span className=' text-primary-text subpixel-antialiased italic truncate w-32 text-right'>
					{item?.author}
				</span>
			</div>
		</article>
	);
};

export default NewsCard;

export const NewsSkeleton = () => {
	return (
		<div className='animate-pulse space-y-3.5 h-56 flex  flex-col'>
			<div className='mt-2 h-4 w-1/2 rounded bg-gray-200'></div>
			<div className='h-8 w-full rounded bg-gray-200'></div>
			<div className='h-10 w-9/10 rounded bg-gray-200'></div>
			<div className='h-4 w-full rounded bg-gray-200'></div>
			<div className='mt-2 h-4 w-1/2 rounded bg-gray-200'></div>
			<div className='flex justify-between mt-auto'>
				<div className='mt-2 h-4 w-10 rounded bg-gray-200'></div>
				<div className='mt-2 h-4 w-12 rounded bg-gray-200'></div>
			</div>
		</div>
	);
};
