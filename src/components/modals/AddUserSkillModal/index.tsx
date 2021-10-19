import React, { FC, createRef, useEffect, useState } from 'react';
import UserJobBlock from '@components/UserJobBlock';
import UserSchoolBlock from '@components/UserSchoolBlock';
import UserToolBlock from '@components/UserToolBlock';
import { createSkillMutation, getUserSkillQuery, searchSkillsQuery } from '@services/graphql/queries/skill';
import { createUserMutation } from '@services/graphql/queries/user';
import { createUserSkillMutation } from '@services/graphql/queries/userSkill';
import { RootState } from '@store/configure-store';
import { SkillLevel, skillLevelsList } from 'src/definitions/skill';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Modal, Row, Select, Space, Tooltip, message } from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import { ControlType, EditorState } from 'braft-editor';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from 'urql';
import styles from './AddUserSkillModal.module.less';

type AddSkillArgs = {
	visible: boolean;
	recordId?: string | null;
	onClose: () => void;
};

type UserSkill = {
	skillId: string;
	level: SkillLevel;
	description?: EditorState | string;
	tool?: UserTool[];
	job?: UserJob[];
	school?: UserSchool[];
};

type UserSchool = {
	title: string;
	startedAt?: Date;
	finishedAt?: Date;
	description?: EditorState | string;
};

type UserJob = {
	company: string;
	title: string;
	startedAt?: Date;
	finishedAt?: Date;
	description?: EditorState | string;
};

type UserTool = {
	title: string;
	level: number;
	description?: EditorState | string;
};

const AddUserSkillModal: FC<AddSkillArgs> = ({ visible, recordId, onClose }) => {
	const BraftEditor = dynamic(() => import('braft-editor'), { ssr: false });
	const [form] = Form.useForm();
	const skillRef = createRef<RefSelectProps>();
	const controls: ControlType[] = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];
	const [createUserSkillResponse] = useMutation(createUserMutation);
	const [skillSearchQuery, setsSkillSearchQuery] = useState('');
	const [visibleBlocks, setVisibleBlocks] = useState({
		description: false,
		schools: false,
		jobs: false,
		tools: false,
	});
	const userId = useSelector((state: RootState) => state.user.id);
	const [{ data: searchSkillData }, searchSkills] = useQuery({
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

	const handleOk = () => {
		console.log('handleOk', form.getFieldsValue());
		form
			.validateFields()
			.then(async (formData: UserSkill) => {
				let { skillId, level, description, tool, job, school } = formData;
				let schoolsCreateExtend: UserSchool[] = [];
				let jobsCreateExtend: UserJob[] = [];
				let toolsCreateExtend: UserTool[] = [];

				try {
					if (description) {
						description = description.toHTML();
					}

					if (tool) {
						tool = tool.map((t: UserTool) => {
							if (t.description) {
								t.description = t.description.toHTML();
							}

							toolsCreateExtend.push({
								title: t.title,
								level: t.level,
								description: t.description,
							});

							return t;
						});
					}

					if (job) {
						job = job.map((j: UserJob) => {
							if (j.description) {
								j.description = j.description.toHTML();
							}

							jobsCreateExtend.push({
								title: j.title,
								company: j.company,
								startedAt: j.startedAt,
								finishedAt: j.finishedAt,
								description: j.description,
							});

							return j;
						});
					}

					if (school) {
						school = school.map((s: UserSchool) => {
							if (s.description) {
								s.description = s.description.toHTML();
							}

							schoolsCreateExtend.push({
								title: s.title,
								startedAt: s.startedAt,
								finishedAt: s.finishedAt,
								description: s.description,
							});

							return s;
						});
					}

					const { error } = await addUserSkill({
						userId,
						skillId,
						level,
						description,
						tools: { create: toolsCreateExtend },
						jobs: { create: jobsCreateExtend },
						schools: { create: schoolsCreateExtend },
					});

					if (error) {
						message.error(error);
						addUserSkillResponse.fetching = false;
						return;
					}

					message.success('New user skill added!');
					onClose();
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

	return (
		<Modal
			title="Add skill"
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
									<Select.Option key={indx} value={item.label}>
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
					<UserToolBlock
						visible={visibleBlocks.tools}
						tools={tools}
						onDelete={handleRemoveTool}
						onAdd={handleAddTool}
					/>

					<UserSchoolBlock
						visible={visibleBlocks.schools}
						schools={schools}
						onDelete={handleRemoveSchool}
						onAdd={handleAddSchool}
					/>

					<UserJobBlock visible={visibleBlocks.schools} jobs={jobs} onDelete={handleRemoveJob} onAdd={handleAddJob} />

					<div className={styles.section}>
						<h4>More details</h4>
						<p>If you have something to add, write here</p>
						{visibleBlocks.description ? (
							<Form.Item name="description" style={{ marginBottom: 0 }}>
								<BraftEditor
									className={styles.textEditor}
									controls={controls}
									language="en"
									contentClassName={styles.textEditorContent}
								/>
							</Form.Item>
						) : (
							<Button
								size="small"
								type="text"
								disabled={visibleBlocks.description}
								onClick={() => setVisibleBlocks({ ...visibleBlocks, description: true })}
							>
								<PlusOutlined /> Add details
							</Button>
						)}
					</div>
				</Space>
			</Form>
		</Modal>
	);
};

export default AddUserSkillModal;
