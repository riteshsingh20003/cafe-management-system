#!/usr/bin/env node
/**
 * Cross-platform concurrent development runner
 * Spawns both backend and frontend with prefixed, color-coded output.
 */

const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');

const isWindows = process.platform === 'win32';
const npmBin = isWindows ? 'npm.cmd' : 'npm';
const rootDir = path.resolve(__dirname, '..');

// ANSI Color Codes
const COLORS = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m'
};

const processes = [];

function pipeOutput(stream, label, color) {
  if (!stream) return;
  const rl = readline.createInterface({ input: stream });
  rl.on('line', (line) => {
    console.log(`${color}${COLORS.bold}[${label}]${COLORS.reset} ${line}`);
  });
}

function startProcess(name, dir, script, color) {
  const cwd = path.join(rootDir, dir);
  console.log(`${color}▶ Starting ${name} (${npmBin} run ${script}) in ${dir}...${COLORS.reset}`);

  const child = spawn(npmBin, ['run', script], {
    cwd,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true
  });

  pipeOutput(child.stdout, name, color);
  pipeOutput(child.stderr, name, color);

  child.on('error', (err) => {
    console.error(`${COLORS.red}[${name}] Failed to start:${COLORS.reset}`, err.message);
  });

  child.on('close', (code) => {
    console.log(`${color}[${name}] Exited with code ${code}${COLORS.reset}`);
  });

  processes.push(child);
  return child;
}

function shutdown() {
  console.log(`\n${COLORS.yellow}Shutting down all development servers...${COLORS.reset}`);
  for (const proc of processes) {
    if (proc && !proc.killed) {
      if (isWindows) {
        spawn('taskkill', ['/pid', proc.pid.toString(), '/f', '/t']);
      } else {
        proc.kill('SIGTERM');
      }
    }
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log(`${COLORS.bold}======================================================${COLORS.reset}`);
console.log(`${COLORS.bold}☕ Starting Cafe Management System (Dev Mode)${COLORS.reset}`);
console.log(`${COLORS.bold}======================================================${COLORS.reset}`);

startProcess('BACKEND', 'backend', 'dev', COLORS.cyan);
startProcess('FRONTEND', 'frontend', 'dev', COLORS.magenta);
