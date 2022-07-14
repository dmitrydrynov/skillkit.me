import { FC, ReactNode } from 'react';
import React from 'react';
import { UserRole } from 'src/definitions/user';
import { Menu, Grid } from 'antd';
import Link from 'next/link';
import styles from './HeaderMenu.module.less';

const { useBreakpoint } = Grid;

type MenuItem = {
	link?: string;
	title: string;
	action?: () => void;
	before?: ReactNode;
	can?: {
		roles?: UserRole[];
	};
};

const HeaderMenu: FC = () => {
	return (
		<Menu mode="horizontal" className={styles.headerMenu}>
			<Menu.SubMenu key="blog" title="Our blog">
				<Menu.Item key="posts">
					<Link href="/blog" passHref>
						All Posts
					</Link>
				</Menu.Item>
				<Menu.Item key="articles">
					<Link href="/blog/[categorySlug]" as={`/blog/articles`} passHref>
						Articles
					</Link>
				</Menu.Item>
				<Menu.Item key="updates">
					<Link href="/blog/[categorySlug]" as={`/blog/updates`} passHref>
						Updates
					</Link>
				</Menu.Item>
			</Menu.SubMenu>
		</Menu>
	);
};

export default HeaderMenu;
