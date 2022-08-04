import React, { useEffect } from 'react';
import { getErrorMessage } from '@helpers/errors';
import { createUserJobMutation, getUserJobQuery, updateUserJobMutation } from '@services/graphql/queries/userJob';
import { Col, DatePicker, Form, Input, message, Modal, Row, Spin } from 'antd';
import moment from 'moment';
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
	position: string;
	description: string;
	startedAt: Date;
	finishedAt: Date;
};

const UserJobModal = ({ onSave, onCancel, userSkillId, recordId = null, visible = false }: _ModalParams) => {
	const [form] = Form.useForm();
	const [, createUserJob] = useMutation(createUserJobMutation);
	const [, updateUserJob] = useMutation(updateUserJobMutation);
	const [{ data, fetching }] = useQuery({
		query: getUserJobQuery,
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
				title: data.userJob.title,
				position: data.userJob.position,
				description: data.userJob.description,
				startedAt: data.userJob.startedAt ? moment(data.userJob.startedAt) : null,
				finishedAt: data.userJob.finishedAt ? moment(data.userJob.finishedAt) : null,
			});
		}
	}, [data]);

	const handleCreate = async () => {
		const { title, position, description, startedAt, finishedAt }: _FormData = await form.validateFields();

		try {
			const { data, error } = await createUserJob({
				data: {
					userSkillId,
					title,
					position,
					description: description ? description : null,
					startedAt,
					finishedAt,
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
		const { title, position, description, startedAt, finishedAt }: _FormData = await form.validateFields();

		try {
			const { data, error } = await updateUserJob({
				recordId,
				data: {
					title,
					position,
					description: description ? description : null,
					startedAt,
					finishedAt,
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
			title={recordId && data ? `Details for ${data.userJob.title}` : 'Add job'}
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
				<Form className={styles.form} form={form} layout="vertical" name="add_job_form" requiredMark={true}>
					<Form.Item name="id" hidden={true} />

					<Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the field!' }]}>
						<Input />
					</Form.Item>

					<Form.Item name="position" label="Position" rules={[{ required: true, message: 'Please input the field!' }]}>
						<Input />
					</Form.Item>

					<Row>
						<Col span={11}>
							<Form.Item name="startedAt" label="Started at" rules={[{ required: true, message: 'Please input the field!' }]}>
								<DatePicker picker="month" style={{ width: '100%' }} format="MMM, YYYY" />
							</Form.Item>
						</Col>
						<Col span={11} offset={2}>
							<Form.Item name="finishedAt" label="Finished at">
								<DatePicker picker="month" style={{ width: '100%' }} format="MMM, YYYY" />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item name="description" label="Details (optional)">
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

export default UserJobModal;
