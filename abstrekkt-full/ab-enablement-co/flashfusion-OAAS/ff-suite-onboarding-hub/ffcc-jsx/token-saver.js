#!/usr/bin/env node

/**
 * Token Optimization Tool
 * Searches locally FIRST to avoid regenerating existing code
 * Saves massive token usage by reusing what already exists
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TokenSaver {
  constructor() {
    this.searchPaths = [
      'C:\\Users\\kyler\\FlashFusion-Unified',
      'C:\\Users\\kyler\\repos',
      'D:\\Projects\\Active',
      'D:\\Projects\\Templates',
      'C:\\Users\\kyler'
    ];
    
    this.cacheFile = path.join('D:', 'Projects', '.code-cache.json');
    this.cache = this.loadCache();
  }

  loadCache() {
    try {
      if (fs.existsSync(this.cacheFile)) {
        return JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'));
      }
    } catch (e) {}
    return { files: {}, components: {}, functions: {}, configs: {} };
  }

  saveCache() {
    fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, 2));
  }

  // Search for existing code before creating new
  async findExisting(query, type = 'all') {
    console.log(`🔍 Searching locally for: ${query}`);
    
    const results = {
      local: [],
      repos: [],
      similar: []
    };

    // 1. Check cache first (instant)
    if (this.cache[type] && this.cache[type][query]) {
      console.log('✅ Found in cache!');
      return this.cache[type][query];
    }

    // 2. Search local files
    for (const searchPath of this.searchPaths) {
      if (fs.existsSync(searchPath)) {
        try {
          const files = execSync(
            `rg -l "${query}" "${searchPath}" --type-add "code:*.{js,jsx,ts,tsx,json,md}" -t code`,
            { encoding: 'utf8', stdio: 'pipe' }
          ).trim().split('\n').filter(Boolean);
          
          results.local.push(...files);
        } catch (e) {}
      }
    }

    // 3. Search GitHub repos
    try {
      const repos = execSync(
        `gh repo list Krosebrook --limit 100 --json name,description`,
        { encoding: 'utf8' }
      );
      
      const repoList = JSON.parse(repos);
      for (const repo of repoList) {
        if (repo.name.toLowerCase().includes(query.toLowerCase()) ||
            (repo.description && repo.description.toLowerCase().includes(query.toLowerCase()))) {
          results.repos.push(repo.name);
        }
      }
    } catch (e) {}

    // Cache results
    if (!this.cache[type]) this.cache[type] = {};
    this.cache[type][query] = results;
    this.saveCache();

    return results;
  }

  // Find reusable components
  async findComponent(componentName) {
    const locations = [
      `C:\\Users\\kyler\\FlashFusion-Unified\\src\\components\\${componentName}.js`,
      `C:\\Users\\kyler\\FlashFusion-Unified\\src\\components\\${componentName}.jsx`,
      `C:\\Users\\kyler\\FlashFusion-Unified\\client\\src\\components\\${componentName}.tsx`,
      `D:\\Projects\\Templates\\components\\${componentName}.js`
    ];

    for (const loc of locations) {
      if (fs.existsSync(loc)) {
        console.log(`✅ Found existing component: ${loc}`);
        return loc;
      }
    }

    // Search for similar
    const results = await this.findExisting(componentName, 'components');
    if (results.local.length > 0) {
      console.log(`📁 Similar components found:`);
      results.local.slice(0, 5).forEach(f => console.log(`   - ${f}`));
      return results.local[0];
    }

    return null;
  }

  // Find existing configurations
  async findConfig(configType) {
    const configs = {
      'package.json': [
        'C:\\Users\\kyler\\FlashFusion-Unified\\package.json',
        'D:\\Projects\\Templates\\package.json'
      ],
      'tsconfig': [
        'C:\\Users\\kyler\\FlashFusion-Unified\\tsconfig.json',
        'D:\\Projects\\Templates\\tsconfig.json'
      ],
      'tailwind': [
        'C:\\Users\\kyler\\FlashFusion-Unified\\tailwind.config.js',
        'D:\\Projects\\Templates\\tailwind.config.js'
      ],
      'eslint': [
        'C:\\Users\\kyler\\FlashFusion-Unified\\.eslintrc.json',
        'D:\\Projects\\Templates\\.eslintrc.json'
      ],
      'env': [
        'C:\\Users\\kyler\\FlashFusion-Unified\\.env.example',
        'D:\\Projects\\Templates\\.env.template'
      ]
    };

    const paths = configs[configType] || [];
    for (const p of paths) {
      if (fs.existsSync(p)) {
        console.log(`✅ Found existing config: ${p}`);
        return p;
      }
    }

    return null;
  }

  // Copy existing project structure
  async copyProject(sourceName, targetName) {
    const sources = [
      `D:\\Projects\\Active\\${sourceName}`,
      `D:\\Projects\\Templates\\${sourceName}`,
      `C:\\Users\\kyler\\${sourceName}`
    ];

    for (const source of sources) {
      if (fs.existsSync(source)) {
        const target = `D:\\Projects\\Active\\${targetName}`;
        console.log(`♻️ Reusing existing project: ${source}`);
        console.log(`📁 Copying to: ${target}`);
        
        execSync(`robocopy "${source}" "${target}" /E /XD node_modules .git`, 
          { stdio: 'inherit' });
        
        return target;
      }
    }

    return null;
  }

  // Smart code reuse
  async reuseCode(description) {
    console.log('\n🎯 TOKEN SAVER ACTIVATED');
    console.log('========================\n');

    // Parse what we're looking for
    const keywords = description.toLowerCase().split(' ');
    
    // Check for common patterns
    const patterns = {
      'auth': ['login', 'auth', 'signup', 'user'],
      'dashboard': ['dashboard', 'admin', 'panel'],
      'api': ['api', 'endpoint', 'route', 'server'],
      'database': ['database', 'db', 'supabase', 'firebase'],
      'monitoring': ['monitoring', 'health', 'metrics', 'alert']
    };

    for (const [category, terms] of Object.entries(patterns)) {
      if (terms.some(t => keywords.includes(t))) {
        console.log(`📂 Category detected: ${category}`);
        
        // Find existing implementations
        const existing = await this.findExisting(category, 'functions');
        
        if (existing.local.length > 0) {
          console.log(`\n✅ FOUND ${existing.local.length} EXISTING IMPLEMENTATIONS!`);
          console.log('🎉 No need to regenerate - saving tokens!\n');
          
          console.log('📍 Use these existing files:');
          existing.local.slice(0, 10).forEach(f => {
            console.log(`   ${f}`);
          });
          
          return existing.local;
        }
      }
    }

    return [];
  }

  // Generate reuse report
  async generateReport() {
    const report = {
      totalFiles: 0,
      reusableComponents: [],
      reusableConfigs: [],
      reusableFunctions: [],
      estimatedTokensSaved: 0
    };

    // Scan all projects
    for (const searchPath of this.searchPaths) {
      if (fs.existsSync(searchPath)) {
        const files = this.getAllFiles(searchPath);
        report.totalFiles += files.length;
        
        files.forEach(file => {
          if (file.includes('component')) report.reusableComponents.push(file);
          if (file.includes('config')) report.reusableConfigs.push(file);
          if (file.endsWith('.js') || file.endsWith('.ts')) {
            report.reusableFunctions.push(file);
          }
        });
      }
    }

    // Estimate tokens saved (avg 500 tokens per file)
    report.estimatedTokensSaved = report.totalFiles * 500;

    console.log('\n📊 TOKEN SAVINGS REPORT');
    console.log('======================\n');
    console.log(`📁 Total reusable files: ${report.totalFiles}`);
    console.log(`🧩 Reusable components: ${report.reusableComponents.length}`);
    console.log(`⚙️  Reusable configs: ${report.reusableConfigs.length}`);
    console.log(`🔧 Reusable functions: ${report.reusableFunctions.length}`);
    console.log(`\n💰 ESTIMATED TOKENS SAVED: ${report.estimatedTokensSaved.toLocaleString()}`);
    
    return report;
  }

  getAllFiles(dirPath, arrayOfFiles = []) {
    try {
      const files = fs.readdirSync(dirPath);
      
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        
        if (fs.statSync(filePath).isDirectory()) {
          if (!file.startsWith('.') && file !== 'node_modules') {
            this.getAllFiles(filePath, arrayOfFiles);
          }
        } else {
          arrayOfFiles.push(filePath);
        }
      });
    } catch (e) {}
    
    return arrayOfFiles;
  }
}

// CLI Usage
if (require.main === module) {
  const saver = new TokenSaver();
  const [,, command, ...args] = process.argv;

  switch(command) {
    case 'find':
      saver.findExisting(args.join(' ')).then(results => {
        if (results.local.length > 0) {
          console.log('\n✅ Found locally - NO TOKENS NEEDED!');
        }
      });
      break;
      
    case 'component':
      saver.findComponent(args[0]);
      break;
      
    case 'config':
      saver.findConfig(args[0]);
      break;
      
    case 'reuse':
      saver.reuseCode(args.join(' '));
      break;
      
    case 'report':
      saver.generateReport();
      break;
      
    default:
      console.log('Token Saver - Minimize token usage!');
      console.log('\nCommands:');
      console.log('  find [query]      - Find existing code');
      console.log('  component [name]  - Find existing component');
      console.log('  config [type]     - Find existing config');
      console.log('  reuse [desc]      - Find reusable code');
      console.log('  report            - Show savings report');
  }
}

module.exports = TokenSaver;