import { getCookie } from '../../helpers/cookie';
import { createClient } from 'urql';

export const graphqlClient = createClient({
  url: process.env.NEXT_PUBLIC_API_URL + '/graphql',
  fetchOptions: () => {
    const token = getCookie('gamelab_jwt');

    return {
      headers: {
        authorization: token || '',
      },
    };
  },
});
