import {
  FC, ReactElement, ReactNode, useEffect, useState,
} from 'react';
import { getCookie } from '@helpers/cookie';
import PublicLayout from '@layouts/PublicLayout';
import '@styles/globals.less';
import { graphqlClient } from '@services/graphql/client';
import { authenticatedUserQuery } from '@services/graphql/queries/auth';
import { store } from '@store/configure-store';
import { setLogin } from '@store/reducers/auth';
import { setUserData } from '@store/reducers/user';
import ProgressBar from '@badrap/bar-of-progress';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import { Provider as StoreProvider, useDispatch } from 'react-redux';
import { Provider as UrqlProvider, useQuery } from 'urql';

export type NextPageWithLayout = NextPage & {
    // eslint-disable-next-line no-unused-vars
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const progress = new ProgressBar({
  size: 2,
  className: 'bar-of-progress',
  delay: 100,
});

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
    const { data } = userData;

    if (data && sessionToken) {
      dispatch(setLogin({ token: sessionToken }));
      dispatch(setUserData(data.authenticatedItem));
    }
  }, [dispatch, sessionToken, userData]);

  return children;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => <PublicLayout>{page}</PublicLayout>);

  Router.events.on('routeChangeStart', progress.start);
  Router.events.on('routeChangeComplete', progress.finish);
  Router.events.on('routeChangeError', progress.finish);

  return (
    <>
      <StoreProvider store={store}>
        <UrqlProvider value={graphqlClient}>
          <AuthProvider>
            {getLayout(<Component {...pageProps} />)}
          </AuthProvider>
        </UrqlProvider>
      </StoreProvider>
    </>
  );
}
export default MyApp;
