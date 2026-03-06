/**
 * Newt File Save Hook
 * Provides real-time feedback when files are saved in IDE
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

class FileSaveHook extends EventEmitter {
  constructor(config) {
    super();
    this.config = config.hooks['file-save'] || {};
    this.globalConfig = config.global || {};
    this.pendingAnalyses = new Map();
    this.debounceTimers = new Map();
  }

  /**
   * Handle file save event
   */
  async onFileSave(filePath, content, context = {}) {
    const startTime = Date.now();
    
    try {
      // Debounce rapid saves
      if (this.shouldDebounce(filePath)) {
        return this.debounceAnalysis(filePath, content, context);
      }

      // Analyze the file
      const analysis = await this.analyzeFile(filePath, content, context);
      
      // Emit suggestions if enabled
      if (this.config.suggestions && analysis.suggestions.length > 0) {
        this.emit('suggestions', {
          file: filePath,
          suggestions: analysis.suggestions,
          severity: analysis.severity
        });
      }

      // Emit analysis complete
      this.emit('analysis', {
        file: filePath,
        analysis,
        duration: Date.now() - startTime
      });

      return analysis;

    } catch (error) {
      this.emit('error', {
        file: filePath,
        error: error.message,
        duration: Date.now() - startTime
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Determine if analysis should be debounced
   */
  shouldDebounce(filePath) {
    return this.config.delay_ms > 0;
  }

  /**
   * Debounce file analysis
   */
  debounceAnalysis(filePath, content, context) {
    // Clear existing timer
    if (this.debounceTimers.has(filePath)) {
      clearTimeout(this.debounceTimers.get(filePath));
    }

    // Set new timer
    const timer = setTimeout(async () => {
      await this.onFileSave(filePath, content, context);
      this.debounceTimers.delete(filePath);
    }, this.config.delay_ms);

    this.debounceTimers.set(filePath, timer);
  }

  /**
   * Analyze file content
   */
  async analyzeFile(filePath, content, context) {
    const fileExt = path.extname(filePath).toLowerCase();
    const analysis = {
      file: filePath,
      fileType: this.getFileType(fileExt),
      success: true,
      score: 100,
      issues: [],
      suggestions: [],
      metrics: this.calculateMetrics(content, fileExt),
      severity: 'info'
    };

    // Run file-type specific analysis
    switch (analysis.fileType) {
      case 'typescript':
      case 'javascript':
        await this.analyzeCodeFile(content, analysis);
        break;
      case 'json':
        await this.analyzeJSONFile(content, analysis);
        break;
      case 'markdown':
        await this.analyzeMarkdownFile(content, analysis);
        break;
      case 'yaml':
        await this.analyzeYAMLFile(content, analysis);
        break;
    }

    // Run quick Newt review if configured
    if (this.config.commands?.includes('quick-review')) {
      await this.runQuickReview(filePath, analysis);
    }

    // Determine overall severity
    analysis.severity = this.determineSeverity(analysis);

    return analysis;
  }

  /**
   * Get file type from extension
   */
  getFileType(ext) {
    const typeMap = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.json': 'json',
      '.md': 'markdown',
      '.yml': 'yaml',
      '.yaml': 'yaml'
    };

    return typeMap[ext] || 'other';
  }

  /**
   * Calculate basic file metrics
   */
  calculateMetrics(content, fileType) {
    const lines = content.split('\n');
    const characters = content.length;
    const words = content.split(/\s+/).filter(w => w.length > 0).length;

    const metrics = {
      lines: lines.length,
      characters,
      words,
      complexity: 1
    };

    // Calculate complexity for code files
    if (['typescript', 'javascript'].includes(fileType)) {
      metrics.complexity = this.calculateCodeComplexity(content);
    }

    return metrics;
  }

  /**
   * Calculate code complexity
   */
  calculateCodeComplexity(content) {
    let complexity = 1;
    
    // Count cyclomatic complexity indicators
    const complexityPatterns = [
      /if\s*\(/g,
      /else\s*if/g,
      /for\s*\(/g,
      /while\s*\(/g,
      /case\s+/g,
      /catch\s*\(/g,
      /\&\&/g,
      /\|\|/g,
      /\?/g
    ];

    complexityPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });

    return complexity;
  }

  /**
   * Analyze code files
   */
  async analyzeCodeFile(content, analysis) {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Check for potential issues
      if (line.includes('console.log') && !line.includes('//')) {
        analysis.suggestions.push({
          type: 'warning',
          message: 'Console.log statement detected',
          line: lineNumber,
          suggestion: 'Remove or comment out console.log statements'
        });
        analysis.issues.push({
          severity: 'low',
          message: 'Console.log statement found',
          line: lineNumber
        });
      }

      // Check for TODO comments
      if (line.includes('TODO') || line.includes('FIXME')) {
        analysis.suggestions.push({
          type: 'info',
          message: 'TODO/FIXME comment found',
          line: lineNumber,
          suggestion: 'Consider creating an issue for tracking'
        });
      }

      // Check for long lines
      if (line.length > 120) {
        analysis.suggestions.push({
          type: 'style',
          message: `Line too long (${line.length} characters)`,
          line: lineNumber,
          suggestion: 'Break line for better readability'
        });
      }

      // Check for potential security issues
      if (line.includes('eval(') || line.includes('innerHTML')) {
        analysis.suggestions.push({
          type: 'security',
          message: 'Potentially unsafe code detected',
          line: lineNumber,
          suggestion: 'Review for security implications'
        });
        analysis.issues.push({
          severity: 'medium',
          message: 'Potentially unsafe code',
          line: lineNumber
        });
      }
    });

    // Update score based on issues
    analysis.score = Math.max(0, 100 - (analysis.issues.length * 5));
  }

  /**
   * Analyze JSON files
   */
  async analyzeJSONFile(content, analysis) {
    try {
      const parsed = JSON.parse(content);
      
      // Check JSON structure
      if (typeof parsed === 'object' && parsed !== null) {
        const keys = Object.keys(parsed);
        
        if (keys.length === 0) {
          analysis.suggestions.push({
            type: 'info',
            message: 'Empty JSON object',
            suggestion: 'Add meaningful content or remove file'
          });
        }

        // Check for common JSON patterns
        if (keys.includes('password') || keys.includes('secret')) {
          analysis.suggestions.push({
            type: 'security',
            message: 'Sensitive data detected in JSON',
            suggestion: 'Consider using environment variables or secret management'
          });
          analysis.issues.push({
            severity: 'high',
            message: 'Sensitive data in JSON file'
          });
        }
      }

    } catch (error) {
      analysis.suggestions.push({
        type: 'error',
        message: `JSON syntax error: ${error.message}`,
        suggestion: 'Fix JSON syntax'
      });
      analysis.issues.push({
        severity: 'critical',
        message: 'Invalid JSON syntax'
      });
      analysis.success = false;
    }
  }

  /**
   * Analyze Markdown files
   */
  async analyzeMarkdownFile(content, analysis) {
    const lines = content.split('\n');
    let hasHeaders = false;
    let hasLists = false;
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Check for headers
      if (line.startsWith('#')) {
        hasHeaders = true;
      }
      
      // Check for lists
      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        hasLists = true;
      }
      
      // Check for broken links
      const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const linkPath = linkMatch[2];
        if (linkPath.startsWith('http')) {
          // Could check external link validity
          analysis.suggestions.push({
            type: 'info',
            message: 'External link found',
            line: lineNumber,
            suggestion: 'Verify link accessibility'
          });
        }
      }
    });

    // Structure suggestions
    if (!hasHeaders && content.length > 100) {
      analysis.suggestions.push({
        type: 'structure',
        message: 'No headers found in markdown',
        suggestion: 'Add headers for better structure'
      });
    }

    analysis.score = Math.max(0, 100 - (analysis.issues.length * 3));
  }

  /**
   * Analyze YAML files
   */
  async analyzeYAMLFile(content, analysis) {
    try {
      const yaml = require('js-yaml');
      const parsed = yaml.load(content);
      
      // Check YAML structure
      if (typeof parsed === 'object' && parsed !== null) {
        // Check for common YAML patterns
        if (parsed.password || parsed.secret || parsed.api_key) {
          analysis.suggestions.push({
            type: 'security',
            message: 'Sensitive data detected in YAML',
            suggestion: 'Use environment variables or secret management'
          });
          analysis.issues.push({
            severity: 'high',
            message: 'Sensitive data in YAML file'
          });
        }
      }

    } catch (error) {
      analysis.suggestions.push({
        type: 'error',
        message: `YAML syntax error: ${error.message}`,
        suggestion: 'Fix YAML syntax'
      });
      analysis.issues.push({
        severity: 'critical',
        message: 'Invalid YAML syntax'
      });
      analysis.success = false;
    }
  }

  /**
   * Run quick Newt review
   */
  async runQuickReview(filePath, analysis) {
    try {
      const { execSync } = require('child_process');
      const command = `npx newt review --path ${filePath} --depth quick --format json`;
      const output = execSync(command, { 
        encoding: 'utf8',
        timeout: 10000 // 10 second timeout
      });
      
      const reviewData = JSON.parse(output);
      
      // Merge Newt findings
      if (reviewData.major_issues) {
        reviewData.major_issues.forEach(issue => {
          analysis.issues.push({
            severity: issue.severity,
            message: issue.description,
            file: filePath
          });
        });
      }

      // Update score
      if (reviewData.project_health?.score) {
        analysis.score = Math.min(analysis.score, reviewData.project_health.score);
      }

    } catch (error) {
      // Quick review failed, but don't fail the entire analysis
      analysis.suggestions.push({
        type: 'warning',
        message: 'Quick review failed',
        suggestion: 'Check file syntax and try manual review'
      });
    }
  }

  /**
   * Determine overall severity
   */
  determineSeverity(analysis) {
    if (analysis.issues.some(issue => issue.severity === 'critical')) {
      return 'critical';
    }
    if (analysis.issues.some(issue => issue.severity === 'high')) {
      return 'high';
    }
    if (analysis.issues.some(issue => issue.severity === 'medium')) {
      return 'medium';
    }
    if (analysis.issues.length > 0) {
      return 'low';
    }
    return 'info';
  }

  /**
   * Get file analysis status
   */
  getAnalysisStatus(filePath) {
    return this.pendingAnalyses.get(filePath) || null;
  }

  /**
   * Clear pending analysis
   */
  clearAnalysis(filePath) {
    this.pendingAnalyses.delete(filePath);
    if (this.debounceTimers.has(filePath)) {
      clearTimeout(this.debounceTimers.get(filePath));
      this.debounceTimers.delete(filePath);
    }
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    // Clear all debounce timers
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
    this.pendingAnalyses.clear();
  }
}

module.exports = FileSaveHook;
