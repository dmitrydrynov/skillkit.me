import { getCookie } from '../../helpers/cookie';
import { createClient } from 'urql';

export const graphqlClient = createClient({
  url: process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : '',
  fetchOptions: () => {
    return {
      credentials: 'include',
    };
  },
});
