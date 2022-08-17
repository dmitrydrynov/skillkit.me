/* eslint-disable react-hooks/exhaustive-deps */
/// <reference path="index.d.ts" />

import React, { FC, useEffect, useState } from 'react';
import { gtmEvent } from '@helpers/gtm';
import { searchKitsQuery } from '@services/graphql/queries/kit';
import { createUserKitMutation } from '@services/graphql/queries/userKit';
import { Button, Form, Modal, message } from 'antd';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'urql';
import { AddUserKitForm } from './AddUserKitForm';
import styles from './style.module.less';

const AddUserKitModal: FC<AddKitArgs> = ({ visible, onClose, onFinish }) => {
	/** Local variables */
	const router = useRouter();
	const [form] = Form.useForm();
	/** Local state */
	const [selectedKitId, setSelectedKitId] = useState<number>();
	let [kitSearchQuery, setKitSearchQuery] = useState(null);

	/** Queries */
	let [{ data: searchKitData }, searchKits] = useQuery({
		query: searchKitsQuery,
		variables: { search: kitSearchQuery },
		pause: kitSearchQuery === null,
		requestPolicy: 'network-only',
	});

	/** Mutations */
	const [addUserKitResponse, addUserKit] = useMutation(createUserKitMutation);

	useEffect(() => {
		form.resetFields();
		setSelectedKitId(null);
		setKitSearchQuery(null);
		addUserKitResponse.fetching = false;
	}, [visible]);

	useEffect(() => {
		if (!kitSearchQuery) return;

		(async () => {
			await searchKits();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [kitSearchQuery]);

	const handleSave = (params: { redirect?: boolean } = { redirect: false }) => {
		form.validateFields().then(async (formData: UserKit) => {
			let { kitName, level } = formData;

			const resultOperation = await addUserKit({
				kitId: selectedKitId,
				kitName: kitName.trim().toLowerCase(),
			});

			if (resultOperation?.error) {
				setSelectedKitId(null);
				setKitSearchQuery(null);
				addUserKitResponse.fetching = false;

				const err = resultOperation.error.message?.split(']');
				form.setFields([
					{
						name: 'kitName',
						errors: [err[1].trim()],
					},
				]);

				return Promise.resolve();
			}

			gtmEvent('NewUserKitEvent', { kitName, kitLevel: level });

			message.success('New user kit added!');
			setKitSearchQuery(null);
			setSelectedKitId(null);

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
			title={<h3>Add skills kit</h3>}
			visible={visible}
			onCancel={handleCancel}
			width={650}
			centered
			maskClosable={false}
			className={styles.modal}
			footer={[
				<Button key="submit" type="default" loading={addUserKitResponse.fetching} onClick={() => handleSave()}>
					Save
				</Button>,
				<Button
					key="submitWithRedirect"
					type="primary"
					loading={addUserKitResponse.fetching}
					onClick={() => handleSave({ redirect: true })}
				>
					Save & Add Details
				</Button>,
			]}
		>
			<AddUserKitForm
				form={form}
				searchKitData={searchKitData}
				onSelectKit={(value, option) => setSelectedKitId(option.key as number)}
				onSearchKit={(value: string) => setKitSearchQuery(value)}
				onChangeKit={() => setSelectedKitId(null)}
			/>
		</Modal>
	);
};

export default AddUserKitModal;
