import { Col, Layout, Row, Menu, Space, Button, message, Modal, Form, Input, Dropdown, Avatar } from "antd";
import React, { FC, useState, useEffect } from "react";
import Link from 'next/link';
import styles from './PublicLayout.module.less';
import { useRouter } from "next/router";
import { useMutation } from "urql";
import { authorizeMutation } from './../../services/graphql/queries/auth';
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "src/store/reducers/auth";
import { setUserData } from "src/store/reducers/user";
import UserMenu from "@components/UserMenu";
import { RootState } from "src/store/configure-store";

const { Header, Footer, Content } = Layout;

type SignInRequest = {
	email: string;
	password: string;
}

type HeaderMenu = {
	link: string;
	title: string;
}

const headerMenu: HeaderMenu[] = [{
	link: '/',
	title: 'Home',
},
{
	link: '/about',
	title: 'About',
}];

const PublicLayout: FC = ({ children }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [currentHeaderMenuItem, setCurrentHeaderMenuItem] = useState('');
	const [authorizedResponse, authorize] = useMutation(authorizeMutation);
	const { loggedIn } = useSelector((state: RootState) => state.auth)

	const [visibleSignInModal, setVisibleSignInModal] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		setCurrentHeaderMenuItem(router.route)
	}, [router.route])

	const handleClick = (e: any) => {
		setCurrentHeaderMenuItem(e.key);
	}

	const handleSignIn = async () => {
		form.resetFields();
		setVisibleSignInModal(true)
	}

	const handleCancel = () => {
		setVisibleSignInModal(false)
	}

	const handleOk = () => {
		form
			.validateFields()
			.then(async (values: SignInRequest) => {
				try {
					const { data, error } = await authorize({
						email: values.email,
						password: values.password,
					});

					if (error) {
						message.error(error.message);
						return;
					}

					if (data.authenticateUserWithPassword.code) {
						message.error(data.authenticateUserWithPassword.message);
						return;
					}

					dispatch(setLogin({ token: data.authenticateUserWithPassword.sessionToken }));
					dispatch(setUserData({ ...data.authenticateUserWithPassword.item }));

					message.success('Your are welcome!');
					setVisibleSignInModal(false)
				} catch (e: any) {
					message.error(e.message);
				}
			})
			.catch(info => {
				console.log('Validate Failed:', info);
			});
	}

	return (
		<>
			<Modal
				title="Sign in"
				visible={visibleSignInModal}
				onOk={handleOk}
				confirmLoading={authorizedResponse.fetching}
				onCancel={handleCancel}
			>
				<Form
					form={form}
					layout="vertical"
					name="form_in_modal"
					initialValues={{ modifier: 'public' }}
				>
					<Form.Item
						name="email"
						label="Email"
						rules={[{ required: true, message: 'Please input the email!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="password"
						label="Password"
						rules={[{ required: true, message: 'Please input the password!' }]}
					>
						<Input type="password" />
					</Form.Item>
				</Form>
			</Modal>
			<Layout className={styles.layout} >
				<Header className={styles.publicLayout_header}>
					<Row align="middle">
						<Col flex="1">
							<div className={styles.logo}></div>
							<Menu onClick={handleClick} selectedKeys={[currentHeaderMenuItem]} mode="horizontal" className={styles.publicLayout_header_menu}>
								{headerMenu.map((menuItem) => (
									<Menu.Item key={menuItem.link}>
										<Link href={menuItem.link}>
											<a>
												{menuItem.title}
											</a>
										</Link>
									</Menu.Item>
								))}
							</Menu>
						</Col>
						<Col>
							{!loggedIn ? (
								<Space>
									<Button type="text" onClick={handleSignIn}>Sign in</Button>
									<Button type="primary">Sign up</Button>
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
	)
}

export default PublicLayout;