import './checkbox.css';

interface Props {
	label: string;
	value: string;
	checked?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Checkbox: React.FC<Props> = ({ label, value, checked, onChange }) => {
	return (
		<label className='flex'>
			<input
				type='checkbox'
				className='checkbox'
				value={value}
				checked={checked}
				onChange={onChange}
			/>
			<span>{label}</span>
		</label>
	);
};

export default Checkbox;
