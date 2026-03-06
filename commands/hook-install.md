---
title: /hook:install
purpose: Install Newt hooks for automated quality checks and workflow integration
outputs:
  sections:
    - Installation Summary
    - Hook Types Installed
    - Configuration Details
    - Next Steps
---

## Description
Installs Newt hooks for Git, IDE, and CI/CD integration. Hooks provide automated quality checks, security validation, and intelligent code assistance throughout the development workflow.

## Usage
```bash
/hook:install [--type <type>] [--environment <env>] [--team <team>]
```

### Options
- `--type`: Hook type to install (git, ide, cicd, all) - default: all
- `--environment`: Target environment (development, staging, production) - default: current
- `--team`: Team configuration (small-team, enterprise, opensource) - default: auto-detect

### Examples
```bash
# Install all hooks
/hook:install

# Install only Git hooks
/hook:install --type git

# Install for production environment
/hook:install --environment production

# Install for enterprise team
/hook:install --team enterprise
```

## Behavior
1. Detects current environment and team size
2. Installs appropriate hooks based on configuration
3. Sets up hook configuration files
4. Validates hook installation
5. Provides usage instructions

## Hook Types

### Git Hooks
- **Pre-commit**: Quality checks on staged files
- **Pre-push**: Branch-level validation
- **Post-commit**: Metrics and logging
- **Post-merge**: Baseline updates

### IDE Hooks
- **File Save**: Real-time analysis and suggestions
- **Project Load**: Initialization and configuration
- **Command Execution**: Pre/post command validation

### CI/CD Hooks
- **Pre-build**: Build readiness checks
- **Post-build**: Artifact analysis
- **Pre-deploy**: Deployment validation
- **Post-deploy**: Health monitoring

## Configuration

### Environment-Specific Settings
```yaml
environments:
  development:
    pre-commit:
      thresholds:
        min_score: 70
      block_on_high: false
  
  production:
    pre-deploy:
      thresholds:
        min_score: 90
      block_on_high: true
```

### Team-Specific Settings
```yaml
teams:
  small-team:
    pre-commit:
      thresholds:
        min_score: 70
      block_on_high: false
  
  enterprise-team:
    pre-commit:
      thresholds:
        min_score: 85
      block_on_high: true
```

## Output Contract

All sections must be present. Empty sections must state `None`.
