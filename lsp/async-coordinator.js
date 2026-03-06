/**
 * Async Coordinator
 * Manages concurrent analysis requests, prevents duplicates
 */

class AsyncCoordinator {
  constructor(connection, config, agents) {
    this.connection = connection;
    this.config = config;
    this.agents = agents; // Will be injected later
    this.queue = [];
    this.running = false;
    this.fileTimestamps = new Map();
  }

  enqueue(task) {
    const { uri, timestamp } = task;

    // Check if we already have a pending task for this file
    const existingIndex = this.queue.findIndex((t) => t.uri === uri);
    if (existingIndex !== -1) {
      // Replace old task with new one
      this.queue[existingIndex] = task;
      this.connection.console.log(`Updated queued task for ${uri}`);
    } else {
      this.queue.push(task);
      this.connection.console.log(`Queued analysis for ${uri}`);
    }

    // Start processing if not already running
    if (!this.running) {
      this.startProcessing();
    }
  }

  async startProcessing() {
    if (this.running || this.queue.length === 0) {
      return;
    }

    this.running = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      try {
        await this.processTask(task);
      } catch (error) {
        this.connection.console.error(
          `Error processing task for ${task.uri}: ${error.message}`
        );
      }
    }

    this.running = false;
  }

  async processTask(task) {
    const { uri, content, language, depth } = task;

    this.connection.console.log(
      `Analyzing ${uri} (depth: ${depth})`
    );

    // Skip analysis for non-code files
    if (!this.isCodeFile(language)) {
      return;
    }

    // Call agents if available
    if (this.agents && this.agents.analyzeSecurityAndArchitecture) {
      try {
        const results = await this.agents.analyzeSecurityAndArchitecture(
          uri,
          content,
          { depth }
        );

        // Results will be published by caller
        return results;
      } catch (error) {
        this.connection.console.error(`Analysis failed: ${error.message}`);
        throw error;
      }
    }
  }

  isCodeFile(languageId) {
    const codeLanguages = [
      'typescript',
      'javascript',
      'python',
      'go',
      'rust',
      'java',
      'cpp',
      'csharp',
    ];
    return codeLanguages.includes(languageId);
  }
}

module.exports = AsyncCoordinator;
