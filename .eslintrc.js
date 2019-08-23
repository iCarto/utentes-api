module.exports = {
    env: {
        browser: true,
    },
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double", {avoidEscape: true, allowTemplateLiterals: true}],
        "quote-props": ["error", "consistent"],
        semi: ["error", "always"],
    },
};
