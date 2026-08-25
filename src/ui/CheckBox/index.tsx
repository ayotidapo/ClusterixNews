import './checkbox.css';

interface Props {
	name: string;
	label: string;
	value: string;
	checked?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
	type?: 'checkbox' | 'radio';
}
const Checkbox: React.FC<Props> = props => {
	const { label, name, value, checked, onChange, className = '' } = props;

	return (
		<label>
			<input
				name={name}
				type='checkbox'
				className='checkbox'
				value={value}
				checked={checked}
				onChange={onChange}
			/>
			<span className={`checkers  ${className}`}>{label}</span>
		</label>
	);
};

export default Checkbox;
