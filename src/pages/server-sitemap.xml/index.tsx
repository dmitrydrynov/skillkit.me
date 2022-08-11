import { PostViewModeEnum } from '@components/PostEditorBeforeContent';
import { fetchPosts } from '@models/post';
import { fetchUserSkillsListForShare } from '@models/user-skill';
import { GetServerSideProps } from 'next';
import { getServerSideSitemap } from 'next-sitemap';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const fields = [];

	const { posts, error } = await fetchPosts({
		where: { viewMode: { equals: PostViewModeEnum.EVERYONE } },
	});

	fields.push({
		loc: process.env.NEXT_PUBLIC_APP_URL + '/blog',
		lastmod: posts.length > 0 ? posts[posts.length - 1].updatedAt : new Date().toISOString(),
		priority: 0.7,
	});

	if (posts.length) {
		posts.map((post) => {
			fields.push({
				loc: process.env.NEXT_PUBLIC_APP_URL + '/blog/' + post.slug,
				lastmod: post.updatedAt,
				priority: 0.7,
			});
		});
	}

	const { data: userSkillsShareData, error: userSkillsShareError } = await fetchUserSkillsListForShare();

	if (userSkillsShareData.length) {
		userSkillsShareData.map((userSkill) => {
			fields.push({
				loc: userSkill.url,
				lastmod: userSkill.updatedAt,
				priority: 0.9,
			});
		});
	}

	return await getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
