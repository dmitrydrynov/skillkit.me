import type { AppProps } from 'next/app'
// import 'tailwindcss/tailwind.css'
import React, { ReactElement, ReactNode } from 'react'
import PublicLayout from 'src/layouts/PublicLayout'
import { NextPage } from 'next'
import '@styles/globals.less'

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout || ((page) => <PublicLayout>{page}</PublicLayout>)

    return getLayout(<Component {...pageProps} />);
}
export default MyApp
