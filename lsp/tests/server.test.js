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

describe('LSP Server Protocol', () => {
  test('connection has onInitialize method', () => {
    expect(connection.onInitialize).toBeDefined();
  });

  test('connection has onInitialized method', () => {
    expect(connection.onInitialized).toBeDefined();
  });

  test('documents has onDidOpen method', () => {
    expect(documents.onDidOpen).toBeDefined();
  });

  test('documents has onDidChangeContent method', () => {
    expect(documents.onDidChangeContent).toBeDefined();
  });

  test('documents has onDidSave method', () => {
    expect(documents.onDidSave).toBeDefined();
  });

  test('connection has onDidChangeConfiguration method', () => {
    expect(connection.onDidChangeConfiguration).toBeDefined();
  });
});
