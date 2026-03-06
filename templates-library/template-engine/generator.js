#!/usr/bin/env node
/**
 * Newt Template Generator
 * Generates project templates with Newt integration
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class TemplateGenerator {
  constructor(templatePath, outputPath, config = {}) {
    this.templatePath = templatePath;
    this.outputPath = outputPath;
    this.config = config;
    this.variables = {};
  }

  /**
   * Load template configuration
   */
  loadTemplateConfig() {
    const configPath = path.join(this.templatePath, 'template.config.yml');
    
    if (!fs.existsSync(configPath)) {
      throw new Error(`Template configuration not found: ${configPath}`);
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    return yaml.load(configContent);
  }

  /**
   * Merge user config with template defaults
   */
  mergeConfig(templateConfig) {
    return {
      ...templateConfig.defaults,
      ...this.config,
      project: {
        ...templateConfig.defaults?.project,
        ...this.config.project
      },
      newt: {
        ...templateConfig.defaults?.newt,
        ...this.config.newt
      }
    };
  }

  /**
   * Process template variables
   */
  processVariables(content, variables) {
    let processed = content;
    
    // Replace {{variable}} syntax
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      processed = processed.replace(regex, variables[key]);
    });

    // Replace nested variables like {{project.name}}
    const nestedRegex = /{{(\w+)\.(\w+)}}/g;
    processed = processed.replace(nestedRegex, (match, obj, prop) => {
      return variables[obj]?.[prop] || match;
    });

    return processed;
  }

  /**
   * Copy directory recursively with variable substitution
   */
  copyDirectory(src, dest, variables) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    entries.forEach(entry => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        // Skip template config and metadata
        if (entry.name === '.template' || entry.name === 'node_modules') {
          return;
        }
        this.copyDirectory(srcPath, destPath, variables);
      } else {
        // Process file content
        const content = fs.readFileSync(srcPath, 'utf8');
        const processed = this.processVariables(content, variables);
        fs.writeFileSync(destPath, processed, 'utf8');
      }
    });
  }

  /**
   * Validate template structure
   */
  validateTemplate() {
    const requiredFiles = [
      'template.config.yml',
      'README.md'
    ];

    const requiredDirs = [
      '.newt'
    ];

    requiredFiles.forEach(file => {
      const filePath = path.join(this.templatePath, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Required file missing: ${file}`);
      }
    });

    requiredDirs.forEach(dir => {
      const dirPath = path.join(this.templatePath, dir);
      if (!fs.existsSync(dirPath)) {
        throw new Error(`Required directory missing: ${dir}`);
      }
    });

    return true;
  }

  /**
   * Generate project from template
   */
  async generate() {
    console.log('🦎 Newt Template Generator\n');

    // Validate template
    console.log('Validating template structure...');
    this.validateTemplate();
    console.log('✓ Template structure valid\n');

    // Load configuration
    console.log('Loading template configuration...');
    const templateConfig = this.loadTemplateConfig();
    const mergedConfig = this.mergeConfig(templateConfig);
    console.log('✓ Configuration loaded\n');

    // Prepare variables
    this.variables = {
      ...mergedConfig,
      timestamp: new Date().toISOString(),
      year: new Date().getFullYear()
    };

    // Create output directory
    console.log(`Creating project at: ${this.outputPath}`);
    if (fs.existsSync(this.outputPath)) {
      throw new Error(`Output directory already exists: ${this.outputPath}`);
    }
    fs.mkdirSync(this.outputPath, { recursive: true });

    // Copy template files
    console.log('Copying template files...');
    this.copyDirectory(this.templatePath, this.outputPath, this.variables);
    console.log('✓ Files copied\n');

    // Post-generation tasks
    await this.postGenerate(mergedConfig);

    console.log('✅ Template generation complete!\n');
    console.log('Next steps:');
    console.log(`  cd ${path.basename(this.outputPath)}`);
    console.log('  npm install');
    console.log('  /review  # Run Newt code review\n');

    return {
      success: true,
      outputPath: this.outputPath,
      config: mergedConfig
    };
  }

  /**
   * Post-generation tasks
   */
  async postGenerate(config) {
    // Initialize git if needed
    if (config.git?.init) {
      console.log('Initializing git repository...');
      const { execSync } = require('child_process');
      try {
        execSync('git init', { cwd: this.outputPath, stdio: 'ignore' });
        console.log('✓ Git initialized\n');
      } catch (err) {
        console.warn('⚠️  Git initialization failed (git may not be installed)\n');
      }
    }

    // Create initial commit
    if (config.git?.initialCommit) {
      console.log('Creating initial commit...');
      const { execSync } = require('child_process');
      try {
        execSync('git add .', { cwd: this.outputPath, stdio: 'ignore' });
        execSync('git commit -m "Initial commit from Newt template"', { 
          cwd: this.outputPath, 
          stdio: 'ignore' 
        });
        console.log('✓ Initial commit created\n');
      } catch (err) {
        console.warn('⚠️  Initial commit failed\n');
      }
    }
  }
}

module.exports = TemplateGenerator;

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node generator.js <template-path> <output-path> [config-file]');
    process.exit(1);
  }

  const [templatePath, outputPath, configFile] = args;
  let config = {};

  if (configFile && fs.existsSync(configFile)) {
    const configContent = fs.readFileSync(configFile, 'utf8');
    config = yaml.load(configContent);
  }

  const generator = new TemplateGenerator(templatePath, outputPath, config);
  
  generator.generate()
    .then(result => {
      console.log('Generation successful!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Generation failed:', err.message);
      process.exit(1);
    });
}
