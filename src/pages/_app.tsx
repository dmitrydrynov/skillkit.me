/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useEffect, useState } from 'react';
import { CookieConsent } from '@components/CookieConsent';
import LoadingScreen from '@components/loadingScreen';
import PublicLayout from '@layouts/PublicLayout';
import { graphqlClient } from '@services/graphql/client';
import { store } from '@store/configure-store';
import { appConfig } from 'src/config/app';
import { AuthProvider } from 'src/providers/auth-provider';
import ProgressBar from '@badrap/bar-of-progress';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import Script from 'next/script';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as UrqlProvider } from 'urql';
import '@styles/globals.less';

export type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactNode) => ReactNode;
	beforeContent?: ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
	server: { healthy: boolean };
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout || ((page) => <PublicLayout>{page}</PublicLayout>);
	const [loading, setLoading] = useState(true);
	const [progress, setProgress] = useState(null);

	useEffect(() => {
		setProgress(new ProgressBar(appConfig.progressBar));
		setLoading(false);
	}, []);

	Router.events.on('routeChangeStart', () => {
		progress?.start();
		setLoading(true);
	});
	Router.events.on('routeChangeComplete', () => {
		progress?.finish();
		setLoading(false);
	});
	Router.events.on('routeChangeError', () => {
		progress?.finish();
		setLoading(false);
	});

	return (
		<>
			{/* <DefaultSeo {...configSEO} /> */}
			<Script
				id="google-tag-manager"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html:
						process.env.NODE_ENV == 'development'
							? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=xcw78CtpYYSpOm4rHyKemw&gtm_preview=env-14&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-K9N6B7P');`
							: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-K9N6B7P');`,
				}}
			/>
			<StoreProvider store={store}>
				<UrqlProvider value={graphqlClient}>
					<AuthProvider>
						<>
							{getLayout(<Component {...pageProps} style={{ opacity: loading ? 0 : 1 }} />)}
							<CookieConsent />
						</>
					</AuthProvider>
				</UrqlProvider>
			</StoreProvider>
			<LoadingScreen visible={loading} />
		</>
	);
}

export default MyApp;
