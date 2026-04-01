# Newt Plugin Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all structural and manifest gaps in the Newt plugin so every declared command, skill, and agent resolves correctly in Claude Code and validation passes clean.

**Architecture:** The plugin is a file-driven system — `.claude-plugin/plugin.json` is the manifest, `commands/*.md` defines slash commands, `skills/*/SKILL.md` defines automated skills, and `agents/*.md` defines agents. Claude Code derives the command name directly from the filename (without extension), meaning colons are invalid on Windows and hyphens must be used throughout. Everything declared in plugin.json must have a corresponding file, and every file should be declared in the manifest.

**Tech Stack:** Markdown (commands, agents, skills), JSON (plugin manifest), Node.js (validation script)

---

## Audit Summary — What Is Broken

Before executing tasks, understand the full gap:

**plugin.json declares commands that don't exist as files:**
- `hook:list` → no `commands/hook-list.md`
- `hook:uninstall` → no `commands/hook-uninstall.md`
- `hook:status` → no `commands/hook-status.md`
- `hook:test` → no `commands/hook-test.md`
- `hook:validate` → no `commands/hook-validate.md`

**plugin.json uses colon-format names that don't match hyphen-format filenames:**
- `hook:install` → file is `commands/hook-install.md` (command is `/hook-install`)
- `hook:execute` → file is `commands/hook-execute.md` (command is `/hook-execute`)

**plugin.json declares skills that have no directory or SKILL.md:**
- `hook-execution`, `hook-monitoring`, `hook-configuration`, `hook-validation`
- `secret-detection`, `performance-monitoring`, `dependency-security-check`
- `build-readiness-check`, `deployment-validation`

**Files exist but are not declared in plugin.json:**
- `commands/refresh-plugin.md`

**No CLAUDE.md exists** — Claude Code cannot discover the plugin's purpose, commands, or context without this file.

**Command frontmatter titles use colon format inconsistently** with filenames:
- `hook-install.md` has `title: /hook:install` → should be `title: /hook-install`
- `hook-execute.md` has `title: /hook:execute` → should be `title: /hook-execute`

---

## Task 1: Fix plugin.json manifest

**Files:**
- Modify: `.claude-plugin/plugin.json`

**Step 1: Open and read the current manifest**

File: `.claude-plugin/plugin.json`

**Step 2: Replace the commands array with corrected names**

Replace the entire `"commands"` array. Change `hook:install` → `hook-install`, `hook:execute` → `hook-execute`. Add `refresh-plugin`. Add the five missing hook commands. Remove the colon-format entries entirely:

```json
"commands": [
  "review",
  "project-health",
  "review-history",
  "architecture-check",
  "pr-review",
  "brainstorm",
  "converge",
  "experiment-brief",
  "adr-draft",
  "ui-design",
  "component-review",
  "accessibility-audit",
  "responsive-check",
  "design-system",
  "ux-pattern-review",
  "hook-install",
  "hook-execute",
  "hook-list",
  "hook-uninstall",
  "hook-status",
  "hook-test",
  "hook-validate",
  "refresh-plugin"
]
```

**Step 3: Update the skills array to match actual + new skill directories**

The current skills array references 9 skills with no files. Add them properly:

```json
"skills": [
  "detect-god-class",
  "detect-circular-deps",
  "detect-sql-injection",
  "dependency-audit",
  "live-suggestions",
  "commit-planning",
  "pr-splitting",
  "idea-backlog-curator",
  "constraint-harvester",
  "idea-clusterer",
  "detect-accessibility-issues",
  "analyze-visual-hierarchy",
  "component-consistency-checker",
  "responsive-breakpoint-analyzer",
  "ux-pattern-detector",
  "hook-execution",
  "hook-monitoring",
  "hook-configuration",
  "hook-validation",
  "secret-detection",
  "performance-monitoring",
  "dependency-security-check",
  "build-readiness-check",
  "deployment-validation"
]
```

