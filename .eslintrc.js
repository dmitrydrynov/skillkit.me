module.exports = {
	plugins: ['prettier'],
	extends: ['next/core-web-vitals', 'plugin:prettier/recommended'],
	rules: {
		'prettier/prettier': 'error',
		'import/order': [
			'error',
			{
				alphabetize: {
					order: 'asc',
					caseInsensitive: true,
				},
				groups: ['builtin', 'internal', 'external', 'sibling', 'index'],
				'newlines-between': 'never',
				pathGroups: [
					{
						pattern: 'react',
						group: 'builtin',
						position: 'before',
					},
				],
				pathGroupsExcludedImportTypes: ['react'],
			},
		],
	},
};
