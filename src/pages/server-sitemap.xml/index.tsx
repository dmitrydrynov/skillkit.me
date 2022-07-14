import { PostViewModeEnum } from '@components/PostEditorBeforeContent';
import { ssrGraphqlClient } from '@services/graphql/client';
import { postsDataQuery } from '@services/graphql/queries/post';
import { postCategoriesDataQuery } from '@services/graphql/queries/postCategory';
import { GetServerSideProps } from 'next';
import { getServerSideSitemap } from 'next-sitemap';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const fields = [
		{
			loc: process.env.NEXT_PUBLIC_APP_URL,
			lastmod: new Date().toISOString(),
		},
		{
			loc: process.env.NEXT_PUBLIC_APP_URL + '/blog',
			lastmod: new Date().toISOString(),
		},
	];

	const client = ssrGraphqlClient(ctx.req.cookies[process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME]);

	const categoriesResponse = await client.query(postCategoriesDataQuery).toPromise();
	const postsResponse = await client
		.query(postsDataQuery, {
			where: { viewMode: { equals: PostViewModeEnum.EVERYONE } },
		})
		.toPromise();

	if (postsResponse.data) {
		postsResponse.data.posts.map((post) => {
			fields.push({
				loc: process.env.NEXT_PUBLIC_APP_URL + '/blog/' + post.slug,
				lastmod: post.updatedAt,
			});
		});
	}

	if (categoriesResponse.data) {
		categoriesResponse.data.postCategories.map((category) => {
			fields.push({
				loc: process.env.NEXT_PUBLIC_APP_URL + '/blog/' + category.slug,
				lastmod: category.updatedAt,
			});
		});
	}

	return await getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
