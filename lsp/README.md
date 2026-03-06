# Newt LSP Server

Language Server Protocol implementation for Newt.

## Running the Server

```bash
node lsp/server.js --port 9090
```

## Testing

```bash
npm run test -- lsp/tests/
```

## Architecture

- **server.js**: Main LSP server, protocol handlers
- **file-monitor.js**: File watcher, triggers diagnostics
- **async-coordinator.js**: Manages concurrent analysis
- **command-router.js**: Routes /review commands to agents
- **config.js**: Configuration loading
- **diagnostics-builder.js**: Translates output to LSP format
