import React, { ReactElement, useState } from 'react';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import {
	deleteUserSkillMutation,
	updateUserSkillVisibilityMutation,
	userSkillsQuery,
} from '@services/graphql/queries/userSkill';
import { RootState } from '@store/configure-store';
import { SkillLevel, getSkillLevel } from 'src/definitions/skill';
import Icon, { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Dropdown, Menu, message, PageHeader, Switch, Table } from 'antd';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import { HiDotsVertical } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

const AddUserSkillModal = dynamic(() => import('@components/modals/AddUserSkillModal'), { ssr: false });

const ProfilePage: NextPageWithLayout = () => {
	const [visibleAddUserSkillModal, setVisibleAddUserSkillModal] = useState(false);
	const userId = useSelector((state: RootState) => state.user.id);
	const [userSkills, reexecuteUserSkills] = useQuery({
		query: userSkillsQuery,
		variables: { userId },
		pause: !userId,
		requestPolicy: 'network-only',
	});
	const [, deleteUserSkill] = useMutation(deleteUserSkillMutation);
	const [userSkillVisibility, updateUserSkillVisibility] = useMutation(updateUserSkillVisibilityMutation);
	const [userSkillId, setUserSkillId] = useState<{ id: string | null; operation: 'create' | 'update' } | null>(null);

	const getSkillLevelIcon = (levelName: string): string => {
		const skillLevel: SkillLevel = getSkillLevel(levelName);
		return skillLevel.icon;
	};

	const handleEditUserSkill = (id: string) => {
		setVisibleAddUserSkillModal(true);
		setUserSkillId({ id, operation: 'update' });
	};

	const handleAddUserSkill = async () => {
		setVisibleAddUserSkillModal(false);
		setUserSkillId(null);
		await reexecuteUserSkills();
	};

	const userSkillItemMenu = (recordId?: string) => (
		<Menu
			onClick={({ key, domEvent }) => {
				domEvent.stopPropagation();
				return key === 'delete' && !!recordId && handleDeleteUserSkill(recordId);
			}}
		>
			<Menu.Item key="delete">
				<DeleteOutlined /> Delete
			</Menu.Item>
		</Menu>
	);

	const handleDeleteUserSkill = async (recordId?: string) => {
		try {
			if (recordId) {
				const { data, error } = await deleteUserSkill({ where: { id: recordId } });

				if (error) {
					message.error(error.message);
					return Promise.resolve(false);
				}

				if (!data.deleteUserSkill) {
					message.error("We can't delete this user skill");
					return Promise.resolve(false);
				}

				message.success('The user skill deleted successfully');

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

	const handleSwitchVisibility = async (recordId: string, visible: boolean) => {
		try {
			const { data } = await updateUserSkillVisibility({
				recordId,
				isVisible: visible,
			});
			userSkillVisibility.fetching = false;

			return data?.updateUserSkill.isVisible;
		} catch (error: any) {
			message.error(error.message);
			userSkillVisibility.fetching = false;
		}
	};

	return (
		<>
			<Head>
				<title>My Skills</title>
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
					<Table.Column
						title="Visible"
						width="120px"
						key="isVisible"
						dataIndex="isVisible"
						render={(data: boolean, record: UserSkill) => (
							<Switch
								checked={data}
								loading={userSkillVisibility.fetching}
								onChange={async (value: boolean, e) => {
									e.stopPropagation();
									if (record.id) {
										await handleSwitchVisibility(record.id, value);
									}
								}}
							/>
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
