/* eslint-disable react-hooks/exhaustive-deps */
/// <reference path="index.d.ts" />

import React, { FC, createRef, useEffect, useState } from 'react';
import { createSkillMutation, searchSkillsQuery } from '@services/graphql/queries/skill';
import { createUserSkillMutation, getUserSkillQuery } from '@services/graphql/queries/userSkill';
import { skillLevelsList } from 'src/definitions/skill';
import { Button, Col, Form, Modal, Row, Select, Tooltip, message, AutoComplete } from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import Image from 'next/image';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

const AddUserSkillModal: FC<AddSkillArgs> = ({ visible, recordId, onClose, onFinish }) => {
	/** Local variables */
	const skillRef = createRef<RefSelectProps>();
	const [form] = Form.useForm();
	/** Local state */
	const [selectedSkillId, setSelectedSkillId] = useState<number>();
	let [skillSearchQuery, setSkillSearchQuery] = useState(null);

	/** Queries */
	let [{ data: searchSkillData }, searchSkills] = useQuery({
		query: searchSkillsQuery,
		variables: { search: skillSearchQuery },
		pause: skillSearchQuery === null,
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
		form.resetFields();
		setSelectedSkillId(null);
		setSkillSearchQuery(null);
		addUserSkillResponse.fetching = false;
	}, [visible]);

	useEffect(() => {
		if (!skillSearchQuery) return;

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
			let { skillName, level } = formData;

			const resultOperation = await addUserSkill({
				skillId: selectedSkillId,
				skillName: skillName.trim().toLowerCase(),
				level: level.toUpperCase(),
			});

			if (resultOperation?.error) {
				setSelectedSkillId(null);
				setSkillSearchQuery(null);
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

			message.success('New user skill added!');
			setSkillSearchQuery(null);
			setSelectedSkillId(null);
			onFinish();
		});
	};

	const handleCancel = () => {
		form.resetFields();
		onClose();
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
			{/* <Spin spinning={addUserSkillResponse.fetching}> */}
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
								ref={skillRef}
								showSearch
								allowClear
								defaultActiveFirstOption={false}
								showArrow={false}
								filterOption={false}
								placeholder="To do something ..."
								notFoundContent={null}
								onSelect={(value, option) => setSelectedSkillId(option.key as number)}
								onSearch={(value: string) => setSkillSearchQuery(value)}
								onChange={() => setSelectedSkillId(null)}
							>
								{searchSkillData?.skills.map((d: any) => (
									<AutoComplete.Option key={d.id} value={d.name}>
										{d.name}
									</AutoComplete.Option>
								))}
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
			{/* </Spin> */}
		</Modal>
	);
};

export default AddUserSkillModal;
