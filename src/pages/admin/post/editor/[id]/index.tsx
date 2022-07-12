// https://medium.com/@sfazleyrabbi/next-js-editor-js-complete-setup-guide-7136c8bb694e
import { ReactElement, useContext, useEffect, useRef, useState } from 'react';
import { InlineEdit } from '@components/InlineEdit';
import PostEditorMenu from '@components/menus/PostEditorMenu';
import PostEditorBeforeContent, { PostViewModeEnum } from '@components/PostEditorBeforeContent';
import ProtectedLayout, { PageContext } from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { getPostQuery } from '@services/graphql/queries/post';
import { RootState } from '@store/configure-store';
import { UserRole } from 'src/definitions/user';
import { Input } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useQuery } from 'urql';
import styles from './style.module.less';

const PostEditor = dynamic(() => import('@components/PostEditor'), { ssr: false });

const AdminPostEditPage: NextPageWithLayout = () => {
	const titleEditMinWidth = 16;
	const router = useRouter();
	const { loggedIn } = useSelector((state: RootState) => state.auth);
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
		variables: { id: router.query.id },
		pause: !loggedIn || !router.query.id,
		requestPolicy: 'network-only',
	});

	useEffect(() => {
		if (queryResponse?.post) {
			setPost({ ...queryResponse?.post, content: JSON.parse(queryResponse?.post.content) });
		}
	}, [queryResponse]);

	useEffect(() => {
		setPageData(post);
	}, [post]);

	const handleInstance = async (instance) => {
		editorInstance.current = instance;
	};

	const handleChangeInlineInput = (event) => {
		const { value } = event?.target;
		setTitleWidth(value?.length > titleEditMinWidth ? value?.length : titleEditMinWidth);
	};

	const handleTitleSave = async (value: any) => {
		const title = value.title || 'Unknown title';
		setPost({ ...post, title });
	};

	const handlePostEditorChange = async () => {
		if (editorInstance.current) {
			const content = await editorInstance.current.save();
			const _content = content.blocks?.length ? content : null;
			setPost((previousPost) => {
				return { ...previousPost, content: _content };
			});
		}
	};

	return (
		<>
			<InlineEdit
				name="title"
				initialValue={post.title}
				onSave={handleTitleSave}
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
				<PostEditor handleInstance={handleInstance} data={post.content} imageArray={[]} onChange={handlePostEditorChange} />
			) : (
				<PostEditor handleInstance={handleInstance} data={{}} imageArray={[]} onChange={handlePostEditorChange} />
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
