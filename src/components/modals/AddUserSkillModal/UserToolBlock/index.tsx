/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Icon from '@ant-design/icons';
import { Col, Form, Input, message, Modal, Rate, Row } from 'antd';
import { ControlType } from 'braft-editor';
import dynamic from 'next/dynamic';
import styles from './style.module.less';

const BraftEditor: any = dynamic(() => import('braft-editor').then((mod: any) => mod.default), {
	ssr: false,
});

type UserToolBlockParams = {
	onSave(): void;
	onCancel(): void;
	visible?: boolean;
};

const ToolLevelSvg = () => (
	<svg width="1em" height="1em" viewBox="0 0 29 29" fill="currentColor">
		<rect width="29" height="29" />
	</svg>
);
const ToolLevelIcon = (props: any) => <Icon component={ToolLevelSvg} {...props} />;

const UserToolBlock = ({ onSave, onCancel, visible = false }: UserToolBlockParams) => {
	const [form] = Form.useForm();
	const controls: ControlType[] = ['bold', 'italic', 'underline', 'text-color'];
	const userToolDesc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
	const [titles, setTitles] = useState<string[] | undefined>([]);
	const [activeKey, setActiveKey] = useState<number>();

	const onOk = async () => {
		try {
			const { data, error } = await addUserTool({
				name: skillSearchQuery,
			});

			if (error) {
				message.error(error);
				return;
			}

			// searchSkillData?.skills.push(data.createSkill);
			// setSelectedSkillId(data.createSkill.id);
		} catch (error: any) {
			message.error(error.message);
		}
	};

	return (
		<Modal
			title="Add tool"
			visible={visible}
			onOk={onOk}
			onCancel={onCancel}
			width={650}
			centered
			maskClosable={false}
			className={styles.modal}
		>
			<Form className={styles.form} form={form} layout="vertical" name="add_tool_form" requiredMark={true}>
				<Form.Item name="id" hidden={true} />

				<Row>
					<Col span={14}>
						<Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the field!' }]}>
							<Input />
						</Form.Item>
					</Col>
					<Col span={8} offset={2}>
						<Form.Item name="level" label="Level" rules={[{ required: true, message: 'Please input the field!' }]}>
							<Rate allowClear={false} tooltips={userToolDesc} character={<ToolLevelIcon />} />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name="description" label="Description" style={{ marginBottom: 0 }}>
					<BraftEditor
						className={styles.textEditor}
						controls={controls}
						language="en"
						contentClassName={styles.textEditorContent}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default UserToolBlock;
