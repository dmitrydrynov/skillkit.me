import React, { FC, ReactNode, useState } from 'react';
import { setLogout } from 'src/store/reducers/auth';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useMutation } from 'urql';
import { endSessionMutation } from './../../services/graphql/queries/auth';
import styles from './UserMenu.module.less';

type MenuItem = {
    link?: string;
    title: string;
    action?: () => void;
    before?: ReactNode;
}

const UserMenu: FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [activeUserMenu, setActiveUserMenu] = useState(false);
    const [, endSession] = useMutation(endSessionMutation);

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
            title: 'Sign out',
            action: async () => {
                await endSession();

                dispatch(setLogout());

                router.push('/');
            },
            before: <Menu.Divider />,
        },
    ];

    const userMenu = (
        <Menu>
            {userMenuItems.map((menuItem) => (
                <div key={menuItem.link}>
                    {!!menuItem.before && menuItem.before}
                    <Menu.Item>
                        {!!menuItem.link && (
                            <Link href={menuItem.link}>
                                <a>
                                    {menuItem.title}
                                </a>
                            </Link>
                        )}

                        {!!menuItem.action && (
                            <span onClick={menuItem.action}>
                                {menuItem.title}
                            </span>
                        )}
                    </Menu.Item>
                </div>
            ))}
        </Menu>
    );

    return (
        <Menu
            className={styles.userMenu}
            defaultActiveFirst={false}
            selectedKeys={activeUserMenu ? ['userMenu'] : []}
        >
            <Dropdown
                overlay={userMenu}
                trigger={['click']}
                onVisibleChange={(visible: boolean) => { setActiveUserMenu(visible) }}
            >
                <Menu.Item key="userMenu">
                    <Space align="center">
                        <Avatar icon={<UserOutlined />} className="ant-dropdown-link" />
                        <span className="name">Peter Pan</span>
                    </Space>
                </Menu.Item>
            </Dropdown>
        </Menu>
    );
}

export default UserMenu;