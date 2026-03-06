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
