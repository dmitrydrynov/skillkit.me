import { FC, ReactNode, useState } from 'react';
import { RootState } from '@store/configure-store';
import { setLogout } from '@store/reducers/auth';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Space, Skeleton } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import styles from './UserMenu.module.less';

type MenuItem = {
	link?: string;
	title: string;
	action?: () => void;
	before?: ReactNode;
};

const UserMenu: FC = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [activeUserMenu, setActiveUserMenu] = useState(false);
	// const [, endSession] = useMutation(endSessionMutation);
	const { logginingIn } = useSelector((state: RootState) => state.auth);
	const authUser = useSelector((state: RootState) => state.user);

	const userMenuItems: MenuItem[] = [
		{
			link: '/user/skills',
			title: 'My skills',
		},
		{
			link: '/settings/profile',
			title: 'Settings',
		},
		{
			title: 'Sign out',
			action: async () => {
				// await endSession();

				dispatch(setLogout());

				router.push('/');
			},
			before: <Menu.Divider />,
		},
	];

	const userMenu = (
		<Menu>
			{userMenuItems.map((menuItem, idx) => (
				<>
					{!!menuItem.before && menuItem.before}
					<Menu.Item key={idx.toString()}>
						{!!menuItem.link && (
							<Link href={menuItem.link}>
								<a>{menuItem.title}</a>
							</Link>
						)}

						{!!menuItem.action && (
							<span onClick={menuItem.action} aria-hidden="true">
								{menuItem.title}
							</span>
						)}
					</Menu.Item>
				</>
			))}
		</Menu>
	);

	return (
		<Menu className={styles.userMenu} defaultActiveFirst={false} selectedKeys={activeUserMenu ? ['userMenu'] : []}>
			<Dropdown
				overlay={logginingIn ? null : userMenu}
				trigger={['click']}
				onVisibleChange={(visible: boolean) => {
					setActiveUserMenu(visible);
				}}
			>
				<Menu.Item key="userMenuItem">
					{logginingIn ? (
						<Space align="center">
							<div className={styles.info}>
								<p className={styles.name}>
									<Skeleton.Button style={{ width: 100, height: '18px' }} shape="round" active={true} />
								</p>
								<p className={styles.email}>
									<Skeleton.Button style={{ width: 130, height: '14px' }} shape="round" active={true} />
								</p>
							</div>
							<Skeleton.Avatar size={40} active={true} />
						</Space>
					) : (
						<Space align="center">
							<div className={styles.info}>
								<p className={styles.name}>{authUser.fullName}</p>
								<p className={styles.email}>{authUser.email}</p>
							</div>
							{authUser.avatar ? (
								<Avatar size={40} src={authUser.avatar} className={`${styles.avatar} ant-dropdown-link`} />
							) : (
								<Avatar size={40} icon={<UserOutlined />} className={`${styles.avatar} ant-dropdown-link`} />
							)}
						</Space>
					)}
				</Menu.Item>
			</Dropdown>
		</Menu>
	);
};

export default UserMenu;
