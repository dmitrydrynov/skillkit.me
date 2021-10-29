import React from 'react';
import BraftEditor, { ControlType, EditorState } from 'braft-editor';

interface OnChangeHandler {
	(e: any): void;
}

type Props = {
	value?: string;
	placeholder?: string;
	toolbars?: any;
	onChange?: OnChangeHandler;
};

const TextEditor: React.FC<Props> = ({ value, onChange, placeholder, toolbars }) => {
	return (
		<>
			<BraftEditor
				value={value ? BraftEditor.createEditorState(value) : ''}
				onChange={onChange}
				placeholder={placeholder}
			/>
		</>
	);
};

export default TextEditor;
