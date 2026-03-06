---
title: /refresh-plugin
purpose: Refresh Newt plugin in IDE when repository updates
outputs:
  sections:
    - Refresh Summary
    - Changes Detected
    - Installation Status
    - IDE Notification
---

## Description
Automatically refreshes the Newt plugin in Windsurf/Cursor whenever the repository is updated. This ensures you always have the latest version of the plugin without manual reinstallation.

## Usage
```bash
/refresh-plugin [--target <ide>] [--force] [--watch] [--interval <seconds>]
```

### Options
- `--target`: Target IDE (windsurf, cursor, claude) - default: windsurf
- `--force`: Force refresh even if no changes detected
- `watch`: Watch mode for automatic refresh on repository changes
- `--interval`: Watch interval in seconds - default: 30

### Examples
```bash
# Refresh plugin (auto-detect changes)
/refresh-plugin

# Force refresh regardless of changes
/refresh-plugin --force

# Watch mode for automatic updates
/refresh-plugin --watch

# Watch with custom interval
/refresh-plugin --watch --interval 60

# Target specific IDE
/refresh-plugin --target cursor
```

## Behavior
1. Detects repository changes using git commit hash comparison
2. Backs up existing plugin installation
3. Copies latest plugin files to IDE plugin directory
4. Validates plugin installation
5. Notifies IDE of plugin update
6. Updates metrics and logs

## Target IDEs

### Windsurf
- **Plugin Path**: `%APPDATA%\Windsurf\plugins\newt`
- **Notification**: Config file update triggers plugin reload
- **Auto-refresh**: Works with Windsurf's plugin system

### Cursor
- **Plugin Path**: `%APPDATA%\Cursor\plugins\newt`
- **Notification**: File-based notification system
- **Auto-refresh**: Works with Cursor's plugin system

### Claude Code
- **Plugin Path**: `%APPDATA%\Claude\plugins\newt`
- **Notification**: File-based notification system
- **Auto-refresh**: Works with Claude Code's plugin system

## Configuration

### Hook Configuration
Configure automatic refresh in `.newt/hooks.yml`:

```yaml
hooks:
  post-commit:
    enabled: true
    commands:
      - refresh-plugin
      - update-metrics
    async: true
    timeout_seconds: 60
```

### Watch Mode Configuration
```yaml
global:
  watch:
    enabled: true
    interval_seconds: 30
    auto_start: false
```

## Integration

### Git Hooks Integration
The refresh system integrates with Git hooks:

```bash
# Post-commit hook (automatic)
.git/hooks/post-commit

# Pre-push hook (optional)
.git/hooks/pre-push
```

### IDE Integration
- **Windsurf**: Updates config.json to trigger plugin reload
- **Cursor**: Creates notification file for IDE detection
- **Claude Code**: File-based notification system

### NPM Scripts
```json
{
  "scripts": {
    "refresh:plugin": "node scripts/refresh-plugin.js",
    "refresh:plugin:watch": "node scripts/refresh-plugin.js --watch",
    "refresh:plugin:windsurf": "powershell -ExecutionPolicy Bypass -File scripts/refresh-plugin.ps1 --target windsurf",
    "refresh:plugin:cursor": "powershell -ExecutionPolicy Bypass -File scripts/refresh-plugin.ps1 --target cursor"
  }
}
```

## Output Contract

All sections must be present. Empty sections must state `None`.
