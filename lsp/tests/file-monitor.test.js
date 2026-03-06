const FileMonitor = require('../file-monitor');

describe('FileMonitor', () => {
  let monitor;
  let mockConnection;
  let mockDocuments;
  let mockCoordinator;

  beforeEach(() => {
    mockConnection = {
      console: { log: jest.fn() },
      onDidOpenTextDocument: jest.fn(),
      onDidChangeTextDocument: jest.fn(),
      onDidSaveTextDocument: jest.fn(),
    };
    mockDocuments = {
      all: jest.fn(() => []),
      onDidOpen: jest.fn(),
      onDidChange: jest.fn(),
      onDidSave: jest.fn(),
    };
    mockCoordinator = {
      enqueue: jest.fn(),
    };

    monitor = new FileMonitor(mockConnection, mockDocuments, mockCoordinator, {
      realTimeDiagnostics: true,
      analysisDepth: 'balanced',
    });
  });

  test('FileMonitor initializes with connection, documents, coordinator', () => {
    expect(monitor.connection).toBe(mockConnection);
    expect(monitor.documents).toBe(mockDocuments);
    expect(monitor.asyncCoordinator).toBe(mockCoordinator);
  });

  test('start() registers document open listener', () => {
    monitor.start();
    expect(mockDocuments.onDidOpen).toHaveBeenCalled();
  });

  test('start() registers document change listener', () => {
    monitor.start();
    expect(mockDocuments.onDidChange).toHaveBeenCalled();
  });

  test('start() registers document save listener', () => {
    monitor.start();
    expect(mockDocuments.onDidSave).toHaveBeenCalled();
  });

  test('onDocumentSave queues analysis task', () => {
    monitor.start();

    // Get the registered callback
    const saveCallback = mockDocuments.onDidSave.mock.calls[0][0];

    // Simulate document save
    saveCallback({
      document: {
        uri: 'file:///test.ts',
        languageId: 'typescript',
        getText: () => 'const x = 1;',
      },
    });

    expect(mockCoordinator.enqueue).toHaveBeenCalled();
    const task = mockCoordinator.enqueue.mock.calls[0][0];
    expect(task.uri).toBe('file:///test.ts');
  });

  test('queueAnalysis creates proper task object', () => {
    monitor.queueAnalysis('file:///test.ts', {
      getText: () => 'const x = 1;',
      languageId: 'typescript',
    });

    expect(mockCoordinator.enqueue).toHaveBeenCalled();
    const task = mockCoordinator.enqueue.mock.calls[0][0];

    expect(task.uri).toBe('file:///test.ts');
    expect(task.content).toBe('const x = 1;');
    expect(task.language).toBe('typescript');
    expect(task.depth).toBe('balanced');
    expect(task.timestamp).toBeDefined();
  });
});
