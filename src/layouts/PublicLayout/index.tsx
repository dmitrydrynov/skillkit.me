import { FC, useEffect, useState } from 'react';
import skillKitLogo from '@assets/images/skillkit-logo.svg';
import UserMenu from '@components/menus/UserMenu';
import SignInModal from '@components/modals/SignInModal';
import SignUpModal from '@components/modals/SignUpModal';
import { RootState } from '@store/configure-store';
import { Button, Col, Layout, Row, Space } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import styles from './PublicLayout.module.less';

const { Header, Footer, Content } = Layout;

const PublicLayout: FC = ({ children }) => {
	const router = useRouter();
	const [, setCurrentHeaderMenuItem] = useState('');
	const { loggedIn, logginingIn } = useSelector((state: RootState) => state.auth);
	const [visibleSignInModal, setVisibleSignInModal] = useState(false);
	const [visibleSignUpModal, setVisibleSignUpModal] = useState(false);

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
		<>
			{<SignInModal visible={visibleSignInModal} onClose={() => setVisibleSignInModal(false)} />}
			{<SignUpModal visible={visibleSignUpModal} onClose={() => setVisibleSignUpModal(false)} />}
			<Layout className={styles.layout}>
				<Header className={styles.publicLayout_header}>
					<Row align="middle" className={styles.logoContainer}>
						<Col flex="1">
							<div className={styles.logo}>
								<Image src={skillKitLogo} alt="skillKit logo" />
							</div>
						</Col>
						<Col>
							{!loggedIn && !logginingIn ? (
								<Space>
									<Button type="default" shape="round" onClick={handleSignIn}>
										Sign in
									</Button>
									<Button type="primary" shape="round" onClick={handleSignUp}>
										Sign up
									</Button>
								</Space>
							) : (
								<UserMenu />
							)}
						</Col>
					</Row>
				</Header>
				<Content style={{ margin: '50px' }}>{children}</Content>
				<Footer>Copyright © 2021 AnyCompany, Inc. All rights reserved.</Footer>
			</Layout>
		</>
	);
};

export default PublicLayout;
