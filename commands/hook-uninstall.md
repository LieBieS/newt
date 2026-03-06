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
