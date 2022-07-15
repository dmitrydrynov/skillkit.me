import { ArrowLeftOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useRouter } from 'next/router';

const SkillEditorMenu = () => {
	const router = useRouter();

	const items = [{ label: 'Back to my skills', key: '/user/skills', icon: <ArrowLeftOutlined /> }];

	const handleClickMenu = ({ key }) => {
		if (key === 'back') {
			router.back();
		} else {
			router.push(key);
		}
	};

	return <Menu onClick={handleClickMenu} mode="inline" items={items} />;
};

export default SkillEditorMenu;
