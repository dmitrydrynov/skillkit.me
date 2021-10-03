import React, { ReactElement } from 'react'
import ProtectedLayout from '@layouts/ProtectedLayout'
import { NextPageWithLayout } from '@pages/_app'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import Head from 'next/head'

const ProfilePage: NextPageWithLayout = () => (
        <>
            <Head>
                <title>Skills</title>
            </Head>
            <main>
                <Button icon={<PlusOutlined />}>Add skill</Button>
            </main>
        </>
    )

ProfilePage.getLayout = (page: ReactElement) => <ProtectedLayout title="Skills">{page}</ProtectedLayout>;

export default ProfilePage;