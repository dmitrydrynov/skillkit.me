import React, { ReactElement, useState, useEffect, createRef } from 'react';
import FileGallery from '@components/FileGallery';
import { InlineEdit } from '@components/InlineEdit';
import SkillEditorMenu from '@components/menus/SkillEditorMenu';
import AddUserFileModal from '@components/modals/AddUserFileModal';
import EditUserFileModal from '@components/modals/EditUserFileModal';
import UserJobModal from '@components/modals/UserJobModal';
import UserSchoolModal from '@components/modals/UserSchoolModal';
import UserToolModal from '@components/modals/UserToolModal';
import { capitalizedText, readyText } from '@helpers/text';
import ProtectedLayout from '@layouts/ProtectedLayout';
import { NextPageWithLayout } from '@pages/_app';
import { createSkillMutation, searchSkillsQuery } from '@services/graphql/queries/skill';
import { deleteUserFileMutation, userFilesQuery } from '@services/graphql/queries/userFile';
import { deleteUserJobMutation, userJobsQuery } from '@services/graphql/queries/userJob';
import { deleteUserSchoolMutation, userSchoolsQuery } from '@services/graphql/queries/userSchool';
import { editUserSkillMutation, getUserSkillQuery } from '@services/graphql/queries/userSkill';
import { deleteUserToolMutation, userToolsQuery } from '@services/graphql/queries/userTool';
import { getSkillLevel, SkillLevel, skillLevelsList } from 'src/definitions/skill';
import { DeleteOutlined, EditOutlined, PlusOutlined, WarningTwoTone } from '@ant-design/icons';
import {
	AutoComplete,
	Button,
	Col,
	Dropdown,
	Input,
	List,
	Menu,
	message,
	Popconfirm,
	Progress,
	Row,
	Select,
	Skeleton,
	Space,
	Spin,
	Timeline,
	Tooltip,
	Typography,
} from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import moment from 'moment';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

