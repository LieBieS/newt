/**
 * Newt Pre-commit Hook
 * Runs quality checks on staged files before commit
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PreCommitHook {
  constructor(config) {
    this.config = config.hooks['pre-commit'] || {};
    this.globalConfig = config.global || {};
  }

  /**
   * Execute the pre-commit hook
   */
  async execute(context = {}) {
    const startTime = Date.now();
    
    try {
      // Get staged files
      const stagedFiles = this.getStagedFiles();
      
      if (stagedFiles.length === 0) {
        return {
          success: true,
          message: 'No staged files to check',
          duration: Date.now() - startTime
        };
      }

      console.log(`🔍 Checking ${stagedFiles.length} staged files...`);

      // Group files by type
      const fileGroups = this.groupFilesByType(stagedFiles);
      
      // Run checks for each file type
      const results = await this.runFileGroupChecks(fileGroups);
      
      // Aggregate results
      const aggregated = this.aggregateResults(results);
      
      // Check if commit should be blocked
      const shouldBlock = this.shouldBlockCommit(aggregated);
      
      const duration = Date.now() - startTime;
      
      if (shouldBlock) {
        return {
          success: false,
          message: `Commit blocked: ${aggregated.blockReason}`,
          details: aggregated,
          duration
        };
      }

      return {
        success: true,
        message: `All checks passed (${stagedFiles.length} files)`,
        details: aggregated,
        duration
      };

    } catch (error) {
      return {
        success: false,
        message: `Pre-commit hook failed: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Get list of staged files
   */
  getStagedFiles() {
    try {
      const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
      return output.trim().split('\n').filter(file => file.length > 0);
    } catch (error) {
      throw new Error('Failed to get staged files');
    }
  }

  /**
   * Group files by type for appropriate checking
   */
  groupFilesByType(files) {
    const groups = {
      typescript: [],
      javascript: [],
      json: [],
      markdown: [],
      yaml: [],
      other: []
    };

    files.forEach(file => {
      const ext = path.extname(file).toLowerCase();
      const baseExt = path.extname(file, path.extname(file)).toLowerCase();
      
      switch (ext) {
        case '.ts':
        case '.tsx':
          groups.typescript.push(file);
          break;
        case '.js':
        case '.jsx':
          groups.javascript.push(file);
          break;
        case '.json':
          groups.json.push(file);
          break;
        case '.md':
          groups.markdown.push(file);
          break;
        case '.yml':
        case '.yaml':
          groups.yaml.push(file);
          break;
        default:
          groups.other.push(file);
      }
    });

    return groups;
  }

  /**
   * Run checks for each file group
   */
  async runFileGroupChecks(fileGroups) {
    const results = {};
    
    for (const [fileType, files] of Object.entries(fileGroups)) {
      if (files.length === 0) continue;
      
      const checkLevel = this.config.file_types?.[fileType] || 'standard';
      results[fileType] = await this.runFileTypeChecks(fileType, files, checkLevel);
    }

    return results;
  }

  /**
   * Run checks for specific file type
   */
  async runFileTypeChecks(fileType, files, checkLevel) {
    const results = {
      files: files,
      issues: [],
      score: 100,
      checks: []
    };

    // Run Newt review command
    if (checkLevel !== 'none') {
      const reviewResult = await this.runNewtReview(files, checkLevel);
      results.checks.push(reviewResult);
      results.issues.push(...reviewResult.issues);
      results.score = Math.min(results.score, reviewResult.score);
    }

    // Run file-type specific checks
    switch (fileType) {
      case 'typescript':
      case 'javascript':
        await this.runCodeChecks(files, results);
        break;
      case 'json':
        await this.runJSONChecks(files, results);
        break;
      case 'markdown':
        await this.runMarkdownChecks(files, results);
        break;
      case 'yaml':
        await this.runYAMLChecks(files, results);
        break;
    }

    return results;
  }

  /**
   * Run Newt review command
   */
  async runNewtReview(files, checkLevel) {
    const depth = checkLevel === 'full' ? 'full' : 'quick';
    const fileList = files.join(',');
    
    try {
      const command = `npx newt review --path ${fileList} --depth ${depth} --format json`;
      const output = execSync(command, { 
        encoding: 'utf8',
        timeout: this.globalConfig.timeout_seconds * 1000
      });
      
      const reviewData = JSON.parse(output);
      
      return {
        type: 'newt-review',
        success: true,
        score: reviewData.project_health?.score || 80,
        issues: this.extractIssuesFromReview(reviewData),
        data: reviewData
      };
      
    } catch (error) {
      // Command failed, likely due to critical issues
      return {
        type: 'newt-review',
        success: false,
        score: 0,
        issues: [{ severity: 'critical', message: error.message }],
        data: null
      };
    }
  }

  /**
   * Extract issues from Newt review data
   */
  extractIssuesFromReview(reviewData) {
    const issues = [];
    
    if (reviewData.major_issues) {
      reviewData.major_issues.forEach(issue => {
        issues.push({
          severity: issue.severity,
          message: issue.description,
          file: issue.file,
          lines: issue.lines
        });
      });
    }
    
    return issues;
  }

  /**
   * Run code-specific checks
   */
  async runCodeChecks(files, results) {
    // Check for console.log statements
    files.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (line.includes('console.log') && !line.includes('//')) {
            results.issues.push({
              severity: 'medium',
              message: `Console.log statement found in ${file}:${index + 1}`,
              file,
              line: index + 1
            });
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    });

    results.checks.push({
      type: 'code-checks',
      success: true,
      issues: results.issues.filter(i => i.file && files.includes(i.file))
    });
  }

  /**
   * Run JSON-specific checks
   */
  async runJSONChecks(files, results) {
    files.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        JSON.parse(content); // Validate JSON syntax
      } catch (error) {
        results.issues.push({
          severity: 'high',
          message: `Invalid JSON syntax in ${file}: ${error.message}`,
          file
        });
      }
    });

    results.checks.push({
      type: 'json-validation',
      success: results.issues.filter(i => i.file && files.includes(i.file)).length === 0
    });
  }

  /**
   * Run Markdown-specific checks
   */
  async runMarkdownChecks(files, results) {
    files.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Check for broken links
          const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
          if (linkMatch) {
            const linkPath = linkMatch[2];
            if (linkPath.startsWith('http')) {
              // External link - could check if it's reachable
            } else {
              // Internal link
              const fullPath = path.resolve(path.dirname(file), linkPath);
              if (!fs.existsSync(fullPath)) {
                results.issues.push({
                  severity: 'low',
                  message: `Broken link in ${file}:${index + 1}: ${linkPath}`,
                  file,
                  line: index + 1
                });
              }
            }
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    });

    results.checks.push({
      type: 'markdown-checks',
      success: true,
      issues: results.issues.filter(i => i.file && files.includes(i.file))
    });
  }

  /**
   * Run YAML-specific checks
   */
  async runYAMLChecks(files, results) {
    files.forEach(file => {
      try {
        const yaml = require('js-yaml');
        const content = fs.readFileSync(file, 'utf8');
        yaml.load(content); // Validate YAML syntax
      } catch (error) {
        results.issues.push({
          severity: 'high',
          message: `Invalid YAML syntax in ${file}: ${error.message}`,
          file
        });
      }
    });

    results.checks.push({
      type: 'yaml-validation',
      success: results.issues.filter(i => i.file && files.includes(i.file)).length === 0
    });
  }

  /**
   * Aggregate results from all file type checks
   */
  aggregateResults(results) {
    const aggregated = {
      totalFiles: 0,
      totalIssues: 0,
      criticalIssues: 0,
      highIssues: 0,
      mediumIssues: 0,
      lowIssues: 0,
      fileTypes: Object.keys(results),
      checks: [],
      blockReason: null
    };

    Object.values(results).forEach(fileResult => {
      aggregated.totalFiles += fileResult.files.length;
      aggregated.totalIssues += fileResult.issues.length;
      aggregated.checks.push(...fileResult.checks);
      
      fileResult.issues.forEach(issue => {
        switch (issue.severity) {
          case 'critical':
            aggregated.criticalIssues++;
            break;
          case 'high':
            aggregated.highIssues++;
            break;
          case 'medium':
            aggregated.mediumIssues++;
            break;
          case 'low':
            aggregated.lowIssues++;
            break;
        }
      });
    });

    return aggregated;
  }

  /**
   * Determine if commit should be blocked
   */
  shouldBlockCommit(aggregated) {
    // Block on critical issues if configured
    if (this.config.thresholds?.block_on_critical && aggregated.criticalIssues > 0) {
      aggregated.blockReason = `${aggregated.criticalIssues} critical issue(s) found`;
      return true;
    }

    // Block on high issues if configured
    if (this.config.thresholds?.block_on_high && aggregated.highIssues > 0) {
      aggregated.blockReason = `${aggregated.highIssues} high issue(s) found`;
      return true;
    }

    // Block if too many issues overall
    const totalBlockingIssues = aggregated.criticalIssues + aggregated.highIssues;
    if (totalBlockingIssues > 5) {
      aggregated.blockReason = `Too many blocking issues: ${totalBlockingIssues}`;
      return true;
    }

    return false;
  }
}

module.exports = PreCommitHook;
