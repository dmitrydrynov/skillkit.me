/* eslint-disable react-hooks/exhaustive-deps */
/// <reference path="index.d.ts" />

import React, { FC, useEffect, useState } from 'react';
import { gtmEvent } from '@helpers/gtm';
import { searchSkillsQuery } from '@services/graphql/queries/skill';
import { createUserSkillMutation } from '@services/graphql/queries/userSkill';
import { Button, Form, Modal, message } from 'antd';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'urql';
import { AddUserSkillForm } from './AddUserSkillForm';
import styles from './style.module.less';

const AddUserSkillModal: FC<AddSkillArgs> = ({ visible, onClose, onFinish }) => {
	/** Local variables */
	const router = useRouter();
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

	/** Mutations */
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

	const handleSave = (params: { redirect?: boolean } = { redirect: false }) => {
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

			gtmEvent('NewUserSkillEvent', { skillName, skillLevel: level });

			message.success('New user skill added!');
			setSkillSearchQuery(null);
			setSelectedSkillId(null);

			if (params.redirect && resultOperation?.data) {
				await router.push(`/user/skill/${resultOperation?.data?.createUserSkill.id}/editor/`);
			}

			onFinish();
		});
	};

	const handleCancel = () => {
		form.resetFields();
		onClose();
	};

	return (
		<Modal
			title={<h3>Add skill</h3>}
			visible={visible}
			onCancel={handleCancel}
			width={650}
			centered
			maskClosable={false}
			className={styles.modal}
			footer={[
				<Button key="submit" type="default" loading={addUserSkillResponse.fetching} onClick={() => handleSave()}>
					Save
				</Button>,
				<Button
					key="submitWithRedirect"
					type="primary"
					loading={addUserSkillResponse.fetching}
					onClick={() => handleSave({ redirect: true })}
				>
					Save & Add Details
				</Button>,
			]}
		>
			<AddUserSkillForm
				form={form}
				searchSkillData={searchSkillData}
				onSelectSkill={(value, option) => setSelectedSkillId(option.key as number)}
				onSearchSkill={(value: string) => setSkillSearchQuery(value)}
				onChangeSkill={() => setSelectedSkillId(null)}
			/>
		</Modal>
	);
};

export default AddUserSkillModal;
