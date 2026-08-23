import { useEffect } from 'react';
import './modal.css';
import Icon from '../Icon';

interface Props {
	children?: React.ReactNode;
	onClose: () => void;
}

const Modal: React.FC<Props> = props => {
	const { children, onClose } = props;

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, []);

	return (
		<div className='modal__'>
			<div className='relative'>
				<Icon
					onClick={onClose}
					id='close'
					height={25}
					width={25}
					className='absolute -right-6 -top-5 text-white cursor-pointer'
				/>
				{children}
			</div>
		</div>
	);
};

export default Modal;
