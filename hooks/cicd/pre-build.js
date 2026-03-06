/**
 * Newt Pre-build Hook
 * Runs comprehensive checks before CI/CD build process
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PreBuildHook {
  constructor(config) {
    this.config = config.hooks['pre-build'] || {};
    this.globalConfig = config.global || {};
  }

  /**
   * Execute the pre-build hook
   */
  async execute(context = {}) {
    const startTime = Date.now();
    
    try {
      console.log('🔍 Running pre-build checks...');
      
      const results = {
        success: true,
        checks: [],
        issues: [],
        score: 100,
        duration: 0,
        blockReason: null
      };

      // Run dependency checks
      await this.checkDependencies(results);
      
      // Run security scans
      await this.runSecurityScans(results);
      
      // Run architecture validation
      await this.validateArchitecture(results);
      
      // Run performance analysis
      await this.analyzePerformance(results);
      
      // Check build readiness
      await this.checkBuildReadiness(results);
      
      // Generate build report
      await this.generateBuildReport(results);
      
      // Determine if build should be blocked
      const shouldBlock = this.shouldBlockBuild(results);
      
      results.duration = Date.now() - startTime;
      
      if (shouldBlock) {
        results.success = false;
        results.blockReason = shouldBlock;
      }

      return results;

    } catch (error) {
      return {
        success: false,
        message: `Pre-build hook failed: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Check project dependencies
   */
  async checkDependencies(results) {
    console.log('📦 Checking dependencies...');
    
    const checkResult = {
      type: 'dependency-check',
      success: true,
      issues: [],
      metrics: {}
    };

    try {
      // Check for package.json
      if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        checkResult.metrics.dependencies = Object.keys(packageJson.dependencies || {}).length;
        checkResult.metrics.devDependencies = Object.keys(packageJson.devDependencies || {}).length;
        
        // Run npm audit
        try {
          const auditOutput = execSync('npm audit --json', { encoding: 'utf8', timeout: 30000 });
          const auditData = JSON.parse(auditOutput);
          
          checkResult.metrics.vulnerabilities = {
            critical: auditData.metadata?.vulnerabilities?.critical || 0,
            high: auditData.metadata?.vulnerabilities?.high || 0,
            moderate: auditData.metadata?.vulnerabilities?.moderate || 0,
            low: auditData.metadata?.vulnerabilities?.low || 0
          };
          
          // Block on critical vulnerabilities
          if (checkResult.metrics.vulnerabilities.critical > 0) {
            checkResult.issues.push({
              severity: 'critical',
              message: `${checkResult.metrics.vulnerabilities.critical} critical vulnerabilities found`,
              suggestion: 'Run npm audit fix to resolve vulnerabilities'
            });
            checkResult.success = false;
          }
          
          // Warn on high vulnerabilities
          if (checkResult.metrics.vulnerabilities.high > 0) {
            checkResult.issues.push({
              severity: 'high',
              message: `${checkResult.metrics.vulnerabilities.high} high vulnerabilities found`,
              suggestion: 'Consider updating vulnerable packages'
            });
          }
          
        } catch (auditError) {
          checkResult.issues.push({
            severity: 'medium',
            message: 'Dependency audit failed',
            suggestion: 'Check npm audit configuration'
          });
        }
        
        // Check for outdated packages
        try {
          const outdatedOutput = execSync('npm outdated --json', { encoding: 'utf8', timeout: 30000 });
          const outdatedData = JSON.parse(outdatedOutput);
          checkResult.metrics.outdated = Object.keys(outdatedData).length;
          
          if (checkResult.metrics.outdated > 5) {
            checkResult.issues.push({
              severity: 'low',
              message: `${checkResult.metrics.outdated} outdated packages found`,
              suggestion: 'Consider updating packages to latest versions'
            });
          }
          
        } catch (outdatedError) {
          // npm outdated returns non-zero exit code when outdated packages found
          try {
            const outdatedOutput = execSync('npm outdated --json', { encoding: 'utf8', timeout: 30000, stdio: 'pipe' });
            const outdatedData = JSON.parse(outdatedOutput);
            checkResult.metrics.outdated = Object.keys(outdatedData).length;
          } catch (e) {
            // Ignore
          }
        }
      }
      
    } catch (error) {
      checkResult.success = false;
      checkResult.issues.push({
        severity: 'high',
        message: `Dependency check failed: ${error.message}`,
        suggestion: 'Check package.json and npm configuration'
      });
    }

    results.checks.push(checkResult);
    results.issues.push(...checkResult.issues);
  }

  /**
   * Run security scans
   */
  async runSecurityScans(results) {
    console.log('🔒 Running security scans...');
    
    const scanResult = {
      type: 'security-scan',
      success: true,
      issues: [],
      metrics: {}
    };

    try {
      // Check for secrets in code
      await this.scanForSecrets(scanResult);
      
      // Check for security misconfigurations
      await this.checkSecurityConfig(scanResult);
      
      // Run Newt security review if configured
      if (this.config.commands?.includes('security-scan')) {
        await this.runNewtSecurityScan(scanResult);
      }
      
    } catch (error) {
      scanResult.success = false;
      scanResult.issues.push({
        severity: 'high',
        message: `Security scan failed: ${error.message}`,
        suggestion: 'Review security scan configuration'
      });
    }

    results.checks.push(scanResult);
    results.issues.push(...scanResult.issues);
  }

  /**
   * Scan for secrets in code
   */
  async scanForSecrets(scanResult) {
    const secretPatterns = [
      /password\s*=\s*['"]\w+['"]/gi,
      /api_key\s*=\s*['"]\w+['"]/gi,
      /secret\s*=\s*['"]\w+['"]/gi,
      /token\s*=\s*['"]\w+['"]/gi,
      /AKIA[0-9A-Z]{16}/g, // AWS access key
      /[a-f0-9]{32}/gi, // Potential API keys
      /-----BEGIN [A-Z]+-----/g, // Private keys
    ];

    const filesToScan = this.getSourceFiles();
    let secretsFound = 0;

    filesToScan.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        secretPatterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            matches.forEach(match => {
              scanResult.issues.push({
                severity: 'critical',
                message: `Potential secret detected in ${file}`,
                suggestion: 'Remove secrets and use environment variables'
              });
              secretsFound++;
            });
          }
        });
        
      } catch (error) {
        // Skip files that can't be read
      }
    });

    scanResult.metrics.secretsFound = secretsFound;
    
    if (secretsFound > 0) {
      scanResult.success = false;
    }
  }

  /**
   * Check security configuration
   */
  async checkSecurityConfig(scanResult) {
    const securityConfigs = [
      { file: '.env.example', required: true },
      { file: '.gitignore', content: ['.env', '.env.local'], required: true },
      { file: 'package.json', content: 'helmet', required: false },
      { file: 'package.json', content: 'cors', required: false }
    ];

    securityConfigs.forEach(config => {
      if (config.required && !fs.existsSync(config.file)) {
        scanResult.issues.push({
          severity: 'medium',
          message: `Missing security file: ${config.file}`,
          suggestion: `Create ${config.file} for security best practices`
        });
      }
      
      if (config.content && fs.existsSync(config.file)) {
        try {
          const content = fs.readFileSync(config.file, 'utf8');
          if (!content.includes(config.content)) {
            scanResult.issues.push({
              severity: 'low',
              message: `Security package ${config.content} not found in ${config.file}`,
              suggestion: `Consider adding ${config.content} for better security`
            });
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    });
  }

  /**
   * Run Newt security scan
   */
  async runNewtSecurityScan(scanResult) {
    try {
      const { execSync } = require('child_process');
      const command = 'npx newt review --focus security --depth full --format json';
      const output = execSync(command, { 
        encoding: 'utf8',
        timeout: this.globalConfig.timeout_seconds * 1000
      });
      
      const reviewData = JSON.parse(output);
      
      if (reviewData.major_issues) {
        reviewData.major_issues.forEach(issue => {
          scanResult.issues.push({
            severity: issue.severity,
            message: issue.description,
            file: issue.file
          });
        });
      }
      
      if (reviewData.project_health?.security) {
        scanResult.metrics.securityScore = reviewData.project_health.security;
      }

    } catch (error) {
      scanResult.issues.push({
        severity: 'medium',
        message: `Newt security scan failed: ${error.message}`,
        suggestion: 'Check Newt configuration and try manual review'
      });
    }
  }

  /**
   * Validate project architecture
   */
  async validateArchitecture(results) {
    console.log('🏗️ Validating architecture...');
    
    const archResult = {
      type: 'architecture-validation',
      success: true,
      issues: [],
      metrics: {}
    };

    try {
      // Run Newt architecture check if configured
      if (this.config.commands?.includes('architecture-check')) {
        await this.runNewtArchitectureCheck(archResult);
      }
      
      // Check for architectural patterns
      await this.checkArchitecturalPatterns(archResult);
      
    } catch (error) {
      archResult.success = false;
      archResult.issues.push({
        severity: 'medium',
        message: `Architecture validation failed: ${error.message}`,
        suggestion: 'Review project structure and Newt configuration'
      });
    }

    results.checks.push(archResult);
    results.issues.push(...archResult.issues);
  }

  /**
   * Run Newt architecture check
   */
  async runNewtArchitectureCheck(archResult) {
    try {
      const { execSync } = require('child_process');
      const command = 'npx newt architecture-check --format json';
      const output = execSync(command, { 
        encoding: 'utf8',
        timeout: this.globalConfig.timeout_seconds * 1000
      });
      
      const archData = JSON.parse(output);
      
      if (archData.issues) {
        archData.issues.forEach(issue => {
          archResult.issues.push({
            severity: issue.severity,
            message: issue.description,
            file: issue.file
          });
        });
      }
      
      if (archData.architecture_score) {
        archResult.metrics.architectureScore = archData.architecture_score;
      }

    } catch (error) {
      archResult.issues.push({
        severity: 'low',
        message: `Newt architecture check failed: ${error.message}`,
        suggestion: 'Check project structure and architecture patterns'
      });
    }
  }

  /**
   * Check architectural patterns
   */
  async checkArchitecturalPatterns(archResult) {
    const sourceFiles = this.getSourceFiles();
    const patterns = {
      'controllers': /controller/i,
      'services': /service/i,
      'models': /model/i,
      'utils': /util/i
    };

    const patternCounts = {};
    Object.keys(patterns).forEach(pattern => {
      patternCounts[pattern] = 0;
    });

    sourceFiles.forEach(file => {
      const fileName = path.basename(file, path.extname(file));
      Object.keys(patterns).forEach(pattern => {
        if (patterns[pattern].test(fileName)) {
          patternCounts[pattern]++;
        }
      });
    });

    archResult.metrics.patternCounts = patternCounts;
    
    // Check for basic structure
    if (sourceFiles.length > 10 && Object.values(patternCounts).every(count => count === 0)) {
      archResult.issues.push({
        severity: 'low',
        message: 'No clear architectural patterns detected',
        suggestion: 'Consider organizing code into layers (controllers, services, models, etc.)'
      });
    }
  }

  /**
   * Analyze performance characteristics
   */
  async analyzePerformance(results) {
    console.log('⚡ Analyzing performance...');
    
    const perfResult = {
      type: 'performance-analysis',
      success: true,
      issues: [],
      metrics: {}
    };

    try {
      // Check for performance anti-patterns
      await this.checkPerformanceAntiPatterns(perfResult);
      
      // Analyze bundle size if applicable
      await this.analyzeBundleSize(perfResult);
      
    } catch (error) {
      perfResult.success = false;
      perfResult.issues.push({
        severity: 'low',
        message: `Performance analysis failed: ${error.message}`,
        suggestion: 'Review performance optimization strategies'
      });
    }

    results.checks.push(perfResult);
    results.issues.push(...perfResult.issues);
  }

  /**
   * Check for performance anti-patterns
   */
  async checkPerformanceAntiPatterns(perfResult) {
    const sourceFiles = this.getSourceFiles();
    let antiPatterns = 0;

    sourceFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for common performance issues
        if (content.includes('querySelectorAll') && content.includes('forEach')) {
          antiPatterns++;
        }
        
        if (content.includes('innerHTML') && !content.includes('textContent')) {
          antiPatterns++;
        }
        
        if (content.includes('setTimeout') && content.includes('0')) {
          antiPatterns++;
        }
        
      } catch (error) {
        // Skip files that can't be read
      }
    });

    perfResult.metrics.antiPatterns = antiPatterns;
    
    if (antiPatterns > 5) {
      perfResult.issues.push({
        severity: 'medium',
        message: `${antiPatterns} potential performance anti-patterns found`,
        suggestion: 'Review code for performance optimizations'
      });
    }
  }

  /**
   * Analyze bundle size
   */
  async analyzeBundleSize(perfResult) {
    // Check for build output
    const buildDirs = ['dist', 'build', 'out'];
    
    for (const buildDir of buildDirs) {
      if (fs.existsSync(buildDir)) {
        try {
          const { statSync } = require('fs');
          const { readdirSync } = require('fs');
          
          let totalSize = 0;
          const files = this.getAllFiles(buildDir);
          
          files.forEach(file => {
            try {
              totalSize += statSync(file).size;
            } catch (error) {
              // Skip files that can't be accessed
            }
          });
          
          perfResult.metrics.bundleSize = totalSize;
          
          // Warn if bundle is large
          if (totalSize > 5 * 1024 * 1024) { // 5MB
            perfResult.issues.push({
              severity: 'medium',
              message: `Large bundle size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`,
              suggestion: 'Consider code splitting and optimization'
            });
          }
          
          break; // Found a build directory
          
        } catch (error) {
          // Skip if can't analyze build directory
        }
      }
    }
  }

  /**
   * Check build readiness
   */
  async checkBuildReadiness(results) {
    console.log('🔧 Checking build readiness...');
    
    const readinessResult = {
      type: 'build-readiness',
      success: true,
      issues: [],
      metrics: {}
    };

    try {
      // Check for required files
      const requiredFiles = ['package.json'];
      
      requiredFiles.forEach(file => {
        if (!fs.existsSync(file)) {
          readinessResult.issues.push({
            severity: 'critical',
            message: `Required file missing: ${file}`,
            suggestion: `Create ${file} before building`
          });
          readinessResult.success = false;
        }
      });
      
      // Check build scripts
      if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const scripts = packageJson.scripts || {};
        
        readinessResult.metrics.buildScripts = Object.keys(scripts).filter(script => 
          script.includes('build') || script.includes('compile')
        ).length;
        
        if (readinessResult.metrics.buildScripts === 0) {
          readinessResult.issues.push({
            severity: 'medium',
            message: 'No build script found in package.json',
            suggestion: 'Add build script to package.json'
          });
        }
      }
      
    } catch (error) {
      readinessResult.success = false;
      readinessResult.issues.push({
        severity: 'high',
        message: `Build readiness check failed: ${error.message}`,
        suggestion: 'Review project configuration'
      });
    }

    results.checks.push(readinessResult);
    results.issues.push(...readinessResult.issues);
  }

  /**
   * Generate build report
   */
  async generateBuildReport(results) {
    console.log('📊 Generating build report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      success: results.success,
      score: this.calculateOverallScore(results),
      checks: results.checks,
      issues: results.issues,
      metrics: this.aggregateMetrics(results),
      recommendations: this.generateRecommendations(results)
    };

    try {
      const reportPath = 'build-reports/pre-build-report.json';
      const reportDir = path.dirname(reportPath);
      
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }
      
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`✓ Build report saved to ${reportPath}`);
      
    } catch (error) {
      console.warn(`Warning: Could not save build report: ${error.message}`);
    }
  }

  /**
   * Determine if build should be blocked
   */
  shouldBlockBuild(results) {
    // Block on critical issues
    const criticalIssues = results.issues.filter(issue => issue.severity === 'critical');
    if (criticalIssues.length > 0) {
      return `${criticalIssues.length} critical issue(s) found`;
    }

    // Block on too many high issues
    const highIssues = results.issues.filter(issue => issue.severity === 'high');
    if (highIssues.length > 3) {
      return `Too many high severity issues: ${highIssues.length}`;
    }

    // Block if score is too low
    if (results.score < 70) {
      return `Build quality score too low: ${results.score}`;
    }

    return null;
  }

  /**
   * Calculate overall score
   */
  calculateOverallScore(results) {
    let score = 100;
    
    // Deduct points for issues
    results.issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'high':
          score -= 10;
          break;
        case 'medium':
          score -= 5;
          break;
        case 'low':
          score -= 2;
          break;
      }
    });
    
    return Math.max(0, score);
  }

  /**
   * Aggregate metrics from all checks
   */
  aggregateMetrics(results) {
    const metrics = {};
    
    results.checks.forEach(check => {
      if (check.metrics) {
        Object.assign(metrics, check.metrics);
      }
    });
    
    return metrics;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(results) {
    const recommendations = [];
    
    // Security recommendations
    const securityIssues = results.issues.filter(issue => 
      issue.suggestion && issue.suggestion.includes('security')
    );
    if (securityIssues.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'security',
        message: 'Address security vulnerabilities',
        details: securityIssues.map(issue => issue.message)
      });
    }
    
    // Performance recommendations
    const performanceIssues = results.issues.filter(issue => 
      issue.suggestion && issue.suggestion.includes('performance')
    );
    if (performanceIssues.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'performance',
        message: 'Optimize performance bottlenecks',
        details: performanceIssues.map(issue => issue.message)
      });
    }
    
    return recommendations;
  }

  /**
   * Get all source files
   */
  getSourceFiles() {
    const sourceExtensions = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.py', '.java', '.go', '.rs'];
    const sourceFiles = [];
    
    const getAllFiles = (dir, fileList = []) => {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          getAllFiles(filePath, fileList);
        } else if (stat.isFile() && sourceExtensions.includes(path.extname(filePath))) {
          fileList.push(filePath);
        }
      });
      
      return fileList;
    };
    
    if (fs.existsSync('src')) {
      return getAllFiles('src');
    }
    
    return getAllFiles('.');
  }

  /**
   * Get all files recursively
   */
  getAllFiles(dir) {
    const files = [];
    
    const getAll = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      items.forEach(item => {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          getAll(itemPath);
        } else {
          files.push(itemPath);
        }
      });
    };
    
    getAll(dir);
    return files;
  }
}

module.exports = PreBuildHook;
