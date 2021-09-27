/** @type {import('next').NextConfig} */
const path = require('path');
const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');

const lessVariables = path.resolve(
  '@styles/variables.less'
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

module.exports = withPlugins(plugins, {
  reactStrictMode: true,
});
