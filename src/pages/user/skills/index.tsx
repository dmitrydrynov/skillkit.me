import React, { ReactElement, useState } from 'react';
import AddUserSkillModal from '@components/modals/AddUserSkillModal';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { userSkillsQuery } from '@services/graphql/queries/userSkill';
import { RootState } from '@store/configure-store';
import { SkillLevel, getSkillLevel } from 'src/definitions/skill';
import { PlusOutlined } from '@ant-design/icons';
import { Button, List, PageHeader, Skeleton, Table } from 'antd';
import Head from 'next/head';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useQuery } from 'urql';
import styles from './SkillsPage.module.less';

const ProfilePage: NextPageWithLayout = () => {
	const [visibleAddUserSkillModal, setVisibleAddUserSkillModal] = useState(false);
	const userId = useSelector((state: RootState) => state.user.id);
	const [userSkillsList] = useQuery({
		query: userSkillsQuery,
		variables: { userId },
		pause: !userId,
	});
	const [userSkillId, setUserSkillId] = useState<string | null>(null);

	const getSkillLevelIcon = (levelName: string): string => {
		const skillLevel: SkillLevel = getSkillLevel(levelName);
		return skillLevel.icon;
	};

	const handleEditUserSkill = (id: string) => {
		setVisibleAddUserSkillModal(true);
		setUserSkillId(id);
	};

	return (
		<>
			<Head>
				<title>My Skills</title>
			</Head>
			{visibleAddUserSkillModal && (
				<AddUserSkillModal
					recordId={userSkillId}
					visible={visibleAddUserSkillModal}
					onClose={() => setVisibleAddUserSkillModal(false)}
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
							setUserSkillId(null);
							setVisibleAddUserSkillModal(true);
						}}
					>
						Add skill
					</Button>,
				]}
			/>
			{/* {userSkillsList.fetching && <Skeleton loading={userSkillsList.fetching} active title round></Skeleton>}
			{userSkillsList.data?.userSkills && ( */}
			{/* // <List
				// 	itemLayout="horizontal"
				// 	dataSource={userSkillsList.data?.userSkills}
				// 	locale={{ emptyText: 'No any skills yet. Add please the first.' }}
				// 	renderItem={(item: any) => (
				// 		<List.Item className={styles.item} onClick={() => handleEditUserSkill(item.id)}>
				// 			<List.Item.Meta
				// 				title={item.skill.name}
				// 				description={
				// 					<>
				// 						<p>
				// 							<Image src={getSkillLevelIcon(item.level)} alt="" /> {item.level}
				// 						</p>
				// 					</>
				// 				}
				// 			/>
				// 		</List.Item>
				// 	)}
				// /> */}
			<Table
				className={styles.skillTable}
				rowClassName={styles.skillTableRow}
				dataSource={userSkillsList.data?.userSkills}
				loading={userSkillsList.fetching}
				size="large"
			>
				<Table.Column title="I can" dataIndex={['skill', 'name']} key="skillName" ellipsis={true} />
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
