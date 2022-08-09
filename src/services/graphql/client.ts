import { getCookie } from '@helpers/cookie';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import { initUrqlClient } from 'next-urql';
import { cacheExchange, createClient, dedupExchange, fetchExchange, ssrExchange } from 'urql';

declare const window: any;

export const graphqlClient = createClient({
	url: process.env.NEXT_PUBLIC_BACKEND_URL,
	exchanges: [dedupExchange, cacheExchange, multipartFetchExchange],
	fetchOptions: () => {
		const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME);

		return {
			credentials: 'include',
			headers: token ? { Authorization: token } : null,
		};
	},
});

export const ssrGraphqlClient = (token: string = null) => {
	const isServerSide = typeof window === 'undefined';

	const ssr = ssrExchange({
		isClient: !isServerSide,
		initialState: !isServerSide ? window.__URQL_DATA__ : undefined,
	});

	const fetchOptionsResponse: RequestInit = {
		credentials: 'include',
	};

	if (token) {
		fetchOptionsResponse.headers = { Authorization: token };
	}

	return createClient({
		url: process.env.BACKEND_URL,
		exchanges: [dedupExchange, cacheExchange, ssr, multipartFetchExchange],
		fetchOptions: () => fetchOptionsResponse,
	});
};

export const urqlServerClient = (token?: string) => {
	const fetchOptionsResponse: RequestInit = {
		credentials: 'include',
	};

	if (token) {
		fetchOptionsResponse.headers = { Authorization: token };
	}

	return initUrqlClient(
		{
			url: process.env.BACKEND_URL,
			exchanges: [dedupExchange, cacheExchange, ssrExchange({ isClient: false }), fetchExchange],
			fetchOptions: () => fetchOptionsResponse,
		},
		false,
	);
};
