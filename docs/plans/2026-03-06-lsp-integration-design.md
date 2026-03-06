# Newt LSP (Language Server Protocol) Integration Design

**Date**: 2026-03-06
**Status**: Approved
**Owner**: Shaun

---

## Executive Summary

Add Language Server Protocol (LSP) support to Newt, making it available as a language server in any LSP-compatible editor (VS Code, Vim, Neovim, etc.). This enables real-time code analysis and on-demand reviews directly in users' editors, complementing the existing Claude Code/Windsurf/Cursor plugin approach.

**Approach**: Hybrid architecture — thin LSP server layer delegates to existing, unchanged agents. Minimal new code, maximum code reuse.

---

## Problem Statement

Currently, Newt is only available as a plugin for Claude Code, Windsurf, and Cursor. This limits adoption to users of those specific IDEs. Many developers use VS Code, Vim, Neovim, or other editors with no current Newt support.

LSP is a standardized protocol supported by virtually all modern editors. By implementing LSP, Newt becomes available everywhere users code.

---

## Goals

1. **Broad Editor Support** — Enable Newt in VS Code, Vim, Neovim as primary targets, with foundation for all LSP-compatible editors
2. **Dual Analysis Modes** — Real-time diagnostics (as-you-code) + on-demand commands (like `/review`)
3. **User Control** — Configurable analysis depth (fast/balanced/comprehensive) based on user preference
4. **Zero Impact on Existing Code** — All current agents, skills, and plugins continue unchanged
5. **Incremental Delivery** — Phase-based rollout so features are usable at each stage

---

## Design Overview

### Architecture

```
Editor (VS Code, Vim, Neovim)
        ↓ LSP Protocol
  Newt LSP Server (new)
    ├─ File Monitor → triggers diagnostics
    ├─ Async Coordinator → runs agents in background
    └─ Command Router → handles /review, /brainstorm, etc.
        ↓
  Existing Newt Agents (unchanged)
    ├─ review-orchestrator
    ├─ architecture-analyst
    ├─ security-auditor
    └─ performance-analyzer
```

### Key Design Decisions

**1. Thin LSP Layer**
- LSP server handles only protocol translation and coordination
- All analysis logic lives in existing agents
- Agents remain unmodified, testable separately

**2. Async Architecture**
- File watches and analysis run in background
- Diagnostics stream to editor as they complete
- Never blocks editor interactions
- User can cancel long-running analysis

**3. Configurable Depth**
- Users choose analysis scope: `fast`, `balanced`, or `comprehensive`
- Fast: Quick security + basic architecture checks (< 2 sec)
- Balanced: Full analysis with reasonable timeouts (5-10 sec)
- Comprehensive: All checks, no time limits (30+ sec)

**4. Command Routing**
- LSP server recognizes commands like `/review`, `/brainstorm`, `/adr-draft`
- Routes to appropriate agents
- Streams results back incrementally

---

## Implementation Components

### New Files

```
newt/lsp/
├── server.js              Main LSP server (listens, routes requests)
├── file-monitor.js        File watcher, triggers diagnostics
├── async-coordinator.js   Runs agents, manages concurrency
├── command-router.js      Maps commands to agents
├── config.js              Load user preferences
├── diagnostics-builder.js Translates agent output → LSP diagnostics
└── README.md              LSP setup and configuration guide
```

### Entry Point

**File**: `lsp/server.js`
- Starts LSP server on configurable port (default: 9090)
- Implements `initialize`, `textDocument/didOpen`, `textDocument/didChange`, `workspace/executeCommand` handlers
- Routes requests to appropriate handlers

**Usage**:
```bash
node lsp/server.js --port 9090
```

### File Monitoring & Real-Time Diagnostics

**File**: `lsp/file-monitor.js`
- Watches for file saves/changes in editor
- Triggers diagnostics based on user's configured depth
- Runs in background, never blocks editor
- Emits diagnostics via LSP `publishDiagnostics`

**Example Flow**:
1. User saves `auth.ts`
2. File monitor detects change
3. Queues security + architecture checks for that file
4. Results published to editor as inline warnings
5. User sees "SQL injection risk: line 45" without waiting

### Async Coordination

**File**: `lsp/async-coordinator.js`
- Manages concurrent analysis requests
- Prevents overwhelming CPU with parallel agents
- Queues requests, processes in optimal order
- Supports cancellation (user closes file, etc.)

**Example**:
```javascript
// User has 3 files open, all changed
// Coordinator processes:
// 1. Security scan on auth.ts (high priority)
// 2. Architecture check on service.ts
// 3. Performance analysis on utils.ts
// (not all at once)
```

### Command Routing

**File**: `lsp/command-router.js`
- Listens for LSP commands from editor
- Maps to existing agents:
  - `/review` → `review-orchestrator`
  - `/brainstorm` → `brainstorming-agent`
  - `/adr-draft` → Existing ADR logic
  - etc.
- Streams results back to editor

### Configuration

**File**: `lsp/config.js`
- Reads from editor settings
- Respects `.newt/config.yml` project overrides
- Provides defaults

**User Configuration** (in editor settings):
```json
{
  "newt.enabled": true,
  "newt.analysisDepth": "balanced",
  "newt.realTimeDiagnostics": true,
  "newt.commandTimeout": 30000,
  "newt.ignorePatterns": ["node_modules/**", "dist/**"],
  "newt.focusAreas": ["security", "architecture", "performance"]
}
```

