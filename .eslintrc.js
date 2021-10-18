module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	plugins: ['jsx-a11y', 'react', 'prettier'],
	extends: ['plugin:jsx-a11y/recommended', 'next', 'prettier'],
	root: true,
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
	},
	settings: {
		react: {
			pragma: 'React',
			version: 'detect',
		},
	},
	rules: {
		'prettier/prettier': 'error',
		'comma-dangle': ['error', 'always-multiline'],
		curly: 'error',
		eqeqeq: [
			'error',
			'always',
			{
				null: 'ignore',
			},
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
		'max-len': ['error', 140],
		'sort-imports': [
			'error',
			{
				ignoreDeclarationSort: true,
			},
		],
		'padding-line-between-statements': [
			'error',
			{ blankLine: 'always', prev: '*', next: 'function' },
			{ blankLine: 'always', prev: '*', next: 'if' },
			{ blankLine: 'always', prev: 'if', next: '*' },
			{ blankLine: 'always', prev: '*', next: 'switch' },
			{ blankLine: 'always', prev: 'switch', next: '*' },
		],
		'jsx-a11y/anchor-is-valid': 'off',
		quotes: [
			'error',
			'single',
			{
				avoidEscape: true,
			},
		],
		'no-unused-vars': 'error',
	},
};
