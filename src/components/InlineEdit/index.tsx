import React, { ReactElement, useState } from 'react';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import styles from './style.module.less';

export type InlineEditRequest = {
	viewMode?: ReactElement;
	editMode?: ReactElement;
	onSave(): void;
	onCancel?(): void;
	onEdit?(): void;
};

export const InlineEdit = ({
	viewMode,
	editMode,
	onSave = () => {},
	onCancel = () => {},
	onEdit = () => {},
}: InlineEditRequest) => {
	const [editting, setEditting] = useState(false);

	const handleEditBtn = () => {
		setEditting(true);
		onEdit();
	};

	const handleSaveBtn = () => {
		setEditting(false);
		onSave();
	};

	const handleCancelBtn = () => {
		setEditting(false);
		onCancel();
	};

	const viewMenu = <Button type="ghost" shape="circle" size="small" icon={<EditOutlined />} onClick={handleEditBtn} />;
	const editMenu = (
		<>
			<Button type="ghost" shape="circle" size="small" icon={<CloseOutlined />} onClick={handleCancelBtn} />
			<Button type="primary" shape="circle" size="small" icon={<CheckOutlined />} onClick={handleSaveBtn} />
		</>
	);

	return (
		<div className={styles.container}>
			{editting ? editMode : viewMode}
			{editting ? editMenu : viewMenu}
		</div>
	);
};
