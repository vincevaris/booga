module.exports = {
    env: {
        es6: true,
        node: true,
    },
    parserOptions: {
        'ecmaVersion': 2018,
    },
    rules: {
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
    },
    overrides: [
        {
            files: ['**/*.spec.*'],
            env: {
                mocha: true,
            },
            rules: {},
        },
    ],
    globals: {},
};
