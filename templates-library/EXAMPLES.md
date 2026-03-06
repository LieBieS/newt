# Newt Templates - Real-World Examples

Practical examples showing how to use Newt templates in real-world scenarios.

## 🚀 Startup MVP Accelerator Examples

### Example 1: Building a SaaS Product

**Scenario**: Building a project management SaaS from scratch

```bash
# 1. Create project from template
npx newt-templates create startup-mvp project-manager \
  --project-name "TaskFlow" \
  --tech-stack "Node.js, React, PostgreSQL" \
  --team-size small

cd project-manager

# 2. Initial brainstorming
/brainstorm --mode product --topic "Core MVP features for project management"

# Output: 15+ feature ideas, top 3 candidates:
# - Task management with drag-drop
# - Team collaboration with real-time updates
# - Simple time tracking

# 3. Create architecture decision
/adr-draft --decision "Real-time architecture" \
  --options "WebSockets, Server-Sent Events, Polling"

# 4. Implement first feature
# ... write code for task management ...

# 5. Review implementation
/review --path src/tasks --depth full

# 6. Generate investor update
/project-health --output json > reports/week-1-health.json

# Result: Health score 82/100, ready for first demo
```

### Example 2: Rapid Prototyping for Pitch

**Scenario**: Need working prototype in 2 weeks for investor pitch

```bash
# Week 1: Core features
/brainstorm --mode product --topic "Must-have features for demo"
# Implement top 3 features
/review --depth quick  # Fast reviews during development

# Week 2: Polish and metrics
/ui-design --path src/components
/project-health --output json
# Generate investor deck with health metrics

# Pitch Day: Show 85/100 health score, 12 features shipped
```

---

## 🏢 Enterprise Compliance Suite Examples

### Example 1: SOC2 Certification Preparation

**Scenario**: Preparing for SOC2 Type II audit

```bash
# 1. Create enterprise project
npx newt-templates create enterprise-compliance healthcare-app \
  --company-name "HealthTech Inc" \
  --compliance-frameworks "SOC2, HIPAA" \
  --security-level critical

cd healthcare-app

# 2. Initial security baseline
/review --focus security --depth full

# 3. Implement SOC2 controls
# ... implement access controls, encryption, logging ...

# 4. Validate controls
/compliance-check --framework soc2 --test-controls

# Output:
# CC6.1 (Logical Access): ✅ Implemented
# CC6.6 (Encryption): ✅ Implemented
# CC7.2 (Monitoring): ✅ Implemented
# CC8.1 (Change Mgmt): ✅ Implemented

# 5. Generate audit evidence
/audit-prep --framework soc2 --comprehensive

# 6. Quarterly compliance report
/compliance-report --framework soc2 --output pdf

# Result: 100% control coverage, audit-ready
```

### Example 2: GDPR Compliance for EU Launch

**Scenario**: Adding GDPR compliance to existing product

```bash
# 1. Privacy impact assessment
/privacy-assessment --feature "user-data-export"

# 2. Data flow mapping
/data-flow-analysis --include-pii

# Output: Identified 12 PII fields, 5 data flows

# 3. Implement GDPR requirements
# ... add consent management, data portability, right to erasure ...

# 4. Validate compliance
/compliance-check --framework gdpr

# Output:
# Data Minimization: ✅
# Consent Management: ✅
# Right to Erasure: ✅
# Data Portability: ✅
# Breach Notification: ✅

# 5. Generate compliance documentation
/compliance-report --framework gdpr --include-evidence

# Result: GDPR compliant, ready for EU launch
```

---

## 🌍 Open Source Community Kit Examples

### Example 1: Launching Open Source Project

**Scenario**: Open sourcing an internal tool

```bash
# 1. Create open source project
npx newt-templates create opensource-community awesome-cli \
  --project-name "Awesome CLI Tool" \
  --license MIT \
  --github-org mycompany

cd awesome-cli

# 2. Prepare for public release
/review --depth full
# Fix all critical and high issues

# 3. Create contribution guidelines
# CONTRIBUTING.md already generated with workflows

# 4. Set up community workflows
# Issue templates, PR templates, code of conduct all included

# 5. Launch announcement
# README.md comprehensive and ready

# 6. First external contribution
/pr-review --contributor external
# Automated review with welcoming message

# Result: 50 stars in first week, 5 contributors
```

### Example 2: Managing Growing Community

**Scenario**: Project has 100+ contributors, need better processes

```bash
# 1. Analyze contribution patterns
/review-history --limit 30

# 2. Identify bottlenecks
/brainstorm --mode process --topic "Improving contribution workflow"

# Output: 
# - Automated issue triage
# - Contributor recognition
# - Better documentation

# 3. Implement improvements
# ... add automation, update docs ...

# 4. Community decision making
/converge --ideas "community-suggestions.md" --top 5

# 5. Track improvements
/project-health --output json
# Monitor contributor satisfaction metrics

# Result: 30% faster PR reviews, 2x contributor retention
```

---

## 🛒 E-commerce Platform Examples

### Example 1: Building Online Store

**Scenario**: Building e-commerce platform for fashion brand

