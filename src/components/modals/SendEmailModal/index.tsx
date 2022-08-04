import React, { useEffect, useState } from 'react';
import { getErrorMessage } from '@helpers/errors';
import { sendEmailByHashMutation } from '@services/graphql/queries/userSkill';
import { Form, Input, message, Modal, Row } from 'antd';
import { BiMailSend } from 'react-icons/bi';
import { useMutation } from 'urql';
import styles from './style.module.less';

type _ModalParams = {
	onSend(data: any): void;
	onCancel(): void;
	visible?: boolean;
	hash: string;
};

type _FormData = {
	email: string;
	name: string;
	content: string;
	hash: string;
};

const SendEmailModal = ({ onSend, onCancel, hash, visible = false }: _ModalParams) => {
	const [form] = Form.useForm();
	const [sending, setSending] = useState(false);
	const [, sendEmail] = useMutation(sendEmailByHashMutation);

	useEffect(() => {
		if (visible === false) {
			form.resetFields();
		}
		form.setFieldsValue({ hash });
	}, [visible]);

	const handleSend = async () => {
		let { hash, content, name, email }: _FormData = await form.validateFields();

		if (content) {
			content += `<br/><br/>This letter sent from <a href="${process.env.NEXT_PUBLIC_APP_URL}/s/${hash}">${process.env.NEXT_PUBLIC_APP_URL}/s/${hash}</a>`;
		}

		try {
			setSending(true);

			const { data, error } = await sendEmail({
				hash,
				name,
				email,
				content: content ? content : null,
			});

			if (error) {
				message.error(getErrorMessage(error));
				setSending(false);
				return;
			}

			setSending(false);
			onSend(data);
			form.resetFields();
		} catch (error: any) {
			message.error(error.message);
			setSending(false);
		}
	};

	return (
		<Modal
			title={
				<Row align="middle">
					<BiMailSend size={32} color="#a7a7a7" style={{ marginRight: '8px' }} /> Send letter
				</Row>
			}
			confirmLoading={sending}
			visible={visible}
			onOk={handleSend}
			onCancel={onCancel}
			width={650}
			centered
			maskClosable={false}
			className={styles.modal}
			destroyOnClose={true}>
			<Form className={styles.form} form={form} layout="vertical" name="add_tool_form" requiredMark={true}>
				<Form.Item name="hash" hidden={true} />

				<Form.Item name="name" label="Your name" rules={[{ required: true, message: 'Please input the field!' }]}>
					<Input />
				</Form.Item>

				<Form.Item name="email" label="Your email" rules={[{ required: true, message: 'Please input the field!' }]}>
					<Input />
				</Form.Item>

				<Form.Item name="content" label="Text your letter" rules={[{ required: true, message: 'Please input the field!' }]}>
					<Input.TextArea
						autoSize={{ minRows: 8, maxRows: 24 }}
						style={{ width: '100%', height: 'auto' }}
						placeholder="Start typing"
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default SendEmailModal;
