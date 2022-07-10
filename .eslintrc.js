require('@rushstack/eslint-config/patch/modern-module-resolution');
module.exports = {
  extends: ['@microsoft/eslint-config-spfx/lib/profiles/react'],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@microsoft/spfx/no-async-await": "off",
    "react/jsx-no-bind": "off",
    "no-async-promise-executor": "off",
    "dot-notation": "off"
  },
  parserOptions: { tsconfigRootDir: __dirname }
};
