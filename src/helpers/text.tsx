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

export const experienceAsText = (experience: { months: number; years: number }): string => {
	let response = "No experience data";

	if (experience.years === 0 && experience.months > 0) {
		response = `Less than a year`;
	}

	if (experience.years == 1 && experience.months === 0) {
		response = `1 year`;
	}

	if (experience.years === 1 && experience.months !== 0) {
		response = `More than 1 year`;
	}

	if (experience.years > 1 && experience.months === 0) {
		response = `${experience.years} years`;
	}

	if (experience.years > 1 && experience.months !== 0) {
		response = `More than ${experience.years} years`;
	}

	return response;
};
