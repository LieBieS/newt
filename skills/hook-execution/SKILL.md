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
