---
title: /hook:execute
purpose: Execute specific Newt hooks for quality checks and workflow automation
outputs:
  sections:
    - Execution Summary
    - Hook Results
    - Issues Found
    - Recommendations
---

## Description
Executes specific Newt hooks with configurable options. Hooks provide automated quality checks, security validation, and intelligent code assistance.

## Usage
```bash
/hook:execute <hook-name> [--verbose] [--dry-run] [--force]
```

### Options
- `hook-name`: Name of hook to execute (required)
- `--verbose`: Show detailed output
- `--dry-run`: Show what would be executed without running
- `--force`: Execute hook even if disabled

### Examples
```bash
# Execute pre-commit hook
/hook:execute pre-commit

# Execute with verbose output
/hook:execute pre-commit --verbose

# Dry run to see what would happen
/hook:execute pre-commit --dry-run

# Execute multiple hooks
/hook:execute pre-commit pre-push

# Execute all hooks
/hook:execute --all
```

## Available Hooks

### Git Hooks
- `pre-commit` - Quality checks on staged files
- `pre-push` - Branch-level validation
- `post-commit` - Metrics and logging
- `post-merge` - Baseline updates

### IDE Hooks
- `file-save` - Real-time analysis and suggestions
- `project-load` - Initialization and configuration
- `command-execution` - Pre/post command validation

### CI/CD Hooks
- `pre-build` - Build readiness checks
- `post-build` - Artifact analysis
- `pre-deploy` - Deployment validation
- `post-deploy` - Health monitoring

### Specialized Hooks
- `secret-detection` - Secret scanning
- `dependency-security` - Vulnerability checking
- `performance-monitoring` - Performance analysis
- `documentation-generation` - Auto-documentation

## Behavior
1. Validates hook configuration
2. Executes hook with specified options
3. Collects results and metrics
4. Provides recommendations
5. Logs execution details

## Output Format

### Success
```
✅ Hook execution completed successfully
Duration: 2.3s
Score: 85/100
Issues: 2 (1 medium, 1 low)
```

### Failure
```
❌ Hook execution failed
Duration: 1.8s
Blocked: Yes
Reason: 2 critical issues found
```

## Configuration

Hook behavior can be customized in `.newt/hooks.yml`:

```yaml
hooks:
  pre-commit:
    enabled: true
    thresholds:
      min_score: 75
      block_on_critical: true
    timeout_seconds: 120
```

## Integration

### Git Integration
Hooks are automatically installed as Git hooks when using `/hook:install`.

### IDE Integration
IDE hooks integrate with editor save events and command execution.

### CI/CD Integration
CI/CD hooks integrate with build and deployment pipelines.

## Output Contract

All sections must be present. Empty sections must state `None`.
