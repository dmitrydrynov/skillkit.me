// yarn add @editorjs/warning @editorjs/simple-image @editorjs/raw @editorjs/quote @editorjs/marker @editorjs/inline-code @editorjs/header @editorjs/delimiter @editorjs/checklist editorjs-button editorjs-drag-drop
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
import SimpleImage from '@editorjs/simple-image';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import { createReactEditorJS } from 'react-editor-js';
import styles from './style.module.less';

const PostEditor = ({ data, imageArray = [], handleInstance }) => {
	const EditorJS: any = createReactEditorJS();
	const EDITOR_JS_TOOLS = {
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
		simpleImage: SimpleImage,
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
					uploadByFile(file) {
						let formData = new FormData();
						formData.append('images', file);
						// send image to server
						// return API.imageUpload(formData).then((res) => {
						// 	// get the uploaded image path, pushing image path to image array
						// 	imageArray.push(res.data.data);
						// 	return {
						// 		success: 1,
						// 		file: {
						// 			url: res.data.data,
						// 		},
						// 	};
						// });
					},
				},
			},
		},
	};

	// Editor.js This will show block editor in component
	// pass EDITOR_JS_TOOLS in tools props to configure tools with editor.js
	return (
		<div className={styles.editor}>
			<EditorJS
				instanceRef={(instance) => handleInstance(instance)}
				tools={EDITOR_JS_TOOLS}
				data={data}
				placeholder={`Write from here...`}
			/>
		</div>
	);
};

// Return the PostEditor to use by other components.

export default PostEditor;
