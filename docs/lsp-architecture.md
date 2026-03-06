# Newt LSP Server - Architecture & Design

Deep dive into the architecture, design decisions, and component interactions.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Component Interactions](#component-interactions)
3. [Data Flow](#data-flow)
4. [Module Breakdown](#module-breakdown)
5. [Design Patterns](#design-patterns)
6. [Performance Considerations](#performance-considerations)
7. [Future Extensions](#future-extensions)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Editor (LSP Client)                      │
│         VS Code / Vim / Neovim / Emacs / JetBrains        │
└────────────────────────┬────────────────────────────────────┘
                         │
                   LSP Protocol (stdio)
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Newt LSP Server (Node.js)                       │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ Protocol Layer │  │ Coordination   │  │   Analysis   │  │
│  │                │  │     Layer      │  │    Layer     │  │
│  │ • Initialize   │  │                │  │              │  │
│  │ • Document     │  │ • FileMonitor  │  │ • Diagnostics│  │
│  │   Events       │  │ • AsyncCoord   │  │   Builder    │  │
│  │ • Config Mgmt  │  │ • Queue Mgmt   │  │ • AgentAdptr │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│                              │                                │
│                      Shared Services:                         │
│                    • Logging  • Error Handling               │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌──────────────────┐           ┌──────────────────┐
│  Agent Adapter   │           │   Config Loader  │
│  (Phase 2)       │           │                  │
│  • Security      │           │ • Default config │
│  • Architecture  │           │ • File-based     │
│  • Performance   │           │ • Editor settings│
│  • Quality       │           └──────────────────┘
└──────────────────┘

```

### Layer Responsibilities

| Layer | Responsibility | Key Classes |
|-------|-----------------|------------|
| **Protocol** | LSP standard compliance | server.js |
| **Coordination** | Request queuing, async mgmt | FileMonitor, AsyncCoordinator |
| **Analysis** | Issue detection, diagnostics | DiagnosticsBuilder, AgentAdapter |

---

## Component Interactions

### Message Flow: File Save Event

```
┌──────────────┐
│   Editor     │
│              │
│ File Saved   │
└──────┬───────┘
       │ LSP: textDocument/didSave
       │
       ▼
┌─────────────────────────────────┐
│   server.js (Protocol Handler)  │
│                                 │
│   onDidSave(event)              │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   FileMonitor                   │
│                                 │
│   onDocumentSave(event)         │
│   → queueAnalysis(uri, doc)     │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   AsyncCoordinator              │
│                                 │
│   enqueue(task)                 │
│   → startProcessing()           │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   AsyncCoordinator (processing) │
│                                 │
│   processTask(task)             │
│   → agents.analyze()            │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   AgentAdapter                  │
│                                 │
│   analyzeSecurityAndArch()      │
│   → (Phase 2: real agents)      │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   DiagnosticsBuilder            │
│                                 │
│   mergeResults()                │
│   → convertToDiagnostics()      │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   server.onTaskComplete()       │
│                                 │
│   connection.sendDiagnostics()  │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   Editor                        │
│                                 │
│   Display Diagnostics           │
│   (red squiggles, warnings)     │
└─────────────────────────────────┘
```

### Key Classes & Responsibilities

```
Server (server.js)
├── Protocol Handler
│   ├── onInitialize() → handshake with editor
│   ├── onInitialized() → start FileMonitor
│   └── onDidChangeConfiguration() → update settings
│
FileMonitor (file-monitor.js)
├── onDocumentOpen() → initial analysis
├── onDocumentChange() → debounced analysis
└── onDocumentSave() → immediate analysis
│
AsyncCoordinator (async-coordinator.js)
├── enqueue(task) → add to queue
├── startProcessing() → run queued tasks
├── processTask() → call agents
└── isCodeFile() → filter non-code files
│
DiagnosticsBuilder (diagnostics-builder.js)
├── buildFromSecurityAudit() → convert issues
├── buildFromArchitectureAnalysis() → convert issues
├── buildDiagnostic() → format single issue
├── convertSeverity() → map severity levels
└── mergeResults() → combine results
│
AgentAdapter (agent-adapter.js)
├── analyzeSecurityAndArchitecture() → (placeholder for Phase 2)
├── runFullReview() → comprehensive analysis
└── registerAgents() → inject real agents

Config (config.js)
└── load() → get configuration defaults
```

---

## Data Flow

### Request Lifecycle

```
TIME →

T0: File Change Event
    ├─ Editor detects save
    └─ Sends textDocument/didSave

T1: FileMonitor Receives Event
    ├─ Debounce check (500ms)
    ├─ Extract content & metadata
    └─ Queue task: { uri, content, language, depth, timestamp }

T2: AsyncCoordinator Deduplicates
    ├─ Check if task for same URI exists
    ├─ If yes: replace old task
    └─ If no: add to queue

T3: AsyncCoordinator Processes (Sequential)
    ├─ Pop task from queue
    ├─ Verify language is code file
    ├─ Call agents.analyzeSecurityAndArchitecture()
    └─ Receive results: { security: [], architecture: [] }

T4: DiagnosticsBuilder Translates
    ├─ Convert issues to LSP format
    ├─ Map severity levels
    ├─ Build ranges (line/column)
    └─ Merge results: array of Diagnostic objects

T5: Publish to Editor
    ├─ connection.sendDiagnostics({ uri, diagnostics })
    └─ Editor displays inline warnings/errors

T6: User Sees Results
    └─ Red squiggles under problematic code
```

### Task Structure

```javascript
Task {
  uri: 'file:///project/src/auth.ts',
  content: 'const x = 1; // code content',
  language: 'typescript',
  depth: 'balanced',
  timestamp: 1709827456000
}
```

### Diagnostic Structure (LSP Format)

```javascript
Diagnostic {
  range: {
    start: { line: 4, character: 10 },    // 0-indexed
    end: { line: 4, character: 20 }
  },
  message: 'Potential SQL injection vulnerability',
  severity: 1,                             // DiagnosticSeverity.Error
  source: 'newt-security',                 // From DiagnosticsBuilder
  code: 'SQL_INJECTION'
}
```

---

## Module Breakdown

### server.js (Main LSP Entry Point)

**Purpose:** LSP protocol handler and orchestrator

**Key Responsibilities:**
- Create LSP connection (stdio for production, mock for tests)
- Register protocol handlers
- Initialize components on server start
- Manage global configuration
- Publish diagnostics to editor

**Key Methods:**
```javascript
connection.onInitialize(params)           // Setup phase
connection.onInitialized()                // Server ready
documents.onDidOpen(event)                // File opened
documents.onDidChangeContent(event)       // File changed (debounced)
documents.onDidSave(event)                // File saved
connection.onDidChangeConfiguration()     // Settings changed
connection.sendDiagnostics(params)        // Send results to editor
startServer()                             // Start listening
```

**Dependencies:**
- vscode-languageserver (LSP protocol)
- FileMonitor
- AsyncCoordinator
- DiagnosticsBuilder
- Config

### file-monitor.js

**Purpose:** Detect file changes and queue analysis

**Key Responsibilities:**
- Listen to document open/change/save events
- Debounce rapid changes (500ms)
- Extract file content and metadata
- Queue analysis tasks

**Key Methods:**
```javascript
start()                        // Register listeners
onDocumentOpen(event)          // File opened
onDocumentChange(event)        // File changed (triggers debounce)
onDocumentSave(event)          // File saved
queueAnalysis(uri, document)   // Create and queue task
```

**Design Details:**
- **Debouncing:** Prevents analyzing 10 events per keystroke
  ```javascript
  clearTimeout(changeTimeout);
  changeTimeout = setTimeout(() => { queueAnalysis(...) }, 500);
  ```
- **Language Detection:** Filters out non-code files
- **Always analyze on save** (bypass debounce for save events)

### async-coordinator.js

**Purpose:** Manage task queue and sequential processing

**Key Responsibilities:**
- Maintain task queue
- Prevent duplicate analysis for same file
- Process tasks sequentially (no race conditions)
- Call agents for analysis
- Handle errors gracefully

**Key Methods:**
```javascript
enqueue(task)              // Add/update task in queue
startProcessing()          // Start processing loop
processTask(task)          // Run analysis for one task
isCodeFile(languageId)     // Filter supported languages
```

**Design Details:**
- **Duplicate Prevention:**
  ```javascript
  const existing = this.queue.findIndex(t => t.uri === uri);
  if (existing !== -1) {
    this.queue[existing] = task;  // Replace
  }
  ```
- **Sequential Processing:** While loop ensures one task at a time
- **Error Handling:** Catches exceptions, logs, continues with next task

### diagnostics-builder.js

**Purpose:** Convert analysis results to LSP format

**Key Responsibilities:**
- Transform Newt issues → LSP Diagnostic objects
- Map severity levels (critical → Error, warning → Warning)
- Build diagnostic ranges (convert 1-indexed → 0-indexed)
- Merge results from multiple sources

**Key Methods:**
```javascript
buildFromSecurityAudit(issues)        // Security issues → diagnostics
buildFromArchitectureAnalysis(issues) // Architecture issues → diagnostics
buildDiagnostic(issue, source)        // Single issue → diagnostic
convertSeverity(severity)             // Map severity levels
mergeResults(security, architecture)  // Combine all diagnostics
```

**Severity Mapping:**
```
Newt           → LSP DiagnosticSeverity
critical/error → Error (1)
warning/major  → Warning (2)
info/minor     → Information (3)
hint           → Hint (4)
```

**Line/Column Conversion:**
```
Newt (1-indexed):  line: 5, column: 10
                   ↓
LSP (0-indexed):   line: 4, character: 10
```

### agent-adapter.js

**Purpose:** Bridge between LSP and analysis agents (Phase 1: placeholder)

**Key Responsibilities:**
- Provide consistent interface for agent calls
- Handle mock results (Phase 1)
- Integrate real agents (Phase 2)
- Error handling and graceful degradation

**Key Methods:**
```javascript
analyzeSecurityAndArchitecture(uri, content, options)  // Analyze code
runFullReview(uri, content, depth)                     // Full analysis
registerAgents(agents)                                 // Inject real agents
getMockSecurityIssues(uri, content, depth)             // Placeholder
getMockArchitectureIssues(uri, content, depth)         // Placeholder
```

**Phase 1 → Phase 2 Transition:**
```javascript
// Phase 1 (now)
await this.agents.analyzeSecurityAndArchitecture();  // Mock

// Phase 2 (future)
const security = await this.agents.securityAuditor.analyze();
const arch = await this.agents.architectureAnalyst.analyze();
const perf = await this.agents.performanceAnalyzer.analyze();
```

### config.js

**Purpose:** Load and provide configuration

**Key Responsibilities:**
- Provide default configuration
- Load from files (Phase 2)
- Apply editor settings overrides
- Validate configuration

**Configuration Structure:**
```javascript
{
  analysisDepth: 'balanced',           // fast, balanced, comprehensive
  realTimeDiagnostics: true,           // Enable/disable
  commandTimeout: 30000,               // Milliseconds
  port: 9090,                          // Server port
  ignorePatterns: ['node_modules/**'], // Files to skip
  focusAreas: ['security']             // Priority analyses
}
```

### index.js

**Purpose:** Executable entry point

**Key Responsibilities:**
- Parse CLI arguments
- Set environment variables
- Start the server
- Handle graceful shutdown
- Manage error reporting

**CLI Features:**
```bash
--port, -p       Port to listen on (default 9090)
--config, -c     Config file path
--debug, -d      Enable debug logging
--help, -h       Show help message
```

---

## Design Patterns

### 1. Observer Pattern

**Used by:** FileMonitor with Document events

```
documents.onDidOpen() → FileMonitor.onDocumentOpen()
documents.onDidChange() → FileMonitor.onDocumentChange()
documents.onDidSave() → FileMonitor.onDocumentSave()
```

### 2. Producer-Consumer Pattern

**Used by:** AsyncCoordinator

```
FileMonitor (Producer) → Queue → AsyncCoordinator (Consumer)
```

**Benefits:**
- Decouples event detection from analysis
- Prevents queue buildup
- Handles errors in one task without blocking others

### 3. Adapter Pattern

**Used by:** DiagnosticsBuilder and AgentAdapter

```
Newt Issues → DiagnosticsBuilder → LSP Diagnostics
Agents → AgentAdapter → Consistent Interface
```

### 4. Strategy Pattern

**Used by:** Analysis Depth

```
depth: 'fast' → Quick checks only
depth: 'balanced' → Standard analysis
depth: 'comprehensive' → Full analysis
```

### 5. Dependency Injection

**Used by:** Component initialization in server.js

```javascript
const coordinator = new AsyncCoordinator(connection, config);
const monitor = new FileMonitor(connection, documents, coordinator, config);
coordinator.agents = mockAgents;
```

---

## Performance Considerations

### 1. Debouncing Rapid Changes

**Problem:** User types, triggers 10+ change events per second

**Solution:** 500ms debounce timeout
```javascript
clearTimeout(changeTimeout);
changeTimeout = setTimeout(() => analyze(), 500);
// Only analyzes when typing stops for 500ms
```

**Result:** 10x fewer analyses, user doesn't notice delay

### 2. Duplicate Prevention

**Problem:** Queue fills with duplicate tasks for same file

**Solution:** Replace old task instead of appending
```javascript
const index = queue.findIndex(t => t.uri === uri);
if (index !== -1) {
  queue[index] = newTask;  // O(1) deduplication
}
```

**Result:** Queue never grows unbounded

### 3. Sequential Processing

**Problem:** Parallel analysis causes race conditions, high CPU

**Solution:** Process one task at a time
```javascript
while (queue.length > 0) {
  const task = queue.shift();
  await processTask(task);  // Wait for completion
}
```

**Result:** Predictable CPU, no race conditions

### 4. Language Filtering

**Problem:** Analyzing non-code files (markdown, JSON) wastes time

**Solution:** Check language before analysis
```javascript
if (!isCodeFile(languageId)) return;

// Only supports: ts, js, py, go, rs, java, cpp, cs
```

**Result:** Fast rejection of unsupported files

### 5. Configurable Depth

**Problem:** Some files are large (bundles > 1MB)

**Solution:** User can choose analysis depth
```json
{
  "analysisDepth": "fast"  // Skip expensive checks
}
```

**Result:** User controls CPU usage vs accuracy tradeoff

---

## Memory Management

### Queue Limits

```
Max tasks in queue: 1 per file (deduplication)
Max concurrent tasks: 1 (sequential processing)
Memory per task: ~100KB (content + metadata)
```

### Document Caching

- LSP maintains document cache internally
- We don't cache redundantly
- Leverage LSP's `documents` manager

### Cleanup

- Completed tasks removed from queue
- Diagnostics stored per file (not in memory, sent to editor)
- Old sessions cleaned up (future: add session mgmt)

---

## Error Handling Strategy

### Layer 1: Task Level
```javascript
try {
  await processTask(task);
} catch (error) {
  connection.console.error(`Error: ${error.message}`);
  // Continue with next task
}
```

### Layer 2: Agent Level
```javascript
try {
  return await agents.analyze();
} catch (error) {
  connection.console.error(`Analysis failed: ${error}`);
  return { security: [], architecture: [] };  // Empty results
}
```

### Layer 3: Server Level
```javascript
process.on('uncaughtException', (error) => {
  console.error('Uncaught:', error);
  process.exit(1);
});
```

### Result: Resilient System
- Single task failure doesn't affect others
- Agent failure returns empty diagnostics (safe)
- Server crash logged and reported

---

## Testing Architecture

### Test Organization

```
tests/
├── server.test.js                 (Protocol handlers)
├── file-monitor.test.js           (Event detection)
├── async-coordinator.test.js      (Queue management)
├── diagnostics-builder.test.js    (Translation logic)
├── agent-adapter.test.js          (Agent interface)
└── integration.test.js            (Full flow)
```

### Testing Strategy

**Unit Tests:** Each module tested independently
```javascript
// Mock dependencies
mockConnection, mockDocuments, mockCoordinator
// Test in isolation
```

**Integration Tests:** Full request flow
```javascript
// Real components connected
// Test end-to-end behavior
```

**Mock Connection:** Replaces real LSP connection
```javascript
// Prevents "Connection input stream not set" in tests
// Allows Jest to capture calls
```

---

## Future Extensions (Phase 2+)

### Real Agent Integration

```javascript
// Phase 2: Replace mock with real agents
const securityAuditor = require('../agents/security-auditor');
const architectureAnalyst = require('../agents/architecture-analyst');

adapter.registerAgents({
  securityAuditor,
  architectureAnalyst,
  performanceAnalyzer,
  qualityChecker
});
```

### Command Routing

```javascript
// /review command support
connection.onExecuteCommand((params) => {
  if (params.command === 'newt.review') {
    // Route to orchestrator agent
  }
});
```

### Code Actions

```javascript
// Quick fixes: "Fix this vulnerability"
connection.capabilities.codeActionProvider = true;
connection.onCodeAction((params) => {
  // Return fixable actions
});
```

### Completion Support

```javascript
// Intelligent suggestions
connection.capabilities.completionProvider = true;
connection.onCompletion((params) => {
  // Return suggestions
});
```

---

## Summary

**Newt LSP Architecture:**

1. **Protocol Layer** (server.js)
   - LSP standard compliance
   - Component orchestration

2. **Coordination Layer** (FileMonitor, AsyncCoordinator)
   - Event detection & debouncing
   - Queue management & deduplication
   - Sequential processing

3. **Analysis Layer** (AgentAdapter, DiagnosticsBuilder)
   - Agent interface
   - Result translation
   - Format conversion

4. **Supporting** (Config, Logging, Error Handling)
   - Configuration management
   - Graceful error recovery
   - Detailed logging

**Key Design Principles:**
- ✅ Separation of concerns (layers)
- ✅ Loose coupling (dependency injection)
- ✅ Performance (debouncing, deduplication)
- ✅ Resilience (error handling)
- ✅ Testability (mocks, isolation)
- ✅ Extensibility (agent adapter pattern)

This architecture is ready for Phase 2 agent integration while remaining solid and maintainable.
