/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import React from 'react';
import { setCookie } from '@helpers/cookie';
import { registerUserMutation } from '@services/graphql/queries/auth';
import { setLogin } from '@store/reducers/auth';
import { setUserData } from '@store/reducers/user';
import { Button, Col, Form, Input, Modal, Row, message, Divider } from 'antd';
import { useRouter } from 'next/router';
import { SiDiscord } from 'react-icons/si';
import { useDispatch } from 'react-redux';
import { useMutation } from 'urql';
import styles from './SignUpModal.module.less';

type SignUpModalArgs = {
	visible: boolean;
	onClose: () => void;
};

type SignUpRequest = {
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
};

enum _FormStep {
	_Register = 'register',
	_Password = 'password',
}

const SignUpModal: FC<SignUpModalArgs> = ({ visible, onClose }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const router = useRouter();
	const [registerUserResponse, registerUser] = useMutation(registerUserMutation);
	const [state, setState] = useState<SignUpRequest & { step: _FormStep }>({ step: _FormStep._Register });

	useEffect(() => {
		form.resetFields();
		setState({ step: _FormStep._Register });
	}, []);

	useEffect(() => {
		const { data, error } = registerUserResponse;

		if (!data && !error) {
			registerUserResponse.fetching = false;
			return;
		}

		if (error) {
			if (error.graphQLErrors.length) {
				message.error(error.graphQLErrors[0].message);
			}

			if (error.networkError) {
				message.error(error.networkError.message);
			}

			return;
		}

		if (data.registerUser.next === true) {
			setState({ ...state, step: _FormStep._Password });

			return;
		}

		if (data.registerUser.token.length) {
			setCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME, data.registerUser.token);
			dispatch(setLogin());
			dispatch(setUserData({ ...data.registerUser.user }));

			message.success('You are welcome!');

			router.push('/user/skills');

			onClose();
		}
	}, [registerUserResponse]);

	const handleOk = async () => {
		const { firstName, lastName, email, password }: SignUpRequest = await form.validateFields();

		setState({
			...state,
			firstName: firstName ? firstName : state.firstName,
			lastName: lastName ? lastName : state.lastName,
			email: email ? email : state.email,
			password: password ? password : state.password,
		});

		try {
			await registerUser({
				firstName: firstName ? firstName : state.firstName,
				lastName: lastName ? lastName : state.lastName,
				email: email ? email : state.email,
				password: password ? password : state.password,
			});
		} catch (error) {
			message.error(error.graphQLErrors[0].message);
		}
	};

	const handleCancel = () => {
		setState({ step: _FormStep._Register });
		registerUserResponse.fetching = false;
		onClose();
	};

	const handleKeyUpForm = (event) => {
		if (event.key === 'Enter') {
			handleOk();
		}
	};

	return (
		<Modal
			title={null}
			visible={visible}
			onOk={handleOk}
			onCancel={handleCancel}
			width={450}
			centered
			maskClosable={false}
			className={styles.modal}
			footer={[
				<React.Fragment key="footer-signup">
					<Button
						key="submit"
						type="primary"
						loading={registerUserResponse.fetching}
						onClick={handleOk}
						className={styles.submitBtn}
					>
						{state.step === _FormStep._Register && 'Next'}
						{state.step === _FormStep._Password && 'Sign up'}
					</Button>
					<Divider>or</Divider>
					<Button
						key="discord-login"
						type="text"
						href={process.env.NEXT_PUBLIC_DISCORD_AUTH_URL}
						className={styles.oauthButton}
					>
						<SiDiscord /> Sign up with Discord
					</Button>
				</React.Fragment>,
			]}
		>
			<h2 className={styles.title}>Get Connect to the Skillkit</h2>
			<p className={styles.subtitle}>
				{state.step === _FormStep._Register && <>Fill this form and let&apos;s go!</>}
				{state.step === _FormStep._Password && (
					<>
						Enter your one-time password.
						<br />
						It was sent in your email
						<br />
						<strong>{state.email}</strong>.
					</>
				)}
			</p>

			<Row justify="center">
				<Form
					className={styles.form}
					form={form}
					layout="vertical"
					name="form_in_modal"
					initialValues={{ modifier: 'public' }}
					requiredMark={false}
					onKeyUp={handleKeyUpForm}
				>
					{state.step === _FormStep._Register && (
						<>
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item name="firstName" rules={[{ required: true, message: 'Please input the first name!' }]}>
										<Input placeholder="First name" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item name="lastName" rules={[{ required: true, message: 'Please input the last name!' }]}>
										<Input placeholder="Last name" />
									</Form.Item>
								</Col>
							</Row>
							<Form.Item name="email" rules={[{ type: 'email', required: true, message: 'Please input the email!' }]}>
								<Input placeholder="Email" />
							</Form.Item>
						</>
					)}
					{state.step === _FormStep._Password && (
						<Form.Item name="password" rules={[{ required: true, message: 'Please input the password!' }]}>
							<Input.Password autoFocus={true} placeholder="Password" />
						</Form.Item>
					)}
				</Form>
			</Row>
		</Modal>
	);
};

export default SignUpModal;
