/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useRef, useState } from 'react';
import SignModalIllustration from '@assets/images/sign-modal-illustration.svg';
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

enum FormStep {
	Email = 'email',
	Password = 'password',
}

const SignInModal: FC<SignInModalArgs> = ({ visible, onClose }) => {
	const [form] = Form.useForm();
	const [state, setState] = useState<SignInRequest & { step: FormStep }>({
		step: FormStep.Email,
	});
	const dispatch = useDispatch();
	const router = useRouter();
	const [authorizedResponse, authorize] = useMutation(signInMutation);

	useEffect(() => {
		form.resetFields();
		setState({ step: FormStep.Email });
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
			setState({ ...state, step: FormStep.Password });
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

	const handleDiscordOk = async () => {};

	const handleCancel = () => {
		setState({ step: FormStep.Email });
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
						{state.step === FormStep.Email && 'Next'}
						{state.step === FormStep.Password && 'Sign in'}
					</Button>
					<Divider>or</Divider>
					<Button key="discord-login" type="text" href="http://localhost:8000/auth/discord">
						Sign in with Discord
					</Button>
				</>,
			]}
		>
			{/* <div className={styles.imageContainer}>
				<Image src={SignModalIllustration} alt="image for sign up form" />
			</div> */}
			<h2 className={styles.title}>Sign in</h2>
			<p>Enter your email address to sign in your account</p>
			<Form
				className={styles.form}
				form={form}
				layout="vertical"
				name="form_in_modal"
				initialValues={{ modifier: 'public' }}
				requiredMark={false}
				onKeyUp={handleKeyUpForm}
			>
				{state.step === FormStep.Email && (
					<Form.Item name="email" rules={[{ required: true, message: 'Please input the email!' }]}>
						<Input autoFocus={true} placeholder="Email" />
					</Form.Item>
				)}
				{state.step === FormStep.Password && (
					<Form.Item name="password" rules={[{ required: true, message: 'Please input the password!' }]}>
						<Input.Password autoFocus={true} placeholder="Password" />
					</Form.Item>
				)}
			</Form>
		</Modal>
	);
};

export default SignInModal;
