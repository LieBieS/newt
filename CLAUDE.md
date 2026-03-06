# Newt — Claude Code Plugin

Newt is a comprehensive AI development assistant plugin. It provides architecture analysis, automated code reviews, security auditing, performance analysis, PR review automation, brainstorming, and frontend design tooling.

## Plugin Structure

- `commands/` — slash commands invokable via `/command-name`
- `skills/` — automated skills, each in a subdirectory with `SKILL.md`
- `agents/` — specialist agents called by commands and orchestrators
- `config/default.yml` — all configurable thresholds and settings
- `.claude-plugin/plugin.json` — manifest declaring all commands, skills, agents

## Available Commands

| Command | Purpose |
|---------|---------|
| `/review` | Full-stack code review via review-orchestrator |
| `/project-health` | Holistic codebase health score |
| `/review-history` | Browse past review logs |
| `/architecture-check` | Architecture pattern compliance |
| `/pr-review` | PR diff analysis with commit/split recommendations |
| `/brainstorm` | Structured ideation with ADR + experiment brief |
| `/converge` | Score and select top ideas |
| `/experiment-brief` | Generate experiment design |
| `/adr-draft` | Generate Architecture Decision Record |
| `/ui-design` | Frontend UI design specification |
| `/component-review` | Review UI component quality |
| `/accessibility-audit` | WCAG compliance audit |
| `/responsive-check` | Responsive breakpoint analysis |
| `/design-system` | Design system consistency review |
| `/ux-pattern-review` | UX pattern analysis |
| `/hook-install` | Install Git/IDE/CI hooks |
| `/hook-execute` | Run a specific hook manually |
| `/hook-list` | List all installed hooks |
| `/hook-uninstall` | Remove installed hooks |
| `/hook-status` | Check hook status and health |
| `/hook-test` | Test hook execution in dry-run mode |
| `/hook-validate` | Validate hook configuration |
| `/refresh-plugin` | Refresh plugin after repository updates |

## Validation

Run `npm run validate` to check plugin structural integrity.

## Configuration

Edit `config/default.yml` to adjust thresholds, integrations, and orchestration settings.
