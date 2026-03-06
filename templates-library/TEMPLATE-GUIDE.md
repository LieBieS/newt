# Newt Template Development Guide

Complete guide for creating, customizing, and contributing Newt templates.

## 📚 Table of Contents

1. [Template Structure](#template-structure)
2. [Creating a New Template](#creating-a-new-template)
3. [Template Configuration](#template-configuration)
4. [Newt Integration](#newt-integration)
5. [Workflows](#workflows)
6. [Testing Templates](#testing-templates)
7. [Publishing Templates](#publishing-templates)
8. [Best Practices](#best-practices)

---

## Template Structure

Every Newt template follows this standard structure:

```
template-name/
├── .newt/                          # Newt configuration
│   ├── config.yml                 # Newt settings
│   ├── workflows/                 # Workflow definitions
│   │   ├── feature-development.md
│   │   ├── bug-fix.md
│   │   └── custom-workflow.md
│   └── agents/                    # Custom agent configs (optional)
├── src/                           # Source code structure
├── tests/                         # Test templates
├── docs/                          # Documentation
├── .github/                       # CI/CD workflows
│   └── workflows/
│       ├── ci.yml
│       └── newt-quality-gates.yml
├── template.config.yml            # Template configuration
├── README.md                      # Template documentation
├── CONTRIBUTING.md                # Contribution guidelines
├── LICENSE                        # License file
└── package.json                   # Dependencies
```

---

## Creating a New Template

### Step 1: Initialize Template

```bash
# Create template directory
mkdir templates-library/my-template
cd templates-library/my-template

# Create basic structure
mkdir -p .newt/workflows
mkdir -p src
mkdir -p tests
mkdir -p docs
mkdir -p .github/workflows
```

### Step 2: Create Template Configuration

Create `template.config.yml`:

```yaml
name: "my-template"
version: "1.0.0"
description: "Description of your template"
category: "category"  # startup, enterprise, opensource, domain-specific
author: "Your Name"

variables:
  project_name:
    description: "Project name"
    required: true
    default: "My Project"
  
  # Add more variables as needed

defaults:
  project:
    name: "{{project_name}}"
    version: "0.1.0"
  
  newt:
    enabled: true
    commands:
      - review
      - project-health
    
    quality_gates:
      enabled: true
      min_score: 75

features:
  # Define template-specific features

newt_integration:
  workflows:
    - custom-workflow
  
  agents:
    - review-orchestrator
  
  skills:
    - detect-god-class
```

### Step 3: Configure Newt Settings

Create `.newt/config.yml`:

```yaml
# Metric thresholds
thresholds:
  lines_of_code:
    typescript: 300
  cyclomatic_complexity:
    typescript: 8

# Architecture patterns
architecture:
  preferred_patterns:
    - your-pattern
  
  anti_patterns:
    - god-class

# Security policies
security:
  scan_on_commit: true
  checks:
    - sql-injection
    - xss

# Review policies
review_policies:
  auto_review_on_pr: true
  min_health_score: 75
```

### Step 4: Create Workflows

Create `.newt/workflows/custom-workflow.md`:

```markdown
---
description: Your custom workflow description
---

# Workflow Name

## Phase 1: Setup

### 1. First Step
\`\`\`bash
/review
\`\`\`

### 2. Second Step
\`\`\`bash
/project-health
\`\`\`

## Phase 2: Implementation

### 3. Implementation Step
Instructions here...

## Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2
```

### Step 5: Create README

Create `README.md`:

```markdown
# Template Name

Brief description of your template.

## What's Included

- Feature 1
- Feature 2
- Feature 3

## Quick Start

\`\`\`bash
npx newt-templates create my-template my-project
cd my-project
npm install
/review
\`\`\`

## Configuration

How to customize the template...

## Workflows

Available workflows...

## License

License information...
```

---

## Template Configuration

### Variables

Define variables that users can customize:

```yaml
variables:
  variable_name:
    description: "What this variable is for"
    required: true|false
    default: "default value"
    type: string|number|boolean
    options: [option1, option2]  # For enum types
```

### Variable Usage

Use variables in template files:

```
{{variable_name}}
{{project.name}}
{{newt.enabled}}
```

### Nested Variables

```yaml
defaults:
  project:
    name: "{{project_name}}"
    settings:
      debug: "{{debug_mode}}"
```

Access in files:
```
{{project.name}}
{{project.settings.debug}}
```

---

## Newt Integration

### Commands Configuration

Specify which Newt commands are relevant:

```yaml
newt:
  enabled: true
  commands:
    - review
    - project-health
    - brainstorm
    - pr-review
    - architecture-check
    - security-audit
```

### Quality Gates

Configure quality thresholds:

```yaml
quality_gates:
  enabled: true
  min_score: 75
  min_security_score: 80
  min_test_coverage: 80
  block_on_critical: true
```

### Agent Configuration

Specify which agents to use:

```yaml
newt_integration:
  agents:
    - review-orchestrator
    - architecture-analyst
    - security-auditor
    - performance-analyzer
```

### Skills Configuration

Enable automated skills:

```yaml
newt_integration:
  skills:
    - detect-god-class
    - detect-circular-deps
    - detect-sql-injection
    - dependency-audit
```

---

## Workflows

### Workflow Structure

```markdown
---
description: Brief workflow description
---

# Workflow Title

Brief overview of what this workflow accomplishes.

## Phase 1: Phase Name

### 1. Step Name
\`\`\`bash
/command --options
\`\`\`

**Expected Output**:
- Output 1
- Output 2

**Success Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2

## Phase 2: Next Phase

### 2. Next Step
Instructions...

## Troubleshooting

### Issue 1
Solution...

## Tips

- Tip 1
- Tip 2
```

### Best Practices for Workflows

1. **Clear Phases**: Break workflow into logical phases
2. **Specific Commands**: Show exact commands to run
3. **Expected Outputs**: Document what users should see
4. **Success Criteria**: Provide checkboxes for validation
5. **Troubleshooting**: Include common issues and solutions
6. **Tips**: Add helpful hints for efficiency

---

## Testing Templates

### Validation

Use the template validator:

```bash
node template-engine/validator.js templates-library/my-template
```

Checks:
- Required files present
- Configuration valid
- Newt integration correct
- Documentation complete
- Variables properly defined

### Generation Testing

Test template generation:

```bash
node template-engine/generator.js \
  templates-library/my-template \
  /tmp/test-project
```

Verify:
- All files generated correctly
- Variables substituted properly
- Structure matches expectations
- No errors during generation

### Integration Testing

Test with actual Newt commands:

```bash
cd /tmp/test-project
/review
/project-health
# Test all relevant commands
```

---

## Publishing Templates

### Pre-publish Checklist

- [ ] All required files present
- [ ] Template validates successfully
- [ ] README comprehensive
- [ ] Workflows documented
- [ ] Examples provided
- [ ] License file included
- [ ] Version number set
- [ ] CHANGELOG updated

### Template Metadata

Ensure `template.config.yml` has:

```yaml
name: "template-name"
version: "1.0.0"
description: "Clear, concise description"
category: "appropriate-category"
author: "Your Name"
keywords:
  - keyword1
  - keyword2
repository: "https://github.com/org/repo"
license: "MIT"
```

### Publishing Process

1. **Validate Template**
   ```bash
   npm run validate:template my-template
   ```

2. **Test Generation**
   ```bash
   npm run test:template my-template
   ```

3. **Create Pull Request**
   - Fork repository
   - Add template
   - Create PR with description

4. **Review Process**
   - Automated validation runs
   - Community review
   - Maintainer approval

---

## Best Practices

### Template Design

1. **Start Simple**: Begin with minimal structure, add complexity as needed
2. **Follow Conventions**: Use established patterns from existing templates
3. **Document Everything**: Comprehensive README and workflow docs
4. **Provide Examples**: Include example code and usage
5. **Test Thoroughly**: Validate before publishing

### Newt Integration

1. **Appropriate Commands**: Only include relevant Newt commands
2. **Realistic Thresholds**: Set achievable quality gates
3. **Clear Workflows**: Step-by-step guidance for common tasks
4. **Helpful Defaults**: Sensible default configurations

### Documentation

1. **Quick Start**: Get users productive in <5 minutes
2. **Clear Examples**: Show real usage scenarios
3. **Troubleshooting**: Address common issues
4. **Reference**: Complete configuration options

### Maintenance

1. **Version Semantically**: Follow semver (major.minor.patch)
2. **Update Dependencies**: Keep packages current
3. **Track Changes**: Maintain CHANGELOG
4. **Respond to Issues**: Address user feedback

---

## Template Categories

### Startup Templates
Focus: Speed, iteration, investor visibility
- Rapid development workflows
- Investor reporting
- MVP features
- Small team optimization

### Enterprise Templates
Focus: Compliance, security, audit
- Strict quality gates
- Compliance frameworks
- Audit trails
- Enterprise controls

### Open Source Templates
Focus: Community, contributions, transparency
- Contribution workflows
- Community engagement
- Issue management
- Transparent processes

### Domain-Specific Templates
Focus: Industry best practices
- Domain patterns
- Industry compliance
- Specialized workflows
- Vertical optimization

---

## Contributing Templates

### Contribution Guidelines

1. **Check Existing**: Ensure template doesn't duplicate existing
2. **Follow Structure**: Use standard template structure
3. **Validate**: Run validation before submitting
4. **Document**: Comprehensive README and workflows
5. **Test**: Verify generation and usage
6. **Submit PR**: Clear description of template purpose

### Review Criteria

Templates are evaluated on:
- **Usefulness**: Solves real problem
- **Quality**: Well-structured and documented
- **Completeness**: All required components
- **Newt Integration**: Proper use of Newt features
- **Maintainability**: Easy to understand and modify

---

## Advanced Topics

### Custom Agents

Create template-specific agent configurations:

```yaml
# .newt/agents/custom-agent.yml
name: custom-agent
description: Custom agent for specific checks
triggers:
  - file_pattern: "*.custom"
checks:
  - custom-check-1
  - custom-check-2
```

### Post-Generation Hooks

Execute commands after generation:

```yaml
hooks:
  post_generate:
    - npm install
    - git init
    - npm run setup
```

### Conditional Content

Include/exclude based on variables:

```
{{#if feature_enabled}}
This content only appears if feature_enabled is true
{{/if}}
```

### Template Inheritance

Extend existing templates:

```yaml
extends: "base-template"
overrides:
  newt:
    commands:
      - additional-command
```

---

## Resources

- **Template Examples**: See existing templates in `templates-library/`
- **Newt Documentation**: [docs.newt.dev](https://docs.newt.dev)
- **Community**: [discord.gg/newt](https://discord.gg/newt)
- **Issues**: [github.com/newt/templates/issues](https://github.com/newt/templates/issues)

---

**Ready to create your template? Start with the structure above and iterate!**
