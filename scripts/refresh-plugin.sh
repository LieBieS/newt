#!/bin/bash
# Newt Plugin Refresh Script
# Automatically refreshes the Newt plugin in IDEs when repository updates

set -e

# Configuration
PLUGIN_NAME="newt"
SOURCE_DIR=".claude-plugin"
BACKUP_DIR=".newt/backup"
LOG_FILE=".newt/logs/refresh.log"

# Parse command line arguments
TARGET_IDE="windsurf"
FORCE=false
WATCH=false
INTERVAL=30

while [[ $# -gt 0 ]]; do
    case $1 in
        --target)
            TARGET_IDE="$2"
            shift 2
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --watch)
            WATCH=true
            shift
            ;;
        --interval)
            INTERVAL="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# IDE paths
IDE_PATHS=(
    "windsurf:$HOME/.config/windsurf/plugins"
    "cursor:$HOME/.config/cursor/plugins"
    "claude:$HOME/.config/claude/plugins"
)

# Logging function
log() {
    local level="$1"
    shift
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*" | tee -a "$LOG_FILE"
}

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Check if source directory exists
check_source() {
    if [[ ! -d "$SOURCE_DIR" ]]; then
        log "ERROR" "Plugin source directory not found: $SOURCE_DIR"
        exit 1
    fi
}

# Get target IDE path
get_target_path() {
    local target_path=""
    
    for path_entry in "${IDE_PATHS[@]}"; do
        local ide="${path_entry%%:*}"
        local path="${path_entry##*:}"
        
        if [[ "$ide" == "$TARGET_IDE" ]]; then
            target_path="$path/$PLUGIN_NAME"
            break
        fi
    done
    
    if [[ -z "$target_path" ]]; then
        log "ERROR" "Unsupported IDE: $TARGET_IDE"
        log "ERROR" "Supported IDEs: $(printf '%s\n' "${IDE_PATHS[@]}" | cut -d: -f1 | tr '\n' ', ')"
        return 1
    fi
    
    # Create target directory if it doesn't exist
    if [[ ! -d "$(dirname "$target_path")" ]]; then
        mkdir -p "$(dirname "$target_path")"
        log "INFO" "Created target directory: $(dirname "$target_path")"
    fi
    
    echo "$target_path"
}

# Backup existing plugin
backup_plugin() {
    local target_path="$1"
    
    if [[ ! -d "$target_path" ]]; then
        return  # Nothing to backup
    fi
    
    mkdir -p "$BACKUP_DIR"
    
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_path="$BACKUP_DIR/plugin-backup-$timestamp"
    
    if cp -r "$target_path" "$backup_path"; then
        log "INFO" "Backed up existing plugin to: $backup_path"
        return 0
    else
        log "ERROR" "Failed to backup plugin"
        return 1
    fi
}

# Refresh plugin
refresh_plugin() {
    local source_path="$SOURCE_DIR"
    local target_path
    target_path=$(get_target_path)
    
    if [[ $? -ne 0 ]]; then
        return 1
    fi
    
    log "INFO" "Refreshing plugin from $source_path to $target_path"
    
    # Remove existing plugin
    if [[ -d "$target_path" ]]; then
        rm -rf "$target_path"
        log "INFO" "Removed existing plugin"
    fi
    
    # Copy new plugin
    if cp -r "$source_path" "$target_path"; then
        log "INFO" "Copied plugin to target location"
        
        # Verify installation
        local plugin_json="$target_path/plugin.json"
        if [[ -f "$plugin_json" ]]; then
            local version=$(jq -r '.version' "$plugin_json" 2>/dev/null || echo "unknown")
            local name=$(jq -r '.name' "$plugin_json" 2>/dev/null || echo "unknown")
            local commands=$(jq -r '.commands[]?' "$plugin_json" 2>/dev/null | tr '\n' ', ' || echo "")
            
            log "INFO" "Plugin refreshed successfully: $name v$version"
            log "INFO" "Commands available: $commands"
            return 0
        else
            log "ERROR" "Plugin validation failed: plugin.json not found"
            return 1
        fi
    else
        log "ERROR" "Failed to refresh plugin"
        return 1
    fi
}

