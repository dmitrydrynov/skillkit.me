import type { AppProps } from 'next/app'
import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react'
import PublicLayout from 'src/layouts/PublicLayout'
import { NextPage } from 'next'
import { store } from '../store/configure-store';
import { Provider as StoreProvider, useDispatch } from 'react-redux';
import { Provider as UrqlProvider, useQuery } from 'urql';
import '@styles/globals.less'
import { graphqlClient } from 'src/services/graphql/client';
import { getCookie } from 'src/helpers/cookie';
import { setLogin } from 'src/store/reducers/auth';
import { setUserData } from 'src/store/reducers/user';
import { authenticatedUserQuery } from 'src/services/graphql/queries/auth';
import { message } from 'antd';

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const AuthProvider: FC = ({ children }): any => {
    const dispatch = useDispatch();
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [userData] = useQuery({
        query: authenticatedUserQuery,
        pause: !sessionToken,
    });

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME) {
            const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME);

            if (token) {
                setSessionToken(token);
            }
        }
    }, []);

    useEffect(() => {
        const { data, error } = userData;

        if (data && sessionToken) {
            dispatch(setLogin({ token: sessionToken }));
            dispatch(setUserData(data.authenticatedItem));
        }
    }, [dispatch, sessionToken, userData])

    return children;
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout || ((page) => <PublicLayout>{page}</PublicLayout>)

    return (
        <StoreProvider store={store}>
            <UrqlProvider value={graphqlClient}>
                <AuthProvider>
                    {getLayout(<Component {...pageProps} />)}
                </AuthProvider>
            </UrqlProvider>
        </StoreProvider>
    );
}
export default MyApp
