import React, { createContext, createRef, ReactElement, ReactNode, useEffect, useState } from 'react';
import { ReactFC } from '@appTypes/react';
import skillKitLogo from '@assets/images/skillkit-alpha-logo.svg';
import UserMenu from '@components/menus/UserMenu';
import withAuth from '@helpers/withAuth';
import { RootState } from '@store/configure-store';
import { UserRole } from 'src/definitions/user';
import { ProfileOutlined } from '@ant-design/icons';
import { Col, Grid, Layout, Menu, Row } from 'antd';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import styles from './ProtectedLayout.module.less';

const { Header, Content, Sider } = Layout;
const { useBreakpoint } = Grid;

type ProtectedLayoutParams = {
	title: string;
	siderMenu?: ReactElement;
	onLocation?: () => void;
	beforeContent?: ReactNode;
	can?: {
		roles: UserRole[];
	};
};

export const PageContext = createContext({});

const ProtectedLayout: ReactFC<ProtectedLayoutParams> = ({
	children,
	title,
	siderMenu = null,
	beforeContent,
	can = null,
}) => {
	const router = useRouter();
	const screens = useBreakpoint();
	const [siderCollapsed, setSiderCollapsed] = useState(true);
	const [pageData, setPageData] = useState(null);
	const siderRef = createRef<HTMLDivElement>();
	const authUser = useSelector((state: RootState) => state.user);

	useEffect(() => {
		if (!authUser.id) {
			return;
		}

		if (can && !can.roles.includes(authUser.role.name)) {
			permissionDeny();
		}
	}, [can, authUser]);

	const permissionDeny = async () => {
		await router.push('/403');
	};

	const handleMenuClick = ({ key }) => {
		router.push(key);
		setSiderCollapsed(true);
	};

	const items = [{ label: 'My skills', key: '/user/skills', icon: <ProfileOutlined /> }];

	const defaultSiderMenu = <Menu mode="inline" selectedKeys={[router.route]} onClick={handleMenuClick} items={items} />;

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<Layout className={styles.container} style={{ minHeight: '100vh' }}>
				<div
					className={styles.siderWrapper}
					onClick={() => {
						setSiderCollapsed(true);
					}}
					style={siderCollapsed ? { opacity: 0, display: 'none' } : { opacity: 1, display: 'block' }}
				></div>
				<Sider
					ref={siderRef}
					className={styles.sider}
					trigger={siderCollapsed ? <AiOutlineMenu /> : <AiOutlineClose />}
					breakpoint="lg"
					collapsedWidth={screens.sm ? 80 : 0}
					collapsed={!screens.lg && siderCollapsed}
					onCollapse={(collapsed, type) => {
						if (type === 'clickTrigger') {
							setSiderCollapsed(collapsed);
						}
					}}
				>
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
					<PageContext.Provider value={{ pageData, setPageData }}>
						{beforeContent ? beforeContent : null}
						<Content className={styles.content}>{children}</Content>
					</PageContext.Provider>
				</Layout>
			</Layout>
		</>
	);
};

export default withAuth(ProtectedLayout);
