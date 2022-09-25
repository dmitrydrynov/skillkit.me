import React, { useState, useEffect, ReactElement } from 'react';
import FileGallery from '@components/FileGallery';
import { InlineEdit } from '@components/InlineEdit';
import SkillEditorMenu from '@components/menus/SkillEditorMenu';
import AddUserFileModal from '@components/modals/AddUserFileModal';
import EditUserFileModal from '@components/modals/EditUserFileModal';
import UserSkillForKitModal from '@components/modals/UserSkillForKitModal';
import { capitalizedText, experienceAsText, readyText } from '@helpers/text';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { searchProfessionsQuery } from '@services/graphql/queries/profession';
import { deleteUserFileMutation, userFilesQuery } from '@services/graphql/queries/userFile';
import { userJobsQuery } from '@services/graphql/queries/userJob';
import { deleteUserSkillFromKitMutation, getUserKitQuery } from '@services/graphql/queries/userKit';
import { userSchoolsQuery } from '@services/graphql/queries/userSchool';
import { editUserSkillMutation } from '@services/graphql/queries/userSkill';
import { userToolsQuery } from '@services/graphql/queries/userTool';
import { getSkillLevel, UserSkillViewModeEnum } from 'src/definitions/skill';
import { DeleteOutlined, PlusOutlined, WarningTwoTone } from '@ant-design/icons';
import {
	Alert,
	AutoComplete,
	Badge,
	Button,
	Col,
	Input,
	List,
	message,
	Popconfirm,
	Progress,
	Row,
	Skeleton,
	Space,
	Spin,
	Timeline,
	Tooltip,
	Typography,
} from 'antd';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BiLinkAlt, BiWorld } from 'react-icons/bi';
import { FiEyeOff, FiHelpCircle } from 'react-icons/fi';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

const SkillEditorBeforeContent = dynamic(() => import('@components/SkillEditorBeforeContent'), { ssr: false });

