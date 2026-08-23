interface Props {}

const NewsCard: React.FC<Props> = () => {
	return (
		<article className='shadow-md p-4  space-y-2 cursor-pointer hover:scale-105 transition-[scale] duration-1000'>
			<div className='flex text-xs items-center gap-2 text-primary-text'>
				<span>BUSINESS</span>
				<span>&#8226;</span>
				<span>12M AGO</span>
			</div>
			<h5 className='font-bold text-lg line-clamp-2 h-14'>
				Central banks signal coordinated pause as inflation cools faster than
				forecast Central banks signal coordinated pause as inflation cools
				faster than forecast
			</h5>
			<p className='line-clamp-3 h-18 text-primary-text'>
				Policymakers across three major economies hinted at holding rates
				steady, citing a sharper drop in core inflation.
			</p>
			<div className='flex justify-between text-base mt-2'>
				<span className='text-brand'>Reuters</span>
				<span className=' text-primary-text subpixel-antialiased italic'>
					Reuters
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
