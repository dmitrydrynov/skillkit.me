import { ArrowLeftOutlined, UserOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useRouter } from 'next/router';

type SettingsMenuParams = {
	selectedItem: string;
};

const SettingsMenu = ({ selectedItem = 'profile' }: SettingsMenuParams) => {
	const router = useRouter();

	const items = [
		{ label: 'Back to my skills', key: '/user/skills', icon: <ArrowLeftOutlined /> },
		{ label: 'Profile', key: '/settings/profile', icon: <UserOutlined /> },
		{ label: 'Security', key: '/settings/security', icon: <SecurityScanOutlined /> },
	];

	const handleProfileMenu = ({ key }) => {
		if (key === 'back') {
			router.back();
		} else {
			router.push(key);
		}
	};

	return <Menu onClick={handleProfileMenu} mode="inline" defaultSelectedKeys={[selectedItem]} items={items} />;
};

export default SettingsMenu;
