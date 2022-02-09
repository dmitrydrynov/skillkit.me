import { FC, useEffect } from 'react';
import SignModalIllustration from '@assets/images/sign-modal-illustration.svg';
import { sendUserMagicAuthLinkMutation } from '@services/graphql/queries/auth';
import { createUserMutation } from '@services/graphql/queries/user';
import { Button, Col, Form, Input, Modal, Row, message } from 'antd';
import Image from 'next/image';
import { useMutation } from 'urql';
import styles from './SignUpModal.module.less';

type SignUpModalArgs = {
	visible: boolean;
	onClose: () => void;
};

type SignUpRequest = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
};

const SignUpModal: FC<SignUpModalArgs> = ({ visible, onClose }) => {
	const [form] = Form.useForm();
	const [createUserResponse, createUser] = useMutation(createUserMutation);
	const [, sendUserMagicAuthLink] = useMutation(sendUserMagicAuthLinkMutation);

	useEffect(() => {
		form.resetFields();
	}, [form]);

	const handleOk = () => {
		form
			.validateFields()
			.then(async ({ firstName, lastName, email, password }: SignUpRequest) => {
				try {
					const { data, error } = await createUser({
						firstName,
						lastName,
						email,
						password,
					});

					if (error) {
						message.error('The email already buzy or sign up failed. Try another email.');
						createUserResponse.fetching = false;
						return;
					}

					if (data.createUser?.code) {
						message.error(data.signUp.message);
						createUserResponse.fetching = false;
						return;
					}

					const sended = await sendUserMagicAuthLink({ email });

					if (sended.error) {
						message.error(sended.error.message);
						createUserResponse.fetching = false;
						return;
					}

					if (data.sendUserMagicAuthLink?.code) {
						message.error(data.sendUserMagicAuthLink.message);
						createUserResponse.fetching = false;
						return;
					}

					message.success('You are welcome! Confirm your email please.');
					onClose();
				} catch (e: any) {
					message.error(e.message);
				}
			})
			.catch((info) => {
				console.log('Validate Failed:', info);
			});
	};

	const handleCancel = () => {
		onClose();
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
				<Button
					key="submit"
					type="primary"
					loading={createUserResponse.fetching}
					onClick={handleOk}
					className={styles.submitBtn}
				>
					Sign up
				</Button>,
			]}
		>
			<Row justify="center">
				<div className={styles.imageContainer}>
					<Image src={SignModalIllustration} alt="image for sign up form" />
				</div>
				<h2 className={styles.title}>Get Connect to the best Mentors</h2>
				<p className={styles.subtitle}>Easy way to connect to mentor and get advise solution of design. </p>
				<Form
					className={styles.form}
					form={form}
					layout="vertical"
					name="form_in_modal"
					initialValues={{ modifier: 'public' }}
					requiredMark={false}
				>
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

					<Form.Item name="password" rules={[{ required: true, message: 'Please input the password!' }]}>
						<Input.Password placeholder="Password" />
					</Form.Item>

					<Form.Item
						name="confirmPassword"
						rules={[
							{ required: true, message: 'Please repeat the password!' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
										return Promise.resolve();
									}

									return Promise.reject(new Error('The two passwords not match!'));
								},
							}),
						]}
					>
						<Input.Password placeholder="Repeat the password" />
					</Form.Item>
				</Form>
			</Row>
		</Modal>
	);
};

export default SignUpModal;
