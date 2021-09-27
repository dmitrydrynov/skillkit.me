import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import { cacheExchange, createClient, dedupExchange } from 'urql';

export const graphqlClient = createClient({
  url: process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : '',
  exchanges: [dedupExchange, cacheExchange, multipartFetchExchange],
  fetchOptions: () => {
    return {
      credentials: 'include',
    };
  },
});
