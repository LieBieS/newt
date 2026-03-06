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
