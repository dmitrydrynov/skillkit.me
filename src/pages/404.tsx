import type { NextPage } from 'next'
import React from 'react'
import { Button, Result } from 'antd'
import { useRouter } from 'next/router'

const NoFoundPage: NextPage = () => {
    const router = useRouter()
    
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button type="primary" onClick={() => router.push('/')}>
                    Back Home
                </Button>
            }
        />
    )
}

export default NoFoundPage
