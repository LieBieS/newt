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
const Config = require('./config');
const FileMonitor = require('./file-monitor');
const AsyncCoordinator = require('./async-coordinator');
const DiagnosticsBuilder = require('./diagnostics-builder');

// Create connection for Node IPC (or mocked for testing)
let connection;
if (typeof jest !== 'undefined') {
  // For testing, create a mock connection
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
  // For production, use stdio
  try {
    connection = createConnection(process.stdin, process.stdout);
  } catch (error) {
    console.error('Failed to create connection:', error.message);
    process.exit(1);
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

// Initialize components
const config = new Config().load();
const asyncCoordinator = new AsyncCoordinator(connection, config);
const fileMonitor = new FileMonitor(connection, documents, asyncCoordinator, config);
const diagnosticsBuilder = new DiagnosticsBuilder();

// Track diagnostics per file
const fileDiagnostics = new Map();

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
  // Start monitoring files
  fileMonitor.start();
});

// Mock agent adapter (will be replaced with real agents in Task 7)
const mockAgents = {
  analyzeSecurityAndArchitecture: async (uri, content, options) => {
    // Mock: return empty results for now
    return {
      security: [],
      architecture: [],
    };
  },
};

asyncCoordinator.agents = mockAgents;

// Set up task completion callback to publish diagnostics
asyncCoordinator.onTaskComplete = async (task, results) => {
  if (results) {
    const diagnostics = diagnosticsBuilder.mergeResults(
      results.security,
      results.architecture
    );

    connection.sendDiagnostics({
      uri: task.uri,
      diagnostics,
    });

    fileDiagnostics.set(task.uri, diagnostics);
  }
};

// Document open handler
documents.onDidOpen((event) => {
  if (connection.console && connection.console.log) {
    connection.console.log(`Document opened: ${event.document.uri}`);
  }
  // Handled by FileMonitor via fileMonitor.start()
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
    // Handled by FileMonitor via fileMonitor.start()
  }, 500);
});

// Document save handler
documents.onDidSave((event) => {
  if (connection.console && connection.console.log) {
    connection.console.log(`Document saved: ${event.document.uri}`);
  }
  // Handled by FileMonitor via fileMonitor.start()
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

module.exports = {
  connection,
  documents,
  globalSettings,
  asyncCoordinator,
  fileMonitor,
  diagnosticsBuilder,
  startServer,
};
