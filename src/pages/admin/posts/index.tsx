import { ReactElement, useEffect, useState } from 'react';
import AdminMenu from '@components/menus/AdminMenu';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { deletePostMutation, postsDataQuery } from '@services/graphql/queries/post';
import { RootState } from '@store/configure-store';
import { UserRole } from 'src/definitions/user';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Menu, message, PageHeader, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import Avvvatars from 'avvvatars-react';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HiDotsVertical } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

interface DataType {
	id: number;
	name: string;
	createdAt: string;
}

const AdminPostsPage: NextPageWithLayout = () => {
	const router = useRouter();
	const { loggedIn } = useSelector((state: RootState) => state.auth);
	const [{ data: responsePostsData }, refreshPosts] = useQuery({
		query: postsDataQuery,
		pause: !loggedIn,
		requestPolicy: 'network-only',
	});
	const [prepareData, setPrepareData] = useState([]);
	const [, deletePost] = useMutation(deletePostMutation);

	const postItemMenu = (recordId?: string) => (
		<Menu
			onClick={({ key, domEvent }) => {
				domEvent.stopPropagation();

				if (key === 'delete' && recordId) {
					handleDeletePost(recordId);
				}
			}}
		>
			<Menu.Item key="delete" danger>
				<DeleteOutlined /> Delete
			</Menu.Item>
		</Menu>
	);

	const handleDeletePost = async (recordId?: string) => {
		try {
			if (recordId) {
				const { data, error } = await deletePost({ where: { id: recordId } });

				if (error) {
					message.error(error.message);
					return Promise.resolve(false);
				}

				if (!data.deletePost) {
					message.error("We can't delete this user skill");
					return Promise.resolve(false);
				}

				message.success('The post deleted successfully');
				await refreshPosts();
				return Promise.resolve(true);
			}
		} catch (error) {
			return Promise.resolve(false);
		}
	};

	const columns: ColumnsType<DataType> = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			sorter: (a, b) => a.id - b.id,
			width: 60,
		},
		{
			title: 'Post',
			dataIndex: 'title',
			key: 'title',
			render: (title, post) => <Link href={`/admin/post/editor/${post.id}`}>{title}</Link>,
		},
		{
			title: 'Author',
			dataIndex: 'author',
			key: 'author',
			render: (author) => {
				return (
					<Space>
						{author.avatar ? (
							<Avatar size={24} src={author.avatar} />
						) : (
							<Avvvatars value={author.email} style="shape" size={24} border />
						)}
						{author.fullName}
					</Space>
				);
			},
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 200,
			defaultSortOrder: 'descend',
			sorter: (a, b) => {
				const _a = moment(a.createdAt);
				const _b = moment(b.createdAt);
				return _a.diff(_b);
			},
			render: (value) => moment(value).format('DD/MM/YYYY, h:mm:ss'),
		},
		{
			key: 'actions',
			width: 60,
			render: (data: any, record: any) => (
				<Dropdown overlay={postItemMenu(record.id)} trigger={['click']}>
					<Button
						type="text"
						size="small"
						className="ant-dropdown-link"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						<HiDotsVertical />
					</Button>
				</Dropdown>
			),
		},
	];

	useEffect(() => {
		if (responsePostsData?.posts) {
			setPrepareData(
				responsePostsData.posts.map((post) => {
					return {
						id: post.id,
						title: post.title,
						author: post.author,
						createdAt: post.createdAt,
					};
				}),
			);
		}
	}, [responsePostsData]);

	return (
		<>
			<PageHeader
				className={styles.pageHeader}
				title="Posts"
				backIcon={false}
				extra={[
					<Button
						type="primary"
						key="add-post-button"
						icon={<PlusOutlined />}
						onClick={() => {
							router.push(`/admin/post/editor`);
						}}
					>
						New post
					</Button>,
				]}
			/>
			<Table className={styles.postsTable} columns={columns} dataSource={prepareData} />
		</>
	);
};

AdminPostsPage.getLayout = (page: ReactElement) => (
	<ProtectedLayout title="Posts" can={{ roles: [UserRole.ADMIN] }} siderMenu={<AdminMenu selectedItem="/admin/posts" />}>
		{page}
	</ProtectedLayout>
);

export default AdminPostsPage;
