import { ToolConstructable, ToolSettings } from '@editorjs/editorjs';

export type PostEditorType = {
	[toolName: string]: ToolConstructable | ToolSettings;
};

export const postEditorConfig = async (): Promise<PostEditorType> => {
	return {
		embed: await import('@editorjs/embed'),
		image: await import('@editorjs/image'),
		list: await import('@editorjs/list'),
		table: await import('@editorjs/table'),
		linkTool: await import('@editorjs/link'),
		paragraph: await import('@editorjs/paragraph'),
	};
};
