import React from 'react';
import UserSkillEditor from '@components/editors/UserSkillEditor';
import { Grid, Modal } from 'antd';
import styles from './style.module.less';
import SkillEditorBeforeContent from '@components/SkillEditorBeforeContent';

const { useBreakpoint } = Grid;

type _ModalParams = {
	onSave(data: any): void;
	onCancel(): void;
	visible?: boolean;
	recordId?: number;
};

const UserSkillEditModal = ({ onSave, onCancel, recordId = null, visible = false }: _ModalParams) => {
	const screens = useBreakpoint();

	return (
		<Modal
			title={<SkillEditorBeforeContent userSkillId={recordId} showViewButton={false} />}
			visible={visible}
			onOk={onSave}
			onCancel={onCancel}
			width={screens.lg ? '80%' : 'calc(100% - 20px)'}
			maskClosable={false}
			className={styles.modal}
			destroyOnClose={true}
			footer={null}
		>
			<UserSkillEditor userSkillId={recordId} />
		</Modal>
	);
};

export default UserSkillEditModal;
