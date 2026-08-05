module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['react-hooks', 'react'],
  settings: { react: { version: 'detect' } },
  rules: {
    'no-undef': 'error',
    'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_' }],
    'no-dupe-keys': 'error',
    'no-const-assign': 'error',
    'no-unreachable': 'error',
    'no-self-compare': 'error',
    'no-duplicate-case': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/no-direct-mutation-state': 'error',
    // without these, anything referenced only inside JSX looks unused
    'react/jsx-uses-vars': 'error',
    'react/jsx-uses-react': 'error',
  },
}
