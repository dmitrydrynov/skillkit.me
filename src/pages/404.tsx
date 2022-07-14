import { Button, Result } from 'antd';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const NotFoundPage: NextPage = () => {
	const router = useRouter();

	return (
		<Result
			status="404"
			title="404"
			subTitle="Sorry, the page you visited does not exist."
			extra={
				<Button type="primary" onClick={() => router.push('/')}>
					Back Home
				</Button>
			}
		/>
	);
};

export default NotFoundPage;
