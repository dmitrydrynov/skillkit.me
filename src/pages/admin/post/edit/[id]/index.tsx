// https://medium.com/@sfazleyrabbi/next-js-editor-js-complete-setup-guide-7136c8bb694e
import { ReactElement, useEffect, useState } from 'react';
import AdminMenu from '@components/menus/AdminMenu';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { getPostQuery } from '@services/graphql/queries/post';
import { RootState } from '@store/configure-store';
import { UserRole } from 'src/definitions/user';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useQuery } from 'urql';

const PostEditor = dynamic(() => import('@components/PostEditor'), { ssr: false });

const AdminPostEditPage: NextPageWithLayout = () => {
	const router = useRouter();
	const { loggedIn } = useSelector((state: RootState) => state.auth);
	const [post, setPost] = useState(null);
	const [editorInstance, setEditorInstance] = useState({});
	const [{ data: queryResponse }] = useQuery({
		query: getPostQuery,
		variables: { id: router.query.id },
		pause: !loggedIn || !router.query.id,
		requestPolicy: 'network-only',
	});

	useEffect(() => {
		if (queryResponse?.post) {
			setPost(queryResponse?.post);
		}
	}, [queryResponse]);

	const handleInstance = (instance) => {
		setEditorInstance(instance);
	};

	return (
		<>
			<h1>{post?.title}</h1>
			{PostEditor && <PostEditor handleInstance={handleInstance} data={null} imageArray={[]} />}
		</>
	);
};

AdminPostEditPage.getLayout = (page: ReactElement) => (
	<ProtectedLayout title="Posts" can={{ roles: [UserRole.ADMIN] }} siderMenu={<AdminMenu selectedItem="/admin/posts" />}>
		{page}
	</ProtectedLayout>
);

export default AdminPostEditPage;
