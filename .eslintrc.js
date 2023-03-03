module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "standard-with-typescript"
  ],
  env: {
    jquery: true,
    browser: true,
    jest: true
  },
  overrides: [],
  parserOptions: {
    project: "tsconfig.json"
  //   ecmaVersion: "latest",
  //   sourceType: "module"
  },
  rules: {
    "array-bracket-spacing": ["error", "never"],
    "arrow-spacing": 2,
    "class-methods-use-this": 0,
    indent: ["error", 2, { SwitchCase: 1 }],
    "key-spacing": [
      2,
      {
        afterColon: true
      }
    ],
    "keyword-spacing": 2,
    "linebreak-style": "off",
    "lines-around-comment": [
      "error",
      {
        afterBlockComment: false,
        beforeBlockComment: false
      }
    ],
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true }
    ],
    "no-console": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "off",
    "no-useless-escape": "off",
    "object-curly-newline": [
      "error",
      {
        ImportDeclaration: {
          consistent: true,
          multiline: true
        }
      }
    ],
    "object-curly-spacing": [2, "always"],
    "padding-line-between-statements": [
      "error",
      {
        blankLine: "always",
        next: "function",
        prev: "function"
      },
      {
        blankLine: "always",
        next: "class",
        prev: "class"
      }
    ],
    quotes: ["error", "double", { avoidEscape: true }],
    semi: [
      "error",
      "always",
      {
        omitLastInOneLineBlock: true
      }
    ],
    "space-before-blocks": 2,
    "space-before-function-paren": "off",
    "space-in-parens": ["error", "never"],
    "object-property-newline": "error"
  }
};
