/**
 * Newt LSP Server
 * Main entry point for Language Server Protocol
 */

const {
  createConnection,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  InitializeResult,
} = require('vscode-languageserver');

const { TextDocument } = require('vscode-languageserver-textdocument');

// Create connection for Node IPC
const connection = createConnection();

// Document manager
const documents = new TextDocuments(TextDocument);

// Initialize handler
connection.onInitialize(() => {
  return {
    capabilities: {
      textDocumentSync: 1, // FULL
      diagnosticProvider: {
        interFileDependencies: false,
        workspaceDiagnostics: false,
      },
    },
  };
});

documents.listen(connection);
connection.listen();

module.exports = { connection, documents };