**Step 4: Run validation to confirm manifest is now valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8')); console.log('JSON valid')"
```

Expected: `JSON valid`

**Step 5: Commit**

```bash
git add .claude-plugin/plugin.json
git commit -m "fix: correct command names and add missing entries in plugin.json"
```

---

## Task 2: Fix command frontmatter titles

**Files:**
- Modify: `commands/hook-install.md:1-3`
- Modify: `commands/hook-execute.md:1-3`

**Step 1: Fix hook-install.md frontmatter**

In `commands/hook-install.md`, change line 2 from:
```
title: /hook:install
```
to:
```
title: /hook-install
```

**Step 2: Fix hook-execute.md frontmatter**

In `commands/hook-execute.md`, change line 2 from:
```
title: /hook:execute
```
to:
```
title: /hook-execute
```

**Step 3: Verify**

```bash
grep "title:" commands/hook-install.md commands/hook-execute.md
```

Expected:
```
commands/hook-install.md:title: /hook-install
commands/hook-execute.md:title: /hook-execute
```

**Step 4: Commit**

```bash
git add commands/hook-install.md commands/hook-execute.md
git commit -m "fix: correct hook command titles to use hyphen format"
```

---

## Task 3: Create CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

**Step 1: Write CLAUDE.md**

Create `CLAUDE.md` at the repository root with this content:

```markdown
# Newt — Claude Code Plugin

Newt is a comprehensive AI development assistant plugin. It provides architecture analysis, automated code reviews, security auditing, performance analysis, PR review automation, brainstorming, and frontend design tooling.

## Plugin Structure

- `commands/` — slash commands invokable via `/command-name`
- `skills/` — automated skills, each in a subdirectory with `SKILL.md`
- `agents/` — specialist agents called by commands and orchestrators
- `config/default.yml` — all configurable thresholds and settings
- `.claude-plugin/plugin.json` — manifest declaring all commands, skills, agents

## Available Commands

| Command | Purpose |
|---------|---------|
| `/review` | Full-stack code review via review-orchestrator |
| `/project-health` | Holistic codebase health score |
| `/review-history` | Browse past review logs |
| `/architecture-check` | Architecture pattern compliance |
| `/pr-review` | PR diff analysis with commit/split recommendations |
| `/brainstorm` | Structured ideation with ADR + experiment brief |
| `/converge` | Score and select top ideas |
| `/experiment-brief` | Generate experiment design |
| `/adr-draft` | Generate Architecture Decision Record |
| `/ui-design` | Frontend UI design specification |
| `/component-review` | Review UI component quality |
| `/accessibility-audit` | WCAG compliance audit |
| `/responsive-check` | Responsive breakpoint analysis |
| `/design-system` | Design system consistency review |
| `/ux-pattern-review` | UX pattern analysis |
| `/hook-install` | Install Git/IDE/CI hooks |
| `/hook-execute` | Run a specific hook manually |
| `/hook-list` | List all installed hooks |
| `/hook-uninstall` | Remove installed hooks |
| `/hook-status` | Check hook status and health |
| `/hook-test` | Test hook execution in dry-run mode |
| `/hook-validate` | Validate hook configuration |
| `/refresh-plugin` | Refresh plugin after repository updates |

## Validation

Run `npm run validate` to check plugin structural integrity.

## Configuration

Edit `config/default.yml` to adjust thresholds, integrations, and orchestration settings.
```

**Step 2: Run validation to confirm it's picked up**

```bash
node scripts/validate-plugin.js
```

Expected: no errors about missing directories or manifest.

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "feat: add CLAUDE.md for Claude Code plugin discovery"
```

---

## Task 4: Create missing hook command files (5 files)

**Files:**
- Create: `commands/hook-list.md`
- Create: `commands/hook-uninstall.md`
- Create: `commands/hook-status.md`
- Create: `commands/hook-test.md`
- Create: `commands/hook-validate.md`

Follow the exact structure used by existing commands: YAML frontmatter with `title`, `purpose`, `outputs.sections`, then `## Description`, `## Usage`, `## Behavior`, `## Output Contract`.

**Step 1: Create commands/hook-list.md**

```markdown
---
title: /hook-list
purpose: List all installed Newt hooks with their status and configuration
outputs:
  sections:
    - Hook Inventory
    - Status Summary
    - Configuration Details
---

## Description
Lists all currently installed Newt hooks across Git, IDE, and CI/CD categories. Shows enabled/disabled state, thresholds, and last execution time for each hook.

## Usage
```bash
/hook-list [--type <type>] [--verbose]
```

### Options
- `--type`: Filter by hook type (git, ide, cicd) — default: all
- `--verbose`: Show full configuration for each hook

### Examples
```bash
# List all hooks
/hook-list

# List only Git hooks
/hook-list --type git

# Show full configuration
/hook-list --verbose
```

## Behavior
1. Reads hook configuration from `.newt/hooks.yml`
2. Checks each hook's installed state in the target environment
3. Reports last execution time and result from hook logs
4. Flags hooks that are configured but not installed

## Output Contract
All sections must be present. Empty sections must state `None`.
```

