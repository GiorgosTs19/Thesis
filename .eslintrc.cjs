module.exports = {
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        // Add specific rules as needed
    },
    ignorePatterns: ['node_modules/', 'build/', 'dist/', 'vendor/', 'config/', '/resources/js/bootstrap.js'], // Add directories you want to ignore
};
