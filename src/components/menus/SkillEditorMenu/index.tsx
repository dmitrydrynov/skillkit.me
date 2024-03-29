import { ArrowLeftOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useRouter } from 'next/router';

const SkillEditorMenu = () => {
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
			<Menu.Item key="/user/skills" icon={<ArrowLeftOutlined />}>
				Back to my skills
			</Menu.Item>
		</Menu>
	);
};

export default SkillEditorMenu;
