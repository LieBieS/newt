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
