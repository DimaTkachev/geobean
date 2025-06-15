import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json',
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...reactPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'prettier/prettier': 'error',
            // Enforce arrow functions
            'func-style': ['error', 'expression'],
            'prefer-arrow-callback': 'error',
            'arrow-body-style': ['error', 'as-needed'],
            // Enforce const
            'prefer-const': 'error',
            'no-var': 'error',
            // TypeScript specific rules
            '@typescript-eslint/prefer-function-type': 'error',
            '@typescript-eslint/ban-types': [
                'error',
                {
                    types: {
                        Function: {
                            message:
                                'Avoid using the Function type. Prefer arrow function types.',
                            fixWith: '() => void',
                        },
                    },
                },
            ],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        files: ['**/*.{js,mjs}'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**'],
    },
];
