/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import introImage from '@assets/images/home/intro.png';
import SignInModal from '@components/modals/SignInModal';
import { redeemUserMagicAuthTokenMutation } from '@services/graphql/queries/auth';
import { RootState } from '@store/configure-store';
import { setLogin } from '@store/reducers/auth';
import { setUserData } from '@store/reducers/user';
import styles from '@styles/home.module.less';
import { message, Button, Row, Col } from 'antd';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'urql';

const Home: NextPage = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
	const [, redeemUserMagicAuthToken] = useMutation(redeemUserMagicAuthTokenMutation);
	const [visibleSignInModal, setVisibleSignInModal] = useState(false);

	useEffect(() => {
		const { magicAuth, email }: any = router.query;

		if (magicAuth && email) {
			const checkMagicAuth = async () => {
				const { data, error } = await redeemUserMagicAuthToken({
					email,
					token: magicAuth,
				});

				if (error || data.errorMessage) {
					router.push('/');
					return;
				}

				dispatch(setLogin({ token: data.redeemUserMagicAuthToken.sessionToken }));
				dispatch(setUserData({ ...data.redeemUserMagicAuthToken.item }));

				message.success('Your are welcome!');
				router.push('/settings/profile');
			};
			checkMagicAuth();
		}
	}, [router]);

	return (
		<>
			<Head>
				<title>Skillkit</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<Row>
				<Col span={12} className={styles.container}>
					<h1>Make the perfect skill kit and share only the essentials</h1>
					<p>
						The more flexible alternative to the classic resume. Build your professional skillset and share it with
						customers and employers.
					</p>
					{!loggedIn && (
						<Button shape="round" size="large" type="primary" onClick={() => setVisibleSignInModal(true)}>
							Start Now
						</Button>
					)}
				</Col>
				<Col span={12}>
					<Image src={introImage} alt="" />
				</Col>
			</Row>
			{!loggedIn && <SignInModal visible={visibleSignInModal} onClose={() => setVisibleSignInModal(false)} />}
		</>
	);
};

export default Home;
