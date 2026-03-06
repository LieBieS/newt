#!/usr/bin/env node
/**
 * Newt Template Validator
 * Validates template structure and configuration
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class TemplateValidator {
  constructor(templatePath) {
    this.templatePath = templatePath;
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate template structure
   */
  validateStructure() {
    console.log('Validating template structure...');

    const requiredFiles = [
      'template.config.yml',
      'README.md'
    ];

    const requiredDirs = [
      '.newt'
    ];

    const recommendedFiles = [
      '.gitignore',
      'package.json',
      'LICENSE'
    ];

    // Check required files
    requiredFiles.forEach(file => {
      const filePath = path.join(this.templatePath, file);
      if (!fs.existsSync(filePath)) {
        this.errors.push(`Required file missing: ${file}`);
      }
    });

    // Check required directories
    requiredDirs.forEach(dir => {
      const dirPath = path.join(this.templatePath, dir);
      if (!fs.existsSync(dirPath)) {
        this.errors.push(`Required directory missing: ${dir}`);
      }
    });

    // Check recommended files
    recommendedFiles.forEach(file => {
      const filePath = path.join(this.templatePath, file);
      if (!fs.existsSync(filePath)) {
        this.warnings.push(`Recommended file missing: ${file}`);
      }
    });
  }

  /**
   * Validate template configuration
   */
  validateConfig() {
    console.log('Validating template configuration...');

    const configPath = path.join(this.templatePath, 'template.config.yml');
    
    if (!fs.existsSync(configPath)) {
      this.errors.push('Template configuration file missing');
      return;
    }

    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      const config = yaml.load(configContent);

      // Validate required fields
      const requiredFields = ['name', 'version', 'description', 'category'];
      requiredFields.forEach(field => {
        if (!config[field]) {
          this.errors.push(`Required config field missing: ${field}`);
        }
      });

      // Validate defaults section
      if (!config.defaults) {
        this.warnings.push('No defaults section in configuration');
      } else {
        if (!config.defaults.project) {
          this.warnings.push('No project defaults defined');
        }
        if (!config.defaults.newt) {
          this.warnings.push('No Newt defaults defined');
        }
      }

      // Validate variables
      if (config.variables) {
        Object.keys(config.variables).forEach(key => {
          const variable = config.variables[key];
          if (!variable.description) {
            this.warnings.push(`Variable ${key} missing description`);
          }
          if (!variable.default && !variable.required) {
            this.warnings.push(`Variable ${key} should have default or be marked required`);
          }
        });
      }

    } catch (err) {
      this.errors.push(`Invalid YAML in configuration: ${err.message}`);
    }
  }

  /**
   * Validate Newt integration
   */
  validateNewtIntegration() {
    console.log('Validating Newt integration...');

    const newtConfigPath = path.join(this.templatePath, '.newt', 'config.yml');
    
    if (!fs.existsSync(newtConfigPath)) {
      this.errors.push('Newt configuration missing: .newt/config.yml');
      return;
    }

    try {
      const configContent = fs.readFileSync(newtConfigPath, 'utf8');
      const config = yaml.load(configContent);

      // Check for essential Newt configurations
      if (!config.thresholds) {
        this.warnings.push('No thresholds defined in Newt config');
      }

      if (!config.review_policies) {
        this.warnings.push('No review policies defined in Newt config');
      }

      // Check for workflows
      const workflowsDir = path.join(this.templatePath, '.newt', 'workflows');
      if (!fs.existsSync(workflowsDir)) {
        this.warnings.push('No Newt workflows directory found');
      } else {
        const workflows = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.md'));
        if (workflows.length === 0) {
          this.warnings.push('No Newt workflows defined');
        }
      }

    } catch (err) {
      this.errors.push(`Invalid Newt configuration: ${err.message}`);
    }
  }

  /**
   * Validate documentation
   */
  validateDocumentation() {
    console.log('Validating documentation...');

    const readmePath = path.join(this.templatePath, 'README.md');
    
    if (!fs.existsSync(readmePath)) {
      this.errors.push('README.md missing');
      return;
    }

    const content = fs.readFileSync(readmePath, 'utf8');

    // Check for essential sections
    const requiredSections = [
      '# ',  // Title
      'Quick Start',
      'Features',
      'Installation'
    ];

    requiredSections.forEach(section => {
      if (!content.includes(section)) {
        this.warnings.push(`README missing section: ${section}`);
      }
    });

    // Check for Newt references
    if (!content.includes('Newt') && !content.includes('/review')) {
      this.warnings.push('README does not mention Newt integration');
    }
  }

  /**
   * Validate variable usage
   */
  validateVariables() {
    console.log('Validating template variables...');

    const configPath = path.join(this.templatePath, 'template.config.yml');
    
    if (!fs.existsSync(configPath)) {
      return;
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(configContent);

    if (!config.variables) {
      this.warnings.push('No variables defined in template');
      return;
    }

    // Find all variable usage in template files
    const usedVariables = new Set();
    const definedVariables = new Set(Object.keys(config.variables));

    const scanDirectory = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== '.git') {
            scanDirectory(fullPath);
          }
        } else {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const matches = content.match(/{{(\w+)}}/g);
            if (matches) {
              matches.forEach(match => {
                const varName = match.replace(/[{}]/g, '').trim();
                usedVariables.add(varName);
              });
            }
          } catch (err) {
            // Skip binary files
          }
        }
      });
    };

    scanDirectory(this.templatePath);

    // Check for undefined variables
    usedVariables.forEach(varName => {
      if (!definedVariables.has(varName)) {
        this.warnings.push(`Variable used but not defined: ${varName}`);
      }
    });

    // Check for unused variables
    definedVariables.forEach(varName => {
      if (!usedVariables.has(varName)) {
        this.warnings.push(`Variable defined but not used: ${varName}`);
      }
    });
  }

  /**
   * Run all validations
   */
  validate() {
    console.log('=== Newt Template Validation ===\n');
    console.log(`Template: ${this.templatePath}\n`);

    this.validateStructure();
    this.validateConfig();
    this.validateNewtIntegration();
    this.validateDocumentation();
    this.validateVariables();

    console.log('\n=== Validation Results ===\n');

    if (this.errors.length > 0) {
      console.log(`❌ ${this.errors.length} ERRORS:`);
      this.errors.forEach(err => console.log(`  - ${err}`));
      console.log();
    }

    if (this.warnings.length > 0) {
      console.log(`⚠️  ${this.warnings.length} WARNINGS:`);
      this.warnings.forEach(warn => console.log(`  - ${warn}`));
      console.log();
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ Template validation passed!\n');
      return { valid: true, errors: [], warnings: [] };
    } else if (this.errors.length === 0) {
      console.log('✅ No errors (warnings can be addressed)\n');
      return { valid: true, errors: [], warnings: this.warnings };
    } else {
      console.log('❌ Template validation failed\n');
      return { valid: false, errors: this.errors, warnings: this.warnings };
    }
  }
}

module.exports = TemplateValidator;

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Usage: node validator.js <template-path>');
    process.exit(1);
  }

  const templatePath = args[0];
  const validator = new TemplateValidator(templatePath);
  const result = validator.validate();

  process.exit(result.valid ? 0 : 1);
}
