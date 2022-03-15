import React, { useState } from 'react';
import { getErrorMessage } from '@helpers/errors';
import { getBase64WithPromise } from '@helpers/file';
import { createUserExampleMutation, updateUserExampleMutation } from '@services/graphql/queries/userExample';
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
	url?: string;
	uploadFile?: any;
	description?: string;
};

enum _ActionEnum {
	'AddLink',
	'UploadImage',
}

const UserExampleModal = ({ onSave, onCancel, userSkillId, recordId = null, visible = false }: _ModalParams) => {
	const [form] = Form.useForm();
	const [selectedAction, setSelectedAction] = useState(_ActionEnum.AddLink);
	const [fileLoading, setFileLoading] = useState(false);
	// const [fileUrl, setFileUrl] = useState(null);
	const [selectedFile, setSelectedFile] = useState<any>();
	const [previewState, setPreviewState] = useState({
		visible: false,
		title: 'Unknown name',
	});
	const [, createUserExample] = useMutation(createUserExampleMutation);
	const [, updateUserExample] = useMutation(updateUserExampleMutation);
	// const [{ data, fetching }] = useQuery({
	// 	query: getUserExampleQuery,
	// 	variables: { id: recordId },
	// 	requestPolicy: 'network-only',
	// 	pause: !recordId,
	// });

	// useEffect(() => {
	// 	if (visible === false) {
	// 		form.resetFields();
	// 	}
	// }, [visible]);

	// useEffect(() => {
	// 	if (data) {
	// 		form.setFieldsValue({
	// 			title: data.userExample.title,
	// 			position: data.userExample.position,
	// 			description: data.userExample.description,
	// 			startedAt: data.userExample.startedAt ? moment(data.userExample.startedAt) : null,
	// 			finishedAt: data.userExample.finishedAt ? moment(data.userExample.finishedAt) : null,
	// 		});
	// 	}
	// }, [data]);

	const handleCreate = async () => {
		const { title, description, uploadFile }: _FormData = await form.validateFields();

		debugger;

		try {
			const { data, error } = await createUserExample({
				data: {
					userSkillId,
					title,
					file: uploadFile.file.originFileObj,
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
		// const { url }: _FormData = await form.validateFields();
		// try {
		// 	const { data, error } = await updateUserExample({
		// 		recordId,
		// 		data: {
		// 			title,
		// 			position,
		// 			description: description ? description : null,
		// 			startedAt,
		// 			finishedAt,
		// 		},
		// 	});
		// 	if (error) {
		// 		message.error(getErrorMessage(error));
		// 		return;
		// 	}
		// 	onSave('update', data);
		// 	form.resetFields();
		// } catch (error: any) {
		// 	message.error(error.message);
		// }
	};

	const handleFileChange = async ({ file }: any) => {
		if (file && file.status === 'uploading') {
			setFileLoading(true);
			const src = await getBase64WithPromise(file.originFileObj);

			setSelectedFile({
				uid: file.uid,
				name: file.name,
				status: 'done',
				url: src,
				original: file,
			});
		}
		if (file.status === 'done') {
			setFileLoading(false);
		}
	};

	const handleFilePreview = async (file) => {
		// let src = file.url;
		// if (!src) {
		// 	src = await new Promise((resolve) => {
		// 		getBase64(file.originFileObj);
		// 	});
		// }
		setPreviewState({
			visible: true,
			title: selectedFile.name,
		});
	};

	return (
		<Modal
			title={recordId ? `Edit the example` : 'Add an example'}
			visible={visible}
			onOk={() => (recordId ? handleUpdate() : handleCreate())}
			onCancel={onCancel}
			width={650}
			centered
			maskClosable={false}
			className={styles.modal}
			destroyOnClose={true}
		>
			<Spin spinning={false}>
				<Tabs
					defaultActiveKey="1"
					tabPosition="left"
					className={styles.tabs}
					onTabClick={(selectedKey) => setSelectedAction(selectedKey as unknown as _ActionEnum)}
				>
					<Tabs.TabPane tab={`Add link`} key={_ActionEnum.AddLink}>
						{selectedAction == _ActionEnum.AddLink && (
							<Form form={form} layout="vertical" name="add_example_link_form" requiredMark={false}>
								<Form.Item name="id" hidden={true} />

								<Form.Item name="url" label="Link" rules={[{ required: true, message: 'Please input the field!' }]}>
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
							</Form>
						)}
					</Tabs.TabPane>
					<Tabs.TabPane tab={`Upload image`} key={_ActionEnum.UploadImage}>
						{selectedAction == _ActionEnum.UploadImage && (
							<Form form={form} layout="vertical" name="add_example_upload_form" requiredMark={false}>
								<Form.Item name="id" hidden={true} />

								<Form.Item
									name="uploadFile"
									label="Upload file"
									getValueFromEvent={(e) => {
										debugger;
										console.log('Upload event:', e);

										return e && e.fileList;
									}}
								>
									{/* <ImgCrop rotate> */}
									<Upload
										name={'file'}
										listType="picture"
										className="image-uploader"
										fileList={selectedFile ? [selectedFile] : []}
										onChange={handleFileChange}
										onPreview={handleFilePreview}
										onRemove={() => setSelectedFile(null)}
										maxCount={1}
									>
										{!selectedFile && (
											<Button type="ghost">{fileLoading ? <LoadingOutlined /> : <PlusOutlined />} Select file</Button>
										)}
									</Upload>
									{/* </ImgCrop> */}
								</Form.Item>

								<Modal
									visible={previewState.visible}
									title={previewState.title}
									footer={null}
									onCancel={() => setPreviewState({ visible: false, title: 'Unknown name' })}
								>
									<img alt={selectedFile?.name} style={{ width: '100%' }} src={selectedFile?.url} />
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
							</Form>
						)}
					</Tabs.TabPane>
				</Tabs>
			</Spin>
		</Modal>
	);
};

export default UserExampleModal;
