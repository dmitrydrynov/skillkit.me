/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { CookieConsent } from '@components/CookieConsent';
import LoadingScreen from '@components/loadingScreen';
import { getCookie, setCookie } from '@helpers/cookie';
import PublicLayout from '@layouts/PublicLayout';
import { graphqlClient } from '@services/graphql/client';
import { authenticatedUserQuery, signInByCodeQuery } from '@services/graphql/queries/auth';
import { RootState, store } from '@store/configure-store';
import { setLogin, setLoginingIn } from '@store/reducers/auth';
import { setUserData } from '@store/reducers/user';
import ProgressBar from '@badrap/bar-of-progress';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Router, { useRouter } from 'next/router';
import Script from 'next/script';
import { Provider as StoreProvider, useDispatch, useSelector } from 'react-redux';
import { Provider as UrqlProvider, useQuery } from 'urql';
import '@styles/globals.less';

export type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactNode) => ReactNode;
	beforeContent?: ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const progress = new ProgressBar({
	size: 2,
	className: 'bar-of-progress',
	delay: 100,
	color: '#C057FF',
});

const AuthProvider: FC = ({ children }): any => {
	const dispatch = useDispatch();
	const { query: queryParams, push: routerPush } = useRouter();
	const [sessionToken, setSessionToken] = useState<string | null>(null);
	const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
	const [userDataByCode] = useQuery({
		query: signInByCodeQuery,
		variables: { code: queryParams.code, state: queryParams.state, serviceName: 'discord' },
		pause: !queryParams?.code,
	});
	const [userData] = useQuery({
		query: authenticatedUserQuery,
		pause: !sessionToken && !loggedIn,
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
		// else {
		// 	setCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME, null);
		// 	setSessionToken(null);
		// 	routerPush('/');
		// }
	}, [dispatch, sessionToken, userData, userDataByCode]);

	return children;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout || ((page) => <PublicLayout>{page}</PublicLayout>);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(false);
	}, []);

	Router.events.on('routeChangeStart', () => {
		progress.start();
		setLoading(true);
	});
	Router.events.on('routeChangeComplete', () => {
		progress.finish();
		setLoading(false);
	});
	Router.events.on('routeChangeError', () => {
		progress.finish();
		setLoading(false);
	});

	return (
		<>
			<StoreProvider store={store}>
				<UrqlProvider value={graphqlClient}>
					<AuthProvider>
						<div style={{ opacity: loading ? 0 : 1 }}>
							{getLayout(
								<>
									{process.env.NODE_ENV !== 'development' && (
										<Script id="google-tag-manager" strategy="afterInteractive">
											{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K9N6B7P');`}
										</Script>
									)}
									<Component {...pageProps} />
								</>,
							)}
							<CookieConsent />
						</div>
					</AuthProvider>
				</UrqlProvider>
			</StoreProvider>
			<LoadingScreen visible={loading} />
		</>
	);
}
export default MyApp;
