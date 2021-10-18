import React, { FC } from 'react';
import gdhubLogo from '@assets/images/gdhub-logo.svg';
import UserMenu from '@components/UserMenu';
// import { RootState } from '@store/configure-store';
import { Col, Layout, Row } from 'antd';
// import { useRouter } from 'next/router';
// import { useSelector } from 'react-redux';
import Image from 'next/image';
import styles from './ProtectedLayout.module.less';

const { Header, Content, Sider } = Layout;

type ProtectedLayoutParams = {
	title: string;
};

const ProtectedLayout: FC<ProtectedLayoutParams> = ({ children }) => {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider className={styles.sider} width="250px">
				<div className={styles.logo}>
					<Image src={gdhubLogo} width="100%" alt="gdhub logo" />
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

export default ProtectedLayout;
