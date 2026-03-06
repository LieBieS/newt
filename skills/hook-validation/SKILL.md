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
    - Verify threshold numeric values are within the allowed 0-100 range.
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
