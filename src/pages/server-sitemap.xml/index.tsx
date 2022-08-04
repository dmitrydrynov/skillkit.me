import { PostViewModeEnum } from '@components/PostEditorBeforeContent';
import { ssrGraphqlClient } from '@services/graphql/client';
import { postsDataQuery } from '@services/graphql/queries/post';
import { GetServerSideProps } from 'next';
import { getServerSideSitemap } from 'next-sitemap';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const fields = [
		{
			loc: process.env.NEXT_PUBLIC_APP_URL, // Absolute url
			lastmod: new Date().toISOString(),
		},
	];

	const client = ssrGraphqlClient(ctx.req.cookies[process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME]);

	const { data, error } = await client
		.query(postsDataQuery, {
			where: { viewMode: { equals: PostViewModeEnum.EVERYONE } },
		})
		.toPromise();

	if (data) {
		fields.push({
			loc: process.env.NEXT_PUBLIC_APP_URL + '/blog',
			lastmod: data.posts[data.posts.length - 1].updatedAt,
		});

		data.posts.map((post) => {
			fields.push({
				loc: process.env.NEXT_PUBLIC_APP_URL + '/blog/' + post.slug,
				lastmod: post.updatedAt,
			});
		});
	}

	return await getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
