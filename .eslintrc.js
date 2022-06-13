module.exports = {
	plugins: ['@typescript-eslint', 'unused-imports', 'prettier'],
	extends: ['next/core-web-vitals', 'plugin:prettier/recommended'],
	ignorePatterns: ['node_modules/*'],
	rules: {
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto',
			},
		],
		'@next/next/no-img-element': 'off',
		'react-hooks/exhaustive-deps': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'max-len': 'off',
		'unused-imports/no-unused-imports-ts': 'error',
		'unused-imports/no-unused-imports-ts': [
			'warn',
			{ vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
		],
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
