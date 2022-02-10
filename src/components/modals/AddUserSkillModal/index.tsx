/* eslint-disable react-hooks/exhaustive-deps */
/// <reference path="index.d.ts" />

import React, { FC, createRef, useEffect, useState } from 'react';
import { createSkillMutation, searchSkillsQuery } from '@services/graphql/queries/skill';
import { createUserSkillMutation, getUserSkillQuery } from '@services/graphql/queries/userSkill';
import { skillLevelsList } from 'src/definitions/skill';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Modal, Row, Select, Tooltip, message, Spin, AutoComplete } from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import Image from 'next/image';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

const AddUserSkillModal: FC<AddSkillArgs> = ({ operation = 'create', visible, recordId, onClose, onFinish }) => {
	/** Local variables */
	const skillRef = createRef<RefSelectProps>();
	const [form] = Form.useForm();
	/** Local state */
	const [selectedSkillId, setSelectedSkillId] = useState<number>();
	let [skillSearchQuery, setsSkillSearchQuery] = useState('');

	/** Queries */
	let [{ data: searchSkillData }, searchSkills] = useQuery({
		query: searchSkillsQuery,
		variables: { search: skillSearchQuery },
		pause: true,
		requestPolicy: 'network-only',
	});
	let [{ data: getUserSkillData }] = useQuery({
		query: getUserSkillQuery,
		variables: { id: recordId },
		pause: true,
		requestPolicy: 'network-only',
	});

	/** Mutations */
	const [, addSkill] = useMutation(createSkillMutation);
	const [addUserSkillResponse, addUserSkill] = useMutation(createUserSkillMutation);

	useEffect(() => {
		searchSkillData = [];
		searchSkillData = '';
		form.resetFields();
	}, [visible]);

	useEffect(() => {
		(async () => {
			await searchSkills();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skillSearchQuery]);

	useEffect(() => {
		if (getUserSkillData?.userSkill) {
			const { level, skill } = getUserSkillData.userSkill;

			form.setFieldsValue({
				skillName: skill.name,
				level,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getUserSkillData]);

	const handleOk = () => {
		form.validateFields().then(async (formData: UserSkill) => {
			let { level } = formData;

			if (operation === 'create') {
				const resultOperation = await addUserSkill({
					skillId: selectedSkillId,
					level: level.toUpperCase(),
				});

				if (resultOperation?.error) {
					addUserSkillResponse.fetching = false;

					const err = resultOperation.error.message?.split(']');
					form.setFields([
						{
							name: 'skillName',
							errors: [err[1].trim()],
						},
					]);

					return Promise.resolve();
				}
			}

			message.success('New user skill added!');
			onFinish();
		});
	};

	const handleCancel = () => {
		form.resetFields();
		onClose();
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
			form.setFieldsValue({ skillName: data.createSkill.name });
			form.getFieldInstance('skillId')?.blur();
		} catch (error: any) {
			message.error(error.message);
		}
	};

	return (
		<Modal
			title={<h2>Add skill</h2>}
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
					loading={addUserSkillResponse.fetching}
					onClick={handleOk}
					className={styles.submitBtn}
					// disabled={fetching}
				>
					Save
				</Button>,
			]}
		>
			<Spin spinning={addUserSkillResponse.fetching}>
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
								name="skillName"
								label="What can you do?"
								rules={[
									{
										required: true,
										message: 'Please input the skill name!',
									},
								]}
							>
								<AutoComplete
									disabled={operation === 'update'}
									ref={skillRef}
									showSearch
									allowClear
									defaultActiveFirstOption={false}
									showArrow={false}
									filterOption={false}
									placeholder="To do something ..."
									notFoundContent={null}
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
							</Form.Item>
						</Col>
						<Col span={8} offset={2}>
							<Form.Item name="level" label="Level" rules={[{ required: true, message: 'Please input the email!' }]}>
								<Select placeholder="Select">
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
				</Form>
			</Spin>
		</Modal>
	);
};

export default AddUserSkillModal;
