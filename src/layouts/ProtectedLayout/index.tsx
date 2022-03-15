import React, { FC, ReactElement, useEffect } from 'react';
import skillKitLogo from '@assets/images/skillkit-logo.svg';
import UserMenu from '@components/menus/UserMenu';
import withAuth from '@helpers/withAuth';
import { ProfileOutlined } from '@ant-design/icons';
import { Col, Grid, Layout, Menu, Row } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './ProtectedLayout.module.less';

const { Header, Content, Sider } = Layout;
const { useBreakpoint } = Grid;

type ProtectedLayoutParams = {
	title: string;
	siderMenu: ReactElement | null;
};

const ProtectedLayout: FC<ProtectedLayoutParams> = ({ children, siderMenu = null }) => {
	const router = useRouter();
	const screens = useBreakpoint();

	useEffect(() => {
		if (Object.entries(screens).length) console.log('Sreen sizes', screens);
	}, [screens]);

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
		<Layout className={styles.container} style={{ minHeight: '100vh' }}>
			<Sider className={styles.sider} breakpoint="lg" collapsedWidth={screens.sm ? 80 : 0}>
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
