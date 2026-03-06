#!/usr/bin/env pwsh
/**
 * Newt Plugin Refresh Script
 * Automatically refreshes the Newt plugin in Windsurf/Cursor when repository updates
 */

param(
    [Parameter(Mandatory=$false)]
    [string]$TargetIDE = "windsurf",
    
    [Parameter(Mandatory=$false)]
    [switch]$Force,
    
    [Parameter(Mandatory=$false)]
    [switch]$Watch,
    
    [Parameter(Mandatory=$false)]
    [int]$Interval = 30
)

# Configuration
$Config = @{
    PluginName = "newt"
    SourceDir = ".claude-plugin"
    
    IDEPaths = @{
        windsurf = "$env:APPDATA\Windsurf\plugins"
        cursor = "$env:APPDATA\Cursor\plugins"
        claude = "$env:APPDATA\Claude\plugins"
    }
    
    BackupDir = ".newt\backup"
    LogFile = ".newt\logs\refresh.log"
}

# Ensure log directory exists
if (!(Test-Path ".newt\logs")) {
    New-Item -ItemType Directory -Path ".newt\logs" -Force | Out-Null
}

# Logging function
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] [$Level] $Message"
    
    Write-Host $LogEntry
    Add-Content -Path $Config.LogFile -Value $LogEntry -Encoding UTF8
}

# Check if source directory exists
function Test-PluginSource {
    if (!(Test-Path $Config.SourceDir)) {
        Write-Log "Plugin source directory not found: $Config.SourceDir" "ERROR"
        return $false
    }
    
    return $true
}

# Get target IDE path
function Get-TargetPath {
    $TargetPath = $Config.IDEPaths[$TargetIDE]
    
    if (!$TargetPath) {
        Write-Log "Unsupported IDE: $TargetIDE" "ERROR"
        Write-Log "Supported IDEs: $($Config.IDEPaths.Keys -join ', ')" "ERROR"
        return $null
    }
    
    $PluginPath = Join-Path $TargetPath $Config.PluginName
    
    # Create target directory if it doesn't exist
    if (!(Test-Path $TargetPath)) {
        try {
            New-Item -ItemType Directory -Path $TargetPath -Force | Out-Null
            Write-Log "Created target directory: $TargetPath" "INFO"
        } catch {
            Write-Log "Failed to create target directory: $TargetPath" "ERROR"
            return $null
        }
    }
    
    return $PluginPath
}

