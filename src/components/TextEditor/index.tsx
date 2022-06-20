import React from 'react';
import BraftEditor from 'braft-editor';

interface OnChangeHandler {
	// eslint-disable-next-line unused-imports/no-unused-vars
	(e: any): void;
}

type Props = {
	value?: string;
	placeholder?: string;
	toolbars?: any;
	onChange?: OnChangeHandler;
};

const TextEditor: React.FC<Props> = ({ value, onChange, placeholder }) => {
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
