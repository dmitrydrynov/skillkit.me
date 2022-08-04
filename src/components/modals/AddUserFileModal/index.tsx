import React, { useState } from 'react';
import { getErrorMessage } from '@helpers/errors';
import { getBase64WithPromise, normUploadFile } from '@helpers/file';
import { createUserFileMutation } from '@services/graphql/queries/userFile';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, Spin, Tabs, Form, Input, Upload, Button, message } from 'antd';
import { useMutation } from 'urql';
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
	link?: string;
	uploadFile?: any;
	description?: string;
};

enum _ActionEnum {
	'AddLink',
	'UploadImage',
}

const AddUserFileModal = ({ onSave, onCancel, userSkillId, recordId = null, visible = false }: _ModalParams) => {
	const [form] = Form.useForm();
	const [selectedAction, setSelectedAction] = useState(_ActionEnum.AddLink);
	const [fileLoading, setFileLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	// const [fileUrl, setFileUrl] = useState(null);
	const [selectedFile, setSelectedFile] = useState<any>();
	const [previewState, setPreviewState] = useState({
		visible: false,
		title: 'Unknown name',
	});
	const [showUploadBtn, setShowUploadBtn] = useState(true);
	const [, createUserFile] = useMutation(createUserFileMutation);

	const handleCreate = async () => {
		const { title, description, uploadFile, link }: _FormData = await form.validateFields();

		setSubmitting(true);

		try {
			let createData: any = {
				data: {
					attachTo: 'userSkill',
					attachId: userSkillId,
					title,
					description: description ? description : null,
				},
			};

			if (link) {
				createData.data.url = link;
				createData.data.type = 'LINK';
			}

			if (uploadFile && uploadFile.length) {
				createData.data.file = uploadFile[0].originFileObj;
				createData.data.type = 'FILE';
			}

			const { data, error } = await createUserFile(createData);

			if (error) {
				message.error(getErrorMessage(error));
				setSubmitting(false);
				return;
			}

			onSave('create', data.createUserFile);
			resetModalData();
			setSubmitting(false);
		} catch (error) {
			message.error(error.message);
			setSubmitting(false);
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
		setSelectedAction(_ActionEnum.AddLink);
		setSelectedFile(null);
	};

	const handleFilePreview = async (file) => {
		setPreviewState({
			visible: true,
			title: file.name,
		});
	};

	return (
		<Modal
			title={recordId ? `Edit the example` : 'Add an example'}
			visible={visible}
			onOk={() => handleCreate()}
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
			<Spin spinning={submitting}>
				<Form form={form} layout="vertical" name="add_example_link_form" requiredMark={false}>
					<Tabs
						defaultActiveKey={_ActionEnum.AddLink.toString()}
						tabPosition="left"
						className={styles.tabs}
						onTabClick={(selectedKey) => {
							setSelectedAction(selectedKey as unknown as _ActionEnum);
							form.resetFields();
							setShowUploadBtn(true);
						}}>
						<Tabs.TabPane tab={`Add link`} key={_ActionEnum.AddLink}>
							{selectedAction == _ActionEnum.AddLink && (
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
						</Tabs.TabPane>
						<Tabs.TabPane tab={`Upload image`} key={_ActionEnum.UploadImage}>
							{selectedAction == _ActionEnum.UploadImage && (
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
						</Tabs.TabPane>
					</Tabs>
				</Form>
			</Spin>
		</Modal>
	);
};

export default AddUserFileModal;
