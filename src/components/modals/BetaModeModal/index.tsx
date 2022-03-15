import React, { useEffect } from 'react';
import { getCookie, setCookie } from '@helpers/cookie';
import { Modal } from 'antd';
import styles from './style.module.less';

const BetaModeModal = () => {
	const [modal, contextHolder] = Modal.useModal();

	useEffect(() => {
		if (!getCookie('beta-mode')) {
			modal.warning({
				title: 'The service is under development',
				content:
					'You can test  and try to use it. But keep in mind that the functionality is constantly changing and your data may be completely or partially lost.',
				onOk: handleOk,
				centered: true,
				closable: false,
				okText: 'Ok, I understand',
				className: styles.modal,
				width: '60%',
			});
		}
	}, []);

	const handleOk = () => {
		setCookie('beta-mode', 'approved', 1);
	};

	return <>{contextHolder}</>;
};

export default BetaModeModal;
