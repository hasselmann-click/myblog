module.exports = {
    extends: ['next/core-web-vitals', 'prettier'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': [
            'warn',
            {
                singleQuote: true,
                printWidth: 140,
                tabWidth: 4,
            },
        ],
    },
};
