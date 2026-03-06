/**
 * File Monitor
 * Watches for file changes and triggers diagnostics
 */

class FileMonitor {
  constructor(connection, documents, asyncCoordinator) {
    this.connection = connection;
    this.documents = documents;
    this.asyncCoordinator = asyncCoordinator;
  }

  start() {
    // TODO: Wire up document change listener
  }
}

module.exports = FileMonitor;
