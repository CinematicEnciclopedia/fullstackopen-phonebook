import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    ignores: ['node_modules/**', 'frontend/**', 'dist/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
]