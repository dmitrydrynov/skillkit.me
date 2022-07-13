// https://medium.com/@sfazleyrabbi/next-js-editor-js-complete-setup-guide-7136c8bb694e
import { ReactElement, useContext, useEffect, useRef, useState } from 'react';
import { InlineEdit } from '@components/InlineEdit';
import PostEditorMenu from '@components/menus/PostEditorMenu';
import PostEditorBeforeContent, { PostViewModeEnum } from '@components/PostEditorBeforeContent';
import ProtectedLayout, { PageContext } from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { getPostQuery, removeImageMutation, uploadImageMutation } from '@services/graphql/queries/post';
import { RootState } from '@store/configure-store';
import { UserRole } from 'src/definitions/user';
import { Input } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

const PostEditor = dynamic(() => import('@components/PostEditor'), { ssr: false });

const AdminPostEditPage: NextPageWithLayout = () => {
	const titleEditMinWidth = 16;
	const router = useRouter();
	const { loggedIn } = useSelector((state: RootState) => state.auth);
	const [uploadedImages, setUploadedImages] = useState([]);
	const [post, setPost] = useState({
		id: null,
		title: 'Unknown title',
		content: null,
		viewMode: PostViewModeEnum.ONLY_ME,
		isDraft: true,
		slug: null,
	});
	const { setPageData } = useContext<any>(PageContext);
	const editorInstance = useRef<any>();
	const [titleWidth, setTitleWidth] = useState(titleEditMinWidth);
	const [{ data: queryResponse }] = useQuery({
		query: getPostQuery,
		variables: { where: { id: { equals: router.query.id } } },
		pause: !loggedIn || !router.query.id,
		requestPolicy: 'network-only',
	});
	const [, uploadImage] = useMutation(uploadImageMutation);
	const [, removeImage] = useMutation(removeImageMutation);

	useEffect(() => {
		if (queryResponse?.post) {
			const content = JSON.parse(queryResponse?.post.content);
			const uploadedImages = parsePostImages(content);
			setPost({ ...queryResponse?.post, content });
			setUploadedImages(uploadedImages);
		}
	}, [queryResponse]);

	useEffect(() => {
		setPageData(post);
	}, [post]);

	useEffect(() => {
		console.log('uploadedImages', uploadedImages.length);
	}, [uploadedImages]);

	const handleInstance = async (instance) => {
		editorInstance.current = instance;
	};

	const handleChangeInlineInput = (event) => {
		const { value } = event?.target;
		setTitleWidth(value?.length > titleEditMinWidth ? value?.length : titleEditMinWidth);
	};

	const handleTitleChange = async (value: any) => {
		const title = value.title || 'Unknown title';
		setPost({ ...post, title });
	};

	const handlePostEditorChange = async () => {
		if (editorInstance.current) {
			const _uploadedImages = parsePostImages(post.content);

			const content = await editorInstance.current.save();
			const _content = content.blocks?.length ? content : null;
			setPost((previousPost) => {
				return { ...previousPost, content: _content };
			});
			// setUploadedImages(parsePostImages(_content));
			const currentImages = parsePostImages(_content);
			console.log('images', _uploadedImages.length, currentImages.length);
		}
	};

	const handleUploadImage = async (image: any) => {
		const { data, error } = await uploadImage({ image });

		if (error) {
			return { success: false };
		}

		setUploadedImages((previous) => [...previous, data.uploadImage.url]);

		return {
			success: 1,
			file: {
				url: data.uploadImage.url,
			},
		};
	};

	const parsePostImages = (content = null) => {
		const _content = content ? content : post.content;
		let _images = [];
		// document
		// 	.querySelectorAll('.image-tool__image-picture')
		// 	.forEach((x: any) => _images.push(x.src.includes('/images/') && x.src));

		if (_content?.blocks) {
			_images = _content.blocks.filter((block) => block.type === 'image').map((block) => block.data.file.url);
		}

		return _images;
	};

	// remove image from uploadedImages
	const removeFromImageArray = (img) => {
		const _array = uploadedImages.filter((image) => image !== img);
		// setUploadedImages(() => array);
	};

	const clearEditorLeftoverImages = async (content) => {
		// Get editorJs images
		const currentImages = parsePostImages();

		console.log('images', uploadedImages.length, currentImages.length);

		if (uploadedImages.length > currentImages.length) {
			// image deleted
			for (const img of uploadedImages) {
				if (!currentImages.includes(img)) {
					try {
						// delete image from backend
						await removeImage({ imageUrl: img });
						// remove from array
						removeFromImageArray(img);
						console.log('image removed', img);
					} catch (err) {
						console.log(err.message);
					}
				}
			}
		}
	};

	const handleReady = () => {
		// setUploadedImages(parsePostImages(queryResponse?.post));
	};

	return (
		<>
			<InlineEdit
				name="title"
				initialValue={post.title}
				onSave={handleTitleChange}
				className={styles.titleInlineEdit}
				viewMode={<h1 className={styles.title}>{post.title}</h1>}
				editMode={
					<Input
						className={styles.titleInput}
						style={{ width: titleWidth + 'ch' }}
						onChange={handleChangeInlineInput}
						placeholder="Start typing..."
					/>
				}
			/>
			{router.query.id ? (
				<PostEditor
					handleInstance={handleInstance}
					data={post.content}
					onChange={handlePostEditorChange}
					onUploadImage={handleUploadImage}
					onReady={handleReady}
				/>
			) : (
				<PostEditor
					handleInstance={handleInstance}
					data={{}}
					onChange={handlePostEditorChange}
					onUploadImage={handleUploadImage}
					onReady={handleReady}
				/>
			)}
		</>
	);
};

AdminPostEditPage.getLayout = (page: ReactElement) => (
	<ProtectedLayout
		title="Post Editor"
		can={{ roles: [UserRole.ADMIN] }}
		siderMenu={<PostEditorMenu />}
		beforeContent={<PostEditorBeforeContent />}
	>
		{page}
	</ProtectedLayout>
);

export default AdminPostEditPage;
