/** @type {import('next-sitemap').IConfig} */

module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_APP_URL,
	generateRobotsTxt: true,
	exclude: ['/*', '/server-sitemap.xml', '/settings/*', '/users/*', '/user/*', '/password/*', '/403'],
	// robotsTxtOptions: {
	// 	additionalSitemaps: [
	// 		`${process.env.NEXT_PUBLIC_APP_URL}/server-sitemap.xml`, // <==== Add here
	// 	],
	// },
};
