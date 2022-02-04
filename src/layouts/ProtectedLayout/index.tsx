import React, { FC } from 'react';
import skillKitLogo from '@assets/images/skillkit-logo.svg';
import UserMenu from '@components/UserMenu';
import withAuth from '@helpers/withAuth';
import { Col, Layout, Row } from 'antd';
import Image from 'next/image';
import styles from './ProtectedLayout.module.less';

const { Header, Content, Sider } = Layout;

type ProtectedLayoutParams = {
	title: string;
};

const ProtectedLayout: FC<ProtectedLayoutParams> = ({ children }) => {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider className={styles.sider} breakpoint="lg">
				<div className={styles.logo}>
					<Image src={skillKitLogo} layout="intrinsic" alt="gdhub logo" />
				</div>
			</Sider>
			<Layout className="site-layout">
				<Header className={styles.header}>
					<Row justify="space-between" align="middle" style={{ height: 'inherit' }}>
						<Col>{/* <h2>{title}</h2> */}</Col>
						<Col>
							<UserMenu />
						</Col>
					</Row>
				</Header>
				<Content className={styles.content}>{children}</Content>
			</Layout>
		</Layout>
	);
};

export default withAuth(ProtectedLayout);
