import { getCookie } from '@helpers/cookie';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import { cacheExchange, createClient, dedupExchange, ssrExchange } from 'urql';

declare const window: any;

const API_URL = process.env.BACKEND_URL;

export const graphqlClient = createClient({
	url: process.env.NEXT_PUBLIC_BACKEND_URL || '',
	exchanges: [dedupExchange, cacheExchange, multipartFetchExchange],
	fetchOptions: () => {
		const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME);

		return {
			credentials: 'include',
			headers: token
				? {
						Authorization: token || '',
				  }
				: null,
		};
	},
});

export const ssrGraphqlClient = (token: string = null) => {
	const isServerSide = typeof window === 'undefined';

	const ssr = ssrExchange({
		isClient: !isServerSide,
		initialState: !isServerSide ? window.__URQL_DATA__ : undefined,
	});

	return createClient({
		url: process.env.BACKEND_URL || '',
		exchanges: [dedupExchange, cacheExchange, ssr, multipartFetchExchange],
		fetchOptions: () => {
			return {
				credentials: 'include',
				headers: token
					? {
							Authorization: token || '',
					  }
					: null,
			};
		},
	});
};
