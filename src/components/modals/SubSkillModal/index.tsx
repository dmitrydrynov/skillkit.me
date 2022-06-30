import React, { useEffect, useState } from 'react';
import { getErrorMessage } from '@helpers/errors';
import { getBase64WithPromise } from '@helpers/file';
import { capitalizedText } from '@helpers/text';
import { createUserFileMutation } from '@services/graphql/queries/userFile';
import { userSkillsWithChildrenQuery } from '@services/graphql/queries/userSkill';
import { Modal, Spin, Tabs, Form, message, TreeSelect } from 'antd';
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
	subSkills: number[];
};

enum _ActionEnum {
	'AddNew',
	'SelectFromList',
}

const SubSkillModal = ({ onSave, onCancel, userSkillId, recordId = null, visible = false }: _ModalParams) => {
	const [form] = Form.useForm();
	const [selectedAction, setSelectedAction] = useState(_ActionEnum.SelectFromList);
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
	const [userSkills] = useQuery({ query: userSkillsWithChildrenQuery, pause: !visible && !userSkillId });
	const [userSkillsTree, setUserSkillsTree] = useState([]);

	useEffect(() => {
		const _tree = [];
		if (userSkills.data) {
			setUserSkillsTree(prepareUserSkillData(userSkills.data.userSkills));
		}
	}, [userSkills]);

	const prepareUserSkillData = (_data: any[]) => {
		if (_data)
			return _data.map((item: any) => {
				return {
					title: capitalizedText(item.skill.name),
					value: item.id,
					key: item.id,
					children: prepareUserSkillData(item?.children),
				};
			});

		return [];
	};

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
		setSelectedAction(_ActionEnum.SelectFromList);
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
			title="Add subskills"
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
			confirmLoading={submitting}
		>
			<Spin spinning={submitting}>
				<Form form={form} layout="vertical" name="add_example_link_form" requiredMark={false}>
					<Tabs
						defaultActiveKey={_ActionEnum.SelectFromList.toString()}
						tabPosition="left"
						className={styles.tabs}
						onTabClick={(selectedKey) => {
							setSelectedAction(selectedKey as unknown as _ActionEnum);
							form.resetFields();
							setShowUploadBtn(true);
						}}
					>
						<Tabs.TabPane tab={`Select from list`} key={_ActionEnum.SelectFromList}>
							{selectedAction == _ActionEnum.SelectFromList && (
								<>
									<Form.Item
										name="subSkills"
										label="Subskills"
										rules={[
											{
												required: true,
												message: 'This field is required.',
											},
										]}
									>
										<TreeSelect
											treeData={userSkillsTree}
											treeCheckable
											allowClear
											showSearch
											showCheckedStrategy="SHOW_PARENT"
											placeholder="Please select"
											filterTreeNode={(search, item) => {
												const title = item.title as string;
												return title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
											}}
										/>
									</Form.Item>
								</>
							)}
						</Tabs.TabPane>
						<Tabs.TabPane tab={`Add new`} key={_ActionEnum.AddNew}>
							{selectedAction == _ActionEnum.AddNew && <>In development</>}
						</Tabs.TabPane>
					</Tabs>
				</Form>
			</Spin>
		</Modal>
	);
};

export default SubSkillModal;
