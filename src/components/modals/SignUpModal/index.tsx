import React, { FC, useEffect } from 'react';
import { registerMutation } from 'src/services/graphql/queries/user';
import { setLogin } from 'src/store/reducers/auth';
import { setUserData } from 'src/store/reducers/user';
import { Button, Col, Form, Input, Modal, Row, message } from 'antd';
import Image from 'next/image'
import { useDispatch } from 'react-redux';
import { useMutation } from 'urql';
import styles from './SignUpModal.module.less';
import SignModalIllustration from '../../../assets/images/sign-modal-illustration.svg'

type SignUpModalArgs = {
    visible: boolean;
    onClose: () => void;
}

type SignUpRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const SignUpModal: FC<SignUpModalArgs> = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [registeredResponse, register] = useMutation(registerMutation);

    useEffect(() => {
        form.resetFields();
    }, [form])

    const handleOk = () => {
        form
            .validateFields()
            .then(async (values: SignUpRequest) => {
                try {
                    const { data, error } = await register({
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        password: values.password,
                        confirmPassword: values.confirmPassword,
                    });

                    if (error) {
                        message.error(error.message);
                        return;
                    }

                    if (data.register.code) {
                        message.error(data.register.message);
                        return;
                    }

                    // await sendConfirmEmail(email, token);

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

    return (
        <Modal
            title="Register to continue"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={450}
            maskClosable={false}
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    loading={registeredResponse.fetching}
                    onClick={handleOk}
                    className={styles.submitBtn}
                >
                    Sign Up
                </Button>,
            ]}
        >
            <Row justify="center">
                <Image
                    src={SignModalIllustration}
                    alt="image for sign up form"
                />
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
                            <Form.Item
                                name="firstName"
                                label="First name"
                                rules={[{ required: true, message: 'Please input the first name!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastName"
                                label="Last name"
                                rules={[{ required: true, message: 'Please input the last name!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ type: 'email', required: true, message: 'Please input the email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input the password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Confirm password"
                        rules={[{ required: true, message: 'Please confirm the password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                </Form>
            </Row>
        </Modal>
    );
}

export default SignUpModal;