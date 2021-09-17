import React, { FC, useEffect } from 'react';
import { authorizeMutation } from 'src/services/graphql/queries/auth';
import { setLogin } from 'src/store/reducers/auth';
import { setUserData } from 'src/store/reducers/user';
import { Button, Col, Form, Input, Modal, Row, message } from 'antd';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useMutation } from 'urql';
import styles from './SignInModal.module.less';

type SignInModalArgs = {
    visible: boolean;
    onClose: () => void;
}

type SignInRequest = {
    email: string;
    password: string;
}

const SignInModal: FC<SignInModalArgs> = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const router = useRouter();
    const [authorizedResponse, authorize] = useMutation(authorizeMutation);

    useEffect(() => {
        form.resetFields();
    }, [form])

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

                    onClose();
                } catch (e: any) {
                    message.error(e.message);
                }
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    const handleCancel = () => {
        onClose();
    }

    const forgotPasword = () => {
        onClose();
        router.push('/password/send')
    }

    return (
        <Modal
            title="Sign in"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={450}
            maskClosable={false}
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    loading={authorizedResponse.fetching}
                    onClick={handleOk}
                    className={styles.submitBtn}
                >
                    Sign in
                </Button>,
            ]}
        >
            <Form
                className={styles.form}
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{ modifier: 'public' }}
                requiredMark={false}
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
                    label={(
                        <Row justify="space-between" style={{ width: '100%' }}>
                            <Col>Password</Col>
                            <Col><a onClick={forgotPasword}>Forgot password</a></Col>
                        </Row>
                    )}
                    rules={[{ required: true, message: 'Please input the password!' }]}
                >
                    <Input type="password" />
                </Form.Item>

            </Form>
        </Modal>
    );
}

export default SignInModal;