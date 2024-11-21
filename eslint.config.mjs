import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import _import from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: ['src/public/*'],
    },
    ...fixupConfigRules(
        compat.extends(
            'eslint:recommended',
            'plugin:import/typescript',
            'plugin:@typescript-eslint/eslint-recommended',
            'plugin:@typescript-eslint/recommended',
            'prettier'
        )
    ),
    {
        plugins: {
            '@typescript-eslint': fixupPluginRules(typescriptEslint),
            prettier,
            import: fixupPluginRules(_import),
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: 'module',

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        settings: {
            react: {
                version: 'detect',
            },

            'import/ignore': ['node_modules'],
        },

        rules: {
            'no-case-declarations': 'off',

            'import/extensions': [
                'off',
                'ignorePackages',
                {
                    js: 'never',
                    jsx: 'never',
                    ts: 'never',
                    tsx: 'never',
                },
            ],

            'import/no-cycle': 1,
            '@typescript-eslint/ban-ts-ignore': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            'prettier/prettier': 'error',
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/no-var-requires': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',

            // TODO: Denne burde nok skrus på!
            '@typescript-eslint/no-unused-expressions': 'off',

            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    args: 'all',
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            //
            // "@typescript-eslint/ban-types": ["error", {
            //     types: {
            //         object: false,
            //     },
            //
            //     extendDefaults: true,
            // }],

            'import/named': 'error',
            'import/namespace': 'error',
            'import/default': 'error',
            'import/export': 'error',

            'import/order': [
                'error',
                {
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },

                    'newlines-between': 'always',
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],

                    pathGroups: [
                        {
                            pattern: 'react',
                            group: 'external',
                            position: 'before',
                        },
                        {
                            pattern: 'nav-**',
                            group: 'external',
                            position: 'after',
                        },
                        {
                            pattern: '@navikt/**',
                            group: 'internal',
                            position: 'before',
                        },
                    ],

                    pathGroupsExcludedImportTypes: ['builtin'],
                },
            ],
        },
    },
];
