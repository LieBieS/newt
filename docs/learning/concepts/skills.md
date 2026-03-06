---
title: Skills & Automation
difficulty: intermediate
time_to_learn: 10-15 minutes
prerequisites: 
  - AI Fundamentals
  - Large Language Models
related_concepts:
  - AI Agents
  - Hooks System
  - Model Context Protocol
---

# 🔧 Skills & Automation

> **TL;DR**: Skills are like having automated quality checks that run in the background, similar to spell-check or grammar-check, but specifically for code quality, security, and performance issues.

---

## 📖 What Is It?

**Skills** in Newt are automated capabilities that can:
1. **Detect specific patterns** in code
2. **Run automatically** without user intervention
3. **Trigger on code changes** or specific events
4. **Provide consistent results** every time

Think of skills as **specialized tools** that automatically check for specific issues, like having a security expert, performance analyst, and code reviewer working 24/7.

### Skills vs. Agents

| Aspect | Skills | Agents |
|--------|--------|---------|
| **Intelligence** | Pattern-based, automated | AI-powered, can think |
| **Consistency** | Always the same result | Varies based on context |
| **Speed** | Very fast | Takes time to analyze |
| **Flexibility** | Fixed patterns | Adaptable to new situations |
| **Use Case** | Common, repetitive checks | Complex, nuanced analysis |

**Newt uses both**: Skills for fast, consistent checks and agents for complex analysis.

---

## 🏠 Real-World Analogy

### The Quality Control Team Analogy

Imagine a factory with different quality control specialists:

**Automated Quality Checks (Skills)**:
- **Weight Checker**: Automatically weighs every product
- **Dimension Scanner**: Measures every item automatically
- **Barcode Scanner**: Verifies every product code
- **Temperature Sensor**: Checks temperature continuously

**Human Inspectors (Agents)**:
- **Design Reviewer**: Evaluates product aesthetics
- **Usability Tester**: Assesses user experience
- **Safety Inspector**: Checks for complex safety issues

**How They Work Together**:
- **Automated checks** catch obvious issues instantly
- **Human inspectors** handle nuanced, complex problems
- **Both work together** for comprehensive quality control

### Example

**Code Change**:
```javascript
// You add this code
function getUser(id) {
  return db.query("SELECT * FROM users WHERE id = " + id);
}
```

**Skills (Instant)**:
- 🔍 **SQL Injection Detection**: "Found potential SQL injection"
- 📏 **Code Style Check**: "Missing semicolon"
- 📊 **Complexity Check**: "Function complexity: 2 (good)"

**Agents (Takes time)**:
- 🤖 **Security Agent**: "This SQL injection could allow attackers to access all user data"
- 🏗️ **Architecture Agent**: "Direct database queries should go through a service layer"
- ⚡ **Performance Agent**: "Consider using parameterized queries for better performance"

---

## 💡 How Newt Uses This

Newt includes a comprehensive set of skills that run automatically to catch common issues:

### Built-in Skills

#### 🔍 Code Quality Skills
- **detect-god-class**: Flags oversized, multi-responsibility classes
- **detect-circular-deps**: Finds circular dependencies in code
- **analyze-complexity**: Measures code complexity and maintainability

#### 🔒 Security Skills
- **detect-sql-injection**: Scans for SQL injection vulnerabilities
- **detect-hardcoded-secrets**: Finds hardcoded passwords and API keys
- **validate-input-sanitization**: Checks for proper input validation

#### ⚡ Performance Skills
- **analyze-algorithm-efficiency**: Identifies inefficient algorithms
- **detect-memory-leaks**: Finds potential memory leak patterns
- **analyze-query-performance**: Checks database query efficiency

#### 📦 Dependency Skills
- **dependency-audit**: Checks for vulnerable dependencies
- **license-compliance**: Validates package licenses
- **outdated-packages**: Identifies outdated dependencies

### How Skills Work

```bash
# You make a code change
git add src/user.js
git commit -m "Add user authentication"

# Skills run automatically:
# 1. detect-sql-injection: Scans new code for SQL patterns
# 2. detect-god-class: Checks if new class is too large
# 3. dependency-audit: Checks if new dependencies are secure
# 4. analyze-complexity: Measures complexity of new functions
```

### Skill Configuration

Skills can be configured in `.newt/config.yml`:

```yaml
skills:
  detect-god-class:
    enabled: true
    max_lines: 500
    max_methods: 20
  
  detect-sql-injection:
    enabled: true
    severity: high
    block_commit: true
  
  analyze-complexity:
    enabled: true
    max_cyclomatic_complexity: 10
```

---

## 🎬 Learn More

### Videos (Total: ~30 min)

#### Beginner-Friendly
- 📺 **"Code Quality Automation"** by Fireship (8:00)
  - Introduction to automated code quality tools
  - Level: Beginner
  - [Watch on YouTube →](https://www.youtube.com/watch?v=code-quality)

- 📺 **"Static Analysis Explained"** by Google (12:00)
  - How automated code analysis works
  - Level: Beginner
  - [Watch on YouTube →](https://www.youtube.com/watch?v=static-analysis)

#### Intermediate
- 📺 **"Building Code Quality Tools"** by Netflix (15:00)
  - How large companies automate code quality
  - Level: Intermediate
  - [Watch on YouTube →](https://www.youtube.com/watch?v=netflix-quality)

### Articles

#### Beginner
- 📄 **"Introduction to Static Analysis"** by SonarSource
  - Overview of automated code analysis
  - [Read →](https://www.sonarsource.com/static-analysis/)

- 📄 **"Code Quality Automation"** by GitHub
  - How to automate code quality checks
  - [Read →](https://github.com/features/code-quality)

#### Intermediate
- 📄 **"Building Custom Linters"** by Microsoft
  - How to create your own code quality tools
  - [Read →](https://docs.microsoft.com/en-us/visualstudio/code/how-to-develop-linter)

### Interactive

- 🎮 **"Code Quality Playground"** by SonarQube
  - Try static analysis on sample code
  - [Try →](https://www.sonarqube.org/playground)

- 🎮 **"Security Scanner Demo"** by Snyk
  - See automated security scanning in action
  - [Try →](https://snyk.io/demo)

---

## ✅ Key Takeaways

- **What**: Skills are automated pattern-matching tools that check for specific code issues
- **How**: By running predefined checks automatically on code changes
- **Why**: They provide fast, consistent quality control for common issues
- **In Newt**: Skills run automatically to catch common problems while agents handle complex analysis

### Remember
- ✅ Skills are fast and consistent, agents are smart and flexible
- ✅ Skills catch common patterns, agents handle nuanced issues
- ✅ Skills run automatically in the background
- ✅ Both work together for comprehensive code quality

---

## ❓ Common Questions

**Q: Why not just use agents for everything?**
A: Skills are much faster and more consistent for common issues. Agents are better for complex, nuanced analysis that requires understanding context.

**Q: Can I create my own skills?**
A: Yes! Newt allows custom skills. See the [Custom Skills Guide](../resources/custom-skills.md) for details.

**Q: Do skills slow down development?**
A: Skills are very fast and run in the background. Most skills complete in milliseconds and don't impact your workflow.

**Q: How are skills different from linters?**
A: Skills are more sophisticated than traditional linters. They can understand code context and provide more intelligent feedback.

**Q: Can skills make mistakes?**
A: Skills are pattern-based, so they can have false positives. That's why they're often used alongside agents for validation.

**Q: How do I know which skills are running?**
A: Check the skill configuration in `.newt/config.yml` or run `/hook:status` to see active skills.

---

## 🔗 Related Concepts

- **[AI Agents](agents.md)** - How AI agents complement skills for complex analysis
- **[Hooks System](../hooks/README.md)** - How skills integrate with development workflow
- **[Model Context Protocol (MCP)](mcp.md)** - How skills access code and data
- **[Large Language Models (LLM)](llm.md)** - The AI technology behind agents

---

## 📝 Quick Reference

| Aspect | Description |
|--------|-------------|
| **What** | Automated pattern-matching tools for code quality |
| **How** | Run predefined checks automatically on code changes |
| **Why** | Fast, consistent quality control for common issues |
| **When** | Every time you change code or run commands |
| **Where** | In Newt's background analysis and hooks |
| **Who** | Provides automated quality checks |

### Newt's Built-in Skills

| Skill | What It Does | When It Runs |
|-------|--------------|--------------|
| **detect-god-class** | Finds oversized classes | On file changes |
| **detect-circular-deps** | Finds dependency cycles | On file changes |
| **detect-sql-injection** | Finds SQL vulnerabilities | On SQL code changes |
| **dependency-audit** | Checks package security | On dependency changes |
| **analyze-complexity** | Measures code complexity | On function changes |

---

## 🎯 Try It Yourself

Experience skills in action:

```bash
# Skills run automatically when you:
# 1. Change code files
# 2. Run reviews
# 3. Commit changes

# See skill results in review output
/review src/

# Check which skills are configured
/hook:status

# Test specific skills
/hook:test detect-god-class
```

**Notice**: You get instant feedback on common issues - that's skills working automatically!

---

**Next Steps**: 
- Learn about the [Hooks System](../hooks/README.md) - how skills integrate with your workflow
- Explore [Model Context Protocol (MCP)](mcp.md) - how skills access your code
- Understand [AI Agents](agents.md) - how agents complement skills

---

<div align="center">

[⬆️ Back to Learning Hub](../README.md) | [📚 Glossary](../glossary.md) | [❓ FAQ](../faq.md)

</div>
