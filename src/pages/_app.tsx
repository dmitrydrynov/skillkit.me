import type { AppProps } from 'next/app'
import { NextPage } from 'next'
import Head from 'next/head'
import React, { ReactElement, ReactNode } from 'react'
import PublicLayout from '@components/layouts/PublicLayout'
import 'tailwindcss/tailwind.css'
import '@styles/globals.scss'

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout =
        Component.getLayout ?? ((page) => <PublicLayout>{page}</PublicLayout>)

    return getLayout(
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
        </>
    )
}
export default MyApp
