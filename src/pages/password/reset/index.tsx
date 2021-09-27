import React, { useEffect, useState } from 'react'
import { resetPasswordMutation } from '@services/graphql/queries/user'
import { Button, Col, Form, Input , Row, message } from 'antd'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMutation } from 'urql';
import styles from './style.module.less'

const ResetPasswordPage: NextPage = () => {
    const router = useRouter()
    const [form] = Form.useForm();
    const [resetToken, setResetToken] = useState<string>();
    const [resetPasswordResponse, resetPassword] = useMutation(resetPasswordMutation);

    useEffect(() => {
        const { resetToken }: any = router.query;

        if (resetToken) {
            setResetToken(resetToken);
        }
    }, [router])

    const handleFormFinish = async () => {
        const { email, password } = form.getFieldsValue();

        try {
            const { data: { redeemUserPasswordResetToken }, error } = await resetPassword({
                email, password, token: resetToken,
            })

            if (redeemUserPasswordResetToken !== null && redeemUserPasswordResetToken.message) {
                message.error(redeemUserPasswordResetToken.message);
            }

            if (error) {
                message.error(error.message);
            }

            message.success('Your password updated.');
            router.push('/');
        } catch (error: any) {
            message.error(error.message);
        }
    }

    return (
        <Row justify="center" className={styles.formSection}>
            <Col flex="0 450px">
                <h2>Reset password</h2>
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
                    <Form.Item
                        name="password"
                        label="New password"
                        rules={[{ required: true, message: 'Please input the new password!' }]}
                    >
                        <Input type="password" autoComplete="new-password" />
                    </Form.Item>
                </Form>
                <Button type="primary" loading={resetPasswordResponse.fetching} onClick={form.submit}>Reset</Button>
            </Col>
        </Row>
    )
}

export default ResetPasswordPage;
