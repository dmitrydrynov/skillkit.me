import { PostViewModeEnum } from '@components/PostEditorBeforeContent';
import { fetchPosts } from '@models/post';
import { GetServerSideProps } from 'next';
import { getServerSideSitemap } from 'next-sitemap';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const fields = [
		{
			loc: process.env.NEXT_PUBLIC_APP_URL, // Absolute url
			lastmod: new Date().toISOString(),
		},
	];

	const { posts, error } = await fetchPosts({
		where: { viewMode: { equals: PostViewModeEnum.EVERYONE } },
	});

	if (posts) {
		fields.push({
			loc: process.env.NEXT_PUBLIC_APP_URL + '/blog',
			lastmod: posts[posts.length - 1].updatedAt,
		});

		posts.map((post) => {
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
