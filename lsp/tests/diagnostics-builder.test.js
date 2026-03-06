const DiagnosticsBuilder = require('../diagnostics-builder');
const { DiagnosticSeverity } = require('vscode-languageserver');

describe('DiagnosticsBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new DiagnosticsBuilder();
  });

  test('buildFromSecurityAudit() converts security issues to diagnostics', () => {
    const issues = [
      {
        type: 'SQL_INJECTION',
        line: 5,
        column: 10,
        message: 'Potential SQL injection vulnerability',
        severity: 'critical',
      },
    ];

    const diagnostics = builder.buildFromSecurityAudit(issues);

    expect(diagnostics.length).toBe(1);
    expect(diagnostics[0].message).toContain('SQL injection');
    expect(diagnostics[0].severity).toBe(DiagnosticSeverity.Error);
  });

  test('buildFromArchitectureAnalysis() converts arch issues to diagnostics', () => {
    const issues = [
      {
        type: 'CIRCULAR_DEPENDENCY',
        line: 12,
        column: 0,
        message: 'Circular dependency detected',
        severity: 'warning',
      },
    ];

    const diagnostics = builder.buildFromArchitectureAnalysis(issues);

    expect(diagnostics.length).toBe(1);
    expect(diagnostics[0].message).toContain('Circular');
  });

  test('convertSeverity() maps Newt severity to LSP severity', () => {
    expect(builder.convertSeverity('critical')).toBe(DiagnosticSeverity.Error);
    expect(builder.convertSeverity('error')).toBe(DiagnosticSeverity.Error);
    expect(builder.convertSeverity('warning')).toBe(DiagnosticSeverity.Warning);
    expect(builder.convertSeverity('info')).toBe(DiagnosticSeverity.Information);
    expect(builder.convertSeverity('hint')).toBe(DiagnosticSeverity.Hint);
  });

  test('buildDiagnostic() creates properly formatted LSP diagnostic', () => {
    const issue = {
      line: 5,
      column: 10,
      message: 'Test issue',
      severity: 'warning',
      type: 'TEST',
    };

    const diagnostic = builder.buildDiagnostic(issue, 'newt-security');

    expect(diagnostic.range).toBeDefined();
    expect(diagnostic.range.start.line).toBe(4); // 0-indexed
    expect(diagnostic.range.start.character).toBe(10);
    expect(diagnostic.message).toBe('Test issue');
    expect(diagnostic.severity).toBe(DiagnosticSeverity.Warning);
    expect(diagnostic.source).toBe('newt-security');
    expect(diagnostic.code).toBe('TEST');
  });

  test('buildDiagnostic() defaults missing fields', () => {
    const issue = {
      line: 1,
      column: 0,
      type: 'ISSUE',
    };

    const diagnostic = builder.buildDiagnostic(issue);

    expect(diagnostic.message).toContain('ISSUE');
    expect(diagnostic.severity).toBe(DiagnosticSeverity.Warning);
    expect(diagnostic.source).toBe('newt');
  });

  test('mergeResults() combines security and architecture diagnostics', () => {
    const securityResults = [
      { line: 1, column: 0, message: 'Security issue', severity: 'critical', type: 'SEC' },
    ];
    const architectureResults = [
      { line: 2, column: 0, message: 'Arch issue', severity: 'warning', type: 'ARCH' },
    ];

    const allDiagnostics = builder.mergeResults(securityResults, architectureResults);

    expect(allDiagnostics.length).toBe(2);
    expect(allDiagnostics[0].source).toBe('newt-security');
    expect(allDiagnostics[1].source).toBe('newt-architecture');
  });
});
