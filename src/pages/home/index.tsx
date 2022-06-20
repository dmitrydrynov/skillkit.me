/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import introImage from '@assets/images/home/intro.png';
import SignUpModal from '@components/modals/SignUpModal';
import { setCookie } from '@helpers/cookie';
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
	const [visibleSignUpModal, setVisibleSignUpModal] = useState(false);

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

				setCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME, data.redeemUserMagicAuthToken.sessionToken);
				dispatch(setLogin());
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
				<title>Skillkit — flexible alternative to the classic resume</title>
				<meta name="description" content="Build your unique skills and share them with customers and employers." />
				<meta name="keywords" content="cv, resume, job, skills, customers, employers, hr" />
				<meta property="og:title" content="Skillkit — flexible alternative to the classic resume" />
				<meta property="og:description" content="Build your unique skills and share them with customers and employers." />
				<meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL} />
				<meta property="og:type" content="website" />
				<meta
					property="og:image"
					content={`${process.env.NEXT_PUBLIC_APP_URL}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fintro.4e42a1a1.png&w=1080&q=75`}
				/>
				<meta
					name="twitter:images"
					content={`${process.env.NEXT_PUBLIC_APP_URL}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fintro.4e42a1a1.png&w=1080&q=75`}
				/>
				<meta name="twitter:title" content="Skillkit — flexible alternative to the classic resume" />
				<meta name="twitter:description" content="Build your unique skills and share them with customers and employers." />
				<meta name="twitter:author" content="@DmirtyDrynov" />
			</Head>
			<Row align="middle">
				<Col xs={24} md={11} className={styles.container}>
					<h1>You are more than your profession</h1>
					<p>
						The more flexible alternative to the classic resume.
						<br />
						Build your unique skills and share them with customers and employers.
					</p>
					{!loggedIn ? (
						<Button
							shape="round"
							size="large"
							type="primary"
							className={styles.primaryButton}
							onClick={() => setVisibleSignUpModal(true)}
						>
							Start Now
						</Button>
					) : (
						<Button
							shape="round"
							size="large"
							type="primary"
							className={styles.primaryButton}
							onClick={() => router.push('/user/skills')}
						>
							Go to your skills
						</Button>
					)}
				</Col>
				<Col xs={24} md={{ span: 11, offset: 2 }}>
					<Image src={introImage} alt="" />
				</Col>
			</Row>
			{!loggedIn && <SignUpModal visible={visibleSignUpModal} onClose={() => setVisibleSignUpModal(false)} />}
		</>
	);
};

export default Home;