# Backup existing plugin
function Backup-Plugin {
    param([string]$TargetPath)
    
    if (!(Test-Path $TargetPath)) {
        return # Nothing to backup
    }
    
    if (!(Test-Path $Config.BackupDir)) {
        New-Item -ItemType Directory -Path $Config.BackupDir -Force | Out-Null
    }
    
    $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $BackupPath = Join-Path $Config.BackupDir "plugin-backup-$Timestamp"
    
    try {
        Copy-Item -Path $TargetPath -Destination $BackupPath -Recurse -Force
        Write-Log "Backed up existing plugin to: $BackupPath" "INFO"
        return $true
    } catch {
        Write-Log "Failed to backup plugin: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Refresh plugin
function Refresh-Plugin {
    $SourcePath = $Config.SourceDir
    $TargetPath = Get-TargetPath
    
    if (!$SourcePath -or !$TargetPath) {
        return $false
    }
    
    Write-Log "Refreshing plugin from $SourcePath to $TargetPath" "INFO"
    
    try {
        # Remove existing plugin
        if (Test-Path $TargetPath) {
            Remove-Item -Path $TargetPath -Recurse -Force
            Write-Log "Removed existing plugin" "INFO"
        }
        
        # Copy new plugin
        Copy-Item -Path $SourcePath -Destination $TargetPath -Recurse -Force
        Write-Log "Copied plugin to target location" "INFO"
        
        # Verify installation
        $PluginJson = Join-Path $TargetPath "plugin.json"
        if (Test-Path $PluginJson) {
            $PluginData = Get-Content $PluginJson | ConvertFrom-Json
            Write-Log "Plugin refreshed successfully: $($PluginData.name) v$($PluginData.version)" "INFO"
            Write-Log "Commands available: $($PluginData.commands -join ', ')" "INFO"
            return $true
        } else {
            Write-Log "Plugin validation failed: plugin.json not found" "ERROR"
            return $false
        }
        
    } catch {
        Write-Log "Failed to refresh plugin: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Validate plugin
function Test-Plugin {
    $TargetPath = Get-TargetPath
    
    if (!$TargetPath) {
        return $false
    }
    
    try {
        # Run validation script
        $ValidationScript = Join-Path "scripts" "validate-plugin.js"
        if (Test-Path $ValidationScript) {
            $Result = node $ValidationScript 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Plugin validation passed" "INFO"
                return $true
            } else {
                Write-Log "Plugin validation failed: $Result" "ERROR"
                return $false
            }
        } else {
            Write-Log "Validation script not found, skipping validation" "WARNING"
            return $true
        }
    } catch {
        Write-Log "Failed to validate plugin: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Notify IDE about plugin update
function Notify-IDE {
    param([string]$TargetPath)
    
    try {
        # Create notification file
        $NotificationFile = Join-Path $TargetPath ".newt-refreshed"
        $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Set-Content -Path $NotificationFile -Value $Timestamp -Encoding UTF8
        
        Write-Log "Created notification file for IDE" "INFO"
        
        # Try to trigger IDE refresh (platform-specific)
        if ($TargetIDE -eq "windsurf") {
            # Windsurf-specific refresh
            try {
                # This might trigger Windsurf to reload plugins
                $ConfigFile = Join-Path $TargetPath "config.json"
                if (Test-Path $ConfigFile) {
                    $Config = Get-Content $ConfigFile | ConvertFrom-Json
                    $Config.lastRefreshed = $Timestamp
                    $Config | ConvertTo-Json -Depth 10 | Set-Content -Path $ConfigFile
                }
            } catch {
                Write-Log "Failed to update config for IDE notification" "WARNING"
            }
        }
        
    } catch {
        Write-Log "Failed to notify IDE: $($_.Exception.Message)" "WARNING"
    }
}

# Check for repository changes
function Test-RepositoryChanges {
    try {
        # Get current commit hash
        $CurrentHash = git rev-parse HEAD 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Not in a git repository" "WARNING"
            return $true # Assume changes exist if not in git
        }
        
        # Get last refresh hash
        $HashFile = Join-Path ".newt" "last-refresh-hash.txt"
        $LastHash = if (Test-Path $HashFile) { Get-Content $HashFile } else { "" }
        
        if ($CurrentHash -ne $LastHash) {
            Write-Log "Repository changes detected" "INFO"
            Set-Content -Path $HashFile -Value $CurrentHash -Encoding UTF8
            return $true
        }
        
        return $false
    } catch {
        Write-Log "Failed to check repository changes: $($_.Exception.Message)" "WARNING"
        return $true # Assume changes exist on error
    }
}

# Watch mode
function Start-WatchMode {
    Write-Log "Starting watch mode (interval: ${Interval}s)" "INFO"
    Write-Log "Press Ctrl+C to stop watching" "INFO"
    
    try {
        while ($true) {
            if (Test-RepositoryChanges) {
                Write-Log "Repository changed, refreshing plugin..." "INFO"
                $Success = Refresh-Plugin
                if ($Success) {
                    Notify-IDE (Get-TargetPath)
                    Test-Plugin
                }
            }
            
            Start-Sleep -Seconds $Interval
        }
    } catch {
        Write-Log "Watch mode interrupted: $($_.Exception.Message)" "INFO"
    }
}

# Main execution
function Main {
    Write-Log "Newt Plugin Refresh Script Started" "INFO"
    Write-Log "Target IDE: $TargetIDE" "INFO"
    Write-Log "Force mode: $Force" "INFO"
    Write-Log "Watch mode: $Watch" "INFO"
    
    # Check prerequisites
    if (!(Test-PluginSource)) {
        exit 1
    }
    
    if ($Watch) {
        Start-WatchMode
    } else {
        # Single refresh
        if ($Force -or (Test-RepositoryChanges)) {
            $TargetPath = Get-TargetPath
            if ($TargetPath) {
                Backup-Plugin $TargetPath
                $Success = Refresh-Plugin
                if ($Success) {
                    Notify-IDE $TargetPath
                    Test-Plugin
                    Write-Log "Plugin refresh completed successfully" "INFO"
                } else {
                    Write-Log "Plugin refresh failed" "ERROR"
                    exit 1
                }
            } else {
                exit 1
            }
        } else {
            Write-Log "No repository changes detected, skipping refresh" "INFO"
        }
    }
    
    Write-Log "Plugin refresh script completed" "INFO"
}

# Execute main function
Main
