import { ReactElement, useEffect, useState } from 'react';
import AdminMenu from '@components/menus/AdminMenu';
import { capitalizedText } from '@helpers/text';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { skillsDataQuery } from '@services/graphql/queries/skill';
import { RootState } from '@store/configure-store';
import { UserRole } from 'src/definitions/user';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useQuery } from 'urql';
import styles from './style.module.less';

interface DataType {
	id: number;
	name: string;
	createdAt: string;
}

const AdminSkillsPage: NextPageWithLayout = () => {
	const { loggedIn } = useSelector((state: RootState) => state.auth);
	const [{ data: responseSkillsData }] = useQuery({
		query: skillsDataQuery,
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
			title: 'Skill',
			dataIndex: 'name',
			key: 'name',
			render: (value) => <b>{capitalizedText(value)}</b>,
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
		if (responseSkillsData?.skills) {
			setPrepareData(
				responseSkillsData.skills.map((user) => {
					return {
						id: user.id,
						name: user.name,
						createdAt: user.createdAt,
					};
				}),
			);
		}
	}, [responseSkillsData]);

	return (
		<>
			<Table className={styles.skillsTable} columns={columns} dataSource={prepareData} />
		</>
	);
};

AdminSkillsPage.getLayout = (page: ReactElement) => (
	<ProtectedLayout
		title="Skills"
		can={{ roles: [UserRole.ADMIN] }}
		siderMenu={<AdminMenu selectedItem="/admin/skills" />}>
		{page}
	</ProtectedLayout>
);

export default AdminSkillsPage;