const SkillEditorPage: NextPageWithLayout = () => {
	const router = useRouter();
	const skillRef = createRef<RefSelectProps>();
	const { skillId } = router.query;
	// State data
	const [experience, setExperience] = useState(0);
	const [level, setLevel] = useState<SkillLevel>(skillLevelsList[0]);
	const [width, setWidth] = useState(25);
	const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
	const [visibleToolModal, setVisibleToolModal] = useState(false);
	const [editableUserTool, setEditableUserTool] = useState<number>(null);
	const [visibleSchoolModal, setVisibleSchoolModal] = useState(false);
	const [editableUserSchool, setEditableUserSchool] = useState<number>(null);
	const [visibleJobModal, setVisibleJobModal] = useState(false);
	const [editableUserJob, setEditableUserJob] = useState<number>(null);
	const [visibleAddUserFile, setVisibleAddUserFileModal] = useState(false);
	const [editableAddUserFile, setEditableAddUserFile] = useState<number>(null);
	const [visibleEditUserFileModal, setVisibleEditUserFileModal] = useState(false);
	const [editableEditUserFile, setEditableEditUserFile] = useState<any>(null);
	let [skillSearchQuery, setsSkillSearchQuery] = useState('');

	// GraphQL queries
	const [{ data: userSkillData, fetching: userSkillFetching, error: userSkillError }] = useQuery({
		query: getUserSkillQuery,
		variables: { id: skillId },
		pause: !skillId,
		requestPolicy: 'network-only',
	});
	let [{ data: searchSkillData }, searchSkills] = useQuery({
		query: searchSkillsQuery,
		variables: { search: skillSearchQuery },
		pause: true,
		requestPolicy: 'network-only',
	});
	const [{ data: userToolsData, fetching: userToolFetching }, refreshUserTools] = useQuery({
		query: userToolsQuery,
		variables: { userSkillId: skillId },
		requestPolicy: 'network-only',
	});
	const [{ data: userSchoolsData, fetching: userSchoolFetching }, refreshUserSchools] = useQuery({
		query: userSchoolsQuery,
		variables: { userSkillId: skillId },
		requestPolicy: 'network-only',
	});
	const [{ data: userJobsData, fetching: userJobFetching }, refreshUserJobs] = useQuery({
		query: userJobsQuery,
		variables: { userSkillId: skillId },
		requestPolicy: 'network-only',
	});
	const [{ data: userFilesData, fetching: userFilesFetching }, refreshUserFiles] = useQuery({
		query: userFilesQuery,
		variables: { attachType: 'UserSkill', attachId: skillId },
		requestPolicy: 'network-only',
	});
	// GraphQL mutations
	const [, updateUserSkillData] = useMutation(editUserSkillMutation);
	const [, addSkill] = useMutation(createSkillMutation);
	const [, deleteUserTool] = useMutation(deleteUserToolMutation);
	const [, deleteUserSchool] = useMutation(deleteUserSchoolMutation);
	const [, deleteUserJob] = useMutation(deleteUserJobMutation);
	const [, deleteUserFile] = useMutation(deleteUserFileMutation);

	useEffect(() => {
		if (userSkillError) {
			message.warning("The user skill doesn't exist. We returned you to skill list");
			router.replace('/user/skills');
		}

		if (!userSkillData) {
			return;
		}

		setExperience(5);
		setLevel(getSkillLevel(userSkillData.userSkill.level));
		handleChangeInlineInput(userSkillData.userSkill.title);
	}, [userSkillData, userSkillError]);

	useEffect(() => {
		(async () => {
			await searchSkills();
		})();
	}, [skillSearchQuery]);

	const emptyData = (dataName = 'data') => <span className={styles.descriptionEmpty}>({dataName})</span>;

	const handleChangeInlineInput = (value) => {
		const minWidth = 20;
		setWidth(value?.length > minWidth ? value?.length + 1 : minWidth);
	};

	const handleAddNewSkill = async () => {
		try {
			const { data, error } = await addSkill({
				name: skillSearchQuery,
			});

			if (error) {
				message.error(error);
				return;
			}

			searchSkillData?.skills.push(data.createSkill);
			setSelectedSkillId(data.createSkill.id);
		} catch (error: any) {
			message.error(error.message);
		}
	};

	const handleSaveUserSkill = async (values: any) => {
		let formatedValues = values;

		Object.entries(values).map(([key]) => {
			if (key === 'skillId') {
				formatedValues[key] = +selectedSkillId;
			}
		});

		const reponse = await updateUserSkillData({ recordId: skillId, data: formatedValues });

		if (reponse.error) {
			message.error(reponse.error.message);
			return;
		}

		message.success('User skill updated!');
	};

	/** User tool handles */
	const handleSaveUserTool = (action: string) => {
		if (action == 'create') {
			message.success('New user tool added');
		}
		if (action == 'update') {
			message.success('The user tool updated');
		}
		setVisibleToolModal(false);
		setEditableUserTool(null);
		refreshUserTools();
	};

	const handleDeleteUserTool = async (item) => {
		try {
			const deletedItems = await deleteUserTool({ where: { id: item.id } });
			if (deletedItems) {
				message.success(
					<>
						The user tool <strong>{item.title}</strong> deleted
					</>,
				);
				refreshUserTools();
			}
		} catch (error: any) {
			message.error(error.message);
		}
	};

	/** User school handles */
	const handleSaveUserSchool = (action: string) => {
		if (action == 'create') {
			message.success('New user school added');
		}
		if (action == 'update') {
			message.success('The user school updated');
		}
		setVisibleSchoolModal(false);
		setEditableUserSchool(null);
		refreshUserSchools();
	};

	const handleDeleteUserSchool = async (item) => {
		try {
			const deletedItems = await deleteUserSchool({ where: { id: item.id } });
			if (deletedItems) {
				message.success(
					<>
						The user school <strong>{item.title}</strong> deleted
					</>,
				);
				refreshUserSchools();
			}
		} catch (error: any) {
			message.error(error.message);
		}
	};

	/** User job handles */
	const handleSaveUserJob = (action: string) => {
		if (action == 'create') {
			message.success('New user job added');
		}
		if (action == 'update') {
			message.success('The user job updated');
		}
		setVisibleJobModal(false);
		setEditableUserJob(null);
		refreshUserJobs();
	};

	const handleDeleteUserJob = async (item) => {
		try {
			const deletedItems = await deleteUserJob({ where: { id: item.id } });
			if (deletedItems) {
				message.success(
					<>
						The user job <strong>{item.title}</strong> deleted
					</>,
				);
				refreshUserJobs();
			}
		} catch (error: any) {
			message.error(error.message);
		}
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

	return (
		<>
			<Head>
				<title>Skill Editor - SkillKit</title>
			</Head>
			<Space direction="vertical" size={40} className={styles.container}>
				<div className={styles.header}>
					<UserToolModal
						userSkillId={skillId as string}
						visible={visibleToolModal}
						recordId={editableUserTool}
						onSave={handleSaveUserTool}
						onCancel={() => {
							setEditableUserTool(null);
							setVisibleToolModal(false);
						}}
					/>
					<UserSchoolModal
						userSkillId={skillId as string}
						visible={visibleSchoolModal}
						recordId={editableUserSchool}
						onSave={handleSaveUserSchool}
						onCancel={() => {
							setEditableUserSchool(null);
							setVisibleSchoolModal(false);
						}}
					/>
					<UserJobModal
						userSkillId={skillId as string}
						visible={visibleJobModal}
						recordId={editableUserJob}
						onSave={handleSaveUserJob}
						onCancel={() => {
							setEditableUserJob(null);
							setVisibleJobModal(false);
						}}
					/>
					<AddUserFileModal
						userSkillId={skillId as string}
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
					<Row align="middle">
						<Col flex={1}>
							<div>I can</div>
							{userSkillFetching ? (
								<Skeleton.Button style={{ width: '450px', height: '30px', marginBottom: '0.5em' }} active={true} />
							) : (
								<InlineEdit
									name="skillId"
									initialValue={capitalizedText(userSkillData?.userSkill.skill.name)}
									onSave={handleSaveUserSkill}
									viewMode={<h2 className={styles.title}>{capitalizedText(userSkillData?.userSkill.skill.name)}</h2>}
									editMode={
										<AutoComplete
											ref={skillRef}
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
											onSearch={(value: string) => setsSkillSearchQuery(value)}
										>
											{searchSkillData?.skills.map((d: any) => (
												<AutoComplete.Option key={d.id} value={d.name}>
													{d.name}
												</AutoComplete.Option>
											))}
											{skillSearchQuery.length &&
												searchSkillData?.skills.filter((d: { name: string }) => {
													return skillSearchQuery.toLowerCase().trim() === d.name.toLowerCase();
												}).length === 0 && (
													<Select.Option
														disabled
														key={'emptyOption'}
														value={''}
														style={{
															paddingBottom: 0,
															paddingTop: 0,
														}}
													>
														<Button type="link" style={{ padding: 0 }} onClick={handleAddNewSkill}>
															<PlusOutlined /> Add new: &ldquo;{skillSearchQuery}&ldquo;
														</Button>
													</Select.Option>
												)}
										</AutoComplete>
									}
								/>
							)}
						</Col>
						<Col>
							<InlineEdit
								name="level"
								initialValue={level.label.toUpperCase()}
								onSave={handleSaveUserSkill}
								viewMode={
									<Tooltip title={level.description}>
										<div className={styles.levelName}>
											<strong>{level.label}</strong> level
										</div>
										<Progress
											className={styles.progressBar}
											percent={level.index * 20}
											steps={5}
											status="active"
											strokeColor={level.color}
											showInfo={false}
										/>
									</Tooltip>
								}
								editMode={
									<Select placeholder="Select" style={{ width: '150px' }}>
										{skillLevelsList.map((item, indx) => (
											<Select.Option key={indx.toString()} value={item.label.toUpperCase()}>
												<Tooltip title={item.description} placement="right">
													<Image src={item.icon} alt="" /> {item.label}
												</Tooltip>
											</Select.Option>
										))}
									</Select>
								}
							/>
							<p>{experience > 0 ? `Work experience more than ${experience} year(s)` : "I haven't any experience yet"}</p>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<InlineEdit
								name="description"
								initialValue={userSkillData?.userSkill.description}
								onSave={handleSaveUserSkill}
								viewMode={
									<p className={styles.description}>
										{userSkillData?.userSkill.description
											? readyText(userSkillData?.userSkill.description)
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
										defaultValue={userSkillData?.userSkill.description}
									/>
								}
							/>
						</Col>
					</Row>
				</div>
				<div className={styles.toolsSection}>
					<div className={styles.headerContainer}>
						<h2>I use for this</h2>
						<Button
							type="ghost"
							shape="circle"
							size="small"
							icon={<PlusOutlined />}
							onClick={() => {
								setVisibleToolModal(true);
								setEditableUserTool(null);
							}}
						/>
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
												<Dropdown.Button
													className="editItemButtons"
													size="small"
													overlay={
														<Menu>
															<Popconfirm
																key="delete-user-tool"
																title="Are you sure to delete this tool?"
																onConfirm={() => handleDeleteUserTool(item)}
																okText="Yes"
																cancelText="No"
																icon={<WarningTwoTone />}
															>
																<Menu.Item key="delete" icon={<DeleteOutlined />} danger>
																	Delete
																</Menu.Item>
															</Popconfirm>
														</Menu>
													}
													onClick={() => {
														setEditableUserTool(item.id);
														setVisibleToolModal(true);
													}}
												>
													<EditOutlined />
												</Dropdown.Button>
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
						<Space style={{ display: 'flex' }}>
							<h2>History of skill learning</h2>
							<Button
								type="ghost"
								shape="circle"
								size="small"
								icon={<PlusOutlined />}
								onClick={() => {
									setVisibleSchoolModal(true);
									setEditableUserSchool(null);
								}}
							/>
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
											<Dropdown.Button
												className="editItemButtons"
												size="small"
												overlay={
													<Menu>
														<Popconfirm
															key="delete-user-school"
															title="Are you sure to delete this school?"
															onConfirm={() => handleDeleteUserSchool(item)}
															okText="Yes"
															cancelText="No"
															icon={<WarningTwoTone />}
														>
															<Menu.Item key="delete" icon={<DeleteOutlined />} danger>
																Delete
															</Menu.Item>
														</Popconfirm>
													</Menu>
												}
												onClick={() => {
													setEditableUserSchool(item.id);
													setVisibleSchoolModal(true);
												}}
											>
												<EditOutlined />
											</Dropdown.Button>
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
						<h2>This skill was been used in the following jobs</h2>
						<Button
							type="ghost"
							shape="circle"
							size="small"
							icon={<PlusOutlined />}
							onClick={() => {
								setVisibleJobModal(true);
								setEditableUserJob(null);
							}}
						/>
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
												<div className={styles.userJobTitle}>{item.title}</div>
												{!!item.description && <p className={styles.userJobDesc}>{readyText(item.description)}</p>}
											</div>
											<Dropdown.Button
												className="editItemButtons"
												size="small"
												overlay={
													<Menu>
														<Popconfirm
															key="delete-user-job"
															title="Are you sure to delete this job?"
															onConfirm={() => handleDeleteUserJob(item)}
															okText="Yes"
															cancelText="No"
															icon={<WarningTwoTone />}
														>
															<Menu.Item key="delete" icon={<DeleteOutlined />} danger>
																Delete
															</Menu.Item>
														</Popconfirm>
													</Menu>
												}
												onClick={() => {
													setEditableUserJob(item.id);
													setVisibleJobModal(true);
												}}
											>
												<EditOutlined />
											</Dropdown.Button>
										</Space>
									</Timeline.Item>
								))}
							</Timeline>
						</Spin>
					) : (
						emptyData('No data about jobs')
					)}
				</div>
				<div className={styles.worksSection}>
					<div className={styles.headerContainer}>
						<h2>Work examples</h2>
						{/* <Dropdown overlay={examplesMenu} trigger={['click']} placement="topCenter" arrow={{ pointAtCenter: true }}> */}
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
						{/* </Dropdown> */}
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
			</Space>
		</>
	);
};

SkillEditorPage.getLayout = (page: ReactElement) => (
	<ProtectedLayout title="Skill Editor" siderMenu={<SkillEditorMenu />}>
		{page}
	</ProtectedLayout>
);

export default SkillEditorPage;
