import { useEffect, useRef, useState } from 'react';
import styles from './style.module.less';

const LoadingScreen = ({ visible }) => {
	const [enabled, setEnabled] = useState(true);
	const ref = useRef();

	useEffect(() => {
		setEnabled(visible);
	}, [visible]);

	return enabled ? (
		<div ref={ref} className={styles.screen}>
			<div className={styles.gooey}>
				<span className={styles.dot}></span>
				<div className={styles.dots}>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
		</div>
	) : null;
};

export default LoadingScreen;
