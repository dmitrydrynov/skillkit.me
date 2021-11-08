/// <reference path="index.d.ts" />
import React, { FC, createRef, useEffect, useState } from 'react';
import UserJobBlock from '@components/modals/AddUserSkillModal/UserJobBlock';
import UserSchoolBlock from '@components/modals/AddUserSkillModal/UserSchoolBlock';
import UserToolBlock from '@components/modals/AddUserSkillModal/UserToolBlock';
import { createSkillMutation, searchSkillsQuery } from '@services/graphql/queries/skill';
import { deleteUserJobMutation, updateUserJobsMutation } from '@services/graphql/queries/userJob';
import { deleteUserSchoolMutation, updateUserSchoolsMutation } from '@services/graphql/queries/userSchool';
import { createUserSkillMutation, editUserSkillMutation, getUserSkillQuery } from '@services/graphql/queries/userSkill';
import { deleteUserToolMutation, updateUserToolsMutation } from '@services/graphql/queries/userTool';
import { RootState } from '@store/configure-store';
import { skillLevelsList } from 'src/definitions/skill';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Modal, Row, Select, Space, Tooltip, message, Spin, Dropdown, Menu } from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import BraftEditor, { ControlType } from 'braft-editor';
import moment from 'moment';
import Image from 'next/image';
import { GrCertificate, GrChat, GrTools } from 'react-icons/gr';
import { HiOutlineBriefcase } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { OperationResult, useMutation, useQuery } from 'urql';
import styles from './style.module.less';

