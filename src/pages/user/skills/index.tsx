import type { NextPage } from 'next'
import Head from 'next/head'
import ProtectedLayout from 'src/layouts/ProtectedLayout'
// import styles from './SkillsPage.module.less'
import { NextPageWithLayout } from '@pages/_app'
import React, { ReactElement } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const ProfilePage: NextPageWithLayout = () => {
    return (
        <>
            <Head>
                <title>Skills</title>
            </Head>
            <main>
                <Button icon={<PlusOutlined />}>Add skill</Button>
            </main>
        </>
    )
}

ProfilePage.getLayout = (page: ReactElement) => <ProtectedLayout title="Skills">{page}</ProtectedLayout>;

export default ProfilePage;