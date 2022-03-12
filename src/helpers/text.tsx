import React from 'react';

export const readyText = (text: string) => {
	return text.split('\n').map((item, key) => {
		return (
			<React.Fragment key={key}>
				{item}
				<br />
			</React.Fragment>
		);
	});
};

export const capitalizedText = (text: string) => {
	return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
};
