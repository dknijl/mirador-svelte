import js from '@eslint/js';
import globals from 'globals';
import { fixupPluginRules } from '@eslint/compat';
import importPlugin from 'eslint-plugin-import';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  // Ignore patterns
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/config/**', '**/styles/**', '**/packages/**'],
  },

  // Base ESLint recommended rules
  js.configs.recommended,
  // Pretter recommended rules
  prettierRecommended,

  // Main configuration
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],

    languageOptions: {
      ecmaVersion: 2025,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2025,
        document: true,
        page: true,
        vi: true,
      },
      sourceType: 'module',
    },

    plugins: {
      // eslint-plugin-import still uses context APIs removed in ESLint 10.
      import: fixupPluginRules(importPlugin),
      'jest-dom': jestDomPlugin,
      'testing-library': testingLibraryPlugin,
    },

    rules: {
      ...jestDomPlugin.configs['flat/recommended'].rules,
      ...testingLibraryPlugin.configs['flat/dom'].rules,

      camelcase: ['error', { properties: 'never', ignoreDestructuring: false }],
      complexity: ['warn', 25],
      'consistent-return': 'error',
      'default-case': ['error', { commentPattern: '^no default$' }],
      'dot-notation': ['error', { allowKeywords: true }],
      eqeqeq: ['warn', 'smart'],
      'import/extensions': ['error', 'ignorePackages', { js: 'never' }],
      'import/first': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-anonymous-default-export': 'off',
      'import/no-cycle': ['error', { maxDepth: Infinity }],
      'import/no-duplicates': 'error',
      'import/no-extraneous-dependencies': 'off',
      'import/no-mutable-exports': 'error',
      'import/no-unresolved': [2, { ignore: ['test-utils', 'vite'] }],
      'import/prefer-default-export': 'off',
      'max-depth': ['warn', 4],
      'max-params': ['warn', 5],
      'no-console': 'off',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-empty-function': ['error', { allow: ['arrowFunctions', 'functions', 'methods'] }],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-implicit-coercion': ['error', { boolean: false, number: true, string: true, allow: [] }],
      'no-lonely-if': 'error',
      'no-nested-ternary': 'warn',
      'no-new-func': 'error',
      'no-param-reassign': ['error', { props: true }],
      'no-restricted-globals': [
        'error',
        { name: 'isFinite', message: 'Use Number.isFinite instead' },
        { name: 'isNaN', message: 'Use Number.isNaN instead' },
      ],
      'no-restricted-syntax': ['warn', 'WithStatement'],
      'no-return-assign': ['error', 'always'],
      'no-script-url': 'error',
      'no-shadow': ['error', { builtinGlobals: false, hoist: 'functions' }],
      'no-undef': 'error',
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      'no-unused-vars': 'off',
      'no-use-before-define': ['warn', { functions: false, classes: false, variables: false }],
      'no-useless-return': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-destructuring': [
        'warn',
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: false, object: false },
        },
      ],
      'prefer-rest-params': 'error',
      'prefer-template': 'warn',
      radix: 'error',
      'testing-library/await-async-queries': 'error',
      'testing-library/no-await-sync-queries': 'error',
      'testing-library/no-debugging-utils': 'warn',
      'testing-library/no-dom-import': 'off',
      'testing-library/no-render-in-lifecycle': ['error', { allowTestingFrameworkSetupHook: 'beforeEach' }],
      'testing-library/render-result-naming-convention': 'off',
    },

    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.json'],
          moduleDirectory: ['node_modules', 'src', '__tests__'],
        },
      },
      // The legacy import resolver ignores package exports. Validate these ESM entries with Node.
      'import/core-modules': ['@redux-devtools/extension', 'chalk', 'svelte/reactivity', 'uuid'].filter((id) =>
        import.meta.resolve(id),
      ),
      'testing-library/utils-module': '@tests/utils/test-utils',
    },
  },

  // Test file overrides
  {
    files: ['**/__tests__/**', '**/*.test.js', 'setupTest.js'],
    rules: {
      'no-undef': 'off', // Test globals (describe, it, expect, etc.) provided by vitest
    },
  },
  ...sveltePlugin.configs['flat/recommended'],
  {
    files: ['**/*.svelte', '**/*.svelte.js'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        extraFileExtensions: ['.svelte'],
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        $derived: 'readonly',
        $effect: 'readonly',
        $props: 'readonly',
        $state: 'readonly',
      },
    },
    rules: {
      // Components strip viewer-only props before forwarding the remaining HTML attributes.
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
      // SanitizedHtml is the single place that intentionally injects HTML that
      // DOMPurify has already cleaned.
      'svelte/no-at-html-tags': 'off',
    },
  },
  // Ignore alias imports in test files
  {
    files: ['__tests__/**/*.js'],
    rules: {
      'import/no-unresolved': ['error', { ignore: ['^@src/', '^@tests/'] }],
    },
  },
];
