import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react';
import { getCookie, setCookie } from '@helpers/cookie';
import PublicLayout from '@layouts/PublicLayout';
import '@styles/globals.less';
import { graphqlClient } from '@services/graphql/client';
import { authenticatedUserQuery, signInByCodeQuery } from '@services/graphql/queries/auth';
import { store } from '@store/configure-store';
import { setLogin, setLoginingIn } from '@store/reducers/auth';
import { setUserData } from '@store/reducers/user';
import ProgressBar from '@badrap/bar-of-progress';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Router, { useRouter } from 'next/router';
import { Provider as StoreProvider, useDispatch } from 'react-redux';
import { Provider as UrqlProvider, useQuery } from 'urql';

export type NextPageWithLayout = NextPage & {
	// eslint-disable-next-line no-unused-vars
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const progress = new ProgressBar({
	size: 2,
	className: 'bar-of-progress',
	delay: 100,
});

const AuthProvider: FC = ({ children }): any => {
	const dispatch = useDispatch();
	const { query: queryParams, push: routerPush } = useRouter();
	const [sessionToken, setSessionToken] = useState<string | null>(null);
	const [userData] = useQuery({
		query: authenticatedUserQuery,
		pause: !sessionToken,
	});
	const [userDataByCode] = useQuery({
		query: signInByCodeQuery,
		variables: { code: queryParams.code, state: queryParams.state, serviceName: 'discord' },
		pause: !queryParams?.code,
	});

	useEffect(() => {
		if (process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME) {
			const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME);

			if (token) {
				setSessionToken(token);
				routerPush('/');
			}
		}
	}, []);

	useEffect(() => {
		dispatch(setLoginingIn(userData.fetching || userDataByCode.fetching));
	}, [userData, userDataByCode]);

	useEffect(() => {
		if (userDataByCode.data) {
			const { token } = userDataByCode.data.signInByCode;
			setCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME, token);
			setSessionToken(token);
			routerPush('/');
		}
	}, [userDataByCode]);

	useEffect(() => {
		const data = userData?.data || userDataByCode?.data?.signInByCode;

		if (data && sessionToken) {
			dispatch(setLogin({ token: sessionToken }));
			dispatch(setUserData(data.authenticatedUser));
		}
	}, [dispatch, sessionToken, userData, userDataByCode]);

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
					<AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
				</UrqlProvider>
			</StoreProvider>
		</>
	);
}
export default MyApp;
