import { FC, useEffect, useState } from 'react';
import skillKitLogo from '@assets/images/skillkit-alpha-logo.svg';
import UserMenu from '@components/menus/UserMenu';
import SignInModal from '@components/modals/SignInModal';
import SignUpModal from '@components/modals/SignUpModal';
import { postCategoriesQuery } from '@services/graphql/queries/post';
import { RootState } from '@store/configure-store';
import { Button, Col, Layout, Menu, Row, Space } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useQuery } from 'urql';
import styles from './PublicLayout.module.less';

const { Header, Content } = Layout;

const PublicLayout: FC = ({ children }) => {
	const router = useRouter();
	const [, setCurrentHeaderMenuItem] = useState('');
	const { loggedIn, logginingIn } = useSelector((state: RootState) => state.auth);
	const [visibleSignInModal, setVisibleSignInModal] = useState(false);
	const [visibleSignUpModal, setVisibleSignUpModal] = useState(false);
	const [{ data: postCategoriesResponse }] = useQuery({
		query: postCategoriesQuery,
	});

	const publicMenuItems = [
		{
			label: (
				<Link href="/blog">
					<a>Blog</a>
				</Link>
			),
			key: '/blog',
		},
	];

	useEffect(() => {
		setCurrentHeaderMenuItem(router.route);
	}, [router.route]);

	const handleSignIn = async () => {
		setVisibleSignInModal(true);
	};

	const handleSignUp = async () => {
		setVisibleSignUpModal(true);
	};

	return (
		<div className={styles.container}>
			{<SignInModal visible={visibleSignInModal} onClose={() => setVisibleSignInModal(false)} />}
			{<SignUpModal visible={visibleSignUpModal} onClose={() => setVisibleSignUpModal(false)} />}
			<Layout className={styles.layout}>
				<Header className={styles.publicLayout_header}>
					<Row align="middle" className={styles.logoContainer}>
						<Col flex="none">
							<div className={styles.logo}>
								<Link href="/">
									<a>
										<Image src={skillKitLogo} alt="skillKit logo" />
									</a>
								</Link>
							</div>
						</Col>
						<Col flex="auto">
							<Menu triggerSubMenuAction="click" items={publicMenuItems} mode="horizontal" className={styles.publicMenu} />
						</Col>
						<Col>
							{!loggedIn && !logginingIn ? (
								<Space>
									<Button type="default" shape="round" onClick={handleSignIn} className={styles.signInBtn}>
										Sign in
									</Button>
									<Button type="primary" shape="round" onClick={handleSignUp} className={styles.signUpBtn}>
										Sign up
									</Button>
								</Space>
							) : (
								<UserMenu />
							)}
						</Col>
					</Row>
				</Header>
				<Content className={styles.content}>{children}</Content>
				{/* <BetaModeModal /> */}
				{/* <Footer>Copyright © 2021 AnyCompany, Inc. All rights reserved.</Footer> */}
			</Layout>
		</div>
	);
};

export default PublicLayout;
