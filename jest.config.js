module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'lsp/**/*.js',
    '!lsp/tests/**',
    '!lsp/README.md',
  ],
  testMatch: ['**/tests/**/*.test.js'],
};
