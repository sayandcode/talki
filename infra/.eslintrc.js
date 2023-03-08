const path = require("node:path");

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [path.join(__dirname, "../.eslintrc.js")],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.eslint.json",
  },
  rules: {
    "no-new": "off",
  },
};
