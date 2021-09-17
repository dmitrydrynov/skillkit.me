import React, { FC, useEffect, useState } from 'react';
import SignInModal from '@components/modals/SignInModal';
import UserMenu from '@components/UserMenu';
import { RootState } from 'src/store/configure-store';
import { Button, Col, Layout, Menu, Row, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import styles from './PublicLayout.module.less';

const { Header, Footer, Content } = Layout;

type HeaderMenu = {
	link: string;
	title: string;
}

const headerMenu: HeaderMenu[] = [{
	link: '/',
	title: 'Home',
},
{
	link: '/about',
	title: 'About',
}];

const PublicLayout: FC = ({ children }) => {
	const router = useRouter();
	const [currentHeaderMenuItem, setCurrentHeaderMenuItem] = useState('');
	const { loggedIn } = useSelector((state: RootState) => state.auth)
	const [visibleSignInModal, setVisibleSignInModal] = useState(false);

	useEffect(() => {
		setCurrentHeaderMenuItem(router.route)
	}, [router.route])

	const handleClick = (e: any) => {
		setCurrentHeaderMenuItem(e.key);
	}

	const handleSignIn = async () => {
		setVisibleSignInModal(true)
	}

	return (
		<>
			<SignInModal visible={visibleSignInModal} onClose={() => setVisibleSignInModal(false)} />
			<Layout className={styles.layout} >
				<Header className={styles.publicLayout_header}>
					<Row align="middle">
						<Col flex="1">
							<div className={styles.logo}></div>
							<Menu
								onClick={handleClick}
								selectedKeys={[currentHeaderMenuItem]}
								mode="horizontal"
								className={styles.publicLayout_header_menu}
							>
								{headerMenu.map((menuItem, indx) => (
									<Menu.Item key={indx}>
										<Link href={menuItem.link}>
											<a>
												{menuItem.title}
											</a>
										</Link>
									</Menu.Item>
								))}
							</Menu>
						</Col>
						<Col>
							{!loggedIn ? (
								<Space>
									<Button type="text" onClick={handleSignIn}>Sign in</Button>
									<Button type="primary">Sign up</Button>
								</Space>
							) : (
								<UserMenu />
							)}
						</Col>
					</Row>
				</Header>
				<Content style={{ margin: '50px' }}>{children}</Content>
				<Footer>Copyright © 2021 AnyCompany, Inc. All rights reserved.</Footer>
			</Layout>
		</>
	)
}

export default PublicLayout;