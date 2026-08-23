import React from 'react';
import './dropdown.css';

interface Props {
	triggerComp: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}
const DropDown: React.FC<Props> = ({
	triggerComp,
	children,
	className = '',
}) => {
	return (
		<div className={`dropdown__trigger ${className}`} tabIndex={0}>
			{triggerComp}
			<div className='dropdown__content'>{children}</div>
		</div>
	);
};

export default DropDown;
