module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: ["packages/tsconfig.json"],
      },
    },
  },
  extends: [
    "airbnb-base",
    "plugin:astro/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-use-before-define": ["error", { functions: false }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
      },
    ],
  },
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
      rules: {},
    },
  ],
};
