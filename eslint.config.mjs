import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintReact from 'eslint-plugin-react'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '**/node_modules/',
      '**/build/',
      '**/.react-router/',
      'packages/backend/src/types.ts',
    ],
  },
  /** React */
  eslintReact.configs.flat.recommended,
  eslintReact.configs.flat['jsx-runtime'],
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  }
)
