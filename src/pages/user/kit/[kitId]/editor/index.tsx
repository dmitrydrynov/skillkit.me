import React, { useState, useEffect, ReactElement } from 'react';
import FileGallery from '@components/FileGallery';
import { InlineEdit } from '@components/InlineEdit';
import SkillKitEditorMenu from '@components/menus/KitEditorMenu';
import AddUserFileModal from '@components/modals/AddUserFileModal';
import EditUserFileModal from '@components/modals/EditUserFileModal';
import UserSkillEditModal from '@components/modals/UserSkillEditModal';
import UserSkillForKitModal from '@components/modals/UserSkillForKitModal';
import { hexToRgbA } from '@helpers/color';
import { capitalizedText, experienceAsText, readyText } from '@helpers/text';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { searchProfessionsQuery } from '@services/graphql/queries/profession';
import { deleteUserFileMutation } from '@services/graphql/queries/userFile';
import {
	deleteUserSkillFromKitMutation,
	editUserKitMutation,
	getUserKitQuery,
	userFilesForKitQuery,
	userJobsForKitQuery,
	userSchoolsForKitQuery,
	userToolsForKitQuery,
} from '@services/graphql/queries/userKit';
import { getSkillLevel, UserSkillViewModeEnum } from 'src/definitions/skill';
import { DeleteOutlined, EditOutlined, PlusOutlined, WarningTwoTone } from '@ant-design/icons';
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
	Popover,
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
import { FaInfoCircle } from 'react-icons/fa';
import { FiEyeOff, FiHelpCircle } from 'react-icons/fi';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

const KitEditorBeforeContent = dynamic(() => import('@components/KitEditorBeforeContent'), { ssr: false });

