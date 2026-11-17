#!/usr/bin/env node
/**
 * Cross-platform installation script for Cafe Management System
 * Automatically selects npm.cmd on Windows and npm on Unix-like systems.
 */

const { spawn } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const npmBin = isWindows ? 'npm.cmd' : 'npm';
const rootDir = path.resolve(__dirname, '..');

function installDir(dirName) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(rootDir, dirName);
    console.log(`\n======================================================`);
    console.log(`📦 Installing dependencies for: ${dirName}`);
    console.log(`📂 Location: ${fullPath}`);
    console.log(`⚙️ Executing: ${npmBin} install`);
    console.log(`======================================================\n`);

    const child = spawn(npmBin, ['install'], {
      cwd: fullPath,
      stdio: 'inherit',
      shell: true
    });

    child.on('error', (err) => {
      console.error(`❌ Failed to start install in ${dirName}:`, err);
      reject(err);
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ Successfully installed dependencies for ${dirName}\n`);
        resolve();
      } else {
        reject(new Error(`npm install in ${dirName} exited with code ${code}`));
      }
    });
  });
}

async function main() {
  try {
    console.log('🚀 Starting full-stack dependency installation...');
    await installDir('backend');
    await installDir('frontend');
    console.log('🎉 All dependencies installed successfully!');
  } catch (error) {
    console.error('\n❌ Installation failed:', error.message);
    process.exit(1);
  }
}

main();
