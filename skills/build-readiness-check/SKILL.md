---
title: build-readiness-check
kind: automated-skill
description: Validate that the repository is in a clean, buildable state before CI/CD pipeline execution.
triggers:
  - event: pre_build
    filter: "**/*"
  - event: pre_push
    filter: "**/*"
instructions:
  steps:
    - Verify no merge conflict markers (<<<<<<<, =======, >>>>>>>) remain in tracked files.
    - Check that all files referenced in the build manifest (package.json, tsconfig, etc.) exist on disk.
    - Confirm lockfiles (package-lock.json, yarn.lock) are in sync with manifest.
    - Detect TODO/FIXME comments tagged as blocking (e.g. `// TODO(block-build):`).
    - Validate environment variable references have corresponding `.env.example` entries.
outputs:
  format: |
    Build Readiness:
      Check: <description>
      Status: <pass|fail|warn>
      File: <path>
      Detail: <explanation>
      Blocker: <true|false>
---
