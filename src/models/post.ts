import { urqlServerClient } from '@services/graphql/client';
import { getPostQuery, postsDataQuery } from '@services/graphql/queries/post';

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
