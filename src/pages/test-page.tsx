import { ReactElement } from 'react';
import { Select } from 'antd';

const TestPage = () => {
	return <Select />;
};

TestPage.getLayout = (page: ReactElement) => <>{page}</>;

export default TestPage;
