module.exports = {
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended", "plugin:jsx-a11y/recommended"],
  plugins: ["@typescript-eslint", "jsx-a11y"],
  rules: {
    // Performance
    "@next/next/no-img-element": "error",
    "@next/next/no-page-custom-font": "warn",

    // Accessibility
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error",
    "jsx-a11y/heading-has-content": "error",
    "jsx-a11y/label-has-associated-control": "error",
    "jsx-a11y/no-aria-hidden-on-focusable": "error",

    // TypeScript
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-const": "error",

    // React
    "react/jsx-key": "error",
    "react/no-array-index-key": "warn",
    "react/self-closing-comp": "error",

    // General
    "no-console": "warn",
    "prefer-const": "error",
    "no-var": "error",
  },
  overrides: [
    {
      files: ["**/*.test.{js,jsx,ts,tsx}"],
      env: {
        jest: true,
      },
    },
  ],
}
