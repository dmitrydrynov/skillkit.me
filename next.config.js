/** @type {import('next').NextConfig} */
const path = require('path');
const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');

const lessVariables = path.resolve(
  './src/styles/variables.less'
);

const plugins = [
  [withLess, {
    lessLoaderOptions: {
      additionalData: (content) => `${content}\n\n@import '${lessVariables}';`,
      lessOptions: {
        javascriptEnabled: true,
      },
    },
  }],
];

const config = {
  reactStrictMode: false,
};

/** Add images hosts */
if (process.env.IMAGES_HOST) {
  config.images = {
    domains: [
      process.env.IMAGES_HOST,
    ],
  };
}

module.exports = withPlugins(plugins, config);
