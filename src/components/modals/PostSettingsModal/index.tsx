import React, { useEffect } from 'react';
import { getErrorMessage } from '@helpers/errors';
import { updatePostMutation } from '@services/graphql/queries/post';
import { Button, Form, Input, message, Modal, Tooltip } from 'antd';
import { BiCopy } from 'react-icons/bi';
import { useMutation } from 'urql';
import styles from './style.module.less';

type _ModalParams = {
	onSave(data: any): void;
	onCancel(): void;
	visible?: boolean;
	recordId?: number;
	post: any;
};

type _FormData = {
	slug: string;
	description: string;
};

const PostSettingsModal = ({ onSave, onCancel, post, recordId = null, visible = false }: _ModalParams) => {
	const [form] = Form.useForm();
	const [, updatePost] = useMutation(updatePostMutation);

	useEffect(() => {
		if (visible) {
			form.setFieldsValue({
				slug: post.slug,
				description: post.description,
			});
		}
	}, [visible]);

	const handleSave = async () => {
		const { slug, description }: _FormData = await form.validateFields();
		try {
			const { data, error } = await updatePost({
				recordId: post.id,
				data: { slug, description },
			});

			if (error) {
				message.error(getErrorMessage(error));
				return;
			}

			onSave(data);
			form.resetFields();
		} catch (error: any) {
			message.error(error.message);
		}
	};

	const handleCopyLink = () => {
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard?.writeText(process.env.NEXT_PUBLIC_APP_URL + '/blog/' + post.slug);
			message.success('The post link copied to clipboard');
		} else {
			message.warning('Copy link doesnt work. There isnt SecureContext');
		}
	};

	return (
		<Modal
			title="Settings"
			visible={visible}
			onOk={handleSave}
			onCancel={onCancel}
			width={650}
			centered
			maskClosable={false}
			className={styles.modal}
			destroyOnClose={true}
		>
			<Form className={styles.form} form={form} layout="vertical" name="post_meta_form" requiredMark={true}>
				<Form.Item name="id" hidden={true} />

				{!recordId && (
					<Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Please input the field!' }]}>
						<Input
							className={styles.slugInput}
							prefix={process.env.NEXT_PUBLIC_APP_URL + '/blog/'}
							suffix={
								<Tooltip title="Copy the link">
									<Button type="text" shape="circle" size="small" onClick={handleCopyLink}>
										<BiCopy />
									</Button>
								</Tooltip>
							}
						/>
					</Form.Item>
				)}

				<Form.Item name="description" label="Short description">
					<Input.TextArea
						autoSize={{ minRows: 4, maxRows: 12 }}
						style={{ width: '100%', height: 'auto' }}
						showCount
						maxLength={250}
						placeholder="Start typing"
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default PostSettingsModal;
