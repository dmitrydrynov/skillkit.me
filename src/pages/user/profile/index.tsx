import type { NextPage } from 'next'
import Head from 'next/head'
import ProtectedLayout from 'src/layouts/ProtectedLayout'
import styles from './ProfilePage.module.less'
import { NextPageWithLayout } from '@pages/_app'
import { ReactElement } from 'react'

const ProfilePage: NextPageWithLayout = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Profile</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                Profile page
            </main>
        </div>
    )
}

ProfilePage.getLayout = (page: ReactElement) => <ProtectedLayout title="Profile">{page}</ProtectedLayout>;

export default ProfilePage;