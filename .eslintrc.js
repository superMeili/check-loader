module.exports = {
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015
  },
  rules: {
    'no-unused-vars': [
      'error',
      { varsIgnorePattern: '.*', args: 'none' }
    ],
    'no-restricted-globals': 'off',
  },
}
