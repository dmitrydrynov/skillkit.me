/** @type {import('next').NextConfig} */
require('dotenv').config();
const path = require('path');
const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');

const lessVariables = path.resolve('./src/styles/variables.less');

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
	images: {
		domains: ['cdn.discordapp.com'],
	},
	webpack: (config) => {
		config.watchOptions = {
			poll: 1000,
			aggregateTimeout: 300,
		};
		return config;
	},
};

module.exports = withPlugins(plugins, mainConfig);
