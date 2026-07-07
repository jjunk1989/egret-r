import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/packages/*/src/**',  // generated copies
      'scripts/*.js',           // legacy CommonJS scripts
    ],
  },
  {
    rules: {
      // Phase 3: enforce code quality
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'smart'],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-namespace': 'off',  // project uses namespaces
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-namespace-keyword': 'off',
      // Relaxed rules (tighten over time)
      '@typescript-eslint/no-empty-function': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-case-declarations': 'off',
      'no-fallthrough': 'warn',
      'no-prototype-builtins': 'off',
      'no-cond-assign': 'off',
    },
  },
);
