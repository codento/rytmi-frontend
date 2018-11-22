module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },
  'extends': [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/require-default-prop': 'off',
    'array-bracket-newline': ['error', { 'multiline': true }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
