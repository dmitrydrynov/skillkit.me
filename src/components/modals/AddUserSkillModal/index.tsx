import React, { FC, createRef, useEffect, useState } from 'react';
import UserJobBlock from '@components/UserJobBlock';
import UserSchoolBlock from '@components/UserSchoolBlock';
import UserToolBlock from '@components/UserToolBlock';
import { createSkillMutation, searchSkillsQuery } from '@services/graphql/queries/skill';
import { createUserMutation } from '@services/graphql/queries/user';
import { createUserSkillMutation, editUserSkillMutation, getUserSkillQuery } from '@services/graphql/queries/userSkill';
import { updateUserToolsMutation } from '@services/graphql/queries/userTool';
import { RootState } from '@store/configure-store';
import { SkillLevel, skillLevelsList } from 'src/definitions/skill';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Modal, Row, Select, Space, Tooltip, message, Spin, Dropdown, Menu } from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import BraftEditor, { ControlType, EditorState } from 'braft-editor';
import { Moment } from 'moment';
import moment from 'moment';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { OperationResult, useMutation, useQuery } from 'urql';
import styles from './style.module.less';

type AddSkillArgs = {
	operation?: 'create' | 'edit';
	visible: boolean;
	recordId?: string | null;
	onClose: () => void;
	onFinish: () => void;
};

type UserSkill = {
	skillId: string;
	level: SkillLevel;
	description?: EditorState;
	tools?: UserTool[];
	jobs?: UserJob[];
	schools?: UserSchool[];
};

type UserSchool = {
	id?: string;
	title: string;
	startedAt?: Moment;
	finishedAt?: Moment;
	description?: EditorState;
};

type UserJob = {
	id?: string;
	company: string;
	title: string;
	startedAt?: Moment;
	finishedAt?: Moment;
	description?: EditorState;
};

type UserTool = {
	id?: string;
	title: string;
	level: number;
	description?: EditorState;
};

const AddUserSkillModal: FC<AddSkillArgs> = ({ operation = 'create', visible, recordId, onClose, onFinish }) => {
	const controls: ControlType[] = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];
	const [form] = Form.useForm();
	const skillRef = createRef<RefSelectProps>();
	const [createUserSkillResponse] = useMutation(createUserMutation);
	const [skillSearchQuery, setsSkillSearchQuery] = useState('');
	const [visibleBlocks, setVisibleBlocks] = useState({
		description: false,
		schools: false,
		jobs: false,
		tools: false,
	});
	const userId = useSelector((state: RootState) => state.user.id);
	const [{ data: searchSkillData, fetching }, searchSkills] = useQuery({
		query: searchSkillsQuery,
		variables: { search: skillSearchQuery },
		pause: true,
		requestPolicy: 'network-only',
	});
	const [{ data: getUserSkillData }, getUserSkill] = useQuery({
		query: getUserSkillQuery,
		variables: { id: recordId },
		pause: true,
		requestPolicy: 'network-only',
	});
	const [addSkillResponse, addSkill] = useMutation(createSkillMutation);
	const [addUserSkillResponse, addUserSkill] = useMutation(createUserSkillMutation);
	const [editUserSkillResponse, editUserSkill] = useMutation(editUserSkillMutation);
	const [, updateUserTools] = useMutation(updateUserToolsMutation);
	const [schools, setSchools] = useState<UserSchool[]>([]);
	const [jobs, setJobs] = useState<UserJob[]>([]);
	const [tools, setTools] = useState<UserTool[]>([]);

	useEffect(() => {
		form.resetFields();

		if (recordId) {
			getUserSkill();
		}
	}, [form, getUserSkill, recordId]);

	useEffect(() => {
		const asyncFunc = async () => {
			await searchSkills();
		};
		asyncFunc();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skillSearchQuery]);

	useEffect(() => {
		if (getUserSkillData?.userSkill) {
			const { id, level, skill, jobs, schools, tools, description } = getUserSkillData.userSkill;

			setVisibleBlocks({
				...visibleBlocks,
				description: !!description?.length,
				tools: !!tools?.length,
				schools: !!schools?.length,
				jobs: !!jobs?.length,
			});

			setTools(tools);
			setJobs(jobs);
			setSchools(schools);

			form.setFieldsValue({
				skillId: skill.id,
				level,
				description: BraftEditor.createEditorState(description),
				tools,
				jobs: jobs.map((j: UserJob) => {
					j.startedAt = moment(j.startedAt);
					j.finishedAt = moment(j.finishedAt);

					return j;
				}),
				schools: schools.map((s: UserSchool) => {
					s.startedAt = moment(s.startedAt);
					s.finishedAt = moment(s.finishedAt);

					return s;
				}),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getUserSkillData]);

	const handleOk = () => {
		form
			.validateFields()
			.then(async (formData: UserSkill) => {
				let { skillId, level, description, tools, jobs, schools } = formData;
				let createData: { tools: UserTool[]; schools: UserSchool[]; jobs: UserJob[] } = {
					tools: [],
					schools: [],
					jobs: [],
				};
				let updateData: { tools: any; schools: any; jobs: any } = {
					tools: [],
					schools: [],
					jobs: [],
				};

				try {
					if (tools) {
						tools.map((t: UserTool) => {
							const data = {
								title: t.title,
								level: t.level,
								description: t.description?.toHTML(),
							};

							if (t.id) {
								updateData.tools.push({
									where: { id: t.id },
									data,
								});
							} else {
								createData.tools.push(data);
							}

							return t;
						});

						if (updateData.tools.length) {
							await updateUserTools({
								data: updateData.tools,
							});
						}
					}

					if (jobs) {
						jobs.map((j: UserJob) => {
							createData.jobs.push({
								title: j.title,
								company: j.company,
								startedAt: j.startedAt,
								finishedAt: j.finishedAt,
								description: j.description,
							});

							return j;
						});
					}

					if (schools) {
						schools.map((s: UserSchool) => {
							createData.schools.push({
								title: s.title,
								startedAt: s.startedAt,
								finishedAt: s.finishedAt,
								description: s.description,
							});

							return s;
						});
					}

					let resultOperation: OperationResult<any, object> | null = null;
					if (operation === 'create') {
						resultOperation = await addUserSkill({
							userId,
							skillId,
							level,
							description: description?.toHTML(),
							tools: { create: createData.tools },
							jobs: { create: createData.jobs },
							schools: { create: createData.schools },
						});
					}

					if (operation === 'edit') {
						resultOperation = await editUserSkill({
							recordId,
							skillId,
							level,
							description: description?.toHTML(),
							tools: { create: createData.tools },
							jobs: { create: createData.jobs },
							schools: { create: createData.schools },
						});
					}

					if (resultOperation?.error) {
						const err = resultOperation.error.message.split(':');
						addUserSkillResponse.fetching = false;
						form.setFields([
							{
								name: 'skillId',
								errors: [err[1].trim()],
							},
						]);
						return;
					}

					message.success('New user skill added!');
					onFinish();
				} catch (e: any) {
					message.error(e.message);
					addUserSkillResponse.fetching = false;
				}
			})
			.catch((info) => {
				console.log('Failed:', info);
			});
	};

	const handleCancel = () => {
		onClose();
	};

	const handleAddNewSkill = async () => {
		try {
			const { data, error } = await addSkill({
				name: skillSearchQuery,
			});

			if (error) {
				message.error(error);
				addSkillResponse.fetching = false;
				return;
			}

			searchSkillData?.skills.push(data.createSkill);
			form.setFieldsValue({ skillId: data.createSkill.id });
			form.getFieldInstance('skillId')?.blur();
		} catch (error: any) {
			message.error(error.message);
			addSkillResponse.fetching = false;
		}
	};

	const handleAddSchool = () => {
		if (schools.length === 0 && !visibleBlocks.schools) {
			setSchools([{ title: '' }]);
			setVisibleBlocks({ ...visibleBlocks, schools: true });
		} else {
			setSchools([...schools, { title: '' }]);
		}
	};

	const handleRemoveSchool = (index: number) => {
		setSchools((prevData) => {
			return prevData.filter((item, idx) => index !== idx);
		});

		if (schools.length === 0) {
			setVisibleBlocks({ ...visibleBlocks, schools: false });
		}
	};

	const handleAddJob = () => {
		if (jobs.length === 0 && !visibleBlocks.jobs) {
			setJobs([{ title: '', company: '' }]);
			setVisibleBlocks({ ...visibleBlocks, jobs: true });
		} else {
			setJobs([...jobs, { title: '', company: '' }]);
		}
	};

	const handleRemoveJob = (index: number) => {
		setJobs((prevData) => {
			return prevData.filter((item, idx) => index !== idx);
		});

		if (jobs.length === 0) {
			setVisibleBlocks({ ...visibleBlocks, jobs: false });
		}
	};

	const handleAddTool = () => {
		if (jobs.length === 0 && !visibleBlocks.tools) {
			setTools([{ title: '', level: 0 }]);
			setVisibleBlocks({ ...visibleBlocks, tools: true });
		} else {
			setTools([...tools, { title: '', level: 0 }]);
		}
	};

	const handleRemoveTool = (index: number) => {
		setTools((prevData) => {
			return prevData.filter((item, idx) => index !== idx);
		});

		if (jobs.length === 0) {
			setVisibleBlocks({ ...visibleBlocks, tools: false });
		}
	};

	const addMoreMenu = (
		<Menu className={styles.addMoreMenu}>
			<Menu.Item disabled={visibleBlocks.tools} onClick={() => setVisibleBlocks({ ...visibleBlocks, tools: true })}>
				<div className="title">Add tools</div>
				<div className="extra">What tools do you use when using this skill?</div>
			</Menu.Item>
			<Menu.Item disabled={visibleBlocks.schools} onClick={() => setVisibleBlocks({ ...visibleBlocks, schools: true })}>
				<div className="title">Add schools</div>
				<div className="extra">Where did you learn this skill?</div>
			</Menu.Item>
			<Menu.Item disabled={visibleBlocks.jobs} onClick={() => setVisibleBlocks({ ...visibleBlocks, jobs: true })}>
				<div className="title">Add experience</div>
				<div className="extra">What job did you apply the skill in?</div>
			</Menu.Item>
			<Menu.Item
				disabled={visibleBlocks.description}
				onClick={() => setVisibleBlocks({ ...visibleBlocks, description: true })}
			>
				<div className="title">Add description</div>
				<div className="extra">If you have something to add, write here</div>
			</Menu.Item>
		</Menu>
	);

	return (
		<Modal
			title={(operation === 'create' && 'Add skill') || (operation === 'edit' && 'Edit skill')}
			visible={visible}
			onOk={handleOk}
			onCancel={handleCancel}
			width={650}
			centered
			maskClosable={false}
			className={styles.modal}
			footer={[
				<Button
					key="submit"
					type="primary"
					size="large"
					loading={createUserSkillResponse.fetching}
					onClick={handleOk}
					className={styles.submitBtn}
				>
					Save
				</Button>,
			]}
		>
			<Spin spinning={fetching}>
				<Form
					className={styles.form}
					form={form}
					layout="vertical"
					name="form_in_modal"
					initialValues={{ modifier: 'public' }}
					requiredMark={false}
				>
					<Row>
						<Col span={14}>
							<Form.Item
								name="skillId"
								label="What can you do?"
								rules={[
									{
										required: true,
										message: 'Please input the skill name!',
									},
								]}
							>
								<Select
									disabled={operation === 'edit'}
									ref={skillRef}
									showSearch
									allowClear
									defaultActiveFirstOption={false}
									showArrow={false}
									filterOption={false}
									placeholder="What can you do?"
									notFoundContent={null}
									onSearch={(value: string) => setsSkillSearchQuery(value)}
								>
									{searchSkillData?.skills.map((d: any) => (
										<Select.Option key={d.id} value={d.id}>
											{d.name}
										</Select.Option>
									))}
									{skillSearchQuery.length &&
										searchSkillData?.skills.filter((d: { name: string }) => {
											return skillSearchQuery.toLowerCase().trim() === d.name.toLowerCase();
										}).length === 0 && (
											<Select.Option
												disabled
												key={0}
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
								</Select>
							</Form.Item>
						</Col>
						<Col span={8} offset={2}>
							<Form.Item name="level" label="Level" rules={[{ required: true, message: 'Please input the email!' }]}>
								<Select placeholder="Select a skill level">
									{skillLevelsList.map((item, indx) => (
										<Select.Option key={indx} value={item.label.toLowerCase()}>
											<Tooltip title={item.description} placement="right">
												<Image src={item.icon} alt="" /> {item.label}
											</Tooltip>
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Space direction="vertical" style={{ width: '100%' }}>
						{visibleBlocks.tools && (
							<UserToolBlock
								visible={visibleBlocks.tools}
								tools={tools}
								onDelete={handleRemoveTool}
								onAdd={handleAddTool}
							/>
						)}

						{visibleBlocks.schools && (
							<UserSchoolBlock
								visible={visibleBlocks.schools}
								schools={schools}
								onDelete={handleRemoveSchool}
								onAdd={handleAddSchool}
							/>
						)}

						{visibleBlocks.jobs && (
							<UserJobBlock
								visible={visibleBlocks.schools}
								jobs={jobs}
								onDelete={handleRemoveJob}
								onAdd={handleAddJob}
							/>
						)}

						{visibleBlocks.description && (
							<div className={styles.section}>
								<h4>Add more details</h4>
								<p>If you have something to add, write here</p>

								<Form.Item name="description" style={{ marginBottom: 0 }}>
									<BraftEditor
										className={styles.textEditor}
										controls={controls}
										language="en"
										contentClassName={styles.textEditorContent}
									/>
								</Form.Item>
							</div>
						)}

						<Dropdown overlay={addMoreMenu}>
							<a onClick={(e) => e.preventDefault()}>
								<PlusOutlined /> Add more details
							</a>
						</Dropdown>
					</Space>
				</Form>
			</Spin>
		</Modal>
	);
};

export default AddUserSkillModal;
