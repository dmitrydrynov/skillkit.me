module.exports = {
	plugins: ['prettier'],
	extends: ['next/core-web-vitals', 'plugin:prettier/recommended'],
	rules: {
		'prettier/prettier': 'error',
	},
};
