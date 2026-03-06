# Newt LSP Server - Quick Start (30 seconds)

Get Newt's real-time code analysis in your editor **in 3 steps**.

## Step 1: Start the Server

```bash
cd /path/to/newt
npm run lsp:server
```

Wait for:
```
✓ Server initialized and listening
```

## Step 2: Configure Your Editor

**Neovim (nvim-lspconfig):**
```lua
-- Add to ~/.config/nvim/init.lua
require('lspconfig').newt.setup({
  cmd = { 'node', '/absolute/path/to/newt/lsp/index.js' }
})
```

**Vim (coc.nvim):**
```vim
:CocConfig
```
```json
{
  "languageserver": {
    "newt": {
      "command": "node",
      "args": ["/absolute/path/to/newt/lsp/index.js"]
    }
  }
}
```

**VS Code** (coming Phase 2)

**Emacs (eglot):**
```lisp
(add-to-list 'eglot-server-programs
  '(typescript-mode . ("node" "/absolute/path/to/newt/lsp/index.js")))
```

## Step 3: Open a Code File

Open any `.ts`, `.js`, or `.py` file and watch for diagnostics!

```
🔐 Security: Potential SQL injection at line 45
🏗️ Architecture: Circular dependency detected at line 12
```

---

## Common Commands

```bash
# Start with debug logging
npm run lsp:server -- --debug

# Custom port
npm run lsp:server -- --port 9091

# Show help
npm run lsp:server -- --help
```

## Run Tests

```bash
# All LSP tests
npm run lsp:test

# Watch mode
npm run lsp:test:watch
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Editor can't connect | Check server is running, verify port 9090 |
| No diagnostics | Ensure file is `.ts`, `.js`, or `.py` |
| Slow analysis | Use `analysisDepth: 'fast'` in settings |
| Server won't start | Kill old process: `pkill -f "lsp/index.js"` |

---

## Next Steps

- **Full Tutorial:** [lsp-tutorial.md](lsp-tutorial.md)
- **Architecture:** [lsp/README.md](../lsp/README.md)
- **Troubleshooting:** [lsp-tutorial.md#troubleshooting](lsp-tutorial.md#troubleshooting)

**Questions?** See the full tutorial or open an issue on GitHub.

---

## What's Supported

✅ TypeScript (`.ts`)
✅ JavaScript (`.js`)
✅ Python (`.py`)
✅ Go (`.go`)
✅ Rust (`.rs`)
✅ Java (`.java`)
✅ C++ (`.cpp`)
✅ C# (`.cs`)

**Phase 1 Features:**
- Real-time security diagnostics
- Architecture pattern detection
- Non-blocking background analysis

**Phase 2 Coming:**
- Command routing (/review, /brainstorm)
- Real agent integration
- Performance analysis
- Code actions and fixes
