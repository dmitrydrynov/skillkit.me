import { getCookie } from '@helpers/cookie';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import { cacheExchange, createClient, dedupExchange, Operation } from 'urql';

export const graphqlClient = createClient({
	url: process.env.NEXT_PUBLIC_BACKEND_URL ? process.env.NEXT_PUBLIC_BACKEND_URL : '',
	exchanges: [dedupExchange, cacheExchange, multipartFetchExchange],
	fetchOptions: () => {
		const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME);

		return {
			credentials: 'include',
			headers: {
				Authorization: token || '',
			},
		};
	},
});
