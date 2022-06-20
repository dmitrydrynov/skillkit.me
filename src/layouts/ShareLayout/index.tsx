import { FC } from 'react';
import skillKitLogo from '@assets/images/skillkit-logo.svg';
import { UserSkillViewModeEnum } from 'src/definitions/skill';
import { Button, Col, Layout, Row } from 'antd';
import Image from 'next/image';
import styles from './ShareLayout.module.less';

const { Header, Content, Footer } = Layout;

type ShareLayoutParams = {
	title: string;
	viewMode: UserSkillViewModeEnum;
};

const ShareLayout: FC<ShareLayoutParams> = ({ children, title, viewMode }) => {
	return (
		<>
			<Layout className={styles.layout}>
				<Header className={styles.shareLayout_header}>
					<Row align="middle" className={styles.logoContainer}>
						<Col flex="1">
							<div className={styles.logo}>
								<Image src={skillKitLogo} alt="skillKit logo" />
							</div>
						</Col>
						<Col>
							<Button href="/">Go to skillkit.me</Button>
						</Col>
					</Row>
				</Header>
				<Content className={styles.content}>{children}</Content>
				<Footer>Copyright © 2022 Skillkit.me, Created by Dzmitry Drynau. All rights reserved.</Footer>
			</Layout>
		</>
	);
};

export default ShareLayout;
