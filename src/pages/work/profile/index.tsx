import type { NextPage } from 'next'
import Head from 'next/head'
import ProtectedLayout from '@components/layouts/ProtectedLayout'
import { ReactElement } from 'react'
import { NextPageWithLayout } from '@pages/_app'

const UserProfile: NextPageWithLayout = () => {
    return (
        <div>
            <Head>
                <title>User Profile</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
            </Head>
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-lg leading-6 font-semibold text-gray-900">
                        Profile
                    </h1>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Replace with your content */}
                    <div className="px-4 py-4 sm:px-0">
                        <p>User profile page</p>
                    </div>
                    {/* /End replace */}
                </div>
            </main>
        </div>
    )
}

UserProfile.getLayout = (page: ReactElement) => (
    <ProtectedLayout>{page}</ProtectedLayout>
)

export default UserProfile
