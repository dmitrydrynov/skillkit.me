/** @type {import('next-sitemap').IConfig} */

module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_APP_URL,
	generateRobotsTxt: true,
	exclude: [
		'/admin/*',
		'/api/*',
		'/cookies',
		'/blog',
		'/blog/*',
		'/home',
		'/password/*',
		'/server-sitemap.xml',
		'/settings/*',
		'/user/*',
		'/403',
		'/404',
		'/503',
	],
	transform: async (config, path) => {
		let changefreq = config.changefreq;
		let priority = config.priority;

		switch (path) {
			case '/':
				changefreq = 'monthly';
				priority = 0.5;
			case '/about':
				changefreq = 'monthly';
				priority = 0.5;
		}

		return {
			loc: path,
			changefreq,
			priority,
		};
	},
	robotsTxtOptions: {
		policies: [
			{
				userAgent: '*',
				disallow: ['/admin', '/api', '/user'],
			},
		],
		additionalSitemaps: [
			`${process.env.NEXT_PUBLIC_APP_URL}/server-sitemap.xml`, // <==== Add here
		],
	},
};
