import React, { ReactElement, useState } from 'react';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import styles from './style.module.less';

export type InlineEditRequest = {
	name: string;
	initialValue?: any;
	viewMode?: ReactElement;
	editMode?: ReactElement;
	onSave(event: any): void;
	onCancel?(): void;
	onEdit?(): void;
};

export const InlineEdit = ({
	name,
	initialValue = null,
	viewMode,
	editMode,
	onSave = () => {},
	onCancel = () => {},
	onEdit = () => {},
}: InlineEditRequest) => {
	const [form] = Form.useForm();
	const [editting, setEditting] = useState(false);

	const handleEditBtn = () => {
		setEditting(true);
		form.setFieldsValue({ [name]: initialValue });
		onEdit();
	};

	const handleSaveBtn = (values: any) => {
		setEditting(false);
		onSave(values);
	};

	const handleCancelBtn = () => {
		setEditting(false);
		onCancel();
	};

	const viewMenu = <Button type="ghost" shape="circle" size="small" icon={<EditOutlined />} onClick={handleEditBtn} />;
	const editMenu = (
		<>
			<Button type="ghost" shape="circle" size="small" icon={<CloseOutlined />} onClick={handleCancelBtn} />
			<Button type="primary" htmlType="submit" shape="circle" size="small" icon={<CheckOutlined />} />
		</>
	);

	return (
		<div className={styles.container}>
			<Form
				form={form}
				name="inlineForm"
				onFinish={handleSaveBtn}
				initialValues={{ [name]: initialValue }}
				style={{ display: 'flex', alignItems: 'center', width: '100%' }}
			>
				{editting ? (
					<Form.Item name={name} noStyle>
						{editMode}
					</Form.Item>
				) : (
					viewMode
				)}

				{editting ? <Form.Item noStyle>{editMenu}</Form.Item> : viewMenu}
			</Form>
		</div>
	);
};
