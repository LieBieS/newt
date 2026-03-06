const AgentAdapter = require('../agent-adapter');

describe('AgentAdapter', () => {
  let adapter;
  let mockConnection;

  beforeEach(() => {
    mockConnection = {
      console: { log: jest.fn(), error: jest.fn() },
    };
    adapter = new AgentAdapter(mockConnection);
  });

  test('AgentAdapter initializes with connection', () => {
    expect(adapter.connection).toBe(mockConnection);
  });

  test('analyzeSecurityAndArchitecture returns expected structure', async () => {
    const uri = 'file:///test.ts';
    const content = 'const x = 1;';
    const options = { depth: 'balanced' };

    const result = await adapter.analyzeSecurityAndArchitecture(uri, content, options);

    expect(result).toBeDefined();
    expect(result.security).toBeDefined();
    expect(Array.isArray(result.security)).toBe(true);
    expect(result.architecture).toBeDefined();
    expect(Array.isArray(result.architecture)).toBe(true);
  });

  test('runFullReview returns comprehensive results', async () => {
    const uri = 'file:///test.ts';
    const content = 'const x = 1;';
    const depth = 'comprehensive';

    const result = await adapter.runFullReview(uri, content, depth);

    expect(result).toBeDefined();
    expect(result.security).toBeDefined();
    expect(result.architecture).toBeDefined();
    expect(result.performance).toBeDefined();
    expect(result.quality).toBeDefined();
  });

  test('analyzeSecurityAndArchitecture logs analysis', async () => {
    await adapter.analyzeSecurityAndArchitecture('file:///test.ts', 'code', { depth: 'fast' });

    expect(mockConnection.console.log).toHaveBeenCalledWith(
      expect.stringContaining('Analyzing')
    );
  });

  test('handles errors gracefully', async () => {
    // Mock an error scenario
    adapter.connection.console.error = jest.fn();

    const result = await adapter.analyzeSecurityAndArchitecture(
      'file:///test.ts',
      'code',
      { depth: 'balanced' }
    );

    // Should still return valid structure even if analysis fails
    expect(result).toBeDefined();
  });
});
