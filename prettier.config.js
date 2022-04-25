module.exports = {
    endOfLine: 'lf',
    printWidth: 100,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    overrides: [
        {
            files: ['src/**/*'],
            options: {
                printWidth: 140,
            },
        },
    ],
};
