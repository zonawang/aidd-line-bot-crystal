import { spawnSync } from 'node:child_process';
import { testFiles } from './test-files.mjs';
const sourcePaths = [
  'src',
  'public',
  'test/u1-zona-crystal-bot',
  'scripts/u1-zona-crystal-bot',
  'package.json',
  'eslint.config.js',
  '.prettierrc.json',
  '.env.example',
  'README.md',
  'docs/zona-crystal-api.md',
  'docs/zona-crystal-demo.md',
  'docs/zona-crystal-evidence.md',
  '.github/workflows/zona-crystal-check.yml',
];
for (const [bin, args] of [
  [
    'node',
    [
      'node_modules/prettier/bin/prettier.cjs',
      '--check',
      ...sourcePaths.filter((p) => p !== '.env.example'),
    ],
  ],
  [
    'node',
    [
      'node_modules/eslint/bin/eslint.js',
      'src',
      'public',
      'test/u1-zona-crystal-bot',
      'scripts/u1-zona-crystal-bot',
    ],
  ],
  ['node', ['--test', ...testFiles]],
]) {
  const result = spawnSync(bin, args, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
