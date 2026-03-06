/**
 * Configuration Loader
 * Loads Newt LSP configuration from editor settings and project files
 */

class Config {
  constructor() {
    this.defaults = {
      analysisDepth: 'balanced',
      realTimeDiagnostics: true,
      commandTimeout: 30000,
      port: 9090,
    };
  }

  load() {
    return this.defaults;
  }
}

module.exports = Config;
