import { ArrowLeftOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useRouter } from 'next/router';

const SkillKitEditorMenu = () => {
	const router = useRouter();

	const handleClickMenu = ({ key }) => {
		if (key === 'back') {
			router.back();
		} else {
			router.push(key);
		}
	};

	return (
		<Menu onClick={handleClickMenu} mode="inline">
			<Menu.Item key="/user/kits" icon={<ArrowLeftOutlined />}>
				Back to skill kits
			</Menu.Item>
		</Menu>
	);
};

export default SkillKitEditorMenu;
