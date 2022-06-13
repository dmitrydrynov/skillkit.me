import { FC, useEffect, useState } from 'react';
import LoadingScreen from '@components/loadingScreen';
import { RootState } from '@store/configure-store';
import { UserSkillViewModeEnum } from 'src/definitions/skill';
import { Layout } from 'antd';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import styles from './ShareLayout.module.less';

const { Header, Content, Footer } = Layout;

type ShareLayoutParams = {
	title: string;
	viewMode: UserSkillViewModeEnum;
};

const ShareLayout: FC<ShareLayoutParams> = ({ children, title, viewMode }) => {
	const router = useRouter();
	const [, setCurrentHeaderMenuItem] = useState('');
	const { loggedIn, logginingIn } = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		setCurrentHeaderMenuItem(router.route);
	}, [router.route]);

	return (
		<>
			<LoadingScreen />
			<Layout className={styles.layout}>
				{/* <Header className={styles.ShareLayout_header}>Header</Header> */}
				<Content className={styles.content}>{children}</Content>
				<Footer>Copyright © 2022 Skillkit.me, Created by Dzmitry Drynau. All rights reserved.</Footer>
			</Layout>
		</>
	);
};

export default ShareLayout;
