export default [
  {
    files: [
      'src/**/*.js',
      'public/*.js',
      'test/u1-zona-crystal-bot/**/*.js',
      'scripts/u1-zona-crystal-bot/*.mjs',
    ],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: {
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-constant-condition': 'error',
      'no-unreachable': 'error',
    },
  },
];
