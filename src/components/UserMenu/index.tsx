import { FC, ReactNode, useState } from 'react';
import { endSessionMutation } from '@services/graphql/queries/auth';
import { RootState } from '@store/configure-store';
import { setLogout } from '@store/reducers/auth';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'urql';
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
    const authUser = useSelector((state: RootState) => state.user)

    const userMenuItems: MenuItem[] = [
        {
            link: '/settings/profile',
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
                    <Menu.Item key={menuItem.link}>
                        {!!menuItem.link && (
                            <Link href={menuItem.link}>
                                <a>
                                    {menuItem.title}
                                </a>
                            </Link>
                        )}

                        {!!menuItem.action && (
                            <span onClick={menuItem.action} aria-hidden="true">
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
                        <div className={styles.info}>
                            <p className={styles.name}>{authUser.name}</p>
                            <p className={styles.email}>{authUser.email}</p>
                        </div>
                        {authUser.avatar ? (
                            <Avatar
                                size={40}
                                src={`http://localhost:8000${  authUser.avatar.src}`} className="ant-dropdown-link"
                            />
                        ) : (
                            <Avatar size={40} icon={<UserOutlined />} className="ant-dropdown-link" />
                        )}


                    </Space>
                </Menu.Item>
            </Dropdown>
        </Menu>
    );
}

export default UserMenu;