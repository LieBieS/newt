/**
 * File Monitor
 * Watches for file changes and triggers diagnostics
 */

class FileMonitor {
  constructor(connection, documents, asyncCoordinator, config) {
    this.connection = connection;
    this.documents = documents;
    this.asyncCoordinator = asyncCoordinator;
    this.config = config;
    this.changeTimeout = null;
  }

  start() {
    this.documents.onDidOpen((event) => {
      this.onDocumentOpen(event);
    });

    this.documents.onDidChange((event) => {
      this.onDocumentChange(event);
    });

    this.documents.onDidSave((event) => {
      this.onDocumentSave(event);
    });

    this.connection.console.log('FileMonitor started');
  }

  onDocumentOpen(event) {
    const uri = event.document.uri;
    this.connection.console.log(`Document opened: ${uri}`);

    if (this.config.realTimeDiagnostics) {
      this.queueAnalysis(uri, event.document);
    }
  }

  onDocumentChange(event) {
    const uri = event.document.uri;

    // Debounce rapid changes
    clearTimeout(this.changeTimeout);
    this.changeTimeout = setTimeout(() => {
      this.connection.console.log(`Document changed: ${uri}`);

      if (this.config.realTimeDiagnostics) {
        this.queueAnalysis(uri, event.document);
      }
    }, 500);
  }

  onDocumentSave(event) {
    const uri = event.document.uri;
    this.connection.console.log(`Document saved: ${uri}`);

    // Always analyze on save
    this.queueAnalysis(uri, event.document);
  }

  queueAnalysis(uri, document) {
    const task = {
      uri,
      content: document.getText(),
      language: document.languageId,
      depth: this.config.analysisDepth,
      timestamp: Date.now(),
    };

    this.asyncCoordinator.enqueue(task);
  }
}

module.exports = FileMonitor;