const SkillEditorPage: NextPageWithLayout = () => {
	const router = useRouter();
	const { kitId } = router.query;
	// State data
	const [width, setWidth] = useState(25);
	const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
	const [visibleUserSkillModal, setVisibleUserSkillModal] = useState(false);
	const [visibleAddUserFile, setVisibleAddUserFileModal] = useState(false);
	const [editableAddUserFile, setEditableAddUserFile] = useState<number>(null);
	const [visibleEditUserFileModal, setVisibleEditUserFileModal] = useState(false);
	const [editableEditUserFile, setEditableEditUserFile] = useState<any>(null);
	let [professionSearchQuery, setProfessionSearchQuery] = useState(null);

	// GraphQL queries
	const [{ data: userKitData, fetching: userKitFetching, error: userKitError }] = useQuery({
		query: getUserKitQuery,
		variables: { id: kitId },
		pause: !kitId,
		requestPolicy: 'network-only',
	});
	let [{ data: searchProfessionData }, searchProfessions] = useQuery({
		query: searchProfessionsQuery,
		variables: { search: professionSearchQuery },
		pause: professionSearchQuery === null,
		requestPolicy: 'network-only',
	});
	const [{ data: userToolsData, fetching: userToolFetching }, refreshUserTools] = useQuery({
		query: userToolsQuery,
		variables: { userSkillId: kitId },
		requestPolicy: 'network-only',
		pause: !kitId,
	});
	const [{ data: userSchoolsData, fetching: userSchoolFetching }, refreshUserSchools] = useQuery({
		query: userSchoolsQuery,
		variables: { userSkillId: kitId },
		requestPolicy: 'network-only',
		pause: !kitId,
	});
	const [{ data: userJobsData, fetching: userJobFetching }, refreshUserJobs] = useQuery({
		query: userJobsQuery,
		variables: { userSkillId: kitId },
		requestPolicy: 'network-only',
		pause: !kitId,
	});
	const [{ data: userFilesData, fetching: userFilesFetching }, refreshUserFiles] = useQuery({
		query: userFilesQuery,
		variables: { attachType: 'UserKit', attachId: kitId },
		requestPolicy: 'network-only',
		pause: !kitId,
	});
	// GraphQL mutations
	const [, updateUserSkillData] = useMutation(editUserSkillMutation);
	const [, deleteUserFile] = useMutation(deleteUserFileMutation);
	const [, deleteUserSkillFromKit] = useMutation(deleteUserSkillFromKitMutation);

	useEffect(() => {
		if (userKitError) {
			message.warning("The user skill doesn't exist. We returned you to skill list");
			router.replace('/user/skills');
		}

		if (!userKitData) {
			return;
		}

		handleChangeInlineInput(userKitData.userKit.title);
	}, [userKitData, userKitError]);

	useEffect(() => {
		if (!professionSearchQuery) return;

		searchProfessions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [professionSearchQuery]);

	const emptyData = (dataName = 'data') => (
		<span className={styles.descriptionEmpty}>
			({dataName}. An empty section will not be displayed in the public version)
		</span>
	);

	const handleChangeInlineInput = (value) => {
		const minWidth = 20;
		setWidth(value?.length > minWidth ? value?.length + 1 : minWidth);
		setSelectedSkillId(null);
	};

	const handleSaveUserSkill = async (values: any) => {
		let formatedValues = values;
		let _needReturn = false;

		Object.entries(values).map(([key]) => {
			if (key === 'kitId') {
				if (!selectedSkillId && !professionSearchQuery) {
					_needReturn = true;
					return;
				}

				formatedValues[key] = selectedSkillId ? +selectedSkillId : null;

				if (!selectedSkillId) {
					formatedValues['skillName'] = professionSearchQuery.trim().toLowerCase();
				}

				setProfessionSearchQuery(null);
			}
		});

		if (_needReturn) return;

		const reponse = await updateUserSkillData({ recordId: kitId, data: formatedValues });

		if (reponse.error) {
			message.error(reponse.error.message);
			return;
		}

		message.success('User skill updated!');
	};

	/** User user file handles */
	const handleAddUserFile = () => {
		message.success('User file added!');
		setVisibleAddUserFileModal(false);
		refreshUserFiles();
	};

	const handleSaveUserFile = () => {
		message.success('User file updated!');
		setVisibleEditUserFileModal(false);
		refreshUserFiles();
	};

	const handleSaveUserSkills = () => {
		message.success('User skills updated!');
		setVisibleUserSkillModal(false);
	};

	const handleDeleteUserFile = async (item) => {
		try {
			const deletedItems = await deleteUserFile({ where: { id: item.id } });
			if (deletedItems) {
				message.success(
					<>
						The user file <strong>{item.title}</strong> deleted
					</>,
				);
				refreshUserFiles();
			}
		} catch (error: any) {
			message.error(error.message);
		}
	};

	const handleDeleteUserSkill = async (item) => {
		try {
			const deletedItems = await deleteUserSkillFromKit({ recordId: userKitData?.userKit.id, userSkillId: item.id });

			if (deletedItems.error) {
				throw Error(deletedItems.error.message);
			}

			if (deletedItems) {
				message.success(
					<>
						The user skill <strong>{capitalizedText(item.name)}</strong> removed
					</>,
				);
				// refreshUserSkills();
			}
		} catch (error: any) {
			message.error(error.message);
		}
	};

	return (
		<>
			<Head>
				<title>Skill Kit Editor</title>
			</Head>
			<div className={styles.container}>
				<Alert
					style={{ marginBottom: '24px' }}
					message={
						<>
							You can change your name, age, city and other personal information in your{' '}
							<Link href="/settings/profile">
								<a target="_blank" rel="noreferrer">
									profile settings
								</a>
							</Link>
						</>
					}
					banner
				/>
				<Row>
					<Col xs={{ span: 24 }} lg={{ span: 16 }}>
						<Space direction="vertical" size={40} style={{ width: '100%' }}>
							<div className={styles.titleSection}>
								<div>I am</div>
								{userKitFetching ? (
									<Skeleton.Button style={{ width: 'auto', height: '30px', marginBottom: '0.5em' }} active={true} />
								) : (
									<InlineEdit
										name="kitId"
										initialValue={capitalizedText(userKitData?.userKit.profession.name)}
										onSave={handleSaveUserSkill}
										viewMode={<h2 className={styles.title}>{capitalizedText(userKitData?.userKit.profession.name)}</h2>}
										editMode={
											<AutoComplete
												showSearch
												allowClear
												className={styles.titleInput}
												style={{ width: width + 'ch' }}
												defaultActiveFirstOption={false}
												showArrow={false}
												filterOption={false}
												placeholder="To do something ..."
												notFoundContent={null}
												onChange={handleChangeInlineInput}
												onSelect={(value, option) => setSelectedSkillId(option.key as number)}
												onSearch={(value: string) => setProfessionSearchQuery(value)}
											>
												{searchProfessionData?.professions.map((d: any) => (
													<AutoComplete.Option key={d.id} value={d.name}>
														{d.name}
													</AutoComplete.Option>
												))}
											</AutoComplete>
										}
									/>
								)}
							</div>
							<div className={styles.descriptionSection}>
								<InlineEdit
									name="description"
									initialValue={userKitData?.userKit.description}
									onSave={handleSaveUserSkill}
									viewMode={
										<p className={styles.description}>
											{userKitData?.userKit.description
												? readyText(userKitData?.userKit.description)
												: emptyData('No description')}
										</p>
									}
									editMode={
										<Input.TextArea
											autoSize={{ minRows: 4, maxRows: 12 }}
											style={{ width: '100%', height: 'auto' }}
											showCount
											maxLength={500}
											placeholder="Start typing"
											defaultValue={userKitData?.userKit.description}
										/>
									}
								/>
							</div>
							<div className={styles.subSkillsSection}>
								<div className={styles.headerContainer}>
									<h2>This kit includes my following skills</h2>
									<Button
										type="ghost"
										shape="circle"
										size="small"
										icon={<PlusOutlined />}
										onClick={() => {
											setVisibleUserSkillModal(true);
										}}
									/>
								</div>
								{userKitData?.userKit.userSkills.length > 0 && (
									<List
										className={styles.list}
										size="small"
										itemLayout="horizontal"
										dataSource={userKitData?.userKit.userSkills.sort((a, b) => {
											const aLevel = getSkillLevel(a.level);
											const bLevel = getSkillLevel(b.level);

											return bLevel.index - aLevel.index;
										})}
										loading={userKitFetching}
										renderItem={(item: any) => {
											const level = getSkillLevel(item.level);

											return (
												<List.Item
													className={styles.listItem}
													actions={[
														<Popconfirm
															key="delete-userskill"
															title="Are you sure to delete this user skill?"
															onConfirm={() => {
																handleDeleteUserSkill(item);
															}}
															okText="Yes"
															cancelText="No"
															icon={<WarningTwoTone />}
														>
															<Button key="editItemButtons" className="editItemButtons" size="small">
																<DeleteOutlined />
															</Button>
														</Popconfirm>,
													]}
												>
													<List.Item.Meta
														avatar={
															<Tooltip title={level.description}>
																<Progress
																	type="circle"
																	percent={level.index * 20}
																	width={24}
																	showInfo={false}
																	strokeColor={level.color}
																	strokeWidth={12}
																/>
															</Tooltip>
														}
														title={
															<div style={{ lineHeight: 'initial' }}>
																<Space align="center">
																	<Typography.Text strong>{capitalizedText(item.skill.name)}</Typography.Text>
																</Space>
																<br />
																<Typography.Text type="secondary" style={{ fontSize: 12 }}>
																	{experienceAsText(item.experience)}
																</Typography.Text>
															</div>
														}
													/>
													<div>
														{
															<>
																{item.viewMode === UserSkillViewModeEnum.ONLY_ME && (
																	<Tooltip title="View mode: only me">
																		<FiEyeOff />
																	</Tooltip>
																)}
																{item.viewMode === UserSkillViewModeEnum.BY_LINK && (
																	<Tooltip title="View mode: by link">
																		<BiLinkAlt />
																	</Tooltip>
																)}
																{item.viewMode === UserSkillViewModeEnum.EVERYONE && (
																	<Tooltip title="View mode: everyone">
																		<BiWorld />
																	</Tooltip>
																)}
															</>
														}
													</div>
												</List.Item>
											);
										}}
									/>
								)}
							</div>
							<div className={styles.toolsSection}>
								<div className={styles.headerContainer}>
									<Space>
										<h2>I use for this</h2>
										<Tooltip title="This data is collected automatically from the selected user skills.">
											<Badge count={<FiHelpCircle style={{ color: '#9f9f9f' }} size={16} />} offset={[0, -6]} />
										</Tooltip>
									</Space>
								</div>
								{userToolsData?.userTools.length ? (
									<List
										className={styles.list}
										size="small"
										dataSource={userToolsData.userTools}
										loading={userToolFetching}
										renderItem={(item: any) => (
											<List.Item className={styles.listItem}>
												<List.Item.Meta
													className={styles.listItemMeta}
													title={item.title}
													description={
														<Space direction="horizontal">
															{item.description && (
																<Typography.Paragraph ellipsis={{ tooltip: item.description }}>
																	{readyText(item.description)}
																</Typography.Paragraph>
															)}
														</Space>
													}
												/>
											</List.Item>
										)}
									/>
								) : (
									emptyData('No tools')
								)}
							</div>
							<div className={styles.schoolsSection}>
								<div className={styles.headerContainer}>
									<Space>
										<h2>I learned this skill in</h2>
										<Tooltip title="This data is collected automatically from the selected user skills.">
											<Badge count={<FiHelpCircle style={{ color: '#9f9f9f' }} size={16} />} offset={[0, -6]} />
										</Tooltip>
									</Space>
								</div>
								{userSchoolsData?.userSchools.length ? (
									<Spin spinning={userSchoolFetching}>
										<Timeline mode="left">
											{userSchoolsData?.userSchools.map((item: any, indx: number) => (
												<Timeline.Item key={indx}>
													<Space size="large" className={styles.userSchoolListItem}>
														<div className={styles.userSchoolInfo}>
															<div className={styles.userSchoolRange}>
																{moment(item.startedAt).format('MMM, YYYY') +
																	' — ' +
																	(item.finishedAt ? moment(item.finishedAt).format('MMM, YYYY') : 'Now')}
															</div>
															<div className={styles.userSchoolTitle}>{item.title}</div>
															{!!item.description && <p className={styles.userSchoolDesc}>{readyText(item.description)}</p>}
														</div>
													</Space>
												</Timeline.Item>
											))}
										</Timeline>
									</Spin>
								) : (
									emptyData('No data about schools')
								)}
							</div>
							<div className={styles.jobsSection}>
								<div className={styles.headerContainer}>
									<Space>
										<h2>I used this skill in the following jobs</h2>
										<Tooltip title="This data is collected automatically from the selected user skills.">
											<Badge count={<FiHelpCircle style={{ color: '#9f9f9f' }} size={16} />} offset={[0, -6]} />
										</Tooltip>
									</Space>
								</div>
								{userJobsData?.userJobs.length ? (
									<Spin spinning={userJobFetching}>
										<Timeline mode="left">
											{userJobsData?.userJobs.map((item: any, indx: number) => (
												<Timeline.Item key={indx}>
													<Space size="large" className={styles.userJobListItem}>
														<div className={styles.userJobInfo}>
															<div className={styles.userJobRange}>
																{moment(item.startedAt).format('MMM, YYYY') +
																	' — ' +
																	(item.finishedAt ? moment(item.finishedAt).format('MMM, YYYY') : 'Now')}
															</div>
															<div className={styles.userJobTitle}>
																{item.userCompany.name} — {item.position}
															</div>
															{!!item.description && <p className={styles.userJobDesc}>{readyText(item.description)}</p>}
														</div>
													</Space>
												</Timeline.Item>
											))}
										</Timeline>
									</Spin>
								) : (
									emptyData('No data about jobs')
								)}
							</div>
						</Space>
					</Col>
				</Row>
				<Row style={{ marginTop: '40px' }}>
					<Col flex={1}>
						<div className={styles.worksSection}>
							<div className={styles.headerContainer}>
								<Space>
									<h2>Work examples</h2>
									<Button
										type="ghost"
										shape="circle"
										size="small"
										icon={<PlusOutlined />}
										onClick={() => {
											setVisibleAddUserFileModal(true);
											setEditableAddUserFile(null);
										}}
									/>
								</Space>
							</div>
							{userFilesData?.userFiles.length > 0 ? (
								<FileGallery
									fileList={userFilesData.userFiles}
									onDelete={handleDeleteUserFile}
									onEdit={(record) => {
										setVisibleEditUserFileModal(true);
										setEditableEditUserFile(record);
									}}
								/>
							) : (
								emptyData('No any examples')
							)}
						</div>
					</Col>
				</Row>
			</div>
			<UserSkillForKitModal
				userKit={userKitData?.userKit}
				visible={visibleUserSkillModal}
				onSave={handleSaveUserSkills}
				onCancel={() => {
					setVisibleUserSkillModal(false);
				}}
			/>
			<AddUserFileModal
				attachTo="UserKit"
				attachId={kitId as string}
				visible={visibleAddUserFile}
				recordId={editableAddUserFile}
				onSave={handleAddUserFile}
				onCancel={() => {
					setEditableAddUserFile(null);
					setVisibleAddUserFileModal(false);
				}}
			/>
			<EditUserFileModal
				visible={visibleEditUserFileModal}
				record={editableEditUserFile}
				onSave={handleSaveUserFile}
				onCancel={() => {
					setEditableEditUserFile(null);
					setVisibleEditUserFileModal(false);
				}}
			/>
		</>
	);
};

SkillEditorPage.getLayout = (page: ReactElement) => (
	<ProtectedLayout title="Skill Editor" siderMenu={<SkillEditorMenu />} beforeContent={<SkillEditorBeforeContent />}>
		{page}
	</ProtectedLayout>
);

export default SkillEditorPage;
