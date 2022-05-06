/* eslint-disable no-unused-vars */
import SkillBeginnerIcon from '@assets/images/skills/beginner.svg';
import SkillExperiencedIcon from '@assets/images/skills/experienced.svg';
import SkillExpertIcon from '@assets/images/skills/expert.svg';
import SkillNoviceIcon from '@assets/images/skills/novice.svg';
import SkillSkillfulIcon from '@assets/images/skills/skillful.svg';

export enum SkillLevelEnum {
	NOVICE = 'Novice',
	BEGINNER = 'Beginner',
	SKILLFUL = 'Skillful',
	EXPERIENCED = 'Experienced',
	EXPERT = 'Expert',
}

export type SkillLevel = {
	label: SkillLevelEnum;
	icon: string;
	description: string;
	index: number;
	color: string;
};

export const skillLevelsList = [
	{
		index: 1,
		label: SkillLevelEnum.NOVICE,
		icon: SkillNoviceIcon,
		color: '#FF5959',
		description: 'Has knowledge of how to get the job done but has no experience yet',
	},
	{
		index: 2,
		label: SkillLevelEnum.BEGINNER,
		icon: SkillBeginnerIcon,
		color: '#FF9159',
		description: 'Has considerable experience',
	},
	{
		index: 3,
		label: SkillLevelEnum.SKILLFUL,
		icon: SkillSkillfulIcon,
		color: '#F3B721',
		description: 'Accepts responsibility for choices and able to prioritize behaviors based on levels of importance',
	},
	{
		index: 4,
		label: SkillLevelEnum.EXPERIENCED,
		icon: SkillExperiencedIcon,
		color: '#80CC14',
		description: 'Uses intuition based on enough past experience',
	},
	{
		index: 5,
		label: SkillLevelEnum.EXPERT,
		icon: SkillExpertIcon,
		color: '#25B869',
		description: 'Has an immense library of distinguishable situations is built up on the basis of experience',
	},
];

export const checkSkillLevel = (level: SkillLevel, experience?: number) => {
	if (experience == null || experience == undefined) {
		return skillLevelsList;
	}

	if (
		experience == 0 &&
		[SkillLevelEnum.EXPERIENCED, SkillLevelEnum.EXPERT, SkillLevelEnum.SKILLFUL, SkillLevelEnum.BEGINNER].includes(
			level.label,
		)
	) {
		return false;
	}

	if (
		experience < 3 &&
		[SkillLevelEnum.EXPERIENCED, SkillLevelEnum.EXPERT, SkillLevelEnum.SKILLFUL].includes(level.label)
	) {
		return false;
	}

	if (experience < 12 && [SkillLevelEnum.EXPERIENCED, SkillLevelEnum.EXPERT].includes(level.label)) {
		return false;
	}

	// if (experience >= 12 && [SkillLevelEnum.EXPERT].includes(level.label)) {
	// 	return false;
	// }

	return true;
};

export const getSkillLevel = (levelName: string): SkillLevel => {
	return skillLevelsList.filter((item) => item.label.toLowerCase() === levelName.toLowerCase())[0];
};