const SkillKitEditorPage: NextPageWithLayout = () => {
	const router = useRouter();
	const { kitId }: any = router.query;
	// State data
	const [loading, setLoading] = useState(true);
	const [width, setWidth] = useState(25);
	const [selectedKitId, setSelectedKitId] = useState<number | null>();
	const [visibleUserSkillModal, setVisibleUserSkillModal] = useState(false);
	const [visibleAddUserFile, setVisibleAddUserFileModal] = useState(false);
	const [editableAddUserFile, setEditableAddUserFile] = useState<number>(null);
	const [visibleEditUserFileModal, setVisibleEditUserFileModal] = useState(false);
	const [editableEditUserFile, setEditableEditUserFile] = useState<any>(null);
	const [visibleEditSkillModal, showEditSkillModal] = useState({ visible: false, recordId: null });
	let [professionSearchQuery, setProfessionSearchQuery] = useState(null);

	// GraphQL queries
	const [{ data: userKitData, fetching: userKitFetching, error: userKitError }, refetchUserKit] = useQuery({
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
		query: userToolsForKitQuery,
		variables: { id: kitId },
		requestPolicy: 'network-only',
		pause: !kitId,
	});
	const [{ data: userSchoolsData, fetching: userSchoolFetching }, refreshUserSchools] = useQuery({
		query: userSchoolsForKitQuery,
		variables: { id: kitId },
		requestPolicy: 'network-only',
		pause: !kitId,
	});
	const [{ data: userJobsData, fetching: userJobFetching }, refreshUserJobs] = useQuery({
		query: userJobsForKitQuery,
		variables: { id: kitId },
		requestPolicy: 'network-only',
		pause: !kitId,
	});
	const [{ data: userFilesData, fetching: userFilesFetching }, refreshUserFiles] = useQuery({
		query: userFilesForKitQuery,
		variables: { id: kitId },
		requestPolicy: 'network-only',
		pause: !kitId,
	});
	// GraphQL mutations
	const [, updateUserKitData] = useMutation(editUserKitMutation);
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
		setLoading(false);
	}, [userKitData, userKitError]);

	useEffect(() => {
		if (!professionSearchQuery) return;

		searchProfessions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [professionSearchQuery]);

	const emptyData = (dataName = 'data') => <span className={styles.descriptionEmpty}>{dataName} *</span>;

	const handleChangeInlineInput = (value) => {
		const minWidth = 20;
		setWidth(value?.length > minWidth ? value?.length + 1 : minWidth);
		setSelectedKitId(null);
	};

	const handleSaveUserKit = async (values: any) => {
		let formatedValues = values;
		let _needReturn = false;

		Object.entries(values).map(([key]) => {
			if (key === 'professionId') {
				if (!selectedKitId && !professionSearchQuery) {
					_needReturn = true;
					return;
				}

				formatedValues[key] = selectedKitId ? +selectedKitId : null;

				if (!selectedKitId) {
					formatedValues['professionName'] = professionSearchQuery.trim().toLowerCase();
				}

				setProfessionSearchQuery(null);
			}
		});

		if (_needReturn) return;

		const reponse = await updateUserKitData({ recordId: kitId, data: formatedValues });

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
		refreshUserTools();
		refreshUserSchools();
		refreshUserJobs();
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
				refreshUserTools();
				refreshUserFiles();
				refreshUserSchools();
				refreshUserJobs();
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
			<Spin spinning={loading}>
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
											name="professionId"
											initialValue={capitalizedText(userKitData?.userKit.profession.name)}
											onSave={handleSaveUserKit}
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
													onSelect={(value, option) => setSelectedKitId(option.key as number)}
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
										alignItems="flex-start"
										initialValue={userKitData?.userKit.description}
										onSave={handleSaveUserKit}
										viewMode={
											<p className={styles.description}>
												{userKitData?.userKit.description
													? readyText(userKitData?.userKit.description)
													: emptyData('Additional information about the skill kit')}
											</p>
										}
										editMode={
											<Input.TextArea
												autoSize={{ minRows: 4, maxRows: 12 }}
												className={styles.descriptionEditor}
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
														style={{
															backgroundColor: `${hexToRgbA(level.color, 0.02 * level.index)}`,
															background: `linear-gradient(105deg, ${hexToRgbA(level.color, 0.05 * level.index)} 0%, ${hexToRgbA(
																level.color,
																0,
															)} ${level.index * 20}%, rgba(255,255,255,0) ${level.index * 20}%)`,
														}}
														actions={[
															<Button
																key="edit-userskill"
																className="editItemButtons"
																size="small"
																type="primary"
																onClick={() => showEditSkillModal({ visible: true, recordId: item.id })}
															>
																<EditOutlined /> Edit
															</Button>,
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
																<Button className="editItemButtons" size="small" danger>
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
							</Space>
						</Col>
					</Row>
					<Row>
						<Col flex={1}>
							<Space direction="vertical" size={40} className={styles.collectedDataContainer}>
								<div className={styles.toolsSection}>
									<div className={styles.headerContainer}>
										<Space>
											<h2>I use for this</h2>
											<Tooltip title="This data is collected automatically from the selected user skills.">
												<Badge count={<FiHelpCircle style={{ color: '#9f9f9f' }} size={16} />} offset={[0, -6]} />
											</Tooltip>
										</Space>
									</div>
									{userToolsData?.getUserToolsForKit.length ? (
										// <List
										// 	className={styles.list}
										// 	size="small"
										// 	dataSource={userToolsData.getUserToolsForKit}
										// 	loading={userToolFetching}
										// 	renderItem={(item: any) => (
										// 		<List.Item className={styles.listItem}>
										// 			<List.Item.Meta
										// 				className={styles.listItemMeta}
										// 				title={item.workTool.name}
										// 				description={
										// 					<Space direction="horizontal">
										// 						{item.description && (
										// 							<Typography.Paragraph ellipsis={{ tooltip: item.description }}>
										// 								{readyText(item.description)}
										// 							</Typography.Paragraph>
										// 						)}
										// 					</Space>
										// 				}
										// 			/>
										// 		</List.Item>
										// 	)}
										// />
										<Space className={styles.toolsList} size="middle" direction="horizontal">
											{userToolsData.getUserToolsForKit.map((item: any, idx: number) =>
												item.description ? (
													<Badge
														count={
															<Popover
																content={item.description}
																overlayStyle={{
																	maxWidth: '50vw',
																}}
															>
																<FaInfoCircle color="#313c5d" />
															</Popover>
														}
														key={idx}
													>
														<div className={styles.toolsListItem}>{item.workTool.name}</div>
													</Badge>
												) : (
													<div className={styles.toolsListItem}>{item.workTool.name}</div>
												),
											)}
										</Space>
									) : (
										emptyData('No data about tools. You can add ones in skill settings')
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
									{userSchoolsData?.userSchoolsForKit.length ? (
										<Spin spinning={userSchoolFetching}>
											<Timeline mode="left">
												{userSchoolsData?.userSchoolsForKit.map((item: any, indx: number) => (
													<Timeline.Item key={indx}>
														<div className={styles.userSchoolListItem}>
															<div className={styles.userSchoolInfo}>
																<div className={styles.userSchoolTitle}>{item.name}</div>
																{item.userSchools.map((userSchool) => (
																	<>
																		{!!userSchool && (
																			<Space direction="vertical" style={{ display: 'block' }}>
																				<div className={styles.userSchoolRange}>
																					{moment(userSchool.startedAt).format('MMM, YYYY') +
																						' — ' +
																						(userSchool.finishedAt ? moment(userSchool.finishedAt).format('MMM, YYYY') : 'Now')}
																				</div>
																				<p className={styles.userSchoolDesc}>{readyText(userSchool?.description)}</p>
																			</Space>
																		)}
																	</>
																))}
															</div>
														</div>
													</Timeline.Item>
												))}
											</Timeline>
										</Spin>
									) : (
										emptyData('No data about schools. You can add ones in skill settings')
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
									{userJobsData?.userJobsForKit.length ? (
										<Spin spinning={userJobFetching}>
											<Timeline mode="left">
												{userJobsData?.userJobsForKit.map((item: any, indx: number) => (
													<Timeline.Item key={indx}>
														<Space size="large" className={styles.userJobListItem}>
															<div className={styles.userJobInfo}>
																{/* <div className={styles.userJobRange}>
																	{moment(item.startedAt).format('MMM, YYYY') +
																		' — ' +
																		(item.finishedAt ? moment(item.finishedAt).format('MMM, YYYY') : 'Now')}
																</div> */}
																<div className={styles.userJobTitle}>{item.name}</div>
																{/* {!!item.description && <p className={styles.userJobDesc}>{readyText(item.description)}</p>} */}
																{item.userJobs.map((userJob) => (
																	<>
																		{!!userJob && (
																			<Space direction="vertical" style={{ display: 'block' }}>
																				<div className={styles.userJobRange}>
																					<span className={styles.jobPosition}>{userJob.position}</span>,&nbsp;
																					{moment(userJob.startedAt).format('MMM, YYYY') +
																						' — ' +
																						(userJob.finishedAt ? moment(userJob.finishedAt).format('MMM, YYYY') : 'Now')}
																				</div>
																				<p className={styles.userJobDesc}>{readyText(userJob?.description)}</p>
																			</Space>
																		)}
																	</>
																))}
															</div>
														</Space>
													</Timeline.Item>
												))}
											</Timeline>
										</Spin>
									) : (
										emptyData('No data about jobs. You can add ones in skill settings')
									)}
								</div>

								{/* </Col>
					</Row> */}
								{/* <Row style={{ marginTop: '40px' }}>
						<Col flex={1}> */}
								<div className={styles.worksSection}>
									<div className={styles.headerContainer}>
										<Space>
											<h2>Work examples</h2>
											{/* <Button
											type="ghost"
											shape="circle"
											size="small"
											icon={<PlusOutlined />}
											onClick={() => {
												setVisibleAddUserFileModal(true);
												setEditableAddUserFile(null);
											}}
										/> */}
										</Space>
									</div>
									{!!userKitData && userFilesData?.getUserFilesForKit.length > 0 ? (
										<FileGallery
											onlyView
											fileList={userFilesData.getUserFilesForKit}
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
							</Space>
						</Col>
					</Row>
					<Row style={{ marginTop: '40px' }}>* An empty section will not be displayed in the public version</Row>
				</div>
			</Spin>
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
			<UserSkillEditModal
				visible={visibleEditSkillModal.visible}
				recordId={visibleEditSkillModal.recordId}
				onSave={() => {}}
				onCancel={async () => {
					showEditSkillModal({ visible: false, recordId: null });
					await refetchUserKit();
					await refreshUserTools();
					await refreshUserTools();
					await refreshUserFiles();
					await refreshUserSchools();
					await refreshUserJobs();
				}}
			/>
		</>
	);
};

SkillKitEditorPage.getLayout = (page: ReactElement) => (
	<ProtectedLayout
		title="Skill Kit Editor"
		siderMenu={<SkillKitEditorMenu />}
		beforeContent={<KitEditorBeforeContent />}
	>
		{page}
	</ProtectedLayout>
);

export default SkillKitEditorPage;
