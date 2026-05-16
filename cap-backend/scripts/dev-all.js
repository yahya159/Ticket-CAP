'use strict';

const net = require('node:net');
const { spawn } = require('node:child_process');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.resolve(rootDir, 'app', 'frontend');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const DEFAULT_BACKEND_PORT = Number(process.env.VITE_BACKEND_PORT || process.env.PORT || 4004);

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

const isPortAvailableOnHost = (port, host) =>
  new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once('error', () => resolve(false));
    server.listen(port, host, () => {
      server.close(() => resolve(true));
    });
  });

const isPortAvailable = async (port) => {
  const checks = await Promise.all([
    isPortAvailableOnHost(port, '127.0.0.1'),
    isPortAvailableOnHost(port, '::'),
  ]);
  return checks.every(Boolean);
};

const findAvailablePort = async (startPort, maxAttempts = 25) => {
  for (let port = startPort; port < startPort + maxAttempts; port += 1) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`Unable to find an available backend port starting at ${startPort}`);
};

const startProcess = (name, command, args, cwd, env) => {
  const child = spawn(command, args, {
    cwd,
    env,
    shell: process.platform === 'win32',
  });

  processes.push(child);
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

  return child;
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

const main = async () => {
  const backendPort = await findAvailablePort(DEFAULT_BACKEND_PORT);
  const backendEnv = {
    ...process.env,
    PORT: String(backendPort),
    VITE_BACKEND_PORT: String(backendPort),
  };
  const frontendEnv = {
    ...process.env,
    VITE_BACKEND_PORT: String(backendPort),
    VITE_ODATA_BASE_URL: '/odata/v4',
  };

  console.log(`[dev-all] backend port ${backendPort} selected`);
  startProcess('backend', npmCommand, ['run', 'start'], rootDir, backendEnv);
  startProcess('frontend', npmCommand, ['run', 'dev'], frontendDir, frontendEnv);
};

void main().catch((error) => {
  console.error('[dev-all] failed to start development servers');
  console.error(error);
  process.exit(1);
});
