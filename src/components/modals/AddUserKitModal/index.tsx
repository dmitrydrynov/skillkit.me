/* eslint-disable react-hooks/exhaustive-deps */
/// <reference path="index.d.ts" />

import React, { FC, useEffect, useState } from 'react';
import { gtmEvent } from '@helpers/gtm';
import { searchProfessionsQuery } from '@services/graphql/queries/profession';
import { createUserKitMutation } from '@services/graphql/queries/userKit';
import { Button, Form, message, Modal } from 'antd';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'urql';
import { AddUserKitForm } from './AddUserKitForm';
import styles from './style.module.less';

const AddUserKitModal: FC<AddKitArgs> = ({ visible, onClose, onFinish }) => {
	/** Local variables */
	const router = useRouter();
	const [form] = Form.useForm();
	/** Local state */
	const [selectedProfessionId, setSelectedProfessionId] = useState<number>();
	let [professionSearchQuery, setProfessionSearchQuery] = useState(null);

	/** Queries */
	let [{ data: searchProfessionData }, searchProfessions] = useQuery({
		query: searchProfessionsQuery,
		variables: { search: professionSearchQuery },
		requestPolicy: 'network-only',
	});

	/** Mutations */
	let [{ fetching: addUserKitFetching }, addUserKit] = useMutation(createUserKitMutation);

	useEffect(() => {
		form.resetFields();
		setSelectedProfessionId(null);
		setProfessionSearchQuery(null);
		addUserKitFetching = false;
	}, [visible]);

	useEffect(() => {
		if (!professionSearchQuery) return;

		(async () => {
			await searchProfessions();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [professionSearchQuery]);

	const handleSave = (params: { redirect?: boolean } = { redirect: false }) => {
		form.validateFields().then(async (formData: UserKit) => {
			const { professionName } = formData;
			const resultOperation = await addUserKit({
				professionId: selectedProfessionId,
				professionName: professionName.trim().toLowerCase(),
			});

			if (resultOperation?.error) {
				setSelectedProfessionId(null);
				setProfessionSearchQuery(null);
				addUserKitFetching = false;

				const err = resultOperation.error.message?.split(']');
				form.setFields([
					{
						name: 'professionName',
						errors: [err[1].trim()],
					},
				]);

				return Promise.resolve();
			}

			gtmEvent('NewSkillKitEvent', { professionName });

			message.success('New skillkit added!');
			setProfessionSearchQuery(null);
			setSelectedProfessionId(null);

			if (params.redirect && resultOperation?.data) {
				await router.push(`/user/kit/${resultOperation?.data?.createUserKit.id}/editor/`);
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
			title={<h3>Add Skillkit</h3>}
			visible={visible}
			onCancel={handleCancel}
			width={650}
			centered
			maskClosable={false}
			className={styles.modal}
			footer={[
				<Button
					key="submitWithRedirect"
					type="primary"
					loading={addUserKitFetching}
					onClick={() => handleSave({ redirect: true })}
				>
					Next
				</Button>,
			]}
		>
			<AddUserKitForm
				visible={visible}
				form={form}
				searchProfessionData={searchProfessionData}
				onSelectProfession={(value, option) => {
					setSelectedProfessionId(option.key as number);
					setProfessionSearchQuery(value);
				}}
				onSearchProfession={(value: string) => setProfessionSearchQuery(value)}
				onChangeProfession={() => setSelectedProfessionId(null)}
			/>
		</Modal>
	);
};

export default AddUserKitModal;
