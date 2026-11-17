#!/usr/bin/env node
/**
 * Cross-platform script runner
 * Usage: node scripts/run-cmd.js <folder> <script> [...args]
 * e.g., node scripts/run-cmd.js backend dev
 */

const { spawn } = require('child_process');
const path = require('path');

const [targetFolder, scriptName, ...extraArgs] = process.argv.slice(2);

if (!targetFolder || !scriptName) {
  console.error('Usage: node scripts/run-cmd.js <backend|frontend> <script-name> [...args]');
  process.exit(1);
}

const isWindows = process.platform === 'win32';
const npmBin = isWindows ? 'npm.cmd' : 'npm';
const rootDir = path.resolve(__dirname, '..');
const cwd = path.join(rootDir, targetFolder);

const args = ['run', scriptName, ...(extraArgs.length > 0 ? ['--', ...extraArgs] : [])];

console.log(`[runner] Executing "${npmBin} ${args.join(' ')}" in "${cwd}"`);

const child = spawn(npmBin, args, {
  cwd,
  stdio: 'inherit',
  shell: true
});

child.on('error', (err) => {
  console.error(`[runner] Failed to run script:`, err);
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code || 0);
});
