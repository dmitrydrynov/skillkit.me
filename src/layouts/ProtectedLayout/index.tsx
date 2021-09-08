import { Avatar, Col, Layout, Row, Menu, Space, Button, Popover, Dropdown, Divider } from "antd";
import React, { FC, ReactNode, useState } from "react";
import Link from 'next/link';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import styles from './ProtectedLayout.module.less';

const { Header, Footer, Content, Sider } = Layout;

type MenuItem = {
    link: string;
    title: string;
    before?: ReactNode;
}

type ProtectedLayoutParams = {
    title?: string;
}

const userMenuItems: MenuItem[] = [
    {
        link: '/user/profile',
        title: 'Profile',
    },
    {
        link: '/user/skills',
        title: 'Skills',
    },
    {
        link: '/',
        title: 'Sign out',
        before: <Menu.Divider />,
    }];

const ProtectedLayout: FC<ProtectedLayoutParams> = ({ children, title }) => {
    const [activeUserMenu, setActiveUserMenu] = useState(false);

    const userMenu = (
        <Menu>
            {userMenuItems.map((menuItem) => (
                <div key={menuItem.link}>
                    {!!menuItem.before && menuItem.before}
                    <Menu.Item>
                        <Link href={menuItem.link}>
                            <a>
                                {menuItem.title}
                            </a>
                        </Link>
                    </Menu.Item>
                </div>
            ))}
        </Menu>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider className={styles.sider}>
                <div className={styles.logo}></div>
            </Sider>
            <Layout className="site-layout">
                <Header className={styles.header} >
                    <Row justify="space-between" align="top" style={{ height: 'inherit' }} >
                        {!!title &&
                            <Col>
                                <h2>{title}</h2>
                            </Col>
                        }
                        <Col>
                            <Menu
                                className={styles.header_userMenu}
                                defaultActiveFirst={false}
                                selectedKeys={activeUserMenu ? ["userMenu"] : []}
                            >
                                <Dropdown overlay={userMenu} trigger={['click']} onVisibleChange={(visible: boolean) => { setActiveUserMenu(visible) }}>
                                    <Menu.Item key="userMenu">
                                        <Space align="center">
                                            <Avatar icon={<UserOutlined />} className="ant-dropdown-link" />
                                            <span className="name">Peter Pan</span>
                                        </Space>
                                    </Menu.Item>
                                </Dropdown>
                            </Menu>
                        </Col>
                    </Row>
                </Header>
                <Content style={{ margin: '64px 16px' }}>{children}</Content>
            </Layout>
        </Layout >
    )
}

export default ProtectedLayout;