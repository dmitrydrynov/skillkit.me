import { Menu } from 'antd';
import { useRouter } from 'next/router';
import { GiSkills } from 'react-icons/gi';
import { TbBook2, TbUsers } from 'react-icons/tb';

type AdminMenuParams = {
	selectedItem: string;
};

const AdminMenu = ({ selectedItem = 'profile' }: AdminMenuParams) => {
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
			<Menu.Item key="/admin/posts" icon={<TbBook2 />}>
				Posts
			</Menu.Item>
			<Menu.Item key="/admin/users" icon={<TbUsers />}>
				Users
			</Menu.Item>
			<Menu.Item key="/admin/skills" icon={<GiSkills />}>
				Skills
			</Menu.Item>
		</Menu>
	);
};

export default AdminMenu;
