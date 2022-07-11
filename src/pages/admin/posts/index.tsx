import { ReactElement, useEffect, useState } from 'react';
import AdminMenu from '@components/menus/AdminMenu';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { postsDataQuery } from '@services/graphql/queries/post';
import { RootState } from '@store/configure-store';
import { UserRole } from 'src/definitions/user';
import { Avatar, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import Avvvatars from 'avvvatars-react';
import moment from 'moment';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useQuery } from 'urql';
import styles from './style.module.less';

interface DataType {
	id: number;
	name: string;
	createdAt: string;
}

const AdminPostsPage: NextPageWithLayout = () => {
	const { loggedIn } = useSelector((state: RootState) => state.auth);
	const [{ data: responsePostsData }] = useQuery({
		query: postsDataQuery,
		pause: !loggedIn,
		requestPolicy: 'network-only',
	});
	const [prepareData, setPrepareData] = useState([]);
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
			render: (title, post) => <Link href={`/admin/post/edit/${post.id}`}>{title}</Link>,
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
