import React, { ReactElement, useState } from 'react';
import AddUserSkillModal from '@components/modals/AddUserSkillModal';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { userSkillsQuery } from '@services/graphql/queries/userSkill';
import { RootState } from '@store/configure-store';
import { SkillLevel, getSkillLevel } from 'src/definitions/skill';
import { PlusOutlined } from '@ant-design/icons';
import { Button, PageHeader, Table } from 'antd';
import Head from 'next/head';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useQuery } from 'urql';
import styles from './SkillsPage.module.less';

const ProfilePage: NextPageWithLayout = () => {
	const [visibleAddUserSkillModal, setVisibleAddUserSkillModal] = useState(false);
	const userId = useSelector((state: RootState) => state.user.id);
	const [userSkills, reexecuteUserSkills] = useQuery({
		query: userSkillsQuery,
		variables: { userId },
		pause: !userId,
	});
	const [userSkillId, setUserSkillId] = useState<{ id: string | null; operation: 'create' | 'edit' } | null>(null);

	const getSkillLevelIcon = (levelName: string): string => {
		const skillLevel: SkillLevel = getSkillLevel(levelName);
		return skillLevel.icon;
	};

	const handleEditUserSkill = (id: string) => {
		setVisibleAddUserSkillModal(true);
		setUserSkillId({ id, operation: 'edit' });
	};

	const handleAddUserSkill = () => {
		setVisibleAddUserSkillModal(false);
		setUserSkillId(null);
		reexecuteUserSkills();
	};

	return (
		<>
			<Head>
				<title>My Skills</title>
			</Head>
			{visibleAddUserSkillModal && (
				<AddUserSkillModal
					operation={userSkillId?.operation}
					recordId={userSkillId?.id}
					visible={visibleAddUserSkillModal}
					onClose={() => setVisibleAddUserSkillModal(false)}
					onFinish={handleAddUserSkill}
				/>
			)}
			<PageHeader
				className={styles.pageHeader}
				title="Skills"
				backIcon={false}
				extra={[
					<Button
						type="primary"
						key="add-skill-button"
						icon={<PlusOutlined />}
						onClick={() => {
							setUserSkillId({ id: null, operation: 'create' });
							setVisibleAddUserSkillModal(true);
						}}
					>
						Add skill
					</Button>,
				]}
			/>
			<Table
				className={styles.skillTable}
				rowClassName={styles.skillTableRow}
				dataSource={userSkills.data?.userSkills}
				loading={userSkills.fetching}
				size="large"
				onRow={(record) => {
					return {
						onClick: (event) => {
							handleEditUserSkill(record.id);
						},
					};
				}}
			>
				<Table.Column
					title="I can"
					dataIndex={['skill', 'name']}
					key="skillName"
					ellipsis={true}
					render={(value, record: any) => (
						<>
							<h4>{value}</h4>
							{record.tools.length > 0 && (
								<span>Use: {record.tools.map((t: { title: string }) => t.title).join(', ')}</span>
							)}
						</>
					)}
				/>
				<Table.Column
					title="Level"
					width="140px"
					dataIndex="level"
					key="level"
					render={(value) => (
						<>
							<Image src={getSkillLevelIcon(value)} alt="" /> {value[0].toUpperCase() + value.slice(1)}
						</>
					)}
				/>
			</Table>
			{/* )} */}
		</>
	);
};

ProfilePage.getLayout = (page: ReactElement) => <ProtectedLayout title="Skills">{page}</ProtectedLayout>;

export default ProfilePage;
