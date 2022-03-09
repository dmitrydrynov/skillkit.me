/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { signInMutation } from '@services/graphql/queries/auth';
import { setLogin } from '@store/reducers/auth';
import { setUserData } from '@store/reducers/user';
import { Button, Form, Input, Modal, message, Divider } from 'antd';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useMutation } from 'urql';
import styles from './SignInModal.module.less';

type SignInModalArgs = {
	visible: boolean;
	onClose: () => void;
};

type SignInRequest = {
	email?: string;
	password?: string;
};

enum _FormStep {
	_Email = 'email',
	_Password = 'password',
}

const SignInModal: FC<SignInModalArgs> = ({ visible, onClose }) => {
	const [form] = Form.useForm();
	const [state, setState] = useState<SignInRequest & { step: _FormStep }>({
		step: _FormStep._Email,
	});
	const dispatch = useDispatch();
	const router = useRouter();
	const [authorizedResponse, authorize] = useMutation(signInMutation);

	useEffect(() => {
		form.resetFields();
		setState({ step: _FormStep._Email });
	}, [form]);

	useEffect(() => {
		const { data, error } = authorizedResponse;

		if (!data && !error) {
			authorizedResponse.fetching = false;
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

		if (data.signIn.next) {
			setState({ ...state, step: _FormStep._Password });
			return;
		}

		if (data.signIn.token) {
			dispatch(setLogin({ token: data.signIn.token }));
			dispatch(setUserData({ ...data.signIn.user }));
		}

		message.success('Your are welcome!');

		router.push('/settings/profile');
		onClose();
	}, [authorizedResponse]);

	const handleOk = async () => {
		const { email, password }: SignInRequest = await form.validateFields();

		setState({
			...state,
			email: email ? email : state.email,
			password: password ? password : state.password,
		});

		try {
			authorize({
				email: email ? email : state.email,
				password: password ? password : state.password,
			});
		} catch (error) {
			message.error(error.graphQLErrors[0].message);
		}
	};

	const handleCancel = () => {
		setState({ step: _FormStep._Email });
		authorizedResponse.fetching = false;
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
				<>
					<Button
						key="submit"
						type="primary"
						loading={authorizedResponse.fetching && !authorizedResponse.error}
						onClick={handleOk}
						className={styles.submitBtn}
					>
						{state.step === _FormStep._Email && 'Next'}
						{state.step === _FormStep._Password && 'Sign in'}
					</Button>
					<Divider>or</Divider>
					<Button key="discord-login" type="text" href={process.env.NEXT_PUBLIC_DISCORD_AUTH_URL}>
						Sign in with Discord
					</Button>
				</>,
			]}
		>
			<h2 className={styles.title}>Sign in</h2>
			<div className={styles.subtitle}>
				{state.step === _FormStep._Email && <>Enter your email address to sign in your account</>}
				{state.step === _FormStep._Password && authorizedResponse.data?.signIn.next && (
					<>
						Enter your one-time password.
						<br />
						It was sent in your email <strong>{state.email}</strong>.
					</>
				)}
				{state.step === _FormStep._Password && !authorizedResponse.data?.signIn.next && <>Enter your password</>}
			</div>
			<Form
				className={styles.form}
				form={form}
				layout="vertical"
				name="form_in_modal"
				initialValues={{ modifier: 'public' }}
				requiredMark={false}
				onKeyUp={handleKeyUpForm}
			>
				{state.step === _FormStep._Email && (
					<Form.Item name="email" rules={[{ required: true, message: 'Please input the email!' }]}>
						<Input autoFocus={true} placeholder="Email" />
					</Form.Item>
				)}
				{state.step === _FormStep._Password && (
					<Form.Item name="password" rules={[{ required: true, message: 'Please input the password!' }]}>
						<Input.Password autoFocus={true} placeholder="Password" />
					</Form.Item>
				)}
			</Form>
		</Modal>
	);
};

export default SignInModal;
