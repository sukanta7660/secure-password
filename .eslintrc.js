module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended'
  ],

  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },

  rules: {
    'no-unused-vars': 1,
    'indent': ['error', 2],
    'quotes': [2, 'single',
      {
        'avoidEscape': true,
        'allowTemplateLiterals': true
      },
    ],
    'semi': [2, 'always'],
    'no-unreachable': 'off',
    'vue/html-quotes': ['off', 'double', { avoidEscape: false }],
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/valid-next-tick': [0, 'never'],
    'vue/no-v-html': [0, 'never'],
    'vue/no-reserved-component-names': [0, 'never'],
    'vue/no-use-v-if-with-v-for': [0, 'never'],
  }
};
