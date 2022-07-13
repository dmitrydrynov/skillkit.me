// yarn add @editorjs/warning @editorjs/simple-image @editorjs/raw @editorjs/quote @editorjs/marker @editorjs/inline-code @editorjs/header @editorjs/delimiter @editorjs/checklist editorjs-button editorjs-drag-drop
import { useState } from 'react';
import CheckList from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import InlineCode from '@editorjs/inline-code';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Raw from '@editorjs/raw';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import { createReactEditorJS } from 'react-editor-js';
import styles from './style.module.less';

type PostEditorParams = {
	data: any;
	handleInstance: (instance: any) => void;
	onChange?: () => void;
	onReady?: () => void;
	onUploadImage?: (data: any) => void;
};

const PostEditor = ({
	data,
	handleInstance,
	onUploadImage = () => {},
	onChange = () => {},
	onReady = () => {},
}: PostEditorParams) => {
	const EditorJS: any = createReactEditorJS();
	const [editorJSTools] = useState({
		embed: {
			class: Embed,
			config: {
				services: {
					youtube: true,
					twitter: true,
					facebook: true,
					pinterest: true,
				},
			},
		},
		paragraph: {
			class: Paragraph,
			inlineToolbar: true,
		},
		list: List,
		table: Table,
		quote: Quote,
		checklist: CheckList,
		delimiter: Delimiter,
		inlineCode: InlineCode,
		header: {
			class: Header,
			config: {
				placeholder: 'Enter a header',
				levels: [1, 2, 3, 4],
				defaultLevel: 2,
			},
		},
		warning: Warning,
		raw: Raw,
		marker: Marker,
		image: {
			class: Image,
			config: {
				uploader: {
					async uploadByFile(image: any) {
						return await onUploadImage(image);
					},
				},
			},
		},
	});

	return (
		<div className={styles.editor}>
			{!!data && (
				<EditorJS
					onInitialize={handleInstance}
					tools={editorJSTools}
					defaultValue={data}
					placeholder={'Write from here...'}
					onChange={onChange}
					onReady={onReady}
				/>
			)}
		</div>
	);
};

export default PostEditor;
