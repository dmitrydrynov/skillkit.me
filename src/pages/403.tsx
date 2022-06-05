import { Button, Result } from 'antd';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const AccessDeniedPage: NextPage = () => {
	const router = useRouter();

	return (
		<Result
			status="403"
			title="403"
			subTitle="Sorry, the page is closed for viewing."
			extra={
				<Button type="primary" onClick={() => router.push('/')}>
					Back Home
				</Button>
			}
		/>
	);
};

export default AccessDeniedPage;
