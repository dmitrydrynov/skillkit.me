/** @type {import('next').NextConfig} */
require('dotenv').config();
const path = require('path');
const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');

const lessVariables = path.resolve('./src/styles/variables.less');
const imagesHost = new URL(process.env.NEXT_PUBLIC_IMAGES_HOST || '');

/** Setup plugins */
const plugins = [
	[
		withLess,
		{
			lessLoaderOptions: {
				additionalData: (content) => `${content}\n\n@import '${lessVariables}';`,
				lessOptions: {
					javascriptEnabled: true,
				},
			},
		},
	],
];

/** Main Next.js configuration */
const mainConfig = {
	reactStrictMode: false,
};

/** Image hosts */
if (imagesHost) {
	mainConfig.images = {
		domains: [imagesHost.hostname],
	};
}

module.exports = withPlugins(plugins, mainConfig);
