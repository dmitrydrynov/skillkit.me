import { getPostQuery, postsDataQuery } from '@services/graphql/queries/post';
import { initUrqlClient } from 'next-urql';
import { cacheExchange, dedupExchange, fetchExchange, ssrExchange } from 'urql';

export const urqlServerClient = () =>
	initUrqlClient(
		{
			url: process.env.BACKEND_URL,
			exchanges: [dedupExchange, cacheExchange, ssrExchange({ isClient: false }), fetchExchange],
		},
		false,
	);

export const fetchPosts = async (variables?: any) => {
	try {
		const { data, error } = await urqlServerClient().query(postsDataQuery, variables).toPromise();

		if (error) {
			return {
				posts: null,
				error,
			};
		}

		return { posts: data.posts };
	} catch (error) {
		return {
			posts: null,
			error,
		};
	}
};

export const fetchPost = async (variables: any) => {
	try {
		const { data, error } = await urqlServerClient().query(getPostQuery, variables).toPromise();

		if (error) {
			return {
				post: null,
				error,
			};
		}

		return { post: data.post };
	} catch (error) {
		return {
			post: null,
			error,
		};
	}
};