**Step 2: Create commands/hook-uninstall.md**

```markdown
---
title: /hook-uninstall
purpose: Remove installed Newt hooks from Git, IDE, or CI/CD environments
outputs:
  sections:
    - Uninstall Summary
    - Hooks Removed
    - Remaining Hooks
---

## Description
Safely removes Newt hooks from the target environment. Restores any pre-existing hooks that were overwritten during installation.

## Usage
```bash
/hook-uninstall [--type <type>] [--all] [--force]
```

### Options
- `--type`: Hook type to remove (git, ide, cicd) — default: prompts for confirmation
- `--all`: Remove all Newt hooks across all environments
- `--force`: Skip confirmation prompt

### Examples
```bash
# Uninstall all hooks (with confirmation)
/hook-uninstall --all

# Uninstall only Git hooks
/hook-uninstall --type git

# Force uninstall without prompt
/hook-uninstall --all --force
```

## Behavior
1. Identifies all hooks installed by Newt
2. Restores original hook files if backups exist
3. Removes hook configuration entries from `.newt/hooks.yml`
4. Logs the uninstall operation

## Output Contract
All sections must be present. Empty sections must state `None`.
```

**Step 3: Create commands/hook-status.md**

```markdown
---
title: /hook-status
purpose: Report the health and execution status of all installed Newt hooks
outputs:
  sections:
    - Status Overview
    - Hook Health
    - Recent Executions
    - Issues Detected
---

## Description
Provides a health dashboard for all installed Newt hooks. Shows execution counts, success rates, last run times, and any configuration or permission issues.

## Usage
```bash
/hook-status [--type <type>] [--since <date>]
```

### Options
- `--type`: Filter by hook type (git, ide, cicd) — default: all
- `--since`: Show executions since date (e.g. `2024-01-01`) — default: last 7 days

### Examples
```bash
# Check all hook statuses
/hook-status

# Check Git hooks only
/hook-status --type git

# Show last 30 days of activity
/hook-status --since 2024-01-01
```

## Behavior
1. Reads hook execution logs from `logs/`
2. Computes success rate per hook over the requested period
3. Checks hook file permissions and executability
4. Reports any blocked executions and their reasons

## Output Contract
All sections must be present. Empty sections must state `None`.
```

**Step 4: Create commands/hook-test.md**

```markdown
---
title: /hook-test
purpose: Test Newt hook execution in dry-run mode without affecting commits or deployments
outputs:
  sections:
    - Test Summary
    - Hook Results
    - Issues Found
    - Recommendations
---

## Description
Executes one or more hooks in dry-run mode against the current working tree. No files are modified, no commits are blocked, and no external systems are notified. Useful for validating hook configuration before enabling blocking mode.

## Usage
```bash
/hook-test [<hook-name>] [--all] [--path <path>]
```

### Options
- `hook-name`: Specific hook to test (e.g. `pre-commit`)
- `--all`: Test all configured hooks
- `--path`: Limit analysis to a specific path

### Examples
```bash
# Test the pre-commit hook
/hook-test pre-commit

# Test all hooks
/hook-test --all

# Test scoped to a directory
/hook-test pre-commit --path src/auth
```

## Behavior
1. Loads hook configuration from `.newt/hooks.yml`
2. Runs each hook's analysis in dry-run mode
3. Reports what would be blocked or flagged
4. Does not write to any git state or CI systems

## Output Contract
All sections must be present. Empty sections must state `None`.
```

**Step 5: Create commands/hook-validate.md**

```markdown
---
title: /hook-validate
purpose: Validate Newt hook configuration files for correctness and completeness
outputs:
  sections:
    - Validation Summary
    - Configuration Errors
    - Configuration Warnings
    - Recommendations
---

## Description
Validates `.newt/hooks.yml` and all related hook configuration against the Newt schema. Reports errors (which prevent hook execution) and warnings (which may cause unexpected behavior).

## Usage
```bash
/hook-validate [--fix] [--strict]
```

### Options
- `--fix`: Automatically repair fixable configuration issues
- `--strict`: Treat warnings as errors

### Examples
```bash
# Validate configuration
/hook-validate

# Validate and auto-fix
/hook-validate --fix

# Strict mode (warnings as errors)
/hook-validate --strict
```

## Behavior
1. Reads `.newt/hooks.yml`
2. Validates each hook entry against expected schema
3. Checks referenced scripts and paths exist
4. Verifies threshold values are within allowed ranges

## Output Contract
All sections must be present. Empty sections must state `None`.
```

