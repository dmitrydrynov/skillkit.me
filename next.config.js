/** @type {import('next').NextConfig} */
require('dotenv').config();
const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');
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
	// output: 'standalone',
	reactStrictMode: false,
	staticPageGenerationTimeout: 1000,
	swcMinify: true,
	images: {
		domains: ['cdn.discordapp.com'],
	},
	experimental: {
		outputStandalone: true,
	},
	webpack: (config) => {
		config.watchOptions = {
			poll: 1000,
			aggregateTimeout: 300,
		};
		return config;
	},
	sentry: {},
};

/** Image hosts */
if (process.env.NEXT_PUBLIC_STORAGE_HOST) {
	mainConfig.images.domains.push(process.env.NEXT_PUBLIC_STORAGE_HOST);
	console.log('Allowed images hostnames', mainConfig.images.domains);
}

const sentryWebpackPluginOptions = {
	silent: true,
};

module.exports = withSentryConfig(withPlugins(plugins, mainConfig), sentryWebpackPluginOptions);