---

## Real-Time Diagnostics

When a file is opened or changed:

1. **Quick Pass** (if depth=fast, ~1-2 sec)
   - Security checks (secrets, injections)
   - Basic architecture patterns
   - Obvious performance issues

2. **Full Analysis** (if depth=balanced/comprehensive, ~5-30 sec)
   - All agents run in sequence
   - Architecture patterns, coupling analysis
   - Performance bottlenecks
   - Code quality metrics

3. **Streaming Results**
   - Diagnostics published as agents complete
   - Editor updates in real-time
   - User sees progress, never waits for final result

---

## On-Demand Commands

User runs command in editor:
```
/review src/auth --depth full
```

Flow:
1. LSP server receives command
2. Routes to `review-orchestrator` agent
3. Orchestrator returns results as diagnostics
4. Editor displays results
5. User can act on findings (view details, fix issues)

---

## Development Phases

### Phase 1: Basic LSP Server + Real-Time Diagnostics
**Deliverable**: File changes trigger diagnostics, appear in editor

- [ ] Implement LSP server (`server.js`)
- [ ] Implement file monitor (`file-monitor.js`)
- [ ] Integrate with security-auditor agent
- [ ] Publish diagnostics to editor
- [ ] Test in VS Code
- [ ] Test in Vim/Neovim

**Success Criteria**:
- User saves a file with security issues
- Warnings appear inline in editor within 2 seconds
- No editor lag or crashes

### Phase 2: Command Routing
**Deliverable**: On-demand `/review`, `/brainstorm` from editor

- [ ] Implement command router (`command-router.js`)
- [ ] Route `/review` to orchestrator
- [ ] Route `/brainstorm` to brainstorming-agent
- [ ] Stream results back to editor
- [ ] Add UI for command results (code lens, quick fix, etc.)

**Success Criteria**:
- `/review --depth full` works in editor
- Results appear as diagnostics + details panel
- User can trigger any Newt command from editor

### Phase 3: VS Code Extension
**Deliverable**: Polished VS Code integration

- [ ] Create VS Code extension (`vscode-extension/`)
- [ ] Package LSP server for distribution
- [ ] VS Code marketplace listing
- [ ] UI improvements (sidebar, panels, quick actions)
- [ ] Detailed documentation

### Phase 4: Vim/Neovim Setup
**Deliverable**: Configuration guides for Vim/Neovim

- [ ] Document LSP client setup for Vim (coc.nvim, neovim-lsp)
- [ ] Provide example configurations
- [ ] Test with popular LSP client plugins
- [ ] Create Neovim-specific documentation

### Phase 5: Refinement & Optimization
**Deliverable**: Performance, UX polish, edge cases

- [ ] Profile and optimize agent execution time
- [ ] Handle large files efficiently
- [ ] Add caching for repeated analyses
- [ ] Error recovery and graceful degradation
- [ ] Comprehensive documentation

---

## Configuration & Customization

### Default Configuration
```yaml
# .newt/config.yml
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

### User Overrides
Users can override via editor settings without modifying project files.

---

## Benefits

| Benefit | Details |
|---------|---------|
| **Broad Adoption** | Works in any LSP editor — VS Code, Vim, Neovim, Sublime, JetBrains, etc. |
| **No Code Duplication** | Reuses all existing agents, zero impact on current functionality |
| **Real-Time Feedback** | Diagnostics appear as user codes, not just on demand |
| **User Control** | Configurable depth balances performance vs. thoroughness |
| **Parallel Strategy** | LSP complements plugins, doesn't replace them |
| **Incremental Value** | Phase 1 alone is useful; each phase adds value |

---

## Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| **Slow Analysis** | Async coordination, configurable depth, incremental diagnostics |
| **High CPU Usage** | Queue management, analysis depth controls, caching |
| **Large File Hangs** | Timeouts, progressive analysis, focus on small sections |
| **Agent Breakage** | Agents unchanged; test LSP adapter separately |
| **Editor Instability** | Isolated LSP process, doesn't affect plugin/MCP server |

---

## Success Criteria

- ✅ Phase 1 complete: Real-time diagnostics working in VS Code + Vim
- ✅ Phase 2 complete: Commands routable and executable
- ✅ Phase 3 complete: VS Code extension listed in marketplace
- ✅ Phase 4 complete: Vim/Neovim documentation complete
- ✅ No regressions in existing plugins
- ✅ Performance: Diagnostics < 5 sec on typical files
- ✅ User satisfaction: 4+ star reviews on marketplace

---

## Next Steps

1. **Approval** — Get team sign-off on this design ✅
2. **Implementation Plan** — Create detailed task list and dependencies
3. **Phase 1 Kickoff** — Start LSP server + file monitor
4. **Iterative Delivery** — Complete phases sequentially, get feedback at each stage

---

## Appendix: LSP Protocol Basics

For reference, key LSP concepts:

- **Initialize**: Editor and server exchange capabilities
- **textDocument/didOpen**: File opened in editor
- **textDocument/didChange**: File content changed
- **textDocument/publishDiagnostics**: Server sends issues to editor
- **workspace/executeCommand**: Editor executes server command

Newt will implement these handlers + custom command routing.

