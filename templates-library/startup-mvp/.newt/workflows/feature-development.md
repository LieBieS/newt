---
description: Complete feature development workflow for startups
---

# Feature Development Workflow

This workflow guides you through developing a new feature from ideation to deployment using Newt's AI agents.

## Phase 1: Ideation & Planning

### 1. Brainstorm Feature Ideas
```bash
/brainstorm --mode product --topic "{{feature_area}}"
```

**Expected Output**:
- 15+ feature ideas
- Top 3 candidates with trade-offs
- ADR draft for selected feature
- Experiment brief

### 2. Create Architecture Decision Record
```bash
/adr-draft --decision "{{feature_name}}" --options "{{implementation_options}}"
```

**Expected Output**:
- Context and problem statement
- Options analysis
- Decision rationale
- Implementation plan

### 3. Design Review (if UI component)
```bash
/ui-design --path src/features/{{feature_name}}
```

**Expected Output**:
- UI/UX recommendations
- Accessibility compliance
- Design system consistency
- Performance considerations

## Phase 2: Implementation

### 4. Create Feature Branch
```bash
git checkout -b feature/{{feature_name}}
```

### 5. Implement Core Logic
Write your feature code following the architecture from the ADR.

**Best Practices**:
- Keep functions small (<50 lines)
- Write tests as you go
- Follow existing patterns
- Document complex logic

### 6. Run Continuous Review
```bash
/review --path src/features/{{feature_name}} --depth quick
```

**Run this after each significant change**:
- After implementing core logic
- After adding tests
- After refactoring
- Before committing

**Quality Gates**:
- No critical security issues
- No circular dependencies
- Complexity within thresholds
- Test coverage >80%

## Phase 3: Testing & Quality

### 7. Comprehensive Code Review
```bash
/review --path src/features/{{feature_name}} --depth full
```

**Expected Output**:
- Architecture analysis
- Security audit
- Performance analysis
- Code quality metrics

### 8. Architecture Validation
```bash
/architecture-check src/features/{{feature_name}}
```

**Validates**:
- Layer separation
- Dependency direction
- Pattern compliance
- Coupling metrics

### 9. Fix Issues
Address all Critical and High severity issues before proceeding.

**Priority Order**:
1. Security vulnerabilities
2. Architecture violations
3. Performance bottlenecks
4. Code quality issues

## Phase 4: Pull Request

### 10. Prepare PR
```bash
/pr-review --staged
```

**Expected Output**:
- Commit boundary suggestions
- PR description template
- Risk assessment
- Reviewer recommendations

### 11. Create Pull Request
Use the generated PR description template.

**Include**:
- Feature summary
- Implementation details
- Testing evidence
- Breaking changes (if any)
- Screenshots (for UI features)

### 12. Address Review Comments
```bash
/review --path {{changed_files}}
```

Run after addressing each batch of review comments.

## Phase 5: Deployment

### 13. Pre-deployment Check
```bash
/project-health --output json
```

**Verify**:
- Health score >75
- No critical issues
- All tests passing
- Documentation updated

### 14. Merge & Deploy
```bash
git checkout main
git merge feature/{{feature_name}}
git push origin main
```

CI/CD will automatically:
- Run full test suite
- Execute Newt quality gates
- Deploy to staging
- Run smoke tests
- Deploy to production (if staging passes)

### 15. Post-deployment Monitoring
Monitor for:
- Error rates
- Performance metrics
- User feedback
- Feature adoption

## Quick Reference

### Fast Track (Small Features)
```bash
/brainstorm --mode product --topic "{{feature}}"
# Implement feature
/review --path src/features/{{feature}}
/pr-review --staged
# Create PR and merge
```

### Full Track (Major Features)
```bash
/brainstorm --mode product --topic "{{feature}}"
/adr-draft --decision "{{feature}}"
/ui-design --path src/features/{{feature}}
# Implement feature
/review --depth full
/architecture-check src/features/{{feature}}
/pr-review --staged
# Create PR, review, merge
/project-health
```

## Success Metrics

Track these metrics for each feature:
- **Development Time**: Target <2 weeks
- **Code Quality Score**: Target >85
- **Test Coverage**: Target >80%
- **Review Cycles**: Target <3
- **Time to Production**: Target <1 week after PR approval

## Troubleshooting

### Review Fails with Critical Issues
1. Run `/review --depth full` for detailed analysis
2. Focus on security and architecture issues first
3. Use `/brainstorm --mode technical` for solution ideas
4. Refactor and re-review

### PR Too Large
1. Run `/pr-review --staged --suggest-commits`
2. Split into multiple smaller PRs
3. Ensure each PR is independently deployable
4. Maintain feature flags for partial features

### Architecture Violations
1. Run `/architecture-check` for detailed analysis
2. Review ADR for intended architecture
3. Refactor to align with patterns
4. Update ADR if architecture needs to change

## Tips for Startup Speed

1. **Use Quick Reviews During Development**
   - Run `/review --depth quick` frequently
   - Save full reviews for PR time

2. **Leverage Brainstorming Early**
   - Don't skip the ideation phase
   - Better ideas upfront = less rework

3. **Automate Everything**
   - Let CI/CD handle quality gates
   - Focus on building features

4. **Iterate Fast**
   - Ship MVPs quickly
   - Use feature flags
   - Gather feedback early

---

*This workflow is optimized for startup velocity while maintaining code quality.*
