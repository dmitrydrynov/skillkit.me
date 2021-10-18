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
};

export const skillLevelsList = [
	{
		label: SkillLevelEnum.NOVICE,
		icon: SkillNoviceIcon,
		description: 'Has knowledge of how to get the job done but has no experience yet',
	},
	{
		label: SkillLevelEnum.BEGINNER,
		icon: SkillBeginnerIcon,
		description: 'Has considerable experience',
	},
	{
		label: SkillLevelEnum.SKILLFUL,
		icon: SkillSkillfulIcon,
		description: 'Accepts responsibility for choices and able to prioritize behaviors based on levels of importance',
	},
	{
		label: SkillLevelEnum.EXPERIENCED,
		icon: SkillExperiencedIcon,
		description: 'Uses intuition based on enough past experience',
	},
	{
		label: SkillLevelEnum.EXPERT,
		icon: SkillExpertIcon,
		description: 'Has an immense library of distinguishable situations is built up on the basis of experience',
	},
];

export const getSkillLevel = (levelName: string): SkillLevel => {
	return skillLevelsList.filter((item) => item.label === levelName)[0];
};
