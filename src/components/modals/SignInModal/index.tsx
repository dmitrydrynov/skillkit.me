import { FC, useEffect } from 'react';
import SignModalIllustration from '@assets/images/sign-modal-illustration.svg';
import { authorizeMutation } from '@services/graphql/queries/auth';
import { setLogin } from '@store/reducers/auth';
import { setUserData } from '@store/reducers/user';
import { Button, Form, Input, Modal, message } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useMutation } from 'urql';
import styles from './SignInModal.module.less';

type SignInModalArgs = {
	visible: boolean;
	onClose: () => void;
};

type SignInRequest = {
	email: string;
	password: string;
};

const SignInModal: FC<SignInModalArgs> = ({ visible, onClose }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const router = useRouter();
	const [authorizedResponse, authorize] = useMutation(authorizeMutation);

	useEffect(() => {
		form.resetFields();
	}, [form]);

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

					if (data.authenticateUserWithPassword.errorMessage) {
						message.error(data.authenticateUserWithPassword.errorMessage);
						return;
					}

					dispatch(setLogin({ token: data.authenticateUserWithPassword.sessionToken }));
					dispatch(setUserData({ ...data.authenticateUserWithPassword.item }));

					message.success('Your are welcome!');

					router.push('/settings/profile');
					onClose();
				} catch (e: any) {
					message.error(e.message);
				}
			})
			.catch(() => {
				// console.log('Validate Failed:', info);
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
					size="large"
					loading={authorizedResponse.fetching && !authorizedResponse.error}
					onClick={handleOk}
					className={styles.submitBtn}
				>
					Sign in
				</Button>,
			]}
		>
			<div className={styles.imageContainer}>
				<Image src={SignModalIllustration} alt="image for sign up form" />
			</div>
			<h2 className={styles.title}>Welcome back</h2>
			<Form
				className={styles.form}
				form={form}
				layout="vertical"
				name="form_in_modal"
				initialValues={{ modifier: 'public' }}
				requiredMark={false}
			>
				<Form.Item name="email" rules={[{ required: true, message: 'Please input the email!' }]}>
					<Input placeholder="Email" />
				</Form.Item>
				<Form.Item name="password" rules={[{ required: true, message: 'Please input the password!' }]}>
					<Input.Password placeholder="Password" />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default SignInModal;
