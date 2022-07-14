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
	let response = 'No experience data';

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

export function readingTime(text: string) {
	const wpm = 225;
	const words = text.trim().split(/\s+/).length;
	const time = Math.ceil(words / wpm);

	return time;
}

export function textLimit(text, limit) {
	text = text.trim();
	if (text.length <= limit) return text;
	text = text.slice(0, limit);
	const lastSpace = text.lastIndexOf(' ');
	if (lastSpace > 0) {
		text = text.substr(0, lastSpace);
	}
	return text + '...';
}

export const textOnly = (textWithHTML: string) => textWithHTML.replace(/(<([^>]+)>)/gi, '');

export function readingTimeOfEditorBlocks(blocks: any[]): number {
	const paragraphs = blocks.filter((block) => block.type === 'paragraph');
	let text = '';

	if (paragraphs.length > 0)
		paragraphs.map((p) => {
			text += ' ' + textOnly(p.data.text);
		});

	return readingTime(text);
}
