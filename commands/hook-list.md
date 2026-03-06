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
