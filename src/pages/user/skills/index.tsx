import React, { ReactElement, useState } from 'react';
import EmptySkills from '@assets/images/skills/empty-skills.svg';
import { capitalizedText, experienceAsText } from '@helpers/text';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { deleteUserSkillMutation, userSkillsQuery } from '@services/graphql/queries/userSkill';
import { RootState } from '@store/configure-store';
import { getSkillLevel } from 'src/definitions/skill';
import { DeleteOutlined, EditOutlined, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import {
	Button,
	ConfigProvider,
	Dropdown,
	Grid,
	Menu,
	message,
	PageHeader,
	Progress,
	Skeleton,
	Space,
	Table,
	Tooltip,
	Typography,
} from 'antd';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { HiDotsVertical } from 'react-icons/hi';
import { TbArrowsJoin } from 'react-icons/tb';
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

	const handleAddUserSkill = async () => {
		setVisibleAddUserSkillModal(false);
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
					// console.log('share skill', recordId);
				}
			}}>
			{screens.sm === false && (
				<>
					<Menu.Item key="edit">
						<EditOutlined /> Details
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
				visible={visibleAddUserSkillModal}
				onClose={() => setVisibleAddUserSkillModal(false)}
				onFinish={handleAddUserSkill}
			/>
			{!userSkills.data && <Skeleton active />}
			{userSkills.data?.userSkills.length === 0 && !userSkills.fetching && (
				<div className={styles.emptySkillsSection}>
					<Space direction="vertical" align="center" size="middle">
						<Image src={EmptySkills} alt="not found any skills" />
						<p className="text-center">You haven&apos;t listed any skills yet. You can add a new one.</p>
						<Button
							type="primary"
							key="add-language-button"
							icon={<PlusOutlined />}
							onClick={() => {
								setVisibleAddUserSkillModal(true);
							}}>
							Add first skill
						</Button>
					</Space>
				</div>
			)}
			{userSkills.data?.userSkills.length > 0 && (
				<>
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
									setVisibleAddUserSkillModal(true);
								}}>
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
							size="middle">
							<Table.Column
								title="I can"
								dataIndex={['skill', 'name']}
								key="skillName"
								ellipsis={true}
								render={(value: string, data: any) => {
									const level = getSkillLevel(data.level);

									return (
										<Space>
											<Progress
												type="circle"
												percent={level.index * 20}
												width={24}
												showInfo={false}
												strokeColor={level.color}
												strokeWidth={12}
											/>
											<div style={{ lineHeight: 'initial' }}>
												<Space align="center">
													{data.isComplexSkill && (
														<Tooltip title="This is complex skill">
															<TbArrowsJoin color="#adadad" style={{ display: 'block' }} />
														</Tooltip>
													)}
													<Typography.Text strong>
														{capitalizedText(value)}&nbsp;{data.isDraft && <span className={styles.isDraftText}>(draft)</span>}
													</Typography.Text>
												</Space>
												<br />
												<Typography.Text type="secondary" style={{ fontSize: 12 }}>
													{capitalizedText(level.label)}
												</Typography.Text>
											</div>
										</Space>
									);
								}}
							/>
							<Table.Column
								title="Experience"
								width="150px"
								key="experience"
								dataIndex="experience"
								render={(data: unknown, record: any) => experienceAsText(record.experience)}
								responsive={['lg']}
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
											onClick={() => router.push(`/user/skill/${record.id}/editor`)}>
											Details
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
											}}>
											<HiDotsVertical />
										</Button>
									</Dropdown>
								)}
							/>
						</Table>
					</ConfigProvider>
				</>
			)}
		</>
	);
};

ProfilePage.getLayout = (page: ReactElement) => <ProtectedLayout title="Skills">{page}</ProtectedLayout>;

export default ProfilePage;
