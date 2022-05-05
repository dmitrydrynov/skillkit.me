import { NextPage } from 'next';
import { useRouter } from 'next/router';

const SharePage: NextPage = () => {
	const router = useRouter();
	const { hash } = router.query;

	return <p>{hash}</p>;
};

export default SharePage;
