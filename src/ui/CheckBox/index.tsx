import './checkbox.css';

interface Props {
	label: string;
	value: string;
	checked?: boolean;
}
const Checkbox: React.FC<Props> = ({ label, value, checked }) => {
	return (
		<label className='flex'>
			<input
				type='checkbox'
				className='checkbox'
				value={value}
				checked={checked}
			/>
			<span>{label}</span>
		</label>
	);
};

export default Checkbox;
