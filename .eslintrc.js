
module.exports = {
  "parser": "babel-eslint",
  "plugins": ["react", "flowtype"],
  "extends": ["react-app", "react-app/jest", "plugin:react/recommended", "plugin:flowtype/recommended"],
  "ignorePatterns": ["/flow-typed", "/node_modules", "/public"],
  "rules": {
    "block-scoped-var": "error",
    "comma-dangle": ["error", "always-multiline"],
    "eol-last": ["error", "always"],
    "jsx-quotes": ["error", "prefer-double"],
    "max-len": ["error", { "code": 120 }],
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "no-console": "error",
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "react/jsx-tag-spacing": "error",
    "flowtype/delimiter-dangle": [2, "always-multiline"],
    "flowtype/no-types-missing-file-annotation": 0,
    "flowtype/semi": [2, "always"],
  },
};
