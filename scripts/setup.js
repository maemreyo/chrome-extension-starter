#!/usr/bin/env node

/**
 * Setup script for Chrome Extension Starter
 * Initializes the development environment and checks dependencies
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Setting up Chrome Extension Starter...\n')

// Check Node.js version
const nodeVersion = process.version
const requiredVersion = '18.0.0'
console.log(`📋 Node.js version: ${nodeVersion}`)

if (nodeVersion < `v${requiredVersion}`) {
  console.error(`❌ Node.js ${requiredVersion} or higher is required`)
  process.exit(1)
}

// Check if package manager is available
function checkPackageManager() {
  const managers = ['pnpm', 'npm', 'yarn']
  
  for (const manager of managers) {
    try {
      execSync(`${manager} --version`, { stdio: 'ignore' })
      console.log(`✅ Package manager: ${manager}`)
      return manager
    } catch (error) {
      continue
    }
  }
  
  console.error('❌ No package manager found (npm, pnpm, or yarn required)')
  process.exit(1)
}

const packageManager = checkPackageManager()

// Create .env.local if it doesn't exist
function setupEnvironment() {
  const envExample = path.join(__dirname, '..', '.env.example')
  const envLocal = path.join(__dirname, '..', '.env.local')
  
  if (!fs.existsSync(envLocal) && fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, envLocal)
    console.log('✅ Created .env.local from .env.example')
    console.log('📝 Please update .env.local with your API keys and configuration')
  }
}

// Install dependencies
function installDependencies() {
  console.log('\n📦 Installing dependencies...')
  try {
    execSync(`${packageManager} install`, { stdio: 'inherit' })
    console.log('✅ Dependencies installed successfully')
  } catch (error) {
    console.error('❌ Failed to install dependencies')
    process.exit(1)
  }
}

// Run type checking
function runTypeCheck() {
  console.log('\n🔍 Running type check...')
  try {
    execSync(`${packageManager} run typecheck`, { stdio: 'inherit' })
    console.log('✅ Type check passed')
  } catch (error) {
    console.warn('⚠️  Type check failed - you may need to fix TypeScript errors')
  }
}

// Run linting
function runLinting() {
  console.log('\n🧹 Running linter...')
  try {
    execSync(`${packageManager} run lint`, { stdio: 'inherit' })
    console.log('✅ Linting passed')
  } catch (error) {
    console.warn('⚠️  Linting failed - running auto-fix...')
    try {
      execSync(`${packageManager} run lint:fix`, { stdio: 'inherit' })
      console.log('✅ Auto-fix completed')
    } catch (fixError) {
      console.warn('⚠️  Some linting issues need manual fixing')
    }
  }
}

// Check Chrome browser
function checkChrome() {
  console.log('\n🌐 Checking Chrome browser...')
  const chromePaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Windows
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', // Windows 32-bit
    '/usr/bin/google-chrome', // Linux
    '/usr/bin/chromium-browser' // Linux Chromium
  ]
  
  const chromeExists = chromePaths.some(chromePath => fs.existsSync(chromePath))
  
  if (chromeExists) {
    console.log('✅ Chrome browser found')
  } else {
    console.warn('⚠️  Chrome browser not found in standard locations')
    console.log('   Please ensure Chrome is installed for extension development')
  }
}

// Create build directory
function setupBuildDirectory() {
  const buildDir = path.join(__dirname, '..', 'build')
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true })
    console.log('✅ Created build directory')
  }
}

// Main setup function
async function main() {
  try {
    setupEnvironment()
    installDependencies()
    setupBuildDirectory()
    runTypeCheck()
    runLinting()
    checkChrome()
    
    console.log('\n🎉 Setup completed successfully!')
    console.log('\n📚 Next steps:')
    console.log('   1. Update .env.local with your API keys')
    console.log('   2. Run "npm run dev" to start development')
    console.log('   3. Load the extension in Chrome from chrome://extensions/')
    console.log('   4. Enable "Developer mode" and click "Load unpacked"')
    console.log('   5. Select the "build" directory')
    console.log('\n📖 Documentation: ./docs/README.md')
    console.log('🐛 Issues: Check the GitHub repository')
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message)
    process.exit(1)
  }
}

main()