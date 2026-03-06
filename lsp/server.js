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
  TextDocumentSyncKind,
} = require('vscode-languageserver');

const { TextDocument } = require('vscode-languageserver-textdocument');

// Create connection for Node IPC (or mocked for testing)
let connection;
try {
  connection = createConnection();
} catch (error) {
  // For testing, create a mock connection
  if (typeof jest !== 'undefined') {
    connection = {
      onInitialize: jest.fn((handler) => handler),
      onInitialized: jest.fn(),
      onDidChangeConfiguration: jest.fn(),
      onDidOpenTextDocument: jest.fn(),
      onDidChangeTextDocument: jest.fn(),
      onDidSaveTextDocument: jest.fn(),
      sendDiagnostics: jest.fn(),
      console: { log: jest.fn(), error: jest.fn() },
      listen: jest.fn(),
    };
  } else {
    throw error;
  }
}

// Document manager
const documents = new TextDocuments(TextDocument);

// Global configuration
let globalSettings = {
  analysisDepth: 'balanced',
  realTimeDiagnostics: true,
  commandTimeout: 30000,
};

// Initialize handler
connection.onInitialize((params) => {
  const capabilities = {
    textDocumentSync: TextDocumentSyncKind.Full,
    diagnosticProvider: {
      interFileDependencies: false,
      workspaceDiagnostics: false,
    },
  };

  return {
    capabilities,
    serverInfo: {
      name: 'Newt LSP Server',
      version: '1.0.0',
    },
  };
});

connection.onInitialized(() => {
  if (connection.console && connection.console.log) {
    connection.console.log('Newt LSP server initialized');
  }
});

// Document open handler
documents.onDidOpen((event) => {
  if (connection.console && connection.console.log) {
    connection.console.log(`Document opened: ${event.document.uri}`);
  }
  // TODO: Trigger initial diagnostics
});

// Document change handler
let changeTimeout;
documents.onDidChangeContent((event) => {
  // Debounce analysis
  clearTimeout(changeTimeout);
  changeTimeout = setTimeout(() => {
    if (connection.console && connection.console.log) {
      connection.console.log(`Document changed: ${event.document.uri}`);
    }
    // TODO: Trigger diagnostics on change
  }, 500);
});

// Document save handler
documents.onDidSave((event) => {
  if (connection.console && connection.console.log) {
    connection.console.log(`Document saved: ${event.document.uri}`);
  }
  // TODO: Trigger diagnostics on save
});

// Settings change handler
connection.onDidChangeConfiguration((change) => {
  globalSettings = change.settings.newt || globalSettings;
  if (connection.console && connection.console.log) {
    connection.console.log('Configuration updated');
  }
});

// Function to start the server (called from index.js in production)
function startServer() {
  documents.listen(connection);
  if (connection.listen) {
    connection.listen();
  }
}

// Only auto-start in production, not in tests
if (typeof jest === 'undefined' && process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { connection, documents, globalSettings };
