---
title: dependency-security-check
kind: automated-skill
description: Check project dependencies against known vulnerability databases and flag packages with critical or high CVEs.
triggers:
  - event: file_change
    filter: "**/package.json"
  - event: file_change
    filter: "**/requirements.txt"
  - event: file_change
    filter: "**/go.mod"
  - event: file_change
    filter: "**/Gemfile"
instructions:
  steps:
    - Parse the modified dependency manifest to extract package names and versions.
    - Compare packages against the CVE feed and known vulnerability advisories.
    - Flag packages with Critical or High severity CVEs.
    - Check for outdated packages more than 2 major versions behind latest stable.
    - Suggest pinned safe version or upgrade path for each flagged package.
outputs:
  format: |
    Dependency Security:
      Package: <name>@<version>
      CVE: <id>
      Severity: <Critical|High|Medium|Low>
      Fixed In: <version>
      OWASP: A06:2021 - Vulnerable and Outdated Components
      Recommendation: <upgrade or replace>
---
