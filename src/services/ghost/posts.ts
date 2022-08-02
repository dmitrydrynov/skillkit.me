import GhostContentAPI from '@tryghost/content-api';

// Create API instance with site credentials
const api = new GhostContentAPI({
	url: process.env.NEXT_PUBLIC_GHOST_URL,
	key: process.env.NEXT_PUBLIC_GHOST_KEY,
	version: 'v5.0',
});

export async function getPosts() {
	return await api.posts
		.browse({
			limit: 'all',
		})
		.catch((err) => {
			console.error(err);
		});
}

export async function getSinglePost(postSlug) {
	return await api.posts
		.read({
			slug: postSlug,
			include: 'tags,authors',
		})
		.catch((err) => {
			console.error(err);
		});
}
