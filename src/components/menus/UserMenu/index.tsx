import { FC, useState } from 'react';
import React from 'react';
import { RootState } from '@store/configure-store';
import { setLogout } from '@store/reducers/auth';
import { UserRole } from 'src/definitions/user';
import { Avatar, Dropdown, Menu, Space, Skeleton, Grid } from 'antd';
import Avvvatars from 'avvvatars-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import styles from './UserMenu.module.less';

const { useBreakpoint } = Grid;

type MenuItem = {
	link?: string;
	title?: string;
	action?: () => void;
	divider?: boolean;
	can?: {
		roles?: UserRole[];
	};
};

const UserMenu: FC = () => {
	const screens = useBreakpoint();
	const dispatch = useDispatch();
	const router = useRouter();
	const [activeUserMenu, setActiveUserMenu] = useState(false);
	// const [, endSession] = useMutation(endSessionMutation);
	const { logginingIn } = useSelector((state: RootState) => state.auth);
	const authUser = useSelector((state: RootState) => state.user);

	const userMenuItems: MenuItem[] = [
		{
			link: '/admin/posts',
			title: 'Administration',
			can: { roles: [UserRole.ADMIN] },
		},
		{
			link: '/user/skills',
			title: 'My skills',
		},
		{
			link: '/settings/profile',
			title: 'Settings',
		},
		{
			link: '/',
			title: 'Website',
		},
		{
			divider: true,
		},
		{
			title: 'Sign out',
			action: async () => {
				dispatch<any>(setLogout());
				router.push('/');
			},
		},
	];

	const items = userMenuItems
		.filter((i) => undefined === i.can || (undefined !== i.can && i.can.roles.includes(authUser.role.name)))
		.map((menuItem, idx) =>
			menuItem.divider
				? { type: 'divider', key: idx }
				: {
						label: (
							<>
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
							</>
						),
						key: idx,
				  },
		);

	const authprizedDropdownMenu = <Menu items={items} />;

	return (
		<Menu
			className={styles.userMenu}
			defaultActiveFirst={false}
			selectedKeys={activeUserMenu ? ['userMenu'] : []}
			disabled={logginingIn}
			items={[
				{
					key: 'userMenu',
					label: (
						<Dropdown
							overlay={logginingIn ? null : authprizedDropdownMenu}
							trigger={['click']}
							onVisibleChange={(visible: boolean) => {
								setActiveUserMenu(visible);
							}}
							placement="bottomRight"
							arrow={false}
						>
							{logginingIn ? (
								<Space align="center">
									{screens.sm && (
										<div className={styles.info}>
											<div className={styles.name}>
												<Skeleton.Button style={{ width: 100, height: '18px' }} shape="round" active={true} />
											</div>
											<div className={styles.email}>
												<Skeleton.Button style={{ width: 130, height: '14px' }} shape="round" active={true} />
											</div>
										</div>
									)}
									<Skeleton.Avatar size={40} active={true} />
								</Space>
							) : (
								<Space align="center">
									{screens.sm && (
										<div className={styles.info}>
											<div className={styles.name}>{authUser.fullName}</div>
											<div className={styles.email}>{authUser.email}</div>
										</div>
									)}
									{authUser.avatar ? (
										<Avatar size={40} src={authUser.avatar} className={`${styles.avatar} ant-dropdown-link`} />
									) : (
										<Avvvatars value={authUser.email} style="shape" size={40} border />
									)}
								</Space>
							)}
						</Dropdown>
					),
				},
			]}
		></Menu>
	);
};

export default UserMenu;
