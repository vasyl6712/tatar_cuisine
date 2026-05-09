import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import * as airbnbExtended from 'eslint-config-airbnb-extended';
import importX from 'eslint-plugin-import-x';
import nodePlugin from 'eslint-plugin-n';
import prettier from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  basePath: __dirname,
  recommendedConfig: js.configs.recommended,
});

const airbnbFlatConfigs = Object.values(airbnbExtended.configs || {})
  .map((conf) => (conf && conf.recommended ? conf.recommended : conf))
  .flat()
  .filter(
    (conf) =>
      typeof conf === 'object' &&
      conf !== null &&
      !Object.hasOwn(conf, 'recommended'),
  );

export default [
  {
    // Додано next-env.d.ts до списку ігнорування
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'public/**',
      'next-env.d.ts',
    ],
  },

  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  ...airbnbFlatConfigs,

  {
    plugins: {
      'unused-imports': unusedImports,
      'import-x': importX,
      '@stylistic': stylistic,
      n: nodePlugin,
      react: reactPlugin,
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      react: { version: 'detect' },
    },
    rules: {
      // Дозволяємо назви шрифтів Next.js (Geist_Mono тощо)
      camelcase: ['error', { allow: ['Geist_Mono', 'Geist_Sans'] }],

      // Дозволяємо JSX у .tsx
      'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],

      'react/react-in-jsx-scope': 'off',
      'no-undef': 'off',
      'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],

      'import-x/no-extraneous-dependencies': 'off',
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Вимикаємо перевірку версії Node для Object.hasOwn, якщо engines у package.json не допоможе
      'n/no-unsupported-features/es-builtins': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
    },
  },

  prettier,
].filter(Boolean);