# Validate plugin
validate_plugin() {
    local target_path
    target_path=$(get_target_path)
    
    if [[ $? -neq 0 ]]; then
        return 1
    fi
    
    if [[ -f "scripts/validate-plugin.js" ]]; then
        if node scripts/validate-plugin.js; then
            log "INFO" "Plugin validation passed"
            return 0
        else
            log "ERROR" "Plugin validation failed"
            return 1
        fi
    else
        log "WARNING" "Validation script not found, skipping validation"
        return 0
    fi
}

# Notify IDE about plugin update
notify_ide() {
    local target_path="$1"
    
    # Create notification file
    local notification_file="$target_path/.newt-refreshed"
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo "$timestamp" > "$notification_file"
    
    log "INFO" "Created notification file for IDE"
    
    # Try to trigger IDE refresh
    if [[ "$TARGET_IDE" == "windsurf" ]]; then
        # Windsurf-specific refresh
        local config_file="$target_path/config.json"
        if [[ -f "$config_file" ]]; then
            # Update config to trigger refresh
            jq ".lastRefreshed = \"$timestamp\"" "$config_file" > "$config_file.tmp" && mv "$config_file.tmp" "$config_file" || {
                log "WARNING" "Failed to update config for IDE notification"
            }
        fi
    fi
}

# Check for repository changes
check_repository_changes() {
    local current_hash last_hash
    
    # Get current commit hash
    if current_hash=$(git rev-parse HEAD 2>/dev/null); then
        # Get last refresh hash
        local hash_file=".newt/last-refresh-hash.txt"
        last_hash=$(cat "$hash_file" 2>/dev/null || echo "")
        
        if [[ "$current_hash" != "$last_hash" ]]; then
            log "INFO" "Repository changes detected"
            echo "$current_hash" > "$hash_file"
            return 0
        fi
    else
        log "WARNING" "Not in a git repository"
        return 0 # Assume changes exist if not in git
    fi
    
    return 1
}

# Watch mode
start_watch_mode() {
    log "INFO" "Starting watch mode (interval: ${INTERVAL}s)"
    log "INFO" "Press Ctrl+C to stop watching"
    
    while true; do
        if check_repository_changes; then
            log "INFO" "Repository changed, refreshing plugin..."
            local target_path
            target_path=$(get_target_path)
            
            if [[ $? -eq 0 ]]; then
                backup_plugin "$target_path"
                if refresh_plugin; then
                    notify_ide "$target_path"
                    validate_plugin
                fi
            fi
        fi
        
        sleep "$INTERVAL"
    done
}

# Main execution
main() {
    log "INFO" "Newt Plugin Refresh Script Started"
    log "INFO" "Target IDE: $TARGET_IDE"
    log "INFO" "Force mode: $FORCE"
    log "INFO" "Watch mode: $WATCH"
    
    # Check prerequisites
    if ! check_source; then
        exit 1
    fi
    
    if [[ "$WATCH" == "true" ]]; then
        start_watch_mode
    else
        # Single refresh
        if [[ "$FORCE" == "true" ]] || check_repository_changes; then
            local target_path
            target_path=$(get_target_path)
            
            if [[ $? -eq 0 ]]; then
                backup_plugin "$target_path"
                if refresh_plugin; then
                    notify_ide "$target_path"
                    validate_plugin
                    log "INFO" "Plugin refresh completed successfully"
                else
                    log "ERROR" "Plugin refresh failed"
                    exit 1
                fi
            else
                exit 1
            fi
        else
            log "INFO" "No repository changes detected, skipping refresh"
        fi
    fi
    
    log "INFO" "Plugin refresh script completed"
}

# Execute main function
main "$@"
