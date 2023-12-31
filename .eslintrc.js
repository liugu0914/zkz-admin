const { defineConfig } = require('eslint-define-config')

// http://eslint.cn/docs/rules/
module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parser: 'vue-eslint-parser',
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:vue/vue3-strongly-recommended',
    'prettier'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      tsx: true
    }
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.vue']
    }
  ],
  // eslint-plugin-vue @typescript-eslint/eslint-plugin eslint-plugin-prettier的缩写
  plugins: ['vue', 'prettier', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/ban-ts-ignore': 'off',

    // 不允许未使用的变量。
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': ['off', { fixToUnknown: true, ignoreRestArgs: false }],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'vue/require-default-prop': 'off',
    'vue/script-setup-uses-vars': 'error',
    'vue/custom-event-name-casing': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/valid-v-for': 'off',
    'vue/this-in-template': 'error',
    'vue/no-v-for-template-key-on-child': 'error',
    'vue/no-static-inline-styles': 'error',
    'vue/component-api-style': 'error',
    'vue/block-tag-newline': 'error',
    'vue/static-class-names-order': 'error',
    'vue/camelcase': 'warn',
    'vue/eqeqeq': 'error',
    'vue/require-valid-default-prop': 'off',
    'vue/block-lang': [
      'error',
      {
        script: {
          lang: ['ts', 'tsx']
        }
      }
    ],
    'vue/no-useless-template-attributes': 'warn',
    'vue/html-end-tags': 'error',
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'never'
      }
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: []
      }
    ],
    // 'vue/static-class-names-order': 'off',
    'vue/attributes-order': [
      'warn',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT'
        ],
        alphabetical: true
      }
    ],
    'vue/v-on-event-hyphenation': [
      'error',
      'always',
      {
        autofix: true,
        ignore: []
      }
    ],

    'prettier/prettier': 'error',
    'no-use-before-define': 'off',
    'no-var': 'error',
    'no-unused-vars': 'error',

    // 该规则强制 typeof 表达式与有效的字符串进行比较。
    'valid-typeof': 'error',

    // 禁止出现console
    'no-console': 'warn',

    // 禁用debugger
    'no-debugger': 'warn',

    // 禁止出现重复的 case 标签
    'no-duplicate-case': 'warn',

    // 禁止出现空语句块
    'no-empty': 'warn',

    // 禁止不必要的括号
    'no-extra-parens': 'off',

    // 禁止对 function 声明重新赋值
    'no-func-assign': 'warn',

    // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码
    'no-unreachable': 'warn',

    // 强制所有控制语句使用一致的括号风格
    curly: 'warn',

    // 要求 switch 语句中有 default 分支
    'default-case': 'warn',

    // 强制尽可能地使用点号
    'dot-notation': 'warn',

    // 要求使用 === 和 !==
    eqeqeq: 'error',

    // 禁止 if 语句中 return 语句之后有 else 块
    'no-else-return': 'warn',

    // 禁止出现空函数
    'no-empty-function': 'error',

    // 禁用不必要的嵌套块
    'no-lone-blocks': 'warn',

    // 禁止使用多个空格
    'no-multi-spaces': 'warn',

    // 禁止多次声明同一变量
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error'],

    // 禁止在 return 语句中使用赋值语句
    'no-return-assign': 'warn',

    // 禁用不必要的 return await
    'no-return-await': 'warn',

    // 禁止自我赋值
    'no-self-assign': 'warn',

    // 禁止自身比较
    'no-self-compare': 'warn',

    // 禁止不必要的 catch 子句
    'no-useless-catch': 'warn',

    // 禁止多余的 return 语句
    'no-useless-return': 'warn',

    // 禁止变量声明与外层作用域的变量同名
    'no-shadow': 'off',

    // 允许delete变量
    'no-delete-var': 'error',

    // 强制数组方括号中使用一致的空格
    'array-bracket-spacing': 'warn',

    // 强制在代码块中使用一致的大括号风格
    'brace-style': 'warn',

    // 强制使用骆驼拼写法命名约定
    camelcase: 'warn',

    // 强制使用一致的缩进
    indent: 'off',

    // 强制在 JSX 属性中一致地使用双引号或单引号
    // 'jsx-quotes': 'warn',
    // 强制可嵌套的块的最大深度4
    'max-depth': ['warn', 3],

    // 强制最大行数
    'max-lines': ['error', { max: 500 }],

    // 强制函数最大代码行数 50
    // 'max-lines-per-function': ['warn', { max: 70 }],

    // 强制函数块最多允许的的语句数量20
    'max-statements': ['warn', 100],

    // 强制回调函数最大嵌套深度
    'max-nested-callbacks': ['warn', 3],

    // 强制函数定义中最多允许的参数数量
    'max-params': ['warn', 5],

    // 强制每一行中所允许的最大语句数量
    'max-statements-per-line': ['warn', { max: 1 }],

    // 要求方法链中每个调用都有一个换行符
    'newline-per-chained-call': ['warn', { ignoreChainWithDepth: 5 }],

    // 禁止 if 作为唯一的语句出现在 else 语句中
    'no-lonely-if': 'warn',

    // 禁止空格和 tab 的混合缩进
    'no-mixed-spaces-and-tabs': 'warn',

    // 禁止出现多行空行
    'no-multiple-empty-lines': 'warn',

    // 禁止出现;
    semi: ['warn', 'never'],

    // 强制在块之前使用一致的空格
    'space-before-blocks': 'warn',

    // 强制在 function的左括号之前使用一致的空格
    // 'space-before-function-paren': ['warn', 'never'],

    // 强制在圆括号内使用一致的空格
    'space-in-parens': 'warn',

    // 要求操作符周围有空格
    'space-infix-ops': 'warn',

    // 强制在一元操作符前后使用一致的空格
    'space-unary-ops': 'warn',

    // 强制在注释中 // 或 /* 使用一致的空格
    'spaced-comment': 'warn',

    // 强制在 switch 的冒号左右有空格
    'switch-colon-spacing': 'warn',

    // 限制标识符的最大和/或最小长度 最小2
    // 'id-length': ['error', { exceptions: ['i', 'e'] }],

    // 要求在块级注释之前有一空行
    // 'lines-around-comment': ['error', { beforeBlockComment: true, beforeLineComment: true }],

    // 强制箭头函数的箭头前后使用一致的空格
    'arrow-spacing': 'warn',
    'prefer-const': 'warn',
    'prefer-rest-params': 'warn',
    'no-useless-escape': 'off',
    'no-irregular-whitespace': 'warn',
    'no-prototype-builtins': 'warn',
    'no-fallthrough': 'warn',
    'no-extra-boolean-cast': 'warn',
    'no-case-declarations': 'warn',
    'no-async-promise-executor': 'warn'
  }
})