const AddUserSkillModal: FC<AddSkillArgs> = ({ operation = 'create', visible, recordId, onClose, onFinish }) => {
	/** Local variables */
	const controls: ControlType[] = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];
	const skillRef = createRef<RefSelectProps>();
	const [form] = Form.useForm();
	/** Local state */
	const [schools, setSchools] = useState<UserSchool[]>([]);
	const [jobs, setJobs] = useState<UserJob[]>([]);
	const [tools, setTools] = useState<UserTool[]>([]);
	const [skillSearchQuery, setsSkillSearchQuery] = useState('');
	const [visibleBlocks, setVisibleBlocks] = useState({
		description: false,
		schools: false,
		jobs: false,
		tools: false,
	});
	/** Selectors from Redux */
	const userId = useSelector((state: RootState) => state.user.id);
	/** Queries */
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

	/** Mutations */
	const [addSkillResponse, addSkill] = useMutation(createSkillMutation);
	const [addUserSkillResponse, addUserSkill] = useMutation(createUserSkillMutation);
	const [editUserSkillResponse, editUserSkill] = useMutation(editUserSkillMutation);
	const [, updateUserTools] = useMutation(updateUserToolsMutation);
	const [, updateUserJobs] = useMutation(updateUserJobsMutation);
	const [, updateUserSchools] = useMutation(updateUserSchoolsMutation);
	const [, deleteUserTool] = useMutation(deleteUserToolMutation);
	const [, deleteUserJob] = useMutation(deleteUserJobMutation);
	const [, deleteUserSchool] = useMutation(deleteUserSchoolMutation);

	useEffect(() => {
		form.resetFields();

		if (recordId) {
			getUserSkill();
		}
	}, [form, getUserSkill, recordId]);

	useEffect(() => {
		(async () => {
			await searchSkills();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skillSearchQuery]);

	useEffect(() => {
		if (getUserSkillData?.userSkill) {
			const { level, skill, jobs, schools, tools, description } = getUserSkillData.userSkill;

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
				tools: tools.map((t: UserTool) => {
					t.description = BraftEditor.createEditorState(t.description);

					return t;
				}),
				jobs: jobs.map((j: UserJob) => {
					j.startedAt = moment(j.startedAt);
					j.finishedAt = moment(j.finishedAt);
					j.description = BraftEditor.createEditorState(j.description);

					return j;
				}),
				schools: schools.map((s: UserSchool) => {
					s.startedAt = moment(s.startedAt);
					s.finishedAt = moment(s.finishedAt);
					s.description = BraftEditor.createEditorState(s.description);

					return s;
				}),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getUserSkillData]);

	const getPreSaveToolsData = async (tools: UserTool[]): Promise<UserTool[]> => {
		let createData: UserTool[] = [];
		let updateData: { where: { id: string }; data: UserTool }[] = [];

		tools.map((t: UserTool) => {
			const data = {
				title: t.title,
				level: t.level,
				description: t.description?.toHTML(),
			};

			if (t.id) {
				updateData.push({
					where: { id: t.id },
					data,
				});
			} else {
				createData.push(data);
			}
		});

		if (updateData.length) {
			await updateUserTools({
				data: updateData,
			});
		}

		return createData;
	};

	const getPreSaveJobsData = async (jobs: UserJob[]): Promise<UserJob[]> => {
		let createData: UserJob[] = [];
		let updateData: { where: { id: string }; data: UserJob }[] = [];

		jobs.map((j: UserJob) => {
			const data = {
				title: j.title,
				company: j.company,
				startedAt: j.startedAt,
				finishedAt: j.finishedAt,
				description: j.description?.toHTML(),
			};

			if (j.id) {
				updateData.push({
					where: { id: j.id },
					data,
				});
			} else {
				createData.push(data);
			}
		});

		if (updateData.length) {
			await updateUserJobs({
				data: updateData,
			});
		}

		return createData;
	};

	const getPreSaveSchoolsData = async (newData: UserSchool[]): Promise<UserSchool[]> => {
		let createData: UserSchool[] = [];
		let updateData: { where: { id?: string }; data: UserSchool }[] = [];

		newData.map((s: UserSchool) => {
			const data = {
				title: s.title,
				startedAt: s.startedAt,
				finishedAt: s.finishedAt,
				description: s.description?.toHTML(),
			};

			if (s.id) {
				updateData.push({
					where: { id: s.id },
					data,
				});
			} else {
				createData.push(data);
			}
		});

		if (updateData.length) {
			await updateUserSchools({
				data: updateData,
			});
		}

		return createData;
	};

	const handleOk = () => {
		form
			.validateFields()
			.then(async (formData: UserSkill) => {
				let { skillId, level, description, tools, jobs, schools } = formData;
				let resultOperation: OperationResult<any, object> | null = null;
				let createData: PreSaveData = {
					tools: [],
					schools: [],
					jobs: [],
				};

				try {
					if (tools) {
						createData.tools = await getPreSaveToolsData(tools);
					}

					if (jobs) {
						createData.jobs = await getPreSaveJobsData(jobs);
					}

					if (schools) {
						createData.schools = await getPreSaveSchoolsData(schools);
					}

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

					if (operation === 'update') {
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

	const handleRemoveSchool = async (schoolId: string | null, index: number) => {
		try {
			if (schoolId) {
				const { data, error } = await deleteUserSchool({ where: { id: schoolId } });

				if (error) {
					message.error(error.message);
					return Promise.resolve(false);
				}

				if (!data.deleteUserSchool) {
					message.error("We can't delete this school");
					return Promise.resolve(false);
				}

				message.success('The school deleted successfully');

				return Promise.resolve(true);
			}

			setSchools((prevData) => {
				return prevData.filter((item, idx) => index !== idx);
			});

			if (schools.length === 0) {
				setVisibleBlocks({ ...visibleBlocks, schools: false });
			}
		} catch (error) {
			return Promise.resolve(false);
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

	const handleRemoveJob = async (jobId: string | null, index: number) => {
		try {
			if (jobId) {
				const { data, error } = await deleteUserJob({ where: { id: jobId } });

				if (error) {
					message.error(error.message);
					return Promise.resolve(false);
				}

				if (!data.deleteUserJob) {
					message.error("We can't delete this job");
					return Promise.resolve(false);
				}

				message.success('The job deleted successfully');

				return Promise.resolve(true);
			}

			setJobs((prevData) => {
				return prevData.filter((item, idx) => index !== idx);
			});

			if (jobs.length === 0) {
				setVisibleBlocks({ ...visibleBlocks, jobs: false });
			}
		} catch (error) {
			return Promise.resolve(false);
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

	const handleRemoveTool = async (toolId: string | null, index: number) => {
		try {
			if (toolId) {
				const { data, error } = await deleteUserTool({ where: { id: toolId } });

				if (error) {
					message.error(error.message);
					return Promise.resolve(false);
				}

				if (!data.deleteUserTool) {
					message.error("We can't delete this tool");
					return Promise.resolve(false);
				}

				message.success('The tool deleted successfully');

				return Promise.resolve(true);
			}

			setTools(tools.filter((item, idx) => idx !== index));

			if (tools.length === 0) {
				setVisibleBlocks({ ...visibleBlocks, tools: false });
			}
		} catch (error) {
			return Promise.resolve(false);
		}
	};

	const addMoreMenu = (
		<Menu className={styles.addMoreMenu}>
			<Menu.Item
				key="addTools"
				icon={<GrTools />}
				disabled={visibleBlocks.tools}
				onClick={() => setVisibleBlocks({ ...visibleBlocks, tools: true })}
			>
				<div className="title">Add tools</div>
				<div className="extra">What tools do you use when using this skill?</div>
			</Menu.Item>
			<Menu.Item
				key="addSchools"
				icon={<GrCertificate />}
				disabled={visibleBlocks.schools}
				onClick={() => setVisibleBlocks({ ...visibleBlocks, schools: true })}
			>
				<div className="title">Add schools</div>
				<div className="extra">Where did you learn this skill?</div>
			</Menu.Item>
			<Menu.Item
				key="addJobs"
				icon={<HiOutlineBriefcase />}
				disabled={visibleBlocks.jobs}
				onClick={() => setVisibleBlocks({ ...visibleBlocks, jobs: true })}
			>
				<div className="title">Add experience</div>
				<div className="extra">What job did you apply the skill in?</div>
			</Menu.Item>
			<Menu.Item
				key="addDescription"
				icon={<GrChat />}
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
			title={(operation === 'create' && 'Add skill') || (operation === 'update' && 'Edit skill')}
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
					loading={addUserSkillResponse.fetching || editUserSkillResponse.fetching}
					onClick={handleOk}
					className={styles.submitBtn}
					disabled={fetching}
				>
					Save
				</Button>,
			]}
		>
			<Spin spinning={fetching || addUserSkillResponse.fetching || editUserSkillResponse.fetching}>
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
									disabled={operation === 'update'}
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
								</Select>
							</Form.Item>
						</Col>
						<Col span={8} offset={2}>
							<Form.Item name="level" label="Level" rules={[{ required: true, message: 'Please input the email!' }]}>
								<Select placeholder="Select a skill level">
									{skillLevelsList.map((item, indx) => (
										<Select.Option key={indx.toString()} value={item.label.toLowerCase()}>
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
							<UserToolBlock form={form} tools={tools} onDelete={handleRemoveTool} onAdd={handleAddTool} />
						)}

						{visibleBlocks.schools && (
							<UserSchoolBlock form={form} schools={schools} onDelete={handleRemoveSchool} onAdd={handleAddSchool} />
						)}

						{visibleBlocks.jobs && (
							<UserJobBlock form={form} jobs={jobs} onDelete={handleRemoveJob} onAdd={handleAddJob} />
						)}

						{visibleBlocks.description && (
							<div className={styles.section}>
								<h4>Description</h4>
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
