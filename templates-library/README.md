# Newt Templates Library

Real-world, production-ready templates that showcase the full power of Newt's AI development assistant capabilities.

## 📚 Available Templates

### 🚀 Startup MVP Accelerator
Complete startup project setup with Newt integration for rapid development and investor-ready documentation.

**Use Cases**: New startups, MVP development, rapid prototyping
**Newt Features**: `/review`, `/project-health`, `/brainstorm`, `/pr-review`

### 🏢 Enterprise Compliance Suite
Enterprise-grade project with security, compliance, and audit trail focus.

**Use Cases**: Enterprise applications, regulated industries, security-critical systems
**Newt Features**: `/security-audit`, `/review-history`, `/adr-draft`, `/architecture-check`

### 🌍 Open Source Community Kit
Open source project with community contribution workflows and engagement tools.

**Use Cases**: Open source projects, community-driven development, public repositories
**Newt Features**: `/pr-review`, `/converge`, `/review-history`, `/brainstorm`

### 🛒 E-commerce Platform Blueprint
Complete e-commerce system with optimized workflows for product, checkout, and customer experience.

**Use Cases**: E-commerce platforms, retail systems, marketplace applications
**Newt Features**: `/ui-design`, `/performance-analyzer`, `/security-auditor`, `/accessibility-audit`

## 🎯 Quick Start

### Install a Template

```bash
# Using the template CLI
npx newt-templates install startup-mvp

# Or manually
git clone https://github.com/newt/templates
cd templates/startup-mvp
npm install
```

### Customize Your Template

Each template includes a `template.config.yml` file for customization:

```yaml
project:
  name: "My Awesome Project"
  type: "startup-mvp"
  
newt:
  enabled: true
  commands:
    - review
    - project-health
    - brainstorm
    
team:
  size: "small"
  workflow: "agile"
```

## 📖 Template Structure

Each template follows this structure:

```
template-name/
├── .newt/                    # Newt configuration
│   ├── config.yml           # Template-specific Newt settings
│   ├── workflows/           # Custom workflows
│   └── agents/              # Agent configurations
├── src/                     # Source code structure
├── docs/                    # Documentation templates
├── .github/                 # CI/CD workflows
├── template.config.yml      # Template configuration
└── README.md               # Template-specific guide
```

## 🔧 Template Features

### Newt Integration
- Pre-configured Newt commands for your workflow
- Custom agent configurations
- Automated quality gates
- CI/CD integration

### Documentation
- README templates
- Architecture decision records (ADRs)
- API documentation
- Contributing guidelines

### Development Workflows
- Feature development process
- Bug fix workflows
- Performance optimization
- Security review process

### CI/CD Integration
- GitHub Actions workflows
- Azure DevOps pipelines
- Quality gates and checks
- Automated deployments

## 🎨 Customization Guide

### Modify Newt Configuration

Edit `.newt/config.yml`:

```yaml
thresholds:
  lines_of_code:
    typescript: 300  # Adjust for your team
  
review_policies:
  auto_review: true
  block_on_critical: true
```

### Add Custom Workflows

Create workflow files in `.newt/workflows/`:

```markdown
---
description: Custom feature development workflow
---

1. Run `/brainstorm` for feature ideation
2. Create ADR with `/adr-draft`
3. Implement with `/review` checks
4. Submit PR with `/pr-review`
```

### Configure CI/CD

Templates include pre-configured pipelines. Customize in `.github/workflows/` or `azure-pipelines.yml`.

## 📊 Success Metrics

Templates are designed to improve:

- **Onboarding Time**: 50% reduction
- **Code Quality**: 20% improvement  
- **Feature Velocity**: 30% acceleration
- **Documentation Coverage**: 90%+

## 🤝 Contributing

We welcome template contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Creating a New Template

1. Fork the repository
2. Create template in `templates/your-template-name/`
3. Follow the template structure
4. Add documentation
5. Submit pull request

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- **Documentation**: [docs.newt.dev/templates](https://docs.newt.dev/templates)
- **Issues**: [GitHub Issues](https://github.com/newt/templates/issues)
- **Community**: [Discord](https://discord.gg/newt)

---

**Built with ❤️ by the Newt community**
