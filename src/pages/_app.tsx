import type { AppProps } from 'next/app'
<<<<<<< HEAD
import React, { ReactElement, ReactNode, useEffect } from 'react'
import PublicLayout from 'src/layouts/PublicLayout'
import { NextPage } from 'next'
import { store } from '../store/configure-store';
import { Provider as StoreProvider, useDispatch } from 'react-redux';
import { Provider as UrqlProvider } from 'urql';
import '@styles/globals.less'
import { graphqlClient } from 'src/services/graphql/client';
import { getCookie } from 'src/helpers/cookie';
import { setLogin } from 'src/store/reducers/auth';
=======
import { NextPage } from 'next'
import Head from 'next/head'
import React, { ReactElement, ReactNode } from 'react'
import PublicLayout from '@components/layouts/PublicLayout'
import 'tailwindcss/tailwind.css'
import '@styles/globals.scss'
>>>>>>> bfa9439fd7d618c4bc63c49dbfc4a504e26f38b8

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
<<<<<<< HEAD
    // const dispatch = useDispatch();
    const getLayout = Component.getLayout || ((page) => <PublicLayout>{page}</PublicLayout>)

    // useEffect(() => {
    //     const token = getCookie('gamelab_jwt');

    //     if (token) {
    //       dispatch(setLogin({ token }));
    //     }

    //   }, [dispatch]);

    return (
        <StoreProvider store={store}>
            <UrqlProvider value={graphqlClient}>
                {getLayout(<Component {...pageProps} />)}
            </UrqlProvider>
        </StoreProvider>
    );
=======
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
>>>>>>> bfa9439fd7d618c4bc63c49dbfc4a504e26f38b8
}
export default MyApp
