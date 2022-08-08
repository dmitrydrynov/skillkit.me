import { ReactElement, useEffect, useState } from 'react';
import AdminMenu from '@components/menus/AdminMenu';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { usersDataQuery } from '@services/graphql/queries/user';
import { RootState } from '@store/configure-store';
import { UserRole } from 'src/definitions/user';
import { Avatar, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import Avvvatars from 'avvvatars-react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useQuery } from 'urql';
import styles from './style.module.less';

interface DataType {
	id: number;
	fullname: string;
	email: string;
	role: UserRole | string;
	avatar?: string;
	age?: number;
	createdAt: string;
}

const AdminUsersPage: NextPageWithLayout = () => {
	const { loggedIn } = useSelector((state: RootState) => state.auth);
	const [{ data: responseUsersData, fetching }] = useQuery({
		query: usersDataQuery,
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
			responsive: ['lg'],
		},
		{
			title: 'User',
			dataIndex: 'fullname',
			key: 'fullname',
			render: (text, user) => {
				return (
					<Space>
						{user.avatar ? (
							<Avatar size={24} src={user.avatar} />
						) : (
							<Avvvatars value={user.email} style="shape" size={24} border />
						)}
						<b>{text}</b>
					</Space>
				);
			},
		},
		{
			title: 'Age',
			dataIndex: 'age',
			key: 'age',
			sorter: (a, b) => a.age - b.age,
			responsive: ['lg'],
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			responsive: ['lg'],
		},
		{
			title: 'Role',
			dataIndex: 'role',
			key: 'role',
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
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
		if (responseUsersData?.users) {
			setPrepareData(
				responseUsersData.users.map((user) => {
					return {
						id: user.id,
						fullname: user.fullName,
						email: user.email,
						role: user.role?.name,
						createdAt: user.createdAt,
						age: user.age,
						avatar: user.avatar,
					};
				}),
			);
		}
	}, [responseUsersData]);

	return (
		<>
			<Table loading={fetching} className={styles.usersTable} columns={columns} dataSource={prepareData} />
		</>
	);
};

AdminUsersPage.getLayout = (page: ReactElement) => (
	<ProtectedLayout title="Users" can={{ roles: [UserRole.ADMIN] }} siderMenu={<AdminMenu selectedItem="/admin/users" />}>
		{page}
	</ProtectedLayout>
);

export default AdminUsersPage;