```bash
# 1. Create e-commerce project
npx newt-templates create ecommerce-platform fashion-store \
  --project-name "StyleHub" \
  --catalog-type "fashion"

cd fashion-store

# 2. Design product catalog
/ui-design --path src/catalog
/brainstorm --mode product --topic "Product discovery features"

# 3. Implement checkout flow
# ... build cart, checkout, payment ...

# 4. Performance optimization
/review --focus performance --path src/checkout

# Output:
# Page load time: 1.2s (target: <2s) ✅
# Bundle size: 450KB (target: <500KB) ✅
# API response: 150ms (target: <200ms) ✅

# 5. Security review for payments
/review --focus security --path src/payment

# 6. Accessibility audit
/accessibility-audit --path src/

# Result: Fast, secure, accessible e-commerce platform
```

### Example 2: Scaling for Black Friday

**Scenario**: Preparing for 10x traffic spike

```bash
# 1. Performance baseline
/review --focus performance --depth full

# 2. Identify bottlenecks
/brainstorm --mode technical --topic "Performance optimization for scale"

# Output:
# - Database query optimization
# - CDN for static assets
# - Redis caching layer
# - API rate limiting

# 3. Implement optimizations
# ... add caching, optimize queries, CDN setup ...

# 4. Load testing
npm run load-test

# 5. Validate improvements
/review --focus performance

# Before: 500ms avg response time
# After: 80ms avg response time

# 6. Monitor during event
# Real-time dashboards active

# Result: Handled 10x traffic, 99.9% uptime
```

---

## 🔄 Cross-Template Workflows

### Example 1: Startup to Enterprise Migration

**Scenario**: Startup growing, needs enterprise features

```bash
# Phase 1: Current state (Startup MVP)
cd my-startup
/project-health --output json > baseline.json

# Phase 2: Add compliance features
# Gradually adopt enterprise patterns
/compliance-check --framework soc2 --identify-gaps

# Phase 3: Implement enterprise controls
# ... add security controls, audit logging ...

# Phase 4: Validate migration
/review --focus security --depth full
/compliance-check --framework soc2

# Result: Smooth transition to enterprise-grade
```

### Example 2: Open Source to Commercial

**Scenario**: Monetizing open source project

```bash
# Phase 1: Open source foundation
cd my-oss-project
/project-health

# Phase 2: Add commercial features
# Create enterprise edition
/brainstorm --mode product --topic "Enterprise features"

# Phase 3: Dual licensing
# Update LICENSE, add commercial terms

# Phase 4: Community communication
# Transparent communication about changes

# Result: Sustainable open source + commercial model
```

---

## 📊 Metrics-Driven Development

### Example: Using Health Scores for Decision Making

```bash
# Week 1: Baseline
/project-health --output json > week1.json
# Score: 75/100

# Week 2: Focus on security
/review --focus security --depth full
# Fix critical issues
/project-health --output json > week2.json
# Score: 82/100 (+7)

# Week 3: Performance optimization
/review --focus performance
# Optimize bottlenecks
/project-health --output json > week3.json
# Score: 88/100 (+6)

# Week 4: Code quality
/review --depth full
# Refactor complex code
/project-health --output json > week4.json
# Score: 92/100 (+4)

# Result: Systematic improvement, measurable progress
```

---

## 🎯 Team-Specific Examples

### Small Team (2-5 people)

```bash
# Use Startup MVP template
# Focus on velocity
/review --depth quick  # Fast reviews
/brainstorm --mode product  # Quick decisions
/project-health  # Weekly check-ins

# Optimize for speed while maintaining quality
```

### Medium Team (10-20 people)

```bash
# Use Startup MVP or Enterprise template
# Balance speed and process
/review --depth full  # Thorough reviews
/pr-review --suggest-commits  # Better PR management
/architecture-check  # Maintain structure

# Establish processes as team grows
```

### Large Team (50+ people)

```bash
# Use Enterprise Compliance template
# Strict processes and controls
/review --focus security --depth full
/compliance-check --framework soc2
/audit-prep --comprehensive

# Enterprise-grade quality and compliance
```

---

## 💡 Pro Tips from Real Usage

### Tip 1: Iterative Quality Improvement

```bash
# Don't aim for 100/100 immediately
# Week 1: Get to 70/100
# Week 2: Get to 80/100
# Week 3: Get to 85/100
# Gradual improvement is sustainable
```

### Tip 2: Focus on What Matters

```bash
# Security-critical app: Focus on security score
/review --focus security

# Performance-critical app: Focus on performance
/review --focus performance

# Prioritize based on your needs
```

### Tip 3: Automate Everything

```bash
# Set up CI/CD with quality gates
# Let automation handle routine checks
# Focus human review on complex decisions
```

### Tip 4: Learn from History

```bash
# Regular review of trends
/review-history --limit 30

# Identify patterns
# Address recurring issues
# Celebrate improvements
```

---

## 🚨 Common Scenarios & Solutions

### Scenario: Failing Quality Gates

```bash
# Problem: Health score 65/100, blocking deployment

# Solution:
/review --depth full  # Identify all issues
# Focus on critical and high severity first
/project-health  # Check progress
# Iterate until above threshold
```

### Scenario: Security Vulnerability Found

```bash
# Problem: Critical security issue in production

# Solution:
/incident-response --type security --severity critical
# Follow incident response workflow
/review --focus security --depth full
# Implement fix
/security-audit --validate-fix
```

### Scenario: Slow Development Velocity

```bash
# Problem: Team shipping slower than expected

# Solution:
/brainstorm --mode process --topic "Development bottlenecks"
# Identify issues (reviews, testing, deployment)
# Implement improvements
/project-health  # Monitor velocity metrics
```

---

**These examples show real-world usage of Newt templates. Adapt them to your specific needs!**
