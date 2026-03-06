#!/usr/bin/env node
/**
 * Node.js wrapper for Newt plugin refresh
 * Cross-platform plugin refresh functionality
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const config = {
    pluginName: 'newt',
    sourceDir: '.claude-plugin',
    backupDir: '.newt/backup',
    logFile: '.newt/logs/refresh.log'
};

// Parse command line arguments
const args = process.argv.slice(2);
let targetIDE = 'windsurf';
let force = false;
let watch = false;
let interval = 30;

for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
        case '--target':
            targetIDE = args[++i];
            break;
        case '--force':
            force = true;
            break;
        case '--watch':
            watch = true;
            break;
        case '--interval':
            interval = parseInt(args[++i]);
            break;
    }
}

// IDE paths
const idePaths = {
    windsurf: path.join(process.env.APPDATA || '', 'Windsurf', 'plugins'),
    cursor: path.join(process.env.APPDATA || '', 'Cursor', 'plugins'),
    claude: path.join(process.env.APPDATA || '', 'Claude', 'plugins')
};

// Logging function
function log(level, message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}`;
    
    console.log(logEntry);
    
    try {
        if (!fs.existsSync(path.dirname(config.logFile))) {
            fs.mkdirSync(path.dirname(config.logFile), { recursive: true });
        }
        fs.appendFileSync(config.logFile, logEntry + '\n', 'utf8');
    } catch (error) {
        console.warn('Failed to write to log file:', error.message);
    }
}

// Check if source directory exists
function checkSource() {
    if (!fs.existsSync(config.sourceDir)) {
        log('ERROR', `Plugin source directory not found: ${config.sourceDir}`);
        process.exit(1);
    }
    return true;
}

// Get target IDE path
function getTargetPath() {
    const targetPath = idePaths[targetIDE];
    
    if (!targetPath) {
        log('ERROR', `Unsupported IDE: ${targetIDE}`);
        log('ERROR', `Supported IDEs: ${Object.keys(idePaths).join(', ')}`);
        return null;
    }
    
    const pluginPath = path.join(targetPath, config.pluginName);
    
    // Create target directory if it doesn't exist
    if (!fs.existsSync(path.dirname(pluginPath))) {
        try {
            fs.mkdirSync(path.dirname(pluginPath), { recursive: true });
            log('INFO', `Created target directory: ${path.dirname(pluginPath)}`);
        } catch (error) {
            log('ERROR', `Failed to create target directory: ${error.message}`);
            return null;
        }
    }
    
    return pluginPath;
}

// Backup existing plugin
function backupPlugin(targetPath) {
    if (!fs.existsSync(targetPath)) {
        return; // Nothing to backup
    }
    
    try {
        if (!fs.existsSync(config.backupDir)) {
            fs.mkdirSync(config.backupDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '').replace('T', '_');
        const backupPath = path.join(config.backupDir, `plugin-backup-${timestamp}`);
        
        fs.cpSync(targetPath, backupPath, { recursive: true });
        log('INFO', `Backed up existing plugin to: ${backupPath}`);
        return true;
    } catch (error) {
        log('ERROR', `Failed to backup plugin: ${error.message}`);
        return false;
    }
}

// Refresh plugin
function refreshPlugin() {
    const sourcePath = config.sourceDir;
    const targetPath = getTargetPath();
    
    if (!targetPath) {
        return false;
    }
    
    log('INFO', `Refreshing plugin from ${sourcePath} to ${targetPath}`);
    
    try {
        // Remove existing plugin
        if (fs.existsSync(targetPath)) {
            fs.rmSync(targetPath, { recursive: true, force: true });
            log('INFO', 'Removed existing plugin');
        }
        
        // Copy new plugin
        fs.cpSync(sourcePath, targetPath, { recursive: true });
        log('INFO', 'Copied plugin to target location');
        
        // Verify installation
        const pluginJson = path.join(targetPath, 'plugin.json');
        if (fs.existsSync(pluginJson)) {
            const pluginData = JSON.parse(fs.readFileSync(pluginJson, 'utf8'));
            log('INFO', `Plugin refreshed successfully: ${pluginData.name} v${pluginData.version}`);
            log('INFO', `Commands available: ${pluginData.commands?.join(', ') || 'none'}`);
            return true;
        } else {
            log('ERROR', 'Plugin validation failed: plugin.json not found');
            return false;
        }
        
    } catch (error) {
        log('ERROR', `Failed to refresh plugin: ${error.message}`);
        return false;
    }
}

// Validate plugin
function validatePlugin() {
    const targetPath = getTargetPath();
    
    if (!targetPath) {
        return false;
    }
    
    try {
        const validationScript = path.join('scripts', 'validate-plugin.js');
        if (fs.existsSync(validationScript)) {
            const result = spawn('node', [validationScript], { stdio: 'pipe' });
            
            let output = '';
            result.stdout.on('data', (data) => {
                output += data.toString();
            });
            
            result.on('close', (code) => {
                if (code === 0) {
                    log('INFO', 'Plugin validation passed');
                    return true;
                } else {
                    log('ERROR', `Plugin validation failed: ${output}`);
                    return false;
                }
            });
            
            return true; // Async, assume success for now
        } else {
            log('WARNING', 'Validation script not found, skipping validation');
            return true;
        }
    } catch (error) {
        log('ERROR', `Failed to validate plugin: ${error.message}`);
        return false;
    }
}

// Notify IDE about plugin update
function notifyIDE(targetPath) {
    try {
        // Create notification file
        const notificationFile = path.join(targetPath, '.newt-refreshed');
        const timestamp = new Date().toISOString();
        fs.writeFileSync(notificationFile, timestamp);
        
        log('INFO', 'Created notification file for IDE');
        
        // Try to trigger IDE refresh
        if (targetIDE === 'windsurf') {
            // Windsurf-specific refresh
            const configFile = path.join(targetPath, 'config.json');
            if (fs.existsSync(configFile)) {
                try {
                    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
                    config.lastRefreshed = timestamp;
                    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
                    log('INFO', 'Updated config for IDE notification');
                } catch (error) {
                    log('WARNING', 'Failed to update config for IDE notification');
                }
            }
        }
        
    } catch (error) {
        log('WARNING', `Failed to notify IDE: ${error.message}`);
    }
}

// Check for repository changes
function checkRepositoryChanges() {
    try {
        // Get current commit hash
        const { execSync } = require('child_process');
        
        let currentHash = '';
        try {
            currentHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
        } catch (error) {
            log('WARNING', 'Not in a git repository');
            return true; // Assume changes exist if not in git
        }
        
        // Get last refresh hash
        const hashFile = path.join('.newt', 'last-refresh-hash.txt');
        let lastHash = '';
        
        if (fs.existsSync(hashFile)) {
            lastHash = fs.readFileSync(hashFile, 'utf8').trim();
        }
        
        if (currentHash !== lastHash) {
            log('INFO', 'Repository changes detected');
            fs.writeFileSync(hashFile, currentHash, 'utf8');
            return true;
        }
        
        return false;
    } catch (error) {
        log('WARNING', `Failed to check repository changes: ${error.message}`);
        return true; // Assume changes exist on error
    }
}

// Watch mode
function startWatchMode() {
    log('INFO', `Starting watch mode (interval: ${interval}s)`);
    log('INFO', 'Press Ctrl+C to stop watching');
    
    const intervalId = setInterval(() => {
        if (checkRepositoryChanges()) {
            log('INFO', 'Repository changed, refreshing plugin...');
            const targetPath = getTargetPath();
            
            if (targetPath) {
                backupPlugin(targetPath);
                if (refreshPlugin()) {
                    notifyIDE(targetPath);
                    validatePlugin();
                }
            }
        }
    }, interval * 1000);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        log('INFO', 'Watch mode interrupted');
        clearInterval(intervalId);
        process.exit(0);
    });
}

// Main execution
function main() {
    log('INFO', 'Newt Plugin Refresh Script Started');
    log('INFO', `Target IDE: ${targetIDE}`);
    log('INFO', `Force mode: ${force}`);
    log('INFO', `Watch mode: ${watch}`);
    
    // Check prerequisites
    if (!checkSource()) {
        process.exit(1);
    }
    
    if (watch) {
        startWatchMode();
    } else {
        // Single refresh
        if (force || checkRepositoryChanges()) {
            const targetPath = getTargetPath();
            
            if (targetPath) {
                backupPlugin(targetPath);
                if (refreshPlugin()) {
                    notifyIDE(targetPath);
                    validatePlugin();
                    log('INFO', 'Plugin refresh completed successfully');
                } else {
                    log('ERROR', 'Plugin refresh failed');
                    process.exit(1);
                }
            } else {
                process.exit(1);
            }
        } else {
            log('INFO', 'No repository changes detected, skipping refresh');
        }
    }
    
    log('INFO', 'Plugin refresh script completed');
}

// Execute main function
main();
