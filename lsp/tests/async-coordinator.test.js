const AsyncCoordinator = require('../async-coordinator');

describe('AsyncCoordinator', () => {
  let coordinator;
  let mockConnection;

  beforeEach(() => {
    mockConnection = {
      console: { log: jest.fn(), error: jest.fn() },
    };
    coordinator = new AsyncCoordinator(mockConnection, { analysisDepth: 'balanced' });
    // Mock startProcessing to prevent auto-processing in tests
    coordinator.startProcessing = jest.fn();
  });

  test('AsyncCoordinator initializes with empty queue', () => {
    expect(coordinator.queue).toBeDefined();
    expect(coordinator.queue.length).toBe(0);
  });

  test('enqueue() adds task to queue', () => {
    const task = { uri: 'file:///test.ts', content: 'const x = 1;' };
    coordinator.enqueue(task);
    expect(coordinator.queue.length).toBe(1);
  });

  test('enqueue() prevents duplicate analysis for same file', () => {
    const task1 = { uri: 'file:///test.ts', content: 'const x = 1;' };
    const task2 = { uri: 'file:///test.ts', content: 'const x = 2;' };

    coordinator.enqueue(task1);
    coordinator.enqueue(task2);

    // Should only have 1 task (second replaces first)
    expect(coordinator.queue.length).toBe(1);
    expect(coordinator.queue[0].content).toBe('const x = 2;');
  });

  test('isCodeFile() identifies code files', () => {
    expect(coordinator.isCodeFile('typescript')).toBe(true);
    expect(coordinator.isCodeFile('javascript')).toBe(true);
    expect(coordinator.isCodeFile('python')).toBe(true);
    expect(coordinator.isCodeFile('markdown')).toBe(false);
    expect(coordinator.isCodeFile('plaintext')).toBe(false);
  });

  test('enqueue() logs task addition', () => {
    coordinator.enqueue({ uri: 'file:///test.ts', content: 'code' });
    expect(mockConnection.console.log).toHaveBeenCalledWith(
      expect.stringContaining('Queued analysis')
    );
  });

  test('enqueue() updates task for duplicate URI', () => {
    coordinator.enqueue({ uri: 'file:///test.ts', content: 'v1' });
    coordinator.enqueue({ uri: 'file:///test.ts', content: 'v2' });

    expect(mockConnection.console.log).toHaveBeenCalledWith(
      expect.stringContaining('Updated queued task')
    );
  });
});
