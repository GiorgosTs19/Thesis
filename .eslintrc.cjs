module.exports = {
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    parserOptions: {
        ecmaVersion: 2022,
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
    env: {
        browser: true,
        node: true,
        // Add other environments as needed
    },
    globals: {
        // Add global variables here
        fetch: 'readonly',
        route: 'readonly'
    },
    ignorePatterns: ['node_modules/', 'build/', 'dist/', 'vendor/', 'config/', '/resources/js/bootstrap.js'], // Add directories you want to ignore
};
