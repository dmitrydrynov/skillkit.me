import { FC, useEffect, useState } from 'react';
import { UserSkillViewModeEnum } from 'src/definitions/skill';
import { Layout } from 'antd';
import { useRouter } from 'next/router';
import styles from './ShareLayout.module.less';

const { Header, Content, Footer } = Layout;

type ShareLayoutParams = {
	title: string;
	viewMode: UserSkillViewModeEnum;
};

const ShareLayout: FC<ShareLayoutParams> = ({ children, title, viewMode }) => {
	const router = useRouter();
	const [, setCurrentHeaderMenuItem] = useState('');

	useEffect(() => {
		setCurrentHeaderMenuItem(router.route);
	}, [router.route]);

	return (
		<>
			<Layout className={styles.layout}>
				{/* <Header className={styles.ShareLayout_header}>Header</Header> */}
				<Content className={styles.content}>{children}</Content>
				<Footer>Copyright © 2022 Skillkit.me, Created by Dzmitry Drynau. All rights reserved.</Footer>
			</Layout>
		</>
	);
};

export default ShareLayout;
