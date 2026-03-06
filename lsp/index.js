#!/usr/bin/env node

/**
 * Newt LSP Server
 * Entry point for starting the language server
 *
 * Usage:
 *   node lsp/index.js [--port PORT] [--config PATH] [--debug]
 *   OR
 *   npm run lsp:server -- --port 9090
 */

const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { startServer } = require('./server');

// Parse command-line arguments
const argv = yargs(hideBin(process.argv))
  .option('port', {
    alias: 'p',
    describe: 'Port to listen on',
    default: 9090,
    type: 'number',
  })
  .option('config', {
    alias: 'c',
    describe: 'Path to config file',
    type: 'string',
  })
  .option('debug', {
    alias: 'd',
    describe: 'Enable debug logging',
    default: false,
    type: 'boolean',
  })
  .help()
  .alias('help', 'h')
  .parseSync();

// Set environment based on debug flag
if (argv.debug) {
  process.env.DEBUG = 'newt:*';
}

// Log startup information
console.log('');
console.log('🚀 Newt LSP Server starting...');
console.log(`📡 Port: ${argv.port}`);
console.log(`📝 Log level: ${argv.debug ? 'debug' : 'info'}`);
if (argv.config) {
  console.log(`⚙️  Config file: ${argv.config}`);
}
console.log('');

// Start the server
try {
  startServer();
  console.log('✓ Server initialized and listening\n');
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
}

// Graceful shutdown handlers
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
