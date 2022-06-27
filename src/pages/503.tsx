import { Result } from 'antd';
import type { NextPage } from 'next';

const UnavaibleServerPage: NextPage = () => {
	return (
		<Result status="500" title="503 Unavaible server" subTitle="Sorry, our server is down. Try to come back later." />
	);
};

export default UnavaibleServerPage;
