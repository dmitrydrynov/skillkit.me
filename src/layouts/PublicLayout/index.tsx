import { Avatar, Col, Layout, Row, Menu, Space, Button } from "antd";
import React, { FC, useState, useEffect } from "react";
import Link from 'next/link';
import { UserOutlined } from '@ant-design/icons';
import styles from './PublicLayout.module.less';
import { useRouter } from "next/router";

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
	const [currentHeaderMenuItem, setCurrentHeaderMenuItem] = useState<string>('');

	useEffect(() => {
		setCurrentHeaderMenuItem(router.route)
	}, [router.route])

	const handleClick = (e: any) => {
		setCurrentHeaderMenuItem(e.key);
	}

	return (
		<Layout className={styles.layout} >
			<Header className={styles.publicLayout_header}>
				<Row>
					<Col flex="1">
						<div className={styles.logo}></div>
						<Menu onClick={handleClick} selectedKeys={[currentHeaderMenuItem]} mode="horizontal" className={styles.publicLayout_header_menu}>
							{headerMenu.map((menuItem) => (
								<Menu.Item key={menuItem.link}>
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
						<Space>
							<Button type="text" onClick={() => router.push('/work/profile')}>Sign in</Button>
							<Button type="primary">Sign up</Button>
						</Space>
					</Col>
				</Row>
			</Header>
			<Content style={{ margin: '50px' }}>{children}</Content>
			<Footer>Copyright © 2021 AnyCompany, Inc. All rights reserved.</Footer>
		</Layout>
	)
}

export default PublicLayout;