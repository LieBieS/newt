/**
 * Diagnostics Builder
 * Translates Newt agent output to LSP diagnostic format
 */

const { DiagnosticSeverity } = require('vscode-languageserver');

class DiagnosticsBuilder {
  buildFromSecurityAudit(issues) {
    return issues.map((issue) =>
      this.buildDiagnostic(issue, 'newt-security')
    );
  }

  buildFromArchitectureAnalysis(issues) {
    return issues.map((issue) =>
      this.buildDiagnostic(issue, 'newt-architecture')
    );
  }

  buildDiagnostic(issue, source = 'newt') {
    const {
      line = 1,
      column = 0,
      endLine = line,
      endColumn = column + 10,
      message,
      severity = 'warning',
      type,
    } = issue;

    return {
      range: {
        start: {
          line: line - 1,      // Convert to 0-indexed
          character: column,
        },
        end: {
          line: endLine - 1,   // Convert to 0-indexed
          character: endColumn,
        },
      },
      message: message || `${type}: Issue detected`,
      severity: this.convertSeverity(severity),
      source: source,
      code: type,
    };
  }

  convertSeverity(severity) {
    switch (severity?.toLowerCase()) {
      case 'critical':
      case 'error':
        return DiagnosticSeverity.Error;
      case 'warning':
      case 'major':
        return DiagnosticSeverity.Warning;
      case 'info':
      case 'minor':
        return DiagnosticSeverity.Information;
      case 'hint':
        return DiagnosticSeverity.Hint;
      default:
        return DiagnosticSeverity.Warning;
    }
  }

  mergeResults(securityResults, architectureResults) {
    const allDiagnostics = [
      ...this.buildFromSecurityAudit(securityResults || []),
      ...this.buildFromArchitectureAnalysis(architectureResults || []),
    ];

    return allDiagnostics;
  }
}

module.exports = DiagnosticsBuilder;
