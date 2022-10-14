import { Menu } from 'antd';
import { useRouter } from 'next/router';
import { SiBuffer, SiGnubash } from 'react-icons/si';

type AdminMenuParams = {
	selectedItem?: string;
};

const DefaultMenu = ({ selectedItem = '/user/skills' }: AdminMenuParams) => {
	const router = useRouter();

	const menu = [
		{
			key: '/user/kits',
			icon: <SiGnubash />,
			label: 'My kits',
		},
		{
			key: '/user/skills',
			icon: <SiBuffer />,
			label: 'My skills',
		},
	];

	const handleMenuClick = ({ key }) => {
		router.push(key);
	};

	return (
		<Menu
			mode="inline"
			selectedKeys={[router.route]}
			onClick={handleMenuClick}
			items={menu}
			defaultSelectedKeys={[selectedItem]}
		/>
	);
};

export default DefaultMenu;
