---
title: deployment-validation
kind: automated-skill
description: Validate deployment configuration and readiness checks before production or staging deployments.
triggers:
  - event: pre_deploy
    filter: "**/*"
  - event: file_change
    filter: "**/{docker-compose,Dockerfile,k8s,helm,terraform}*"
instructions:
  steps:
    - Verify health check endpoints are defined in deployment manifests.
    - Check resource limits (CPU, memory) are explicitly set in container definitions.
    - Validate that secrets are referenced from environment variables or secret managers, not hardcoded.
    - Confirm rollback strategy is defined (e.g. canary weights, replica minimums).
    - Check deployment environment matches the target branch policy (main to production, etc.).
outputs:
  format: |
    Deployment Validation:
      Check: <description>
      Status: <pass|fail|warn>
      File: <path>
      Detail: <explanation>
      Risk: <high|medium|low>
      Recommendation: <action>
---
