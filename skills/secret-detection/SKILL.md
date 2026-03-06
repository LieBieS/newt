---
title: secret-detection
kind: automated-skill
description: Detect secrets, credentials, API keys, tokens, and other sensitive values accidentally committed to the repository.
triggers:
  - event: pre_commit
    filter: "**/*"
  - event: code_change
    filter: "**/*.{env,yml,yaml,json,ts,js,py,sh,config}"
instructions:
  steps:
    - Scan all staged or modified files for patterns matching known secret formats.
    - Check for high-entropy strings that may indicate encoded credentials.
    - Detect common patterns: AWS keys, GitHub tokens, private keys, connection strings, passwords in config.
    - Cross-reference against `.gitignore` and `.newt/secret-allowlist.yml` to suppress known safe values.
    - For each detected secret, report file, line, pattern type, and recommended remediation.
outputs:
  format: |
    Secret Detection:
      File: <path>
      Line: <number>
      Pattern: <type>
      Severity: Critical
      Recommendation: <action>
---
