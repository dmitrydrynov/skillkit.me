import React, { FC, ReactElement, ReactNode, useEffect } from 'react';
import skillKitLogo from '@assets/images/skillkit-logo.svg';
import UserMenu from '@components/menus/UserMenu';
import withAuth from '@helpers/withAuth';
import { ProfileOutlined } from '@ant-design/icons';
import { Col, Layout, Menu, Row } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './ProtectedLayout.module.less';

const { Header, Content, Sider } = Layout;

type ProtectedLayoutParams = {
	title: string;
	siderMenu: ReactElement | null;
};

const ProtectedLayout: FC<ProtectedLayoutParams> = ({ children, siderMenu = null }) => {
	const router = useRouter();

	const handleMenuClick = ({ key }) => {
		router.push(key);
	};

	const defaultSiderMenu = (
		<Menu mode="inline" selectedKeys={[router.route]} onClick={handleMenuClick}>
			<Menu.Item key="/user/skills" icon={<ProfileOutlined />}>
				My skills
			</Menu.Item>
		</Menu>
	);

	return (
		<Layout className={styles.container}>
			<Sider className={styles.sider} breakpoint="lg">
				<div className={styles.logo}>
					<Image src={skillKitLogo} layout="intrinsic" alt="gdhub logo" />
				</div>
				{siderMenu ? siderMenu : defaultSiderMenu}
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
