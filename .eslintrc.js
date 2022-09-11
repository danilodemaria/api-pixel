module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    babelOptions: {
      configFile: './.babelrc',
    },
  },
  rules: {
    'no-console': 'error',
    camelcase: 'off',
    'no-useless-catch': 'off',
    'no-param-reassign': 'off',
    'import/no-unresolved': [2, { commonjs: true }],
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
  },
};
