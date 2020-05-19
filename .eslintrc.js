// module.exports = {
//   env: {
//     commonjs: true,
//     es6: true,
//     node: true,
//   },
//   extends: ["airbnb-base", "prettier", "plugin:security/recommended"],
//   plugins: ["prettier", "security"],
//   globals: {
//     Atomics: "readonly",
//     SharedArrayBuffer: "readonly",
//   },
//   parserOptions: {
//     ecmaVersion: 2018,
//   },
//   rules: {
//     "prettier/prettier": ["error"],
//   },
// };

export default {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
};
