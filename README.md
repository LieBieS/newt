<div align="center">

# 🦎 Newt

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-repo/newt)
[![Platform](https://img.shields.io/badge/platform-Claude%20Code%20%7C%20Windsurf%20%7C%20Cursor-lightgrey.svg)](https://claude.ai)
[![MCP](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://modelcontextprotocol.io)

> **AI-Powered Development Assistant** for architecture, security, performance, and quality automation

---

</div>

## 🌟 Overview

`Newt` is a comprehensive AI development assistant plugin that transforms how you review, plan, and improve code. Built for **Claude Code**, **Windsurf**, and **Cursor**, it provides intelligent automation across your entire development lifecycle.

### ✨ Key Capabilities

<div align="center">

| 🔍 **Code Review Automation** | 🚀 **PR Review Intelligence** | 💡 **Structured Brainstorming** | ⚡ **Continuous Quality** |
|------------------------------|------------------------------|----------------------------------|--------------------------|
| Architecture analysis | Commit planning | Ideation sessions | Real-time suggestions |
| Security audits | PR splitting | Decision artifacts | Automated skills |
| Performance insights | Review-ready summaries | ADR generation | Quality monitoring |

</div>

---

## 🚀 Quick Start

### 📦 Installation

```bash
# Clone or download the plugin
cd /path/to/your/workspace

# Install in Claude Code/Windsurf/Cursor
/plugin marketplace add ./newt
/plugin install newt

# Verify installation
/review --help
```

### ⚡ First Review

```bash
# Run a quick code review
/review --path src/auth --depth quick

# Check project health
/project-health

# Review your staged changes before commit
/pr-review --staged
```

### ⚙️ Configuration

Edit `config/default.yml` to customize thresholds, policies, and integrations.

📖 **See `docs/installation-guide.md` for detailed setup instructions.**

---

## 🔌 MCP (Model Context Protocol)

Newt ships with a native MCP server under `mcp/server.mjs` for seamless integration with MCP-capable clients like **Claude Desktop**.

### 🏃 Run MCP Server

```bash
npm install
npm run mcp:server
```

### 🔧 Claude Desktop Configuration

```json
{
  "mcpServers": {
    "newt": {
      "command": "node",
      "args": ["mcp/server.mjs"],
      "cwd": "/absolute/path/to/newt"
    }
  }
}
```

### 📋 Available Resources

| Resource | Description |
|----------|-------------|
| `config://default.yml` | Main configuration file |
| `config://schema.json` | Configuration schema |
| `logs://reviews/latest` | Latest review logs |
| `logs://brainstorm/latest` | Latest brainstorm sessions |
| `agents://list` | Available agents |
| `skills://list` | Available skills |

### 🛠️ MCP Tools

Newt MCP tools return **deterministic runbooks** for execution in your agentic IDE:

- `newt_review` - Comprehensive code review
- `newt_pr_review` - Pull request analysis  
- `newt_brainstorm` - Structured ideation
- `newt_converge` - Idea convergence
- `newt_experiment_brief` - Experiment planning
- `newt_adr_draft` - Architecture decision records

📖 **See `mcp/README.md` for complete details.**

---

## 🎯 Features

<div align="center">

### 🏗️ **Multi-Agent Architecture**
- Coordinated review orchestrator
- Specialized domain agents
- Deterministic output templates

### 🔒 **Production-Grade Analysis**
- Architecture pattern validation
- OWASP-aligned security scans
- Performance bottleneck detection

### 🤖 **Intelligent Automation**
- Automated skills on every change
- Slash commands for on-demand reviews
- Persistent logging and history

### 📊 **PR Workflow Excellence**
- Commit planning and splitting
- Review-ready summaries
- Large PR management

### 💭 **Structured Ideation**
- Brainstorming sessions
- Decision artifacts (ADRs, briefs)
- Cross-domain pattern imports

</div>

---

## 🏛️ Architecture Overview

```mermaid
graph TD
    A[/review command] --> B[review-orchestrator]
    B --> C[architecture-analyst]
    B --> D[security-auditor] 
    B --> E[performance-analyzer]
    
    C --> F[Circular Deps Detection]
    C --> G[God Class Analysis]
    
    D --> H[SQL Injection Detection]
    D --> I[Secrets Scanning]
    
    E --> J[Performance Heuristics]
    E --> K[Data Flow Analysis]
    
    F --> L[Review Logs & Skills]
    G --> L
    H --> L
    I --> L
    J --> L
    K --> L
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style L fill:#f1f8e9
```

---

## 📥 Installation Guide

### Step 1: Open Command Palette
Open Claude Code command palette (`Ctrl/Cmd + Shift + P`)

### Step 2: Install Plugin
```bash
/plugin marketplace add ./newt
/plugin install newt
```

### Step 3: Reload if Prompted
Reload plugins when prompted to complete installation.

---

## 🎮 Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/review` | Full code review (architecture, security, performance, quality) | `/review src/auth --depth full` |
| `/project-health` | Health score with risks and debt areas | `/project-health` |
| `/review-history` | Summarizes past reviews and recurring issues | `/review-history --limit 5` |
| `/architecture-check` | Deep structural validation | `/architecture-check services/billing` |
| `/pr-review` | Reviews changes and suggests commits/PR splits | `/pr-review --staged` |
| `/brainstorm` | Structured ideation with decision artifacts | `/brainstorm --topic authentication` |
| `/converge` | Scores and converges ideas to top candidates | `/converge --ideas 10` |
| `/experiment-brief` | Creates executable experiment plans | `/experiment-brief --idea "OAuth flow"` |
| `/adr-draft` | Drafts architecture decision records | `/adr-draft --decision "Microservices"` |

---

## 🤖 Agent Ecosystem

<div align="center">

### 🎯 **Review Agents**
| Agent | Role | Expertise |
|-------|------|-----------|
| **review-orchestrator** | Central coordinator | Workflow management, result synthesis |
| **architecture-analyst** | Structure validator | Patterns, coupling, layering |
| **security-auditor** | Security scanner | OWASP, injections, secrets |
| **performance-analyzer** | Performance expert | Bottlenecks, algorithms, queries |

### 🚀 **PR Agents**  
| Agent | Role | Expertise |
|-------|------|-----------|
| **pr-review-agent** | Continuous PR companion | Staged review, PR splitting |
| **pr-planning-agent** | Strategic planner | Commit boundaries, dependencies |
| **pr-communication-agent** | Communication expert | PR descriptions, summaries |

### 💡 **Ideation Agents**
| Agent | Role | Expertise |
|-------|------|-----------|
| **brainstorming-agent** | Session facilitator | Structured ideation, artifacts |
| **creative-pattern-agent** | Pattern importer | Cross-domain patterns, practices |
| **constraint-analysis-agent** | Constraint extractor | Assumptions, relaxation options |
| **convergence-agent** | Idea scorer | Deterministic scoring, selection |
| **experiment-designer-agent** | Plan creator | Testable experiment design |

</div>

---

## 🔧 Skills & Automation

| Skill | Purpose | Trigger | Language Support |
|-------|---------|---------|------------------|
| **detect-god-class** | Flags oversized, multi-responsibility classes | Any code change | TypeScript, Python, Java |
| **detect-circular-deps** | Cycle detection on dependency graphs | Code changes | JavaScript, Python |
| **detect-sql-injection** | Scans for concatenation and unbound parameters | SQL code changes | SQL, ORMs |
| **dependency-audit** | Checks for vulnerable packages | Package file changes | npm, pip, maven |

---

## 📊 Logging & Analytics

### 📝 Review Logs
- Every `/review` creates `logs/reviews/YYYY-MM-DD_HHMM.md`
- **Metadata**: date, files analyzed, issues found, recommendations
- **Analytics**: agents invoked, execution time, severity distribution

### 📈 History Analysis
- `/review-history` aggregates and analyzes historical data
- **Trends**: recurring issues, hotspots, improvement metrics
- **Reports**: executive summaries, technical debt tracking

---

## 💡 Usage Examples

### 🎯 Focused Review
```bash
# Review authentication module
/review src/auth --depth full --focus security

# Architecture-only review
/review services/ --agents architecture-analyst
```

### 📊 Health Assessment
```bash
# Full project health check
/project-health --output json

# Health with trend analysis
/project-health --history 30
```

### 🚀 PR Workflow
```bash
# Review staged changes
/pr-review --staged --suggest-commits

# Review entire branch
/pr-review --branch feature/auth --split-large-prs
```

### 💭 Ideation Session
```bash
# Brainstorm authentication improvements
/brainstorm --topic "Multi-factor auth" --patterns cross-domain

# Converge on top ideas
/converge --from brainstorm --top 3
```

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:

- 🐛 **Bug Reports**: How to report issues effectively
- 💡 **Feature Requests**: Proposing new capabilities  
- 🔧 **Code Contributions**: Development setup and PR process
- 📚 **Documentation**: Improving guides and examples

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

For enhancements, troubleshooting, or questions:

- 📋 **Issues**: Open an issue in your internal repo
- 🔧 **Extensions**: Modify agents/skills as needed
- 📖 **Documentation**: Check `docs/` for detailed guides
- 💬 **Community**: Join discussions in your team channels

---

<div align="center">

**Built with ❤️ for the modern development workflow**

[⬆️ Back to top](#-newt)

</div>
