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
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Input, message, Spin, Upload, UploadProps } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BiImageAdd } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

const PostEditor = dynamic(() => import('@components/PostEditor'), { ssr: false });

const AdminPostEditPage: NextPageWithLayout = () => {
	const titleEditMinWidth = 16;
	const router = useRouter();
	const { loggedIn } = useSelector((state: RootState) => state.auth);
	const [uploadedImages, setUploadedImages] = useState([]);
	const [featureImage, setFeatureImage] = useState<{ url: string; width: number; height: number }>();
	const [featureLoading, setFeatureLoading] = useState(false);
	const [post, setPost] = useState({
		id: null,
		title: 'Unknown title',
		content: null,
		viewMode: PostViewModeEnum.ONLY_ME,
		isDraft: true,
		slug: null,
		description: null,
		featureImage: null,
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
			if (queryResponse?.post.featureImage) {
				setFeatureImage({ url: queryResponse?.post.featureImage, width: null, height: null });
			}
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

	const coverProps: UploadProps = {
		name: 'featureImage',
		accept: 'image/*',
		multiple: false,
		showUploadList: false,
		async customRequest(options) {
			const { onSuccess, onError, file } = options;

			try {
				const { data, error } = await uploadImage({ image: file });

				if (error) {
					onError(error);
					return false;
				}

				setFeatureImage(data.uploadImage);
				setPost({ ...post, featureImage: data.uploadImage.url });
				console.log('uploadImage', data);
				onSuccess('Ok');
			} catch (error: any) {
				onError(error);
			}
		},
		onChange(info) {
			const { status } = info.file;
			if (status === 'uploading') {
				setFeatureLoading(true);
			}
			if (status === 'done') {
				setFeatureLoading(false);
			} else if (status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
				setFeatureLoading(false);
			}
		},
	};

	const handleFeatureImageRemove = async () => {
		if (featureImage) {
			await removeImage({ imageUrl: featureImage.url });
			setPost({ ...post, featureImage: null });
			setFeatureImage(null);
		}
	};

	return (
		<>
			{featureImage ? (
				<div className={styles.featureImage}>
					<Image
						layout="fill"
						placeholder="empty"
						objectFit="cover"
						src={featureImage.url}
						width={featureImage.width}
						height={featureImage.height}
						alt={`feature image for ${post.title}`}
					/>
					<Button shape="circle" size="small" className={styles.featureImageDelBtn} onClick={handleFeatureImageRemove}>
						<DeleteOutlined />
					</Button>
				</div>
			) : (
				<Spin spinning={featureLoading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
					<Upload {...coverProps} className={styles.coverUpload}>
						<Button icon={<BiImageAdd size={24} />} type="text" style={{ width: '100%' }}>
							Add cover
						</Button>
					</Upload>
				</Spin>
			)}
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
		beforeContent={<PostEditorBeforeContent />}>
		{page}
	</ProtectedLayout>
);

export default AdminPostEditPage;
