/* eslint-disable unused-imports/no-unused-vars */
type AddKitArgs = {
	visible: boolean;
	onClose: () => void;
	onFinish: () => void;
};

type UserKit = {
	id?: string;
	professionId: number;
	professionName?: string;
	description?: EditorState;
	userSkills?: UserTool[];
};
