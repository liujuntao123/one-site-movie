module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/prettier'],

  parserOptions: {
    ecmaVersion: 2020,
    type: 'module',
  },
  rules: {
    'no-undef': 'off',
    'vue/no-unused-vars': 'warn',
    'no-unused-vars': 'warn',
    'vue/multi-word-component-names': 'off',
  },
};
