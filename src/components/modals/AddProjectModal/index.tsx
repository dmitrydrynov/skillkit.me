import React, { FC, useEffect } from 'react';
import { createProjectMutation } from '@services/graphql/queries/project';
import { RootState } from '@store/configure-store';
import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, message, Row, Col, Avatar } from 'antd';
import { useSelector } from 'react-redux';
import { useMutation } from 'urql';
import styles from './style.module.less';

type AddProjectModalArgs = {
	recordId: string;
	operation: string;
	visible: boolean;
	onClose: () => void;
	onFinish: () => void;
};

type AddProjectRequest = {
	title: string;
	genre: string;
	platforms: string;
	settingName?: string;
	settingDescription?: string;
};

const AddProjectModal: FC<AddProjectModalArgs> = ({ visible, onClose }) => {
	const [form] = Form.useForm();
	const authUser = useSelector((state: RootState) => state.user);
	const [createProjectResponse, createProject] = useMutation(createProjectMutation);

	useEffect(() => {
		form.resetFields();
	}, [form]);

	const handleOk = async () => {
		const values: AddProjectRequest = await form.validateFields();

		try {
			const { error } = await createProject({
				data: {
					founder: { connect: { id: authUser.id } },
					title: values.title,
					genre: values.genre,
					platforms: values.platforms,
					settingName: values.settingName,
					settingDescription: values.settingDescription,
				},
			});

			if (error) {
				message.error(error.message);
				createProjectResponse.fetching = false;
				return;
			}

			message.success('The game project succesful added');

			// router.push('/settings/profile');
			onClose();
		} catch (e) {
			message.error(e.message);
		}
	};

	const handleCancel = () => {
		onClose();
	};

	return (
		<Modal
			title="Add new game project"
			visible={visible}
			onCancel={handleCancel}
			width={650}
			centered
			maskClosable={false}
			className={styles.modal}
			footer={[
				<Button
					key="submit"
					type="primary"
					size="large"
					loading={createProjectResponse.fetching && !createProjectResponse.error}
					onClick={handleOk}
					className={styles.submitBtn}
				>
					Save
				</Button>,
			]}
		>
			<Form
				className={styles.form}
				form={form}
				layout="vertical"
				name="addProjectForm"
				initialValues={{ modifier: 'public' }}
				requiredMark={false}
			>
				<Row align="middle">
					<Col span={12}>
						<Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the field!' }]}>
							<Input placeholder="Super Mario" />
						</Form.Item>
					</Col>
					<Col span={11} push={1}>
						<div className={styles.founderName}>
							by{' '}
							{authUser.avatar ? (
								<Avatar size={24} src={authUser.avatar} className={`${styles.avatar} ant-dropdown-link`} />
							) : (
								<Avatar size={40} icon={<UserOutlined />} className={`${styles.avatar} ant-dropdown-link`} />
							)}
							{authUser.fullName}
						</div>
					</Col>
				</Row>

				<Row>
					<Col span={12}>
						<Form.Item label="Genre" name="genre" rules={[{ required: true, message: 'Please input the field!' }]}>
							<Input placeholder="Platformer" />
						</Form.Item>
					</Col>
					<Col span={11} push={1}>
						<Form.Item label="Platforms" name="platforms" rules={[{ required: true, message: 'Please input the field!' }]}>
							<Input placeholder="Mobile game" />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item label="Setting description (short)" name="settingName">
					<Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} showCount maxLength={200} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item label="Gameplay description (short)" name="description">
					<Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }} showCount maxLength={2000} style={{ width: '100%' }} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default AddProjectModal;
