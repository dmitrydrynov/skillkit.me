import React, { ReactElement, useState } from 'react';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { deleteUserSkillMutation, userSkillsQuery } from '@services/graphql/queries/userSkill';
import { RootState } from '@store/configure-store';
import { SkillLevel, getSkillLevel } from 'src/definitions/skill';
import {
	DeleteOutlined,
	EditOutlined,
	EditTwoTone,
	NotificationOutlined,
	NotificationTwoTone,
	PlusOutlined,
} from '@ant-design/icons';
import { Button, ConfigProvider, Dropdown, Grid, Menu, message, PageHeader, Table } from 'antd';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { HiDotsVertical } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

const { useBreakpoint } = Grid;
const AddUserSkillModal = dynamic(() => import('@components/modals/AddUserSkillModal'), { ssr: false });

const ProfilePage: NextPageWithLayout = () => {
	const router = useRouter();
	const screens = useBreakpoint();
	const [visibleAddUserSkillModal, setVisibleAddUserSkillModal] = useState(false);
	const userId = useSelector((state: RootState) => state.user.id);
	const [userSkills, refreshUserSkills] = useQuery({
		query: userSkillsQuery,
		pause: !userId,
		requestPolicy: 'network-only',
	});
	const [, deleteUserSkill] = useMutation(deleteUserSkillMutation);
	const [userSkillId, setUserSkillId] = useState<{ id: string | null; operation: 'create' | 'update' } | null>(null);

	const getSkillLevelIcon = (levelName: string): string => {
		const skillLevel: SkillLevel = getSkillLevel(levelName);
		return skillLevel.icon;
	};

	const handleAddUserSkill = async () => {
		setVisibleAddUserSkillModal(false);
		setUserSkillId(null);
		await refreshUserSkills();
	};

	const userSkillItemMenu = (recordId?: string) => (
		<Menu
			onClick={({ key, domEvent }) => {
				domEvent.stopPropagation();
				if (key === 'delete' && recordId) {
					handleDeleteUserSkill(recordId);
				}
				if (key === 'edit' && recordId) {
					router.push(`/user/skill/${recordId}/editor`);
				}
				if (key === 'share' && recordId) {
					console.log('share skill', recordId);
				}
			}}
		>
			{screens.sm === false && (
				<>
					<Menu.Item key="edit">
						<EditOutlined /> Edit
					</Menu.Item>
					<Menu.Item key="share">
						<NotificationOutlined /> Share
					</Menu.Item>
				</>
			)}
			<Menu.Item key="delete" danger>
				<DeleteOutlined /> Delete
			</Menu.Item>
		</Menu>
	);

	const handleDeleteUserSkill = async (recordId?: string) => {
		try {
			if (recordId) {
				const userSkillData = userSkills.data.userSkills.find((d) => d.id === recordId);
				const { data, error } = await deleteUserSkill({ where: { id: recordId } });

				if (error) {
					message.error(error.message);
					return Promise.resolve(false);
				}

				if (!data.deleteUserSkill) {
					message.error("We can't delete this user skill");
					return Promise.resolve(false);
				}

				message.success(
					<>
						The user skill <strong>{userSkillData.skill.name}</strong> deleted successfully
					</>,
				);
				await refreshUserSkills();

				return Promise.resolve(true);
			}
		} catch (error) {
			return Promise.resolve(false);
		}
	};

	const customizeRenderEmpty = () => (
		<div style={{ textAlign: 'left' }}>
			<p>You haven&apos;t listed any skills yet. You can add a new one.</p>
		</div>
	);

	return (
		<>
			<Head>
				<title>My Skills - SkillKit</title>
			</Head>
			<AddUserSkillModal
				operation={userSkillId?.operation}
				recordId={userSkillId?.id}
				visible={visibleAddUserSkillModal}
				onClose={() => setVisibleAddUserSkillModal(false)}
				onFinish={handleAddUserSkill}
			/>
			<PageHeader
				className={styles.pageHeader}
				title="Skills"
				backIcon={false}
				extra={[
					<Button
						type="primary"
						key="add-language-button"
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
			<ConfigProvider renderEmpty={customizeRenderEmpty}>
				<Table
					className={styles.skillTable}
					rowClassName={styles.skillTableRow}
					dataSource={userSkills.data?.userSkills}
					loading={userSkills.fetching}
					pagination={false}
					size="large"
				>
					<Table.Column
						title="I can"
						dataIndex={['skill', 'name']}
						key="skillName"
						ellipsis={true}
						render={(value) => <h4>{value}</h4>}
					/>
					<Table.Column
						title="Level"
						width="140px"
						dataIndex="level"
						key="level"
						responsive={['md']}
						render={(value) => (
							<>
								<Image src={getSkillLevelIcon(value)} alt="" /> {value[0].toUpperCase() + value.slice(1)}
							</>
						)}
					/>
					<Table.Column
						title="Last updated"
						width="120px"
						key="updatedAt"
						dataIndex="updatedAt"
						render={(data: unknown) => moment(data).fromNow()}
						responsive={['lg']}
					/>
					<Table.Column
						width="250px"
						key="preview"
						align="right"
						responsive={['sm']}
						render={(value, record: UserSkill) => (
							<>
								<Button
									type="text"
									size="small"
									icon={<EditTwoTone twoToneColor="#eb2f96" />}
									onClick={() => router.push(`/user/skill/${record.id}/editor`)}
								>
									Editor
								</Button>
								<Button type="text" size="small" icon={<NotificationTwoTone twoToneColor="#eb2f96" />}>
									Share
								</Button>
							</>
						)}
					/>
					<Table.Column
						width="60px"
						key="action"
						render={(data: unknown, record: UserSkill) => (
							<Dropdown overlay={userSkillItemMenu(record.id)} trigger={['click']}>
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
						)}
					/>
				</Table>
			</ConfigProvider>
		</>
	);
};

ProfilePage.getLayout = (page: ReactElement) => <ProtectedLayout title="Skills">{page}</ProtectedLayout>;

export default ProfilePage;
