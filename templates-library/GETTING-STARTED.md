# Getting Started with Newt Templates

This guide helps you choose and use the right Newt template for your project.

## 📚 Available Templates

### 🚀 Startup MVP Accelerator
**Best for**: New startups, MVP development, rapid prototyping

**Key Features**:
- Fast development workflows
- Investor-ready reporting
- Automated quality gates
- CI/CD integration

**When to use**:
- Building your first product
- Need to move fast
- Want investor visibility
- Small team (1-10 people)

**Get started**:
```bash
npx newt-templates create startup-mvp my-startup
cd my-startup
npm install
/review
```

---

### 🏢 Enterprise Compliance Suite
**Best for**: Enterprise applications, regulated industries, security-critical systems

**Key Features**:
- SOC2/GDPR/HIPAA compliance
- Advanced security controls
- Audit trail (7-year retention)
- Enterprise-grade quality gates

**When to use**:
- Regulated industry (healthcare, finance)
- Enterprise customers
- Compliance requirements
- Security-critical applications

**Get started**:
```bash
npx newt-templates create enterprise-compliance my-enterprise-app
cd my-enterprise-app
npm install
/review --focus security --depth full
```

---

### 🌍 Open Source Community Kit
**Best for**: Open source projects, community-driven development

**Key Features**:
- Contribution workflows
- Community engagement tools
- Issue triage automation
- Contributor recognition

**When to use**:
- Building open source software
- Want community contributions
- Need contribution guidelines
- Public repository

**Get started**:
```bash
npx newt-templates create opensource-community my-oss-project
cd my-oss-project
npm install
/review
```

---

### 🛒 E-commerce Platform Blueprint
**Best for**: E-commerce platforms, retail systems, marketplace applications

**Key Features**:
- Product catalog management
- Checkout workflows
- Performance optimization
- Security for payments

**When to use**:
- Building e-commerce platform
- Need payment processing
- Customer-facing application
- Performance-critical

**Get started**:
```bash
npx newt-templates create ecommerce-platform my-store
cd my-store
npm install
/ui-design
```

---

## 🎯 Quick Decision Guide

### Choose by Team Size

| Team Size | Recommended Template |
|-----------|---------------------|
| 1-5 people | Startup MVP Accelerator |
| 5-20 people | Startup MVP or Open Source |
| 20-100 people | Enterprise Compliance Suite |
| 100+ people | Enterprise Compliance Suite |

### Choose by Industry

| Industry | Recommended Template |
|----------|---------------------|
| Tech Startup | Startup MVP Accelerator |
| Healthcare | Enterprise Compliance Suite (HIPAA) |
| Finance | Enterprise Compliance Suite (SOC2) |
| E-commerce | E-commerce Platform Blueprint |
| Open Source | Open Source Community Kit |
| SaaS | Startup MVP or Enterprise |

### Choose by Requirements

| Requirement | Recommended Template |
|-------------|---------------------|
| Fast iteration | Startup MVP Accelerator |
| Compliance needed | Enterprise Compliance Suite |
| Community contributions | Open Source Community Kit |
| Payment processing | E-commerce Platform Blueprint |
| Investor reporting | Startup MVP Accelerator |
| Audit trail | Enterprise Compliance Suite |

---

## 🚀 Installation

### Prerequisites

- Node.js 18 or higher
- Git
- npm or yarn
- Code editor (VS Code recommended)

### Install Template CLI

```bash
npm install -g newt-templates
```

### Create New Project

```bash
# Interactive mode
newt-templates create

# Specify template
newt-templates create <template-name> <project-name>

# Examples
newt-templates create startup-mvp my-startup
newt-templates create enterprise-compliance my-enterprise-app
newt-templates create opensource-community my-oss-project
newt-templates create ecommerce-platform my-store
```

### Customize During Creation

```bash
newt-templates create startup-mvp my-startup \
  --project-name "My Awesome Startup" \
  --tech-stack "Node.js, React, PostgreSQL" \
  --team-size small
```

---

## 🎓 First Steps After Installation

### 1. Review Project Structure

```bash
cd my-project
ls -la
```

Familiarize yourself with:
- `.newt/` - Newt configuration and workflows
- `src/` - Source code structure
- `docs/` - Documentation templates
- `.github/` - CI/CD workflows

### 2. Run Initial Review

```bash
/review
```

