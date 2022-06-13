import { useEffect, useState } from 'react';
import styles from './style.module.less';

const LoadingScreen = ({ visible }) => {
	const [enabled, setEnabled] = useState(true);

	useEffect(() => {
		setEnabled(visible);
	}, [visible]);

	return (
		<div className={styles.loader} style={{ opacity: enabled ? 1 : 0, zIndex: enabled ? 9999 : -1 }}>
			<div className={styles.loadThreeBounce}>
				<div className={`${styles.loadChild} ${styles.bounce1}`}></div>
				<div className={`${styles.loadChild} ${styles.bounce2}`}></div>
				<div className={`${styles.loadChild} ${styles.bounce3}`}></div>
			</div>
		</div>
	);
};

export default LoadingScreen;
