module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['react-hooks'],
  rules: {
    'no-undef': 'error',
    'react-hooks/rules-of-hooks': 'error',
  },
  globals: { React: 'readonly' },
}
