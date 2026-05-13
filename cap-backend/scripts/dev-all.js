'use strict';

const { spawn } = require('node:child_process');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.resolve(rootDir, 'app', 'frontend');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const processes = [];
let shuttingDown = false;

const forwardOutput = (name, stream) => {
  stream.on('data', (chunk) => {
    const text = chunk.toString();
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (!line && index === lines.length - 1) return;
      const suffix = index === lines.length - 1 ? '' : '\n';
      process.stdout.write(`[${name}] ${line}${suffix}`);
    });
  });
};

const startProcess = (name, command, args, cwd) => {
  const child = spawn(command, args, {
    cwd,
    env: process.env,
    shell: process.platform === 'win32',
  });

  forwardOutput(name, child.stdout);
  forwardOutput(name, child.stderr);

  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log(`[${name}] exited with ${signal ?? code}`);
    processes.forEach((proc) => {
      if (proc !== child && !proc.killed) {
        proc.kill();
      }
    });

    process.exit(code ?? 0);
  });

};

const shutdown = () => {
  if (shuttingDown) return;
  shuttingDown = true;

  processes.forEach((proc) => {
    if (!proc.killed) {
      proc.kill();
    }
  });

  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startProcess('backend', npmCommand, ['run', 'watch'], rootDir);
startProcess('frontend', npmCommand, ['run', 'dev'], frontendDir);