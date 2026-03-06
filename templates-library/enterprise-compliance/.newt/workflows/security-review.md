---
description: Comprehensive security review workflow for enterprise applications
---

# Security Review Workflow

Enterprise-grade security review process ensuring compliance with security standards and regulatory requirements.

## Phase 1: Pre-Development Security Assessment

### 1. Threat Modeling
```bash
/brainstorm --mode technical --topic "Security threats for {{feature_name}}"
```

**Identify**:
- Attack vectors
- Threat actors
- Security controls needed
- Compliance requirements

### 2. Security Architecture Review
```bash
/architecture-check --focus security
```

**Validate**:
- Security boundaries
- Trust zones
- Authentication flows
- Authorization model
- Data classification

### 3. Create Security ADR
```bash
/adr-draft --decision "Security controls for {{feature_name}}" --options "{{security_options}}"
```

**Document**:
- Security requirements
- Control selection
- Risk acceptance
- Mitigation strategies

## Phase 2: Development Security Review

### 4. Code Security Scan
```bash
/review --focus security --depth full
```

**Checks**:
- SQL injection vulnerabilities
- XSS vulnerabilities
- CSRF protection
- Authentication bypass
- Authorization flaws
- Sensitive data exposure
- Insecure dependencies
- Secrets in code
- Security misconfigurations

### 5. OWASP Top 10 Validation
```bash
/security-audit --owasp-top-10
```

**Validates Against**:
1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable Components
7. Authentication Failures
8. Software & Data Integrity
9. Security Logging Failures
10. Server-Side Request Forgery

### 6. Dependency Security Audit
```bash
npm audit --audit-level=moderate
/review --focus dependencies
```

**Checks**:
- Known vulnerabilities
- Outdated packages
- License compliance
- Supply chain risks

## Phase 3: Compliance Validation

### 7. SOC2 Controls Check
```bash
/compliance-check --framework soc2
```

**Validates**:
- CC6.1: Logical Access Controls
- CC6.2: Prior to Issuing Credentials
- CC6.3: Removes Access
- CC6.6: Manages Encryption Keys
- CC6.7: Restricts Access
- CC6.8: Manages Credentials
- CC7.2: System Monitoring
- CC8.1: Change Management

### 8. GDPR Compliance Review
```bash
/compliance-check --framework gdpr
```

**Validates**:
- Data minimization
- Consent management
- Right to erasure
- Data portability
- Privacy by design
- Breach notification
- Data protection impact assessment

### 9. Data Classification Review
```bash
/review --focus data-classification
```

**Ensures**:
- PII identified and protected
- Sensitive data encrypted
- Data retention policies applied
- Access controls appropriate
- Audit logging enabled

## Phase 4: Security Testing

### 10. Static Application Security Testing (SAST)
```bash
npm run security:sast
```

**Tools**:
- SonarQube
- ESLint security plugins
- Semgrep
- CodeQL

### 11. Dynamic Application Security Testing (DAST)
```bash
npm run security:dast
```

**Tests**:
- Authentication bypass
- Authorization flaws
- Input validation
- Session management
- Error handling

### 12. Penetration Testing Preparation
```bash
/security-audit --pentest-prep
```

**Prepares**:
- Test scope definition
- Access provisioning
- Baseline documentation
- Success criteria

## Phase 5: Security Documentation

### 13. Security Controls Documentation
```bash
/document --type security-controls
```

**Documents**:
- Implemented controls
- Control effectiveness
- Residual risks
- Compensating controls

### 14. Incident Response Plan
```bash
/document --type incident-response
```

**Includes**:
- Detection procedures
- Escalation paths
- Containment steps
- Recovery procedures
- Post-incident review

### 15. Security Runbooks
```bash
/document --type security-runbooks
```

**Creates**:
- Security incident playbooks
- Breach notification procedures
- Forensics procedures
- Communication templates

## Phase 6: Audit Preparation

### 16. Generate Audit Evidence
```bash
/audit-prep --framework {{compliance_framework}}
```

**Collects**:
- Code review records
- Security scan results
- Penetration test reports
- Change management logs
- Access control matrices

### 17. Compliance Report Generation
```bash
/compliance-report --framework {{compliance_framework}} --output pdf
```

**Generates**:
- Control implementation status
- Evidence mapping
- Gap analysis
- Remediation plans

## Security Review Checklist

### Authentication & Authorization
- [ ] Multi-factor authentication implemented
- [ ] Password policy enforced
- [ ] Session management secure
- [ ] Authorization checks on all endpoints
- [ ] Principle of least privilege applied
- [ ] Role-based access control implemented

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] Data encrypted in transit (TLS 1.2+)
- [ ] Encryption keys properly managed
- [ ] PII identified and protected
- [ ] Data retention policies implemented
- [ ] Secure data deletion procedures

### Input Validation
- [ ] All inputs validated
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] File upload restrictions
- [ ] API rate limiting

### Security Configuration
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Error messages don't leak information
- [ ] Debug mode disabled in production
- [ ] Default credentials changed
- [ ] Unnecessary services disabled

### Logging & Monitoring
- [ ] Security events logged
- [ ] Audit trail immutable
- [ ] Log retention policy implemented
- [ ] Monitoring alerts configured
- [ ] Incident detection automated
- [ ] SIEM integration active

### Dependency Management
- [ ] Dependencies up to date
- [ ] No known vulnerabilities
- [ ] License compliance verified
- [ ] Supply chain risks assessed
- [ ] Automated dependency scanning
- [ ] Vulnerability patching process

## Security Gates

### Critical Security Issues (Block Deployment)
- SQL injection vulnerabilities
- Authentication bypass
- Hardcoded secrets
- Critical dependency vulnerabilities
- Missing encryption for sensitive data
- Broken access control

### High Security Issues (Require Plan)
- XSS vulnerabilities
- CSRF vulnerabilities
- Insecure session management
- High severity dependency vulnerabilities
- Missing security headers
- Insufficient logging

### Medium Security Issues (Track & Fix)
- Security misconfigurations
- Medium severity vulnerabilities
- Missing rate limiting
- Weak cryptography
- Information disclosure

## Compliance-Specific Requirements

### SOC2 Type II
```bash
# Quarterly security review
/security-audit --soc2 --comprehensive

# Evidence collection
/audit-prep --framework soc2 --period quarterly

# Control testing
/compliance-check --framework soc2 --test-controls
```

### GDPR
```bash
# Privacy impact assessment
/privacy-assessment --feature {{feature_name}}

# Data flow mapping
/data-flow-analysis --include-pii

# Consent management review
/compliance-check --framework gdpr --focus consent
```

### HIPAA
```bash
# PHI identification
/data-classification --identify-phi

# Technical safeguards review
/compliance-check --framework hipaa --safeguards technical

# Breach risk assessment
/risk-assessment --framework hipaa
```

## Incident Response Integration

### Security Incident Detection
```bash
/incident-detect --severity {{severity}}
```

### Incident Response Activation
```bash
/incident-response --type {{incident_type}} --severity {{severity}}
```

### Post-Incident Review
```bash
/post-mortem --incident {{incident_id}} --generate-adr
```

## Continuous Security Monitoring

### Daily Automated Scans
- Dependency vulnerability scanning
- Secret detection in commits
- Security configuration drift
- Access control validation

### Weekly Security Reviews
- Code security review
- Compliance status check
- Vulnerability remediation tracking
- Security metrics reporting

### Monthly Security Assessments
- Comprehensive security audit
- Penetration testing
- Compliance framework validation
- Security training effectiveness

### Quarterly Security Audits
- External security assessment
- Compliance certification preparation
- Security architecture review
- Incident response testing

## Security Metrics

Track these metrics:
- **Mean Time to Detect (MTTD)**: Target <1 hour
- **Mean Time to Respond (MTTR)**: Target <4 hours
- **Vulnerability Remediation Time**: Critical <24h, High <7d
- **Security Score**: Target >90
- **Compliance Score**: Target 100%
- **Security Training Completion**: Target 100%

## Troubleshooting

### High Severity Vulnerabilities Found
1. Assess immediate risk
2. Implement temporary mitigation
3. Create remediation plan
4. Track to completion
5. Verify fix effectiveness

### Compliance Gap Identified
1. Document gap details
2. Assess impact and risk
3. Create remediation plan
4. Implement controls
5. Collect evidence
6. Update compliance status

### Security Incident Detected
1. Activate incident response
2. Contain the incident
3. Investigate root cause
4. Remediate vulnerabilities
5. Conduct post-mortem
6. Update security controls

---

*Security is not optional. Every feature must pass security review before deployment.*
