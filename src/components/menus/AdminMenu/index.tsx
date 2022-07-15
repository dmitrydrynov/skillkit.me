import { Menu } from 'antd';
import { useRouter } from 'next/router';
import { GiSkills } from 'react-icons/gi';
import { TbBook2, TbUsers } from 'react-icons/tb';

type AdminMenuParams = {
	selectedItem: string;
};

const AdminMenu = ({ selectedItem = 'profile' }: AdminMenuParams) => {
	const router = useRouter();

	const items = [
		{ label: 'Posts', key: '/admin/posts', icon: <TbBook2 /> },
		{ label: 'Users', key: '/admin/users', icon: <TbUsers /> },
		{ label: 'Skills', key: '/admin/skills', icon: <GiSkills /> },
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

export default AdminMenu;
