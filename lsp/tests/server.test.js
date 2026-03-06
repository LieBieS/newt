const { connection, documents } = require('../server');

describe('LSP Server', () => {
  test('server initializes successfully', () => {
    expect(connection).toBeDefined();
    expect(documents).toBeDefined();
  });

  test('initialize handler returns capabilities', () => {
    // Test initialize response
  });
});
