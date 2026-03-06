# Newt LSP Server Tutorial

**Learn how to set up and use Newt's Language Server Protocol server for real-time code analysis.**

## Table of Contents

1. [What is LSP?](#what-is-lsp)
2. [Why Use Newt LSP?](#why-use-newt-lsp)
3. [Getting Started](#getting-started)
4. [Editor Setup](#editor-setup)
5. [Configuration](#configuration)
6. [Common Tasks](#common-tasks)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Usage](#advanced-usage)

---

## What is LSP?

**Language Server Protocol (LSP)** is an open standard that allows editors and IDEs to communicate with language servers for intelligent code analysis.

### Traditional Approach
```
Editor A → Language Features ← Editor A's Custom Implementation
Editor B → Language Features ← Editor B's Custom Implementation
Editor C → Language Features ← Editor C's Custom Implementation
```

### LSP Approach
```
Editor A ─┐
Editor B ─┼→ LSP Server (One Implementation)
Editor C ─┘
```

Instead of implementing language features separately for each editor, LSP decouples the analysis engine from the editor:
- **Editors** (VS Code, Vim, Neovim, etc.) act as LSP clients
- **Language Servers** (like Newt) provide intelligent analysis
- **LSP Protocol** standardizes communication

### What Can LSP Servers Do?

✅ Diagnostics (show errors and warnings)
✅ Code completion (suggest fixes)
✅ Go to definition (jump to source)
✅ Find references (locate usage)
✅ Hover information (show details)
✅ Format code (auto-formatting)
✅ Rename symbols (refactoring)

**Newt LSP (Phase 1) focuses on:** Diagnostics

**Newt LSP (Phase 2) will add:** Command routing, refactoring hints

---

## Why Use Newt LSP?

### Vs. Plugin-Based Approach

| Feature | Plugins | LSP |
|---------|---------|-----|
| VS Code support | ✅ | ✅ |
| Vim/Neovim support | ❌ | ✅ |
| Sublime Text support | ❌ | ✅ |
| JetBrains IDE support | ❌ | ✅ |
| Setup complexity | Medium | Simple |
| Real-time analysis | ✅ | ✅ |
| Consistent experience | ❌ | ✅ |

### Key Benefits

**1. Editor Independence**
- Use Newt in ANY LSP-compatible editor
- Same analysis, same results everywhere

**2. Real-Time Analysis**
- Get diagnostics as you type
- Non-blocking background processing
- Configurable analysis depth

**3. Lightweight Setup**
- No plugin installation required
- Just one LSP server running
- Minimal resource usage

**4. Unified Experience**
- Consistent results across all editors
- Single configuration point
- Easy to update (restart server once)

---

## Getting Started

### Prerequisites

- Node.js v18+
- Newt repository cloned
- LSP-compatible editor installed

### Step 1: Install Dependencies

```bash
cd /path/to/newt
npm install
```

### Step 2: Start the LSP Server

```bash
npm run lsp:server
```

You should see:
```
🚀 Newt LSP Server starting...
📡 Port: 9090
📝 Log level: info

✓ Server initialized and listening
```

**Keep this terminal running** — your editor will connect to it.

### Step 3: Configure Your Editor

Choose your editor below for specific instructions.

---

## Editor Setup

### VS Code (Using Settings)

**For Phase 1** (basic LSP support), VS Code support is being developed.

**Workaround - Use Command Palette:**
1. Open Command Palette (`Ctrl+Shift+P`)
2. Search for "LSP Client"
3. Follow the extension's instructions to add:

```json
{
  "languageServerProtocol.servers": [
    {
      "languageId": "typescript",
      "command": "node",
      "args": ["/absolute/path/to/newt/lsp/index.js"]
    }
  ]
}
```

**Full VS Code Extension** coming in Phase 2!

### Neovim (nvim-lspconfig)

**Install LSP client (if not already installed):**
```bash
# Using vim-plug
Plug 'neovim/nvim-lspconfig'

# Using packer
use 'neovim/nvim-lspconfig'
```

**Configure LSP:**
```lua
-- ~/.config/nvim/init.lua
require('lspconfig.configs').newt = {
  default_config = {
    cmd = { 'node', '/absolute/path/to/newt/lsp/index.js' },
    filetypes = { 'typescript', 'javascript', 'python', 'go', 'rust' },
    root_dir = require('lspconfig').util.root_pattern('package.json', '.git'),
    settings = {
      newt = {
        analysisDepth = 'balanced',
        realTimeDiagnostics = true,
      }
    }
  }
}

require('lspconfig').newt.setup{}
```

**Verify connection:**
```vim
:LspInfo
```

You should see:
```
Server: newt
  client_id: 1
  pid: 12345
  cmd: node /absolute/path/to/newt/lsp/index.js
  root_dir: /path/to/project
  initialized: true
```

### Vim (coc.nvim)

**Install coc.nvim (if not already installed):**
```vim
" ~/.vimrc
Plug 'neoclide/coc.nvim', {'branch': 'release'}
```

**Configure in coc-settings.json:**
```bash
:CocConfig
```

Add:
```json
{
  "languageserver": {
    "newt": {
      "command": "node",
      "args": ["/absolute/path/to/newt/lsp/index.js"],
      "filetypes": ["typescript", "javascript", "python", "go", "rust"],
      "rootPatterns": ["package.json", ".git"]
    }
  }
}
```

**Verify connection:**
```vim
:CocList services
```

### Emacs (eglot)

**Install eglot (if not already installed):**
```lisp
;; ~/.emacs.d/init.el
(require 'eglot)
```

**Configure:**
```lisp
(add-to-list 'eglot-server-programs
             '(typescript-mode . ("node" "/absolute/path/to/newt/lsp/index.js")))

(add-hook 'typescript-mode-hook 'eglot-ensure)
(add-hook 'javascript-mode-hook 'eglot-ensure)
(add-hook 'python-mode-hook 'eglot-ensure)
```

**Verify connection:**
```lisp
M-x eglot
```

---

## Configuration

### Command-Line Options

**Start the server with options:**
```bash
npm run lsp:server -- [OPTIONS]
```

**Available options:**

| Option | Short | Default | Purpose |
|--------|-------|---------|---------|
| `--port` | `-p` | 9090 | Port to listen on |
| `--config` | `-c` | (none) | Config file path |
| `--debug` | `-d` | false | Enable debug logging |
| `--help` | `-h` | (none) | Show help message |

**Examples:**
```bash
# Use custom port
npm run lsp:server -- --port 9091

# Enable debug mode
npm run lsp:server -- --debug

# Custom port + debug
npm run lsp:server -- --port 9091 --debug
```

### Editor Settings

Configure analysis behavior via editor settings:

```json
{
  // Analysis depth: fast, balanced, comprehensive
  "newt.analysisDepth": "balanced",

  // Enable/disable real-time diagnostics
  "newt.realTimeDiagnostics": true,

  // Max analysis time (ms)
  "newt.commandTimeout": 30000,

  // Focus on specific areas
  "newt.focusAreas": ["security", "architecture"],

  // Ignore patterns
  "newt.ignorePatterns": [
    "node_modules/**",
    "dist/**",
    "build/**",
    "*.test.ts"
  ]
}
```

### Analysis Depth Modes

**Fast** (< 2 seconds)
- Quick security checks
- Basic architecture patterns
- Obvious issues only
- Best for: Large files, quick feedback

**Balanced** (5-10 seconds) [Default]
- Full security analysis
- Architecture patterns
- Performance checks
- Best for: General development

**Comprehensive** (30+ seconds)
- All analyses
- Deep architecture review
- Performance profiling
- Cross-file analysis
- Best for: Code review, pre-commit checks

---

## Common Tasks

### Enable Diagnostics for a File

When you open a file (`.ts`, `.js`, `.py`, etc.), Newt automatically analyzes it if `realTimeDiagnostics` is enabled.

**Neovim example:**
```vim
" Open file
:edit src/auth.ts

" Wait 1-2 seconds... diagnostics appear!
" View diagnostics
:Telescope lsp_diagnostics
```

### View Diagnostic Details

**VS Code:**
- Hover over underlined code
- Open problems panel (`Ctrl+Shift+M`)

**Neovim:**
```vim
" Show all diagnostics
:telescope lsp_diagnostics

" Show diagnostics for current line
:lua vim.diagnostic.open_float()
```

**Vim (coc.nvim):**
```vim
" Show all diagnostics
:CocDiagnostics

" Show diagnostics for line
:CocDiagnosticNext
```

### Adjust Analysis Depth Per File

**For resource-heavy files** (e.g., large bundles):

**Neovim:**
```lua
-- ~/.config/nvim/init.lua
vim.api.nvim_create_autocmd("FileType", {
  pattern = "typescript",
  callback = function()
    if vim.fn.getfsize(vim.fn.expand('%')) > 1000000 then
      -- Large file: use fast analysis
      vim.api.nvim_set_option_value('lsp', {analysisDepth = 'fast'}, {})
    end
  end
})
```

### Filter Diagnostics

**Show only security issues:**

**Neovim:**
```lua
-- ~/.config/nvim/init.lua
vim.diagnostic.config({
  virtual_text = {
    source = "if_many",
    prefix = function(diagnostic)
      if diagnostic.source == "newt-security" then
        return "🔐"
      elseif diagnostic.source == "newt-architecture" then
        return "🏗️"
      end
    end
  }
})
```

### Monitor Server Performance

**Check server logs:**
```bash
# While running, open new terminal
npm run lsp:server -- --debug
```

This shows:
- Files being analyzed
- Analysis timing
- Errors and issues

**Example output:**
```
Document opened: file:///home/user/project/src/auth.ts
Analyzing file:///home/user/project/src/auth.ts (depth: balanced)
Analysis completed in 1.23s
  - Security: 2 issues found
  - Architecture: 1 issue found
```

---

## Troubleshooting

### Server Won't Start

**Error:** "Connection input stream is not set"

**Solution:** Server needs to be started fresh
```bash
# Kill existing process
pkill -f "node lsp/index.js"

# Start fresh
npm run lsp:server
```

### Editor Can't Connect

**Symptom:** No diagnostics appearing

**Check connection:**
```bash
# See if server is running
ps aux | grep "lsp/index.js"

# Test manually
curl http://localhost:9090
# Should hang (waiting for LSP client)
```

**Fix:**
1. Ensure server is running: `npm run lsp:server`
2. Check port is correct in editor config (default: 9090)
3. Check firewall isn't blocking port
4. Try different port: `npm run lsp:server -- --port 9091`

### No Diagnostics for a File

**Check file type is supported:**
- Supported: `.ts`, `.js`, `.py`, `.go`, `.rs`, `.java`, `.cpp`, `.cs`
- Not supported: `.md`, `.txt`, `.json`, `.yaml` (yet)

**Enable real-time diagnostics:**
```json
{
  "newt.realTimeDiagnostics": true
}
```

**Check log level:**
```bash
npm run lsp:server -- --debug
```

Look for:
```
Analyzing file:///path/to/file.ts
```

If you see "Skipping non-code file", the file type isn't supported yet.

### Slow Analysis

**Problem:** Analysis taking too long

**Solution 1: Reduce depth**
```json
{
  "newt.analysisDepth": "fast"
}
```

**Solution 2: Exclude large files**
```json
{
  "newt.ignorePatterns": ["*.bundle.js", "dist/**"]
}
```

**Solution 3: Check system resources**
```bash
# macOS
top

# Linux
htop

# Windows
tasklist
```

### False Positives

**Problem:** Server reporting issues that aren't real

**This is normal in Phase 1!** Real agent integration coming Phase 2.

**Report issues:**
- File: `/path/to/newt/issues/`
- Include file type and code snippet
- Include full diagnostic message

---

## Advanced Usage

### Environment Variables

Control server behavior via environment variables:

```bash
# Enable debug mode
DEBUG=newt:* npm run lsp:server

# Custom config
NEWT_CONFIG=/path/to/config.yml npm run lsp:server

# Log file
NEWT_LOG_FILE=/tmp/newt.log npm run lsp:server
```

### Custom Configuration File

Create `.newt/config.yml`:
```yaml
lsp:
  enabled: true
  port: 9090

analysis:
  depth: balanced
  timeout: 30000

realtime:
  enabled: true
  debounce: 500
  ignorePatterns:
    - node_modules/**
    - dist/**
    - build/**
```

### Integration with CI/CD

**Use LSP server in pre-commit hooks:**
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Start LSP server if not running
if ! pgrep -f "lsp/index.js"; then
  npm run lsp:server > /dev/null 2>&1 &
  sleep 2
fi

# Analyze staged files
for file in $(git diff --cached --name-only); do
  if [[ "$file" == *.ts ]] || [[ "$file" == *.js ]]; then
    echo "Analyzing $file..."
    # Diagnostic publishing happens automatically
  fi
done
```

### Multiple LSP Servers

Run multiple instances for different projects:

```bash
# Project A - port 9090
cd ~/projects/project-a
npm run lsp:server -- --port 9090

# Project B - port 9091 (different terminal)
cd ~/projects/project-b
npm run lsp:server -- --port 9091
```

### Extend with Plugins

Phase 2 will support:
- Custom diagnostic providers
- Plugin architecture
- User-defined rules
- Integration with other LSP servers

---

## What's Next?

### Phase 2 (Upcoming)

- ✅ VS Code extension in marketplace
- ✅ Command routing (/review, /brainstorm, etc.)
- ✅ Real agent integration
- ✅ Performance analysis
- ✅ Quick fixes and code actions

### Reporting Issues

Found a bug or have a suggestion?

1. **Check existing issues:** [GitHub Issues](https://github.com/newt/issues)
2. **Provide details:**
   - Editor and version
   - LSP server version
   - Minimal reproduction
   - Expected vs actual behavior
3. **Include logs:**
   ```bash
   npm run lsp:server -- --debug 2>&1 | tee lsp.log
   ```

### Getting Help

- 📖 **Docs:** `docs/` directory
- 💬 **Discussions:** GitHub Discussions
- 🐛 **Issues:** Report bugs
- 📺 **Examples:** `examples/` directory

---

## FAQ

**Q: Is the LSP server production-ready?**
A: Phase 1 includes the complete protocol implementation and real-time diagnostics framework. Phase 2 (coming soon) integrates real agents for accurate analysis.

**Q: Can I use LSP and plugins together?**
A: Yes! The plugin approach and LSP are complementary. Use whichever fits your workflow.

**Q: What about performance?**
A: LSP runs in background without blocking. Adjustable analysis depth balances accuracy vs. speed.

**Q: Does LSP work offline?**
A: Yes! Newt LSP is fully local — no internet required.

**Q: Can I contribute to LSP development?**
A: Absolutely! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## Summary

✅ You now understand:
- What LSP is and why it's useful
- How to set up Newt LSP in your editor
- How to configure analysis behavior
- How to troubleshoot common issues
- How to use advanced features

**Next steps:**
1. Start the LSP server: `npm run lsp:server`
2. Configure your editor (see [Editor Setup](#editor-setup))
3. Open a TypeScript/JavaScript file
4. Watch diagnostics appear in real-time!

Happy coding! 🚀
