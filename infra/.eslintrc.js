const path = require("node:path");

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [path.join(__dirname, "../.eslintrc.js")],
  rules: {
    "no-new": "off",
  },
};
