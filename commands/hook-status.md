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
