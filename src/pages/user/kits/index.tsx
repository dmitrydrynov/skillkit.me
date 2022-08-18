import React, { ReactElement, useState } from 'react';
import EmptySkills from '@assets/images/skills/empty-skills.svg';
import { capitalizedText } from '@helpers/text';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { userKitsQuery } from '@services/graphql/queries/userKit';
import { deleteUserKitMutation } from '@services/graphql/queries/userKit';
import { RootState } from '@store/configure-store';
import { DeleteOutlined, EditOutlined, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import {
	Button,
	ConfigProvider,
	Dropdown,
	Grid,
	Menu,
	message,
	PageHeader,
	Skeleton,
	Space,
	Table,
	Typography,
} from 'antd';
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
const AddUserKitModal = dynamic(() => import('@components/modals/AddUserKitModal'), { ssr: false });

const UserKitsPage: NextPageWithLayout = () => {
	const router = useRouter();
	const screens = useBreakpoint();
	const [visibleAddUserKitModal, setVisibleAddUserKitModal] = useState(false);
	const userId = useSelector((state: RootState) => state.user.id);
	const [userKits, refreshUserKits] = useQuery({
		query: userKitsQuery,
		pause: !userId,
		requestPolicy: 'network-only',
	});
	const [, deleteUserKit] = useMutation(deleteUserKitMutation);

	const handleAddUserKit = async () => {
		setVisibleAddUserKitModal(false);
		await refreshUserKits();
	};

	const userKitItemMenu = (recordId?: string) => (
		<Menu
			onClick={({ key, domEvent }) => {
				domEvent.stopPropagation();
				if (key === 'delete' && recordId) {
					handleDeleteUserKit(recordId);
				}
				if (key === 'edit' && recordId) {
					router.push(`/user/kit/${recordId}/editor`);
				}
			}}
		>
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

	const handleDeleteUserKit = async (recordId?: string) => {
		try {
			if (recordId) {
				const userKitData = userKits.data.userKits.find((d) => d.id === recordId);
				const { data, error } = await deleteUserKit({ where: { id: recordId } });

				if (error) {
					message.error(error.message);
					return Promise.resolve(false);
				}

				if (!data.deleteUserKit) {
					message.error("We can't delete this skill kit");
					return Promise.resolve(false);
				}

				message.success(
					<>
						The skill kit <strong>{userKitData.profession.name}</strong> deleted successfully
					</>,
				);
				await refreshUserKits();

				return Promise.resolve(true);
			}
		} catch (error) {
			return Promise.resolve(false);
		}
	};

	const customizeRenderEmpty = () => (
		<div style={{ textAlign: 'left' }}>
			<p>You haven&apos;t listed any kit kits yet. You can add a new one.</p>
		</div>
	);

	return (
		<>
			<Head>
				<title>My Skill Kits - Skillkit</title>
			</Head>
			<AddUserKitModal
				visible={visibleAddUserKitModal}
				onClose={() => setVisibleAddUserKitModal(false)}
				onFinish={handleAddUserKit}
			/>
			{!userKits.data && <Skeleton active />}
			{userKits.data?.userKits.length === 0 && !userKits.fetching && (
				<div className={styles.emptySection}>
					<Space direction="vertical" align="center" size="middle">
						<Image src={EmptySkills} alt="not found any kits" />
						<p className="text-center">You haven&apos;t listed any kit kits yet. You can add a new one.</p>
						<Button
							type="primary"
							key="add-language-button"
							icon={<PlusOutlined />}
							onClick={() => {
								setVisibleAddUserKitModal(true);
							}}
						>
							Add first kit
						</Button>
					</Space>
				</div>
			)}
			{userKits.data?.userKits.length > 0 && (
				<>
					<PageHeader
						className={styles.pageHeader}
						title="My skill kits"
						backIcon={false}
						extra={[
							<Button
								type="primary"
								key="add-language-button"
								icon={<PlusOutlined />}
								onClick={() => {
									setVisibleAddUserKitModal(true);
								}}
							>
								Add kit
							</Button>,
						]}
					/>
					<ConfigProvider renderEmpty={customizeRenderEmpty}>
						<Table
							className={styles.table}
							rowClassName={styles.tableRow}
							dataSource={userKits.data?.userKits}
							loading={userKits.fetching}
							pagination={false}
							size="middle"
						>
							<Table.Column
								title="I am"
								dataIndex={['profession', 'name']}
								key="professionName"
								ellipsis={true}
								render={(value: string, data: any) => {
									return (
										<Space align="center">
											<Typography.Text strong>
												{capitalizedText(value)}&nbsp;{data.isDraft && <span className={styles.isDraftText}>(draft)</span>}
											</Typography.Text>
										</Space>
									);
								}}
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
								render={(value, record: UserKit) => (
									<>
										<Button
											type="text"
											size="small"
											icon={<EditTwoTone twoToneColor="#eb2f96" />}
											onClick={() => router.push(`/user/kit/${record.id}/editor`)}
										>
											Details
										</Button>
									</>
								)}
							/>
							<Table.Column
								width="60px"
								key="action"
								render={(data: unknown, record: UserKit) => (
									<Dropdown overlay={userKitItemMenu(record.id)} trigger={['click']}>
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
			)}
		</>
	);
};

UserKitsPage.getLayout = (page: ReactElement) => <ProtectedLayout title="Skills">{page}</ProtectedLayout>;

export default UserKitsPage;
