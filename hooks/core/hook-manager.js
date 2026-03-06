/**
 * Newt Hook Manager
 * Central management system for all Newt hooks
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

class HookManager {
  constructor(configPath = '.newt/hooks.yml') {
    this.configPath = configPath;
    this.config = this.loadConfig();
    this.hooks = new Map();
    this.loadHooks();
  }

  /**
   * Load hook configuration
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const yaml = require('js-yaml');
        return yaml.load(fs.readFileSync(this.configPath, 'utf8'));
      }
    } catch (err) {
      console.warn(`Warning: Could not load hook config: ${err.message}`);
    }
    
    return this.getDefaultConfig();
  }

  /**
   * Get default hook configuration
   */
  getDefaultConfig() {
    return {
      hooks: {
        'pre-commit': {
          enabled: true,
          commands: ['review', 'security-scan'],
          thresholds: {
            min_score: 75,
            block_on_critical: true,
            block_on_high: false
          },
          file_types: {
            'typescript': 'full',
            'javascript': 'standard',
            'json': 'validation',
            'md': 'documentation'
          }
        },
        'pre-push': {
          enabled: true,
          commands: ['project-health', 'dependency-audit'],
          thresholds: {
            min_score: 70,
            block_on_critical: true
          }
        },
        'post-commit': {
          enabled: true,
          commands: ['update-metrics'],
          async: true
        },
        'file-save': {
          enabled: true,
          delay_ms: 500,
          suggestions: true,
          commands: ['quick-review']
        }
      },
      global: {
        timeout_seconds: 300,
        parallel_execution: false,
        log_level: 'info',
        notifications: {
          slack: false,
          email: false
        }
      }
    };
  }

  /**
   * Load all hook modules
   */
  loadHooks() {
    const hooksDir = path.join(__dirname, '..');
    
    // Load git hooks
    this.loadHooksFromDirectory(path.join(hooksDir, 'git'));
    
    // Load IDE hooks
    this.loadHooksFromDirectory(path.join(hooksDir, 'ide'));
    
    // Load CI/CD hooks
    this.loadHooksFromDirectory(path.join(hooksDir, 'cicd'));
    
    // Load custom hooks
    this.loadHooksFromDirectory(path.join(hooksDir, 'custom'));
  }

  /**
   * Load hooks from a directory
   */
  loadHooksFromDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
    
    files.forEach(file => {
      const hookPath = path.join(dir, file);
      const hookName = path.basename(file, '.js');
      
      try {
        const HookClass = require(hookPath);
        this.hooks.set(hookName, new HookClass(this.config));
      } catch (err) {
        console.warn(`Warning: Could not load hook ${hookName}: ${err.message}`);
      }
    });
  }

  /**
   * Execute a hook by name
   */
  async executeHook(hookName, context = {}) {
    const hook = this.hooks.get(hookName);
    if (!hook) {
      throw new Error(`Hook not found: ${hookName}`);
    }

    const config = this.config.hooks[hookName];
    if (!config || !config.enabled) {
      console.log(`Hook ${hookName} is disabled`);
      return { success: true, message: 'Hook disabled' };
    }

    console.log(`Executing hook: ${hookName}`);
    
    try {
      const result = await hook.execute(context);
      this.logResult(hookName, result);
      return result;
    } catch (err) {
      console.error(`Hook ${hookName} failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Execute multiple hooks
   */
  async executeHooks(hookNames, context = {}) {
    const results = {};
    
    if (this.config.global.parallel_execution) {
      // Execute hooks in parallel
      const promises = hookNames.map(name => 
        this.executeHook(name, context).then(result => ({ name, result }))
      );
      
      const parallelResults = await Promise.all(promises);
      parallelResults.forEach(({ name, result }) => {
        results[name] = result;
      });
    } else {
      // Execute hooks sequentially
      for (const name of hookNames) {
        results[name] = await this.executeHook(name, context);
        
        // Stop on failure if configured
        if (!results[name].success && this.config.global.stop_on_failure) {
          break;
        }
      }
    }
    
    return results;
  }

  /**
   * Get available hooks
   */
  getAvailableHooks() {
    return Array.from(this.hooks.keys());
  }

  /**
   * Get hook configuration
   */
  getHookConfig(hookName) {
    return this.config.hooks[hookName];
  }

  /**
   * Update hook configuration
   */
  updateHookConfig(hookName, config) {
    this.config.hooks[hookName] = { ...this.config.hooks[hookName], ...config };
    this.saveConfig();
  }

  /**
   * Save configuration to file
   */
  saveConfig() {
    const yaml = require('js-yaml');
    const yamlContent = yaml.dump(this.config, { indent: 2 });
    fs.writeFileSync(this.configPath, yamlContent, 'utf8');
  }

  /**
   * Log hook execution result
   */
  logResult(hookName, result) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      hook: hookName,
      success: result.success,
      duration: result.duration,
      message: result.message
    };

    // Log to console
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${hookName}: ${result.message}`);

    // Log to file if configured
    if (this.config.global.log_file) {
      this.writeLogFile(logEntry);
    }
  }

  /**
   * Write to log file
   */
  writeLogFile(logEntry) {
    const logFile = this.config.global.log_file;
    const logLine = JSON.stringify(logEntry) + '\n';
    
    try {
      fs.appendFileSync(logFile, logLine, 'utf8');
    } catch (err) {
      console.warn(`Warning: Could not write to log file: ${err.message}`);
    }
  }

  /**
   * Install hooks (git hooks, IDE plugins, etc.)
   */
  async installHooks() {
    console.log('Installing Newt hooks...');
    
    // Install git hooks
    await this.installGitHooks();
    
    // Install IDE hooks
    await this.installIDEHooks();
    
    // Install CI/CD hooks
    await this.installCICDHooks();
    
    console.log('✅ Hook installation complete');
  }

  /**
   * Install git hooks
   */
  async installGitHooks() {
    const gitHooksDir = '.git/hooks';
    
    if (!fs.existsSync(gitHooksDir)) {
      console.log('Not a git repository, skipping git hooks');
      return;
    }

    const gitHooks = ['pre-commit', 'pre-push', 'post-commit'];
    
    for (const hookName of gitHooks) {
      const hookPath = path.join(gitHooksDir, hookName);
      const hookScript = this.generateGitHookScript(hookName);
      
      fs.writeFileSync(hookPath, hookScript, { mode: 0o755 });
      console.log(`✓ Installed git hook: ${hookName}`);
    }
  }

  /**
   * Generate git hook script
   */
  generateGitHookScript(hookName) {
    return `#!/bin/bash
# Newt ${hookName} hook
# Generated by Newt Hook Manager

npx newt hook:execute ${hookName}
exit_code=$?

if [ $exit_code -ne 0 ]; then
  echo "❌ Newt ${hookName} hook failed"
  echo "Run 'npx newt hook:execute ${hookName} --verbose' for details"
  exit 1
fi

echo "✅ Newt ${hookName} hook passed"
exit 0
`;
  }

  /**
   * Install IDE hooks
   */
  async installIDEHooks() {
    // Implementation depends on IDE
    console.log('IDE hooks installation (IDE-specific)');
  }

  /**
   * Install CI/CD hooks
   */
  async installCICDHooks() {
    // Implementation depends on CI/CD system
    console.log('CI/CD hooks installation (platform-specific)');
  }

  /**
   * Uninstall hooks
   */
  async uninstallHooks() {
    console.log('Uninstalling Newt hooks...');
    
    // Remove git hooks
    const gitHooksDir = '.git/hooks';
    if (fs.existsSync(gitHooksDir)) {
      const hooks = fs.readdirSync(gitHooksDir);
      hooks.forEach(hook => {
        if (hook.startsWith('newt-')) {
          fs.unlinkSync(path.join(gitHooksDir, hook));
        }
      });
    }
    
    console.log('✅ Hook uninstallation complete');
  }
}

module.exports = HookManager;

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const hookName = args[1];
  
  const manager = new HookManager();
  
  switch (command) {
    case 'execute':
      if (!hookName) {
        console.error('Usage: node hook-manager.js execute <hook-name>');
        process.exit(1);
      }
      manager.executeHook(hookName)
        .then(result => {
          process.exit(result.success ? 0 : 1);
        })
        .catch(err => {
          console.error('Hook execution failed:', err.message);
          process.exit(1);
        });
      break;
      
    case 'install':
      manager.installHooks()
        .then(() => process.exit(0))
        .catch(err => {
          console.error('Installation failed:', err.message);
          process.exit(1);
        });
      break;
      
    case 'uninstall':
      manager.uninstallHooks()
        .then(() => process.exit(0))
        .catch(err => {
          console.error('Uninstallation failed:', err.message);
          process.exit(1);
        });
      break;
      
    case 'list':
      console.log('Available hooks:');
      manager.getAvailableHooks().forEach(name => {
        console.log(`  - ${name}`);
      });
      break;
      
    default:
      console.log('Usage: node hook-manager.js <command> [hook-name]');
      console.log('Commands: execute, install, uninstall, list');
      process.exit(1);
  }
}
