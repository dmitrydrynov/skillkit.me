import React, { useEffect, useState } from 'react';
import { getErrorMessage } from '@helpers/errors';
import { searchUserCompaniesQuery } from '@services/graphql/queries/userCompany';
import { createUserJobMutation, getUserJobQuery, updateUserJobMutation } from '@services/graphql/queries/userJob';
import { AutoComplete, Col, DatePicker, Form, Input, message, Modal, Row, Spin } from 'antd';
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
	companyName: string;
	position: string;
	description: string;
	startedAt: Date;
	finishedAt: Date;
};

const UserJobModal = ({ onSave, onCancel, userSkillId, recordId = null, visible = false }: _ModalParams) => {
	const [form] = Form.useForm();
	const [userCompanySearchQuery, setUserCompanySearchQuery] = useState(null);
	/** Mutations */
	const [, createUserJob] = useMutation(createUserJobMutation);
	const [, updateUserJob] = useMutation(updateUserJobMutation);
	/** Queries */
	let [{ data: searchUserCompanyData }, searchUserCompanies] = useQuery({
		query: searchUserCompaniesQuery,
		variables: { search: userCompanySearchQuery },
		pause: !userCompanySearchQuery || userCompanySearchQuery.length <= 2,
		requestPolicy: 'network-only',
	});
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
		setUserCompanySearchQuery(null);
		if (data) {
			form.setFieldsValue({
				companyName: data.userJob.userCompany.name,
				position: data.userJob.position,
				description: data.userJob.description,
				startedAt: data.userJob.startedAt ? moment(data.userJob.startedAt) : null,
				finishedAt: data.userJob.finishedAt ? moment(data.userJob.finishedAt) : null,
			});
		}
	}, [data]);

	const handleCreate = async () => {
		const { companyName, position, description, startedAt, finishedAt }: _FormData = await form.validateFields();

		try {
			const { data, error } = await createUserJob({
				data: {
					userSkillId,
					companyName,
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
		const { companyName, position, description, startedAt, finishedAt }: _FormData = await form.validateFields();

		try {
			const { data, error } = await updateUserJob({
				recordId,
				data: {
					companyName,
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

					<Form.Item
						name="companyName"
						label="Where did you work?"
						rules={[
							{
								required: true,
								message: 'Please input the field!',
							},
						]}
					>
						<AutoComplete
							showSearch
							allowClear
							defaultActiveFirstOption={false}
							showArrow={false}
							filterOption={false}
							placeholder="Company LLC"
							notFoundContent={null}
							onSearch={(value) => setUserCompanySearchQuery(value)}
						>
							{userCompanySearchQuery?.length > 2 &&
								searchUserCompanyData?.userCompanies?.length > 0 &&
								searchUserCompanyData.userCompanies.map((d: any) => (
									<AutoComplete.Option key={d.id} value={d.name}>
										{d.name}
									</AutoComplete.Option>
								))}
						</AutoComplete>
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