**Step 6: Run the validator**

```bash
node scripts/validate-plugin.js
```

Expected: 5 fewer "missing command" warnings.

**Step 7: Commit**

```bash
git add commands/hook-list.md commands/hook-uninstall.md commands/hook-status.md commands/hook-test.md commands/hook-validate.md
git commit -m "feat: add missing hook command files (list, uninstall, status, test, validate)"
```

---

## Task 5: Create missing hook skill files (4 skills)

**Files:**
- Create: `skills/hook-execution/SKILL.md`
- Create: `skills/hook-monitoring/SKILL.md`
- Create: `skills/hook-configuration/SKILL.md`
- Create: `skills/hook-validation/SKILL.md`

Each SKILL.md must include YAML frontmatter with `title`, `kind`, `description`, `triggers`, `instructions`, and `outputs`. Follow the pattern in `skills/detect-god-class/SKILL.md`.

**Step 1: Create skills/hook-execution/SKILL.md**

```markdown
---
title: hook-execution
kind: automated-skill
description: Execute Newt hooks in response to Git, IDE, or CI/CD events with configurable thresholds and blocking behavior.
triggers:
  - event: pre_commit
    filter: "**/*"
  - event: pre_push
    filter: "**/*"
instructions:
  steps:
    - Load hook configuration from `.newt/hooks.yml` for the triggered event type.
    - Run each enabled hook's analysis against the staged or affected files.
    - Evaluate results against configured thresholds (min_score, block_on_critical).
    - If blocking conditions are met, return a non-zero exit with a structured summary.
    - Log execution results to `logs/hooks/` with timestamp and correlation ID.
outputs:
  format: |
    Hook Execution Result:
      Hook: <name>
      Event: <event>
      Score: <value>/100
      Blocked: <true|false>
      Issues: <count> (<critical> critical, <high> high)
      Duration: <seconds>s
---
```

**Step 2: Create skills/hook-monitoring/SKILL.md**

```markdown
---
title: hook-monitoring
kind: automated-skill
description: Monitor hook execution patterns, detect failures, and surface health degradation across Git, IDE, and CI/CD hooks.
triggers:
  - event: post_commit
    filter: "**/*"
  - event: schedule
    interval: "daily"
instructions:
  steps:
    - Read hook execution logs from `logs/hooks/` for the monitoring window.
    - Compute success rate, average duration, and block frequency per hook.
    - Flag hooks with success rate below 80% or average duration above threshold.
    - Detect patterns suggesting misconfiguration (e.g. always blocking, never executing).
    - Emit a monitoring report with trend indicators.
outputs:
  format: |
    Hook Monitoring Report:
      Hook: <name>
      Success Rate: <percent>%
      Avg Duration: <seconds>s
      Block Rate: <percent>%
      Trend: <improving|stable|degrading>
      Recommendation: <action>
---
```

**Step 3: Create skills/hook-configuration/SKILL.md**

```markdown
---
title: hook-configuration
kind: automated-skill
description: Analyze and suggest improvements to Newt hook configuration based on project type, team size, and observed execution patterns.
triggers:
  - event: file_change
    filter: ".newt/hooks.yml"
  - event: file_change
    filter: "config/default.yml"
instructions:
  steps:
    - Parse the modified configuration file for hook-related settings.
    - Compare configured thresholds against recommended defaults for detected project type.
    - Check for missing required fields or conflicting settings between hooks.
    - Suggest threshold adjustments based on historical execution data if available.
    - Output a structured diff of recommended vs current configuration.
outputs:
  format: |
    Hook Configuration Analysis:
      File: <path>
      Setting: <key>
      Current: <value>
      Recommended: <value>
      Reason: <explanation>
---
```

**Step 4: Create skills/hook-validation/SKILL.md**

```markdown
---
title: hook-validation
kind: automated-skill
description: Validate hook configuration files against the Newt schema and surface errors that would prevent correct hook execution.
triggers:
  - event: file_change
    filter: ".newt/hooks.yml"
  - event: file_change
    filter: ".newt/**/*.yml"
instructions:
  steps:
    - Load and parse the modified YAML file.
    - Validate structure against the Newt hooks schema (required fields, value types, allowed enums).
    - Check all referenced script paths and command names exist.
    - Verify threshold numeric values are within the allowed 0–100 range.
    - Report all errors (blocking) and warnings (advisory) with line references.
outputs:
  format: |
    Hook Validation:
      File: <path>
      Level: <error|warning>
      Line: <number>
      Field: <key>
      Message: <description>
      Fix: <suggested correction>
---
```

**Step 5: Commit**

```bash
git add skills/hook-execution/SKILL.md skills/hook-monitoring/SKILL.md skills/hook-configuration/SKILL.md skills/hook-validation/SKILL.md
git commit -m "feat: add hook skill files (execution, monitoring, configuration, validation)"
```

---

## Task 6: Create missing security and quality skill files (5 skills)

**Files:**
- Create: `skills/secret-detection/SKILL.md`
- Create: `skills/performance-monitoring/SKILL.md`
- Create: `skills/dependency-security-check/SKILL.md`
- Create: `skills/build-readiness-check/SKILL.md`
- Create: `skills/deployment-validation/SKILL.md`

**Step 1: Create skills/secret-detection/SKILL.md**

```markdown
---
title: secret-detection
kind: automated-skill
description: Detect secrets, credentials, API keys, tokens, and other sensitive values accidentally committed to the repository.
triggers:
  - event: pre_commit
    filter: "**/*"
  - event: code_change
    filter: "**/*.{env,yml,yaml,json,ts,js,py,sh,config}"
instructions:
  steps:
    - Scan all staged or modified files for patterns matching known secret formats.
    - Check for high-entropy strings that may indicate encoded credentials.
    - Detect common patterns: AWS keys, GitHub tokens, private keys, connection strings, passwords in config.
    - Cross-reference against `.gitignore` and `.newt/secret-allowlist.yml` to suppress known safe values.
    - For each detected secret, report file, line, pattern type, and recommended remediation.
outputs:
  format: |
    Secret Detection:
      File: <path>
      Line: <number>
      Pattern: <type>
      Severity: Critical
      Recommendation: <action>
---
```

**Step 2: Create skills/performance-monitoring/SKILL.md**

```markdown
---
title: performance-monitoring
kind: automated-skill
description: Detect performance regressions in code changes by analyzing algorithmic complexity, resource usage patterns, and known anti-patterns.
triggers:
  - event: code_change
    filter: "**/*.{ts,js,py,java,cs,go}"
instructions:
  steps:
    - Analyze modified functions for nesting depth exceeding `config.performance.complexity_limits.max_nesting_depth`.
    - Detect O(n²) or worse loop patterns in changed code.
    - Flag synchronous blocking calls in async contexts.
    - Check function length against `config.performance.complexity_limits.max_function_length`.
    - Identify memory leak patterns (unclosed resources, growing caches without eviction).
outputs:
  format: |
    Performance Risk:
      File: <path>
      Function: <name>
      Issue: <description>
      Complexity: <estimate>
      Impact: <high|medium|low>
      Recommendation: <action>
---
```

**Step 3: Create skills/dependency-security-check/SKILL.md**

```markdown
---
title: dependency-security-check
kind: automated-skill
description: Check project dependencies against known vulnerability databases and flag packages with critical or high CVEs.
triggers:
  - event: file_change
    filter: "**/package.json"
  - event: file_change
    filter: "**/requirements.txt"
  - event: file_change
    filter: "**/go.mod"
  - event: file_change
    filter: "**/Gemfile"
instructions:
  steps:
    - Parse the modified dependency manifest to extract package names and versions.
    - Compare packages against the CVE feed and known vulnerability advisories.
    - Flag packages with Critical or High severity CVEs.
    - Check for outdated packages more than 2 major versions behind latest stable.
    - Suggest pinned safe version or upgrade path for each flagged package.
outputs:
  format: |
    Dependency Security:
      Package: <name>@<version>
      CVE: <id>
      Severity: <Critical|High|Medium|Low>
      Fixed In: <version>
      OWASP: A06:2021 - Vulnerable and Outdated Components
      Recommendation: <upgrade or replace>
---
```

**Step 4: Create skills/build-readiness-check/SKILL.md**

```markdown
---
title: build-readiness-check
kind: automated-skill
description: Validate that the repository is in a clean, buildable state before CI/CD pipeline execution.
triggers:
  - event: pre_build
    filter: "**/*"
  - event: pre_push
    filter: "**/*"
instructions:
  steps:
    - Verify no merge conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) remain in tracked files.
    - Check that all files referenced in the build manifest (package.json, tsconfig, etc.) exist on disk.
    - Confirm lockfiles (package-lock.json, yarn.lock) are in sync with manifest.
    - Detect TODO/FIXME comments tagged as blocking (e.g. `// TODO(block-build):`).
    - Validate environment variable references have corresponding `.env.example` entries.
