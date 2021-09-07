import type { AppProps } from 'next/app'
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

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
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
}
export default MyApp
