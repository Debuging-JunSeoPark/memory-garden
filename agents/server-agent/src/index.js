import { pathToFileURL } from 'node:url';
import { validateRepository } from '../../../scripts/validate-repository.mjs';
import { loadConfig } from './config.js';
import { createJobRegistry } from './job-registry.js';
import { createServer } from './server.js';

export { createJobRegistry, createServer, loadConfig };

async function main() {
  const config = loadConfig(process.env);
  const registry = createJobRegistry({
    timeoutMs: config.taskTimeoutMs,
    executors: {
      'repository.validate': async () => await validateRepository(process.cwd()),
    },
  });
  const server = createServer({ ...config, registry });
  server.listen(config.port, config.host, () => {
    console.log(`Server agent listening on http://${config.host}:${config.port}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

