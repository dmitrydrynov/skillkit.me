import { FC } from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import styles from './HeaderMenu.module.less';

const HeaderMenu: FC = () => {
	const items = [
		{
			label: 'Our blog',
			key: 'blog',
			children: [
				{
					label: (
						<Link href="/blog" passHref>
							All Posts
						</Link>
					),
					key: 'posts',
				},
				{
					label: (
						<Link href="/blog/articles" passHref>
							Articles
						</Link>
					),
					key: 'articles',
				},
				{
					label: (
						<Link href="/blog/updates" passHref>
							Updates
						</Link>
					),
					key: 'updates',
				},
			],
		},
	];

	return <Menu mode="horizontal" className={styles.headerMenu} items={items} />;
};

export default HeaderMenu;
