module.exports = {
    env: {
        browser: true,
    },
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "single", {avoidEscape: true, allowTemplateLiterals: true}],
        "quote-props": ["error", "consistent"],
        semi: ["error", "always"],
    },
};
