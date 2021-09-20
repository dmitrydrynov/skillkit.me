import React, { FC, useEffect } from 'react';
import { useState } from 'react';
import SignModalIllustration from '@assets/images/sign-modal-illustration.svg'
import { sendConfirmCodeMutation } from '@services/graphql/queries/user';
// import { setLogin } from '@store/reducers/auth';
// import { setUserData } from '@store/reducers/user';
import { registerMutation } from 'src/services/graphql/queries/user';
import { Button, Col, Form, Input, Modal, Row, message } from 'antd';
import Image from 'next/image'
import { useDispatch } from 'react-redux';
import { useMutation } from 'urql';
import styles from './SignUpModal.module.less';

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
    // const dispatch = useDispatch();
    const [step, setStep] = useState('email');
    const [sendConfirmCodeResponse, sendConfirmCode] = useMutation(sendConfirmCodeMutation);
    // const [authorizedResponse, authorize] = useMutation(authorizeMutation);

    useEffect(() => {
        form.resetFields();
        setStep('email');
    }, [form])

    const handleOk = () => {
        form
            .validateFields()
            .then(async (values: SignUpRequest) => {
                try {

                    if (step === 'email') {
                        // const { data, error } = await sendConfirmCode({
                        //     email: values.email,
                        // });

                        // if (error) {
                        //     message.error(error.message);
                        //     return;
                        // }

                        // if (data.sendConfirmCode.code) {
                        //     message.error(data.register.message);
                        //     return;
                        // }

                        setStep('password');
                    }

                    if (step === 'password') {

                        // const { data, error } = await registerMutation({
                        //     ...values,
                        // });

                        // if (error) {
                        //     message.error(error.message);
                        //     return;
                        // }

                        // if (data.sendConfirmCode.code) {
                        //     message.error(data.register.message);
                        //     return;
                        // }

                        message.success('Your are welcome!');
                        onClose();
                    }
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
            title={null}
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={450}
            centered={true}
            maskClosable={false}
            className={styles.modal}
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    size="large"
                    loading={sendConfirmCodeResponse.fetching}
                    onClick={handleOk}
                    className={styles.submitBtn}
                >
                    {step === 'email' ? 'Continue' : 'Sign Up'}
                </Button>,
            ]}
        >
            <Row justify="center">
                <div className={styles.imageContainer}>
                    <Image
                        src={SignModalIllustration}
                        alt="image for sign up form"
                    />
                </div>
                <h2 className={styles.title}>Get Connect to the best Mentors</h2>
                <p className={styles.subtitle}>Easy way to connect to mentor and get
                    advise solution of design. </p>
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
                        rules={[{ type: 'email', required: true, message: 'Please input the email!' }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    {step === 'password' &&
                        <>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="firstName"
                                        rules={[{ required: true, message: 'Please input the first name!' }]}
                                    >
                                        <Input placeholder="First name" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="lastName"
                                        rules={[{ required: true, message: 'Please input the last name!' }]}
                                    >
                                        <Input placeholder="Last name" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="password"
                                label={
                                    <Row style={{ width: '100%' }} justify="end">
                                        <Col>
                                            <Button type="link">Resend a code</Button>
                                        </Col>
                                    </Row>
                                }
                                rules={[{ required: true, message: 'Please input the password!' }]}
                            >
                                <Input.Password placeholder="The code sent to your email" />
                            </Form.Item>
                        </>
                    }
                </Form>
            </Row>
        </Modal>
    );
}

export default SignUpModal;