import React, { useEffect, useState } from 'react';
import { getErrorMessage } from '@helpers/errors';
import { getBase64WithPromise, normUploadFile } from '@helpers/file';
import { getUserFileQuery, updateUserFileMutation } from '@services/graphql/queries/userFile';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, Spin, Form, Input, Upload, Button, message } from 'antd';
import { useMutation, useQuery } from 'urql';
import styles from './style.module.less';

type _ModalParams = {
	onSave(data?: any): void;
	onCancel(): void;
	visible?: boolean;
	record?: any;
};

type _FormData = {
	title: string;
	link?: string;
	uploadFile?: any;
	description?: string;
};

enum _UserFileType {
	'LINK' = 'LINK',
	'FILE' = 'FILE',
}

const EditUserFileModal = ({ onSave, onCancel, record = null, visible = false }: _ModalParams) => {
	const [form] = Form.useForm();
	const [fileLoading, setFileLoading] = useState(false);
	const [submitting] = useState(false);
	const [selectedFile, setSelectedFile] = useState<any>();
	const [previewState, setPreviewState] = useState({
		visible: false,
		title: 'Unknown name',
	});
	const [showUploadBtn, setShowUploadBtn] = useState(true);
	const [, updateUserFile] = useMutation(updateUserFileMutation);
	const [{ data, fetching }] = useQuery({
		query: getUserFileQuery,
		variables: { id: record?.id },
		requestPolicy: 'network-only',
		pause: !record,
	});

	useEffect(() => {
		if (data) {
			const { url, title, description, type } = data.userFile;

			if (url && type === _UserFileType.FILE) {
				const fileData = url
					? {
							uid: '-1',
							name: `User file: ${title}`,
							status: 'loaded',
							url: url,
							original: null,
					  }
					: null;

				form.setFieldsValue({
					uploadFile: fileData ? [fileData] : [],
				});
				setShowUploadBtn(false);

				setSelectedFile(fileData);
			}

			form.setFieldsValue({
				link: url,
				title,
				description,
			});
		}
	}, [data]);

	const handleUpdate = async () => {
		const { link, uploadFile, title, description }: _FormData = await form.validateFields();

		const updateData: any = {
			url: link,
			title,
			description: description ? description : null,
		};

		if (Array.isArray(uploadFile) && uploadFile.length) {
			if (uploadFile[0].original) {
				updateData.file = uploadFile[0].original.originFileObj;
			} else if (uploadFile[0].status === 'done') {
				updateData.file = uploadFile[0].originFileObj;
			}
		} else {
			updateData.file = null;
		}

		try {
			const { data, error } = await updateUserFile({
				recordId: record.id,
				data: updateData,
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

	const handleFileChange = async ({ file }: any) => {
		if (file && file.status === 'uploading') {
			setFileLoading(true);
			setShowUploadBtn(false);
			const src = await getBase64WithPromise(file.originFileObj);

			setSelectedFile({
				name: file.name,
				url: src,
			});
		}
		if (file.status === 'done') {
			setFileLoading(false);
		}
	};

	const resetModalData = () => {
		form.resetFields();
		setShowUploadBtn(true);
		setSelectedFile(null);
	};

	const handleFilePreview = async (file) => {
		setPreviewState({
			visible: true,
			title: file.name,
		});
	};

	if (!record) {
		return null;
	}

	return (
		<Modal
			title="Edit file"
			visible={visible}
			onOk={() => handleUpdate()}
			onCancel={() => {
				onCancel();
				resetModalData();
			}}
			width={650}
			centered
			maskClosable={false}
			className={styles.modal}
			destroyOnClose={true}
			confirmLoading={submitting}>
			<Spin spinning={submitting || fetching}>
				<Form form={form} layout="vertical" name="edit_user_file_form" requiredMark={false} className={styles.form}>
					{record.type == _UserFileType.LINK && (
						<>
							<Form.Item name="id" hidden={true} />

							<Form.Item
								name="link"
								label="Link"
								rules={[
									{
										required: true,
										message: 'This field is required.',
									},
									{
										type: 'url',
										message: 'This field must be a valid url.',
									},
								]}>
								<Input />
							</Form.Item>

							<Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the field!' }]}>
								<Input />
							</Form.Item>

							<Form.Item name="description" label="Descriptions (optional)">
								<Input.TextArea
									autoSize={{ minRows: 4, maxRows: 12 }}
									style={{ width: '100%', height: 'auto' }}
									showCount
									maxLength={250}
									placeholder="Start typing"
								/>
							</Form.Item>
						</>
					)}
					{record.type == _UserFileType.FILE && (
						<>
							<Form.Item name="id" hidden={true} />

							<Form.Item
								name="uploadFile"
								label="Upload file"
								rules={[{ required: true, message: 'Please input the field!' }]}
								valuePropName="fileList"
								getValueFromEvent={normUploadFile}>
								<Upload
									listType="picture"
									className={styles.uploader}
									onChange={handleFileChange}
									onPreview={handleFilePreview}
									onRemove={() => setShowUploadBtn(true)}
									style={{ maxWidth: '200px' }}
									maxCount={1}>
									{showUploadBtn && (
										<Button type="ghost">{fileLoading ? <LoadingOutlined /> : <PlusOutlined />} Select file</Button>
									)}
								</Upload>
							</Form.Item>

							<Modal
								width="80%"
								visible={previewState.visible}
								title={previewState.title}
								footer={null}
								onCancel={() => setPreviewState({ visible: false, title: 'Unknown name' })}>
								<img alt={selectedFile?.name} style={{ maxWidth: '100%' }} src={selectedFile?.url} />
							</Modal>

							<Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the field!' }]}>
								<Input />
							</Form.Item>

							<Form.Item name="description" label="Descriptions (optional)">
								<Input.TextArea
									autoSize={{ minRows: 4, maxRows: 12 }}
									style={{ width: '100%', height: 'auto' }}
									showCount
									maxLength={250}
									placeholder="Start typing"
								/>
							</Form.Item>
						</>
					)}
				</Form>
			</Spin>
		</Modal>
	);
};

export default EditUserFileModal;
