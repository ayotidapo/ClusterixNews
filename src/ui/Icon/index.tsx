interface Props {
	id: string;
	onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
	className?: string;
	height?: number;
	width?: number;
}

const Icon: React.FC<Props> = props => {
	const { id, width, height, className = '' } = props;
	return (
		<svg
			onClick={props.onClick}
			className={`cursor-pointer ${className}`}
			width={width ? width : 20}
			height={height ? height : 20}
			{...props}
		>
			<use href={`/icons_sprite.svg#${id}`}></use>
		</svg>
	);
};

export default Icon;
