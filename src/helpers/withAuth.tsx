import React, { FC } from 'react';
import { getCookie } from '@helpers/cookie';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent) => {
	// eslint-disable-next-line react/display-name
	return (props: any) => {
		// checks whether we are on client / browser or server.
		if (typeof window !== 'undefined') {
			const Router = useRouter();

			const accessToken = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME);

			// If there is no access token we redirect to "/" page.
			if (!accessToken) {
				Router.replace('/');
				return null;
			}

			// If this is an accessToken we just render the component that was passed with all its props

			return <WrappedComponent {...props} />;
		}

		// If we are on server, return null
		return null;
	};
};

export default withAuth;
