import React, { useEffect } from 'react';
import { getErrorMessage } from '@helpers/errors';
import { createUserToolMutation, getUserToolQuery, updateUserToolMutation } from '@services/graphql/queries/userTool';
import { Form, Input, message, Modal, Spin } from 'antd';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

type _ModalParams = {
	onSave(action: 'create' | 'update', data: any): void;
	onCancel(): void;
	visible?: boolean;
	recordId?: number;
	userSkillId: number | string;
};

type _FormData = {
	title: string;
	description: string;
};

const UserToolModal = ({ onSave, onCancel, userSkillId, recordId = null, visible = false }: _ModalParams) => {
	const [form] = Form.useForm();
	const [, createUserTool] = useMutation(createUserToolMutation);
	const [, updateUserTool] = useMutation(updateUserToolMutation);
	const [{ data, fetching }] = useQuery({
		query: getUserToolQuery,
		variables: { id: recordId },
		requestPolicy: 'network-only',
		pause: !recordId,
	});

	useEffect(() => {
		if (visible === false) {
			form.resetFields();
		}
	}, [visible]);

	useEffect(() => {
		if (data) {
			form.setFieldsValue({
				title: data.userTool.title,
				description: data.userTool.description,
			});
		}
	}, [data]);

	const handleCreate = async () => {
		const { title, description }: _FormData = await form.validateFields();

		try {
			const { data, error } = await createUserTool({
				data: {
					userSkillId,
					title,
					description: description ? description : null,
				},
			});

			if (error) {
				message.error(getErrorMessage(error));
				return;
			}

			onSave('create', data);
			form.resetFields();
		} catch (error: any) {
			message.error(error.message);
		}
	};

	const handleUpdate = async () => {
		const { description }: _FormData = await form.validateFields();

		try {
			const { data, error } = await updateUserTool({
				recordId,
				data: {
					description: description ? description : null,
				},
			});

			if (error) {
				message.error(getErrorMessage(error));
				return;
			}

			onSave('update', data);
			form.resetFields();
		} catch (error: any) {
			message.error(error.message);
		}
	};

	return (
		<Modal
			title={recordId && data ? `Details for ${data.userTool.title}` : 'Add tool'}
			visible={visible}
			onOk={() => (recordId ? handleUpdate() : handleCreate())}
			onCancel={onCancel}
			width={650}
			centered
			maskClosable={false}
			className={styles.modal}
			destroyOnClose={true}
		>
			<Spin spinning={fetching && !data}>
				<Form className={styles.form} form={form} layout="vertical" name="add_tool_form" requiredMark={true}>
					<Form.Item name="id" hidden={true} />

					{!recordId && (
						<Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the field!' }]}>
							<Input />
						</Form.Item>
					)}

					<Form.Item name="description" label="Details about using one for current skill (optional)">
						<Input.TextArea
							autoSize={{ minRows: 4, maxRows: 12 }}
							style={{ width: '100%', height: 'auto' }}
							showCount
							maxLength={250}
							placeholder="Start typing"
						/>
					</Form.Item>
				</Form>
			</Spin>
		</Modal>
	);
};

export default UserToolModal;
