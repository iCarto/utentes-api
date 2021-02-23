module.exports = {
    env: {
        browser: true,
        es6: true, // https://caniuse.com/#feat=es6
        jquery: true,
    },
    plugins: ["backbone"],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "script",
        ecmaFeatures: {
            impliedStrict: true,
            jsx: false,
            globalReturn: false,
        },
    },
    extends: ["eslint:recommended", "plugin:backbone/recommended"],
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double", {avoidEscape: true, allowTemplateLiterals: true}],
        "quote-props": ["error", "consistent"],
        semi: ["error", "always"],
        "backbone/no-view-qualified-jquery": "error",
        "backbone/defaults-on-top": ["error", ["dateFields"]],
        "backbone/initialize-on-top": [
            "error",
            {
                View: ["tagName", "className", "events", "id", "template"],
                Model: ["defaults", "url", "urlRoot"],
                Collection: ["model", "url"],
            },
        ],
    },
    globals: {
        L: "readonly",
        SIRHA: "readonly",
        bootbox: "readonly",
        iAuth: "readonly",
        wf: "readonly",
        wfr: "readonly",
    },
};