This establishes your baseline code quality score.

### 3. Check Project Health

```bash
/project-health
```

Understand your project's current state and metrics.

### 4. Explore Workflows

```bash
# List available workflows
ls .newt/workflows/

# Read a workflow
cat .newt/workflows/feature-development.md
```

### 5. Configure for Your Needs

Edit `.newt/config.yml` to adjust:
- Quality thresholds
- Review policies
- Integration settings
- Team preferences

---

## 📖 Learning Resources

### Newt Commands

| Command | Purpose | Template |
|---------|---------|----------|
| `/review` | Code quality analysis | All |
| `/project-health` | Health check | All |
| `/pr-review` | PR analysis | All |
| `/brainstorm` | Feature ideation | Startup, Open Source |
| `/security-audit` | Security scan | Enterprise |
| `/compliance-check` | Compliance validation | Enterprise |
| `/ui-design` | UI/UX review | E-commerce |

### Template-Specific Guides

Each template includes detailed guides:
- **README.md** - Template overview and quick start
- **.newt/workflows/** - Step-by-step workflows
- **docs/** - Comprehensive documentation

### Example Workflows

#### Startup MVP: Feature Development
```bash
/brainstorm --mode product --topic "user authentication"
# Implement feature
/review --path src/auth
/pr-review --staged
```

#### Enterprise: Security Review
```bash
/review --focus security --depth full
/compliance-check --framework soc2
/audit-prep --framework soc2
```

#### Open Source: Contribution Review
```bash
/pr-review --contributor external
/review --path src/contribution
/converge --ideas "community suggestions"
```

#### E-commerce: Performance Optimization
```bash
/review --focus performance
/ui-design --path src/checkout
/architecture-check src/catalog
```

---

## 🔧 Customization

### Adjust Quality Thresholds

Edit `.newt/config.yml`:

```yaml
thresholds:
  lines_of_code:
    typescript: 300  # Adjust for your team
  cyclomatic_complexity:
    typescript: 8    # Adjust for your standards
```

### Add Custom Workflows

Create `.newt/workflows/my-workflow.md`:

```markdown
---
description: My custom workflow
---

1. Step 1
2. Step 2
3. Step 3
```

### Configure CI/CD

Templates include pre-configured pipelines. Customize:
- `.github/workflows/` for GitHub Actions
- `azure-pipelines.yml` for Azure DevOps

---

## 🤝 Getting Help

### Documentation
- **Template README**: Each template has comprehensive docs
- **Workflow Guides**: `.newt/workflows/` directory
- **Newt Docs**: [docs.newt.dev](https://docs.newt.dev)

### Community
- **Discord**: [discord.gg/newt](https://discord.gg/newt)
- **GitHub Discussions**: [github.com/newt/templates/discussions](https://github.com/newt/templates/discussions)
- **Stack Overflow**: Tag `newt-templates`

### Support
- **Issues**: [github.com/newt/templates/issues](https://github.com/newt/templates/issues)
- **Email**: support@newt.dev

---

## 🎯 Next Steps

1. **Choose your template** based on the decision guide above
2. **Install and explore** the template structure
3. **Run initial reviews** to establish baselines
4. **Customize** for your specific needs
5. **Start building** with Newt-powered workflows

---

## 💡 Tips for Success

### 1. Start with Defaults
Don't over-customize initially. Use template defaults to learn best practices.

### 2. Follow Workflows
Templates include proven workflows. Follow them before creating custom ones.

### 3. Leverage AI
Use Newt's AI agents for brainstorming, reviews, and decision-making.

### 4. Iterate Based on Metrics
Track health scores and adjust thresholds based on your team's reality.

### 5. Engage Community
For open source templates, actively engage with contributors.

---

## 🚨 Common Issues

### Template Generation Fails
```bash
# Clear npm cache
npm cache clean --force

# Reinstall CLI
npm uninstall -g newt-templates
npm install -g newt-templates

# Try again
newt-templates create <template> <project>
```

### Quality Gates Too Strict
```bash
# Adjust thresholds in .newt/config.yml
# Start with more lenient settings and tighten over time
```

### CI/CD Pipeline Fails
```bash
# Check pipeline logs
# Ensure all secrets are configured
# Verify Node.js version matches requirements
```

---

**Ready to start? Choose your template and let's build something amazing! 🚀**
