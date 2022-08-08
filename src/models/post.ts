import { ssrGraphqlClient } from '@services/graphql/client';
import { getPostQuery, postsDataQuery } from '@services/graphql/queries/post';

export const fetchPosts = async () => {
	try {
		const client = ssrGraphqlClient();
		const { data, error } = await client.query(postsDataQuery).toPromise();

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

export const fetchPost = async ({ slug }: { slug: string }) => {
	try {
		const client = ssrGraphqlClient();
		const { data, error } = await client.query(getPostQuery, { where: { slug: { equals: slug } } }).toPromise();

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
