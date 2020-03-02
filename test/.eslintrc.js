module.exports = {
  plugins: ["jest"],
  extends: ["plugin:jest/recommended"],
  env: {
    jest: true,
    "jest/globals": true,
  },
  rules: {
    "no-console": "off",
  },
  globals: {},
};