outputs:
  format: |
    Build Readiness:
      Check: <description>
      Status: <pass|fail|warn>
      File: <path>
      Detail: <explanation>
      Blocker: <true|false>
---
```

**Step 5: Create skills/deployment-validation/SKILL.md**

```markdown
---
title: deployment-validation
kind: automated-skill
description: Validate deployment configuration and readiness checks before production or staging deployments.
triggers:
  - event: pre_deploy
    filter: "**/*"
  - event: file_change
    filter: "**/{docker-compose,Dockerfile,k8s,helm,terraform}*"
instructions:
  steps:
    - Verify health check endpoints are defined in deployment manifests.
    - Check resource limits (CPU, memory) are explicitly set in container definitions.
    - Validate that secrets are referenced from environment variables or secret managers, not hardcoded.
    - Confirm rollback strategy is defined (e.g. canary weights, replica minimums).
    - Check deployment environment matches the target branch policy (main → production, etc.).
outputs:
  format: |
    Deployment Validation:
      Check: <description>
      Status: <pass|fail|warn>
      File: <path>
      Detail: <explanation>
      Risk: <high|medium|low>
      Recommendation: <action>
---
```

**Step 6: Run the validator**

```bash
node scripts/validate-plugin.js
```

Expected: all errors resolved, only warnings (if any).

**Step 7: Commit**

```bash
git add skills/secret-detection/SKILL.md skills/performance-monitoring/SKILL.md skills/dependency-security-check/SKILL.md skills/build-readiness-check/SKILL.md skills/deployment-validation/SKILL.md
git commit -m "feat: add security and quality skill files (secret-detection, performance-monitoring, dependency-security-check, build-readiness-check, deployment-validation)"
```

---

## Task 7: Final validation and smoke test

**Step 1: Run full plugin validation**

```bash
node scripts/validate-plugin.js
```

Expected output:
```
=== Newt Plugin Validation ===

Validating directory structure...
✓ Directory structure valid
Validating plugin manifest...
✓ Manifest valid (13 agents, 23 commands, 24 skills)
Validating agents...
✓ Validated 13 agents
Validating commands...
✓ Validated 19 commands
Validating skills...
✓ Validated 24 skills
Validating configuration...
✓ Configuration valid

=== Validation Results ===

✅ No errors (warnings can be addressed)
```

If there are remaining errors, fix them before proceeding.

**Step 2: Verify plugin.json is consistent with filesystem**

Check that every command name in plugin.json has a matching file:

```bash
node -e "
const fs = require('fs');
const m = JSON.parse(fs.readFileSync('.claude-plugin/plugin.json','utf8'));
const missing = m.commands.filter(c => !fs.existsSync('commands/' + c + '.md'));
if (missing.length) { console.log('Missing:', missing); process.exit(1); }
else console.log('All commands have files');
"
```

Expected: `All commands have files`

Check skills:

```bash
node -e "
const fs = require('fs');
const m = JSON.parse(fs.readFileSync('.claude-plugin/plugin.json','utf8'));
const missing = m.skills.filter(s => !fs.existsSync('skills/' + s + '/SKILL.md'));
if (missing.length) { console.log('Missing:', missing); process.exit(1); }
else console.log('All skills have SKILL.md');
"
```

Expected: `All skills have SKILL.md`

Check agents:

```bash
node -e "
const fs = require('fs');
const m = JSON.parse(fs.readFileSync('.claude-plugin/plugin.json','utf8'));
const missing = m.agents.filter(a => !fs.existsSync('agents/' + a + '.md'));
if (missing.length) { console.log('Missing:', missing); process.exit(1); }
else console.log('All agents have files');
"
```

Expected: `All agents have files`

**Step 3: Final commit**

```bash
git add -A
git commit -m "fix: newt plugin fully operational - all commands, skills and agents resolve"
```

---

## Summary of Changes

| Category | Before | After |
|----------|--------|-------|
| Commands in manifest | 22 (7 broken names or missing files) | 23 (all valid) |
| Command files on disk | 19 | 19 + 5 new = 24 (but manifest lists 23 active) |
| Skills in manifest | 24 (9 missing files) | 24 (all have SKILL.md) |
| Skill directories on disk | 15 | 24 |
| CLAUDE.md | absent | present |
| Validation errors | multiple | 0 |
