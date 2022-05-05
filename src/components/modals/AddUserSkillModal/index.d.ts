/* eslint-disable unused-imports/no-unused-vars */
type AddSkillArgs = {
	visible: boolean;
	recordId?: string | null;
	onClose: () => void;
	onFinish: () => void;
};

type UserSkill = {
	id?: string;
	skillId: number;
	skillName?: string;
	level: SkillLevel;
	description?: EditorState;
	tools?: UserTool[];
	jobs?: UserJob[];
	schools?: UserSchool[];
};

type UserSchool = {
	id?: string;
	title: string;
	startedAt?: Moment;
	finishedAt?: Moment;
	description?: EditorState;
};

type UserJob = {
	id?: string;
	company: string;
	title: string;
	startedAt?: Moment;
	finishedAt?: Moment;
	description?: EditorState;
};

type UserTool = {
	id?: string;
	title: string;
	level: number;
	description?: EditorState;
};

type UserLanguage = {
	id?: string;
	title: string;
	level: number;
};

type PreSaveData = {
	tools: UserTool[];
	schools: UserSchool[];
	jobs: UserJob[];
} | null;
