import { ArrowLeftOutlined, UserOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useRouter } from 'next/router';

type SettingsMenuParams = {
	selectedItem: string;
};

const SettingsMenu = ({ selectedItem = 'profile' }: SettingsMenuParams) => {
	const router = useRouter();

	const handleProfileMenu = ({ key }) => {
		if (key === 'back') {
			router.back();
		} else {
			router.push(key);
		}
	};

	return (
		<Menu onClick={handleProfileMenu} mode="inline" defaultSelectedKeys={[selectedItem]}>
			<Menu.Item key="/user/skills" icon={<ArrowLeftOutlined />}>
				Back to my skills
			</Menu.Item>
			<Menu.Item key="/settings/profile" icon={<UserOutlined />}>
				Profile
			</Menu.Item>
			<Menu.Item key="/settings/security" icon={<SecurityScanOutlined />}>
				Security
			</Menu.Item>
		</Menu>
	);
};

export default SettingsMenu;
