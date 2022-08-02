import GhostContentAPI from '@tryghost/content-api';

// Create API instance with site credentials
const api = new GhostContentAPI({
	url: 'http://skillkit_ghost:2368',
	key: '7a478d6c96b42255ae2a3280ed',
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
