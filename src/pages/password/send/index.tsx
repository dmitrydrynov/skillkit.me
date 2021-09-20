import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Result } from 'antd'
import { useRouter } from 'next/router'
import styles from './style.module.less'
import { Row } from 'antd';
import { forgotPasswordMutation } from 'src/services/graphql/queries/auth'
import { useMutation } from 'urql';
import { message } from 'antd';

const ResetPasswordPage: NextPage = () => {
    const router = useRouter()
    const [form] = Form.useForm();
    const [forgotPasswordResponse, forgotPassword] = useMutation(forgotPasswordMutation);

    const handleFormFinish = async () => {
        const { email } = form.getFieldsValue();

        try {
            const { data: { sendUserPasswordResetLink }, error } = await forgotPassword({ email })

            if (sendUserPasswordResetLink !== null && sendUserPasswordResetLink.message) {
                message.error(sendUserPasswordResetLink.message);
            }

            if (error) {
                message.error(error.message);
            }

            message.success('A link to reset your password has been sent to your email');
            router.push('/');
        } catch (error: any) {
            message.error(error.message);
        }
    }

    return (
        <Row justify="center" className={styles.formSection}>
            <Col flex="0 450px">
                <h2>Forgot password</h2>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ modifier: 'public' }}
                    style={{ marginBottom: '40px' }}
                    onFinish={handleFormFinish}
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please input the email!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
                <Button type="primary" loading={forgotPasswordResponse.fetching} onClick={form.submit}>Forgot password</Button>
            </Col>
        </Row>
    )
}

export default ResetPasswordPage;