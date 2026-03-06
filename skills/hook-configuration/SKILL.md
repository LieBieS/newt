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
