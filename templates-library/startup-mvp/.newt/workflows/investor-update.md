---
description: Generate investor-ready project health reports
---

# Investor Update Workflow

Generate comprehensive, investor-ready reports showcasing project health, velocity, and technical excellence.

## Weekly Investor Report

### 1. Generate Project Health Report
```bash
/project-health --output json
```

**Captures**:
- Overall health score (0-100)
- Code quality metrics
- Security posture
- Technical debt status
- Velocity trends

### 2. Review Recent Activity
```bash
/review-history --limit 7
```

**Shows**:
- Features shipped this week
- Issues resolved
- Code quality improvements
- Team productivity

### 3. Compile Investor Deck Metrics

Use the JSON output to populate your investor deck:

```json
{
  "health_score": 85,
  "velocity": {
    "features_shipped": 12,
    "bugs_fixed": 8,
    "lines_added": 5420
  },
  "quality": {
    "test_coverage": 87,
    "security_score": 92,
    "performance_score": 88
  },
  "technical_debt": {
    "score": 78,
    "trend": "improving",
    "critical_issues": 0
  }
}
```

## Monthly Board Report

### 1. Comprehensive Health Analysis
```bash
/project-health --output json > reports/monthly-health-$(date +%Y-%m).json
```

### 2. Architecture Review
```bash
/architecture-check --output summary
```

**Highlights**:
- Architecture compliance
- Scalability readiness
- Technical foundation strength

### 3. Security Audit
```bash
/review --focus security --output summary
```

**Demonstrates**:
- Security best practices
- Vulnerability management
- Compliance status

## Quarterly Strategic Review

### 1. Brainstorm Next Quarter Goals
```bash
/brainstorm --mode product --topic "Q{{quarter}} strategic initiatives"
```

**Produces**:
- Strategic options
- Impact analysis
- Resource requirements
- Risk assessment

### 2. Technical Roadmap Planning
```bash
/brainstorm --mode technical --topic "Technical infrastructure for scale"
```

**Identifies**:
- Scalability improvements
- Infrastructure needs
- Technical investments
- Architecture evolution

### 3. Create ADRs for Major Decisions
```bash
/adr-draft --decision "{{strategic_initiative}}" --options "{{alternatives}}"
```

**Documents**:
- Strategic decisions
- Trade-off analysis
- Implementation plan
- Success metrics

## Investor Presentation Template

### Slide 1: Executive Summary
- **Health Score**: {{health_score}}/100
- **Velocity**: {{features_per_week}} features/week
- **Quality**: {{test_coverage}}% coverage
- **Security**: {{security_score}}/100

### Slide 2: Development Velocity
```
Week 1: {{week1_features}} features
Week 2: {{week2_features}} features
Week 3: {{week3_features}} features
Week 4: {{week4_features}} features

Trend: {{velocity_trend}}
```

### Slide 3: Code Quality
- **Test Coverage**: {{test_coverage}}%
- **Code Review Pass Rate**: {{review_pass_rate}}%
- **Technical Debt Ratio**: {{debt_ratio}}%
- **Automated Quality Gates**: ✅ Enabled

### Slide 4: Security & Compliance
- **Security Score**: {{security_score}}/100
- **Vulnerabilities**: {{critical_vulns}} critical, {{high_vulns}} high
- **Compliance**: {{compliance_frameworks}}
- **Audit Trail**: ✅ Complete

### Slide 5: Technical Foundation
- **Architecture Score**: {{architecture_score}}/100
- **Scalability**: Ready for {{scale_target}}x growth
- **Performance**: {{performance_metrics}}
- **Infrastructure**: {{infrastructure_status}}

### Slide 6: Next Quarter Roadmap
- **Top 3 Initiatives**: {{top_initiatives}}
- **Expected Impact**: {{impact_metrics}}
- **Resource Needs**: {{resource_requirements}}
- **Risk Mitigation**: {{risk_plans}}

## Automated Reporting

### Set Up Weekly Reports
Create `.github/workflows/investor-report.yml`:

```yaml
name: Weekly Investor Report

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM

jobs:
  generate-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate Health Report
        run: |
          npm run newt:health -- --output json > weekly-health.json
      
      - name: Upload to Dashboard
        run: |
          curl -X POST ${{ secrets.DASHBOARD_URL }} \
            -H "Content-Type: application/json" \
            -d @weekly-health.json
      
      - name: Send to Slack
        run: |
          node scripts/send-investor-update.js weekly-health.json
```

## Key Metrics to Track

### Development Metrics
- **Velocity**: Features shipped per week
- **Cycle Time**: Idea to production
- **Deployment Frequency**: Deploys per week
- **Lead Time**: Commit to deploy

### Quality Metrics
- **Health Score**: Overall project health
- **Test Coverage**: Percentage of code tested
- **Bug Density**: Bugs per 1000 lines
- **Code Review Quality**: Issues caught in review

### Security Metrics
- **Security Score**: Overall security posture
- **Vulnerability Count**: By severity
- **Time to Patch**: Average remediation time
- **Compliance Status**: Certification progress

### Business Metrics
- **Feature Completion Rate**: Planned vs delivered
- **Technical Debt Ratio**: Debt vs new features
- **Team Productivity**: Output per engineer
- **Quality vs Speed**: Balance metric

## Sample Investor Email

```
Subject: {{Company}} Weekly Update - Week of {{date}}

Hi {{investor_name}},

Quick update on our progress this week:

📊 **Health Score**: {{health_score}}/100 ({{trend}})

🚀 **Shipped This Week**:
- {{feature_1}}
- {{feature_2}}
- {{feature_3}}

✅ **Quality Metrics**:
- Test Coverage: {{coverage}}%
- Security Score: {{security}}/100
- Zero critical issues

📈 **Velocity**:
- {{features_count}} features shipped
- {{velocity_trend}} vs last week

🎯 **Next Week Focus**:
- {{next_week_priority_1}}
- {{next_week_priority_2}}

Full dashboard: {{dashboard_link}}

Best,
{{founder_name}}
```

## Dashboard Integration

### Metrics Dashboard
Create a real-time dashboard showing:

1. **Health Score Trend** (30 days)
2. **Velocity Chart** (features per week)
3. **Quality Metrics** (coverage, bugs, debt)
4. **Security Status** (vulnerabilities, compliance)
5. **Team Productivity** (commits, PRs, reviews)

### Tools
- **Grafana**: For metric visualization
- **Metabase**: For business intelligence
- **Custom Dashboard**: Using Newt JSON output

## Best Practices

### 1. Consistency
- Send updates same day/time each week
- Use consistent metrics
- Show trends, not just snapshots

### 2. Transparency
- Share both wins and challenges
- Explain technical debt decisions
- Show how you're addressing issues

### 3. Context
- Explain what metrics mean
- Compare to industry benchmarks
- Relate to business goals

### 4. Forward-Looking
- Always include next steps
- Show strategic thinking
- Demonstrate learning

## Troubleshooting

### Low Health Score
1. Run `/review --depth full` to identify issues
2. Prioritize critical and high severity items
3. Create action plan with timeline
4. Show progress in next update

### Declining Velocity
1. Run `/review-history` to analyze trends
2. Identify bottlenecks
3. Use `/brainstorm --mode process` for improvements
4. Implement changes and track results

### Security Concerns
1. Run comprehensive security audit
2. Document remediation plan
3. Show proactive security measures
4. Highlight compliance progress

---

*Transparency builds trust. Use Newt to demonstrate technical excellence.*
