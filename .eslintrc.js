module.exports = {
    root: true,
    parserOptions: {
      parser: 'babel-eslint',
      ecmaVersion: 2015,
      sourceType: 'module'
    },
    env: {
      browser: true,
      node: true
    },
    extends: [
      // https://github.com/standard/eslint-config-standard
      'standard',
      // https://eslint.vuejs.org/rules/
      // 'plugin:vue/base'
      'plugin:vue/essential'
      // 'plugin:vue/strongly-recommended'
      // 'plugin:vue/recommended'
    ],
    plugins: [
      'vue'
    ],
    rules: {
        'no-new': 0
    }
}