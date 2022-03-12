import styles from './style.module.less';

const LoadingScreen = () => {
	return (
		<div className={styles.screen}>
			<div className={styles.gooey}>
				<span className={styles.dot}></span>
				<div className={styles.dots}>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
		</div>
	);
};

export default LoadingScreen;
