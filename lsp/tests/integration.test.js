const { connection, documents } = require('../server');

describe('LSP Server Integration', () => {
  test('Server initializes with all components', () => {
    expect(connection).toBeDefined();
    expect(documents).toBeDefined();
    expect(connection.onInitialize).toBeDefined();
    expect(connection.onInitialized).toBeDefined();
  });

  test('Connection has all required event handlers', () => {
    expect(connection.onInitialize).toBeDefined();
    expect(connection.onInitialized).toBeDefined();
    expect(connection.onDidChangeConfiguration).toBeDefined();
    expect(connection.onDidOpenTextDocument).toBeDefined();
    expect(connection.onDidChangeTextDocument).toBeDefined();
    expect(connection.onDidSaveTextDocument).toBeDefined();
  });

  test('Documents manager is properly initialized', () => {
    expect(documents.onDidOpen).toBeDefined();
    expect(documents.onDidChangeContent).toBeDefined();
    expect(documents.onDidSave).toBeDefined();
  });

  test('Configuration is loaded with defaults', () => {
    const { globalSettings } = require('../server');
    expect(globalSettings).toBeDefined();
    expect(globalSettings.analysisDepth).toBe('balanced');
    expect(globalSettings.realTimeDiagnostics).toBe(true);
  });

  test('All components can be required without errors', () => {
    const FileMonitor = require('../file-monitor');
    const AsyncCoordinator = require('../async-coordinator');
    const DiagnosticsBuilder = require('../diagnostics-builder');

    expect(FileMonitor).toBeDefined();
    expect(AsyncCoordinator).toBeDefined();
    expect(DiagnosticsBuilder).toBeDefined();
  });
});
