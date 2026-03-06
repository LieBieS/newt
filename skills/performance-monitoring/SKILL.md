---
title: performance-monitoring
kind: automated-skill
description: Detect performance regressions in code changes by analyzing algorithmic complexity, resource usage patterns, and known anti-patterns.
triggers:
  - event: code_change
    filter: "**/*.{ts,js,py,java,cs,go}"
instructions:
  steps:
    - Analyze modified functions for nesting depth exceeding `config.performance.complexity_limits.max_nesting_depth`.
    - Detect O(n^2) or worse loop patterns in changed code.
    - Flag synchronous blocking calls in async contexts.
    - Check function length against `config.performance.complexity_limits.max_function_length`.
    - Identify memory leak patterns (unclosed resources, growing caches without eviction).
outputs:
  format: |
    Performance Risk:
      File: <path>
      Function: <name>
      Issue: <description>
      Complexity: <estimate>
      Impact: <high|medium|low>
      Recommendation: <action>
---
