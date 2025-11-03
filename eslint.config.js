import js from '@eslint/js'
import reactHooks from 'eslin
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
export default tseslint.config(

    extends: [js.configs.recomm
  { ignores: ['dist', 'node_modules'] },
   
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
    },
      globals: globals.browser,
      
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [

        { allowConstantExport: true },

      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      '@typescript-eslint/no-explicit-any': 'warn',

  },

