import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const hooksDirectory = dirname(fileURLToPath(import.meta.url));
const defaultAllowlistPath = join(hooksDirectory, 'allowlist.json');
const unsafeArgumentPattern = /[;&|`$<>\n\r]/;

export async function loadAllowlist(path) {
  let parsed;
  try {
    parsed = JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error('Hook allowlist is not valid JSON');
    throw new Error(`Hook allowlist could not be read: ${error.message}`);
  }

  if (parsed?.version !== 1 || !parsed.hooks || typeof parsed.hooks !== 'object') {
    throw new Error('Hook allowlist must contain version 1 and a hooks object');
  }
  return parsed;
}

function validateArguments(name, args, allowedArguments) {
  if (!Array.isArray(args) || args.some((argument) => typeof argument !== 'string')) {
    throw new Error('Hook arguments must be an array of strings');
  }
  for (const argument of args) {
    if (unsafeArgumentPattern.test(argument)) {
      throw new Error(`Unsafe hook argument: ${argument}`);
    }
    if (!allowedArguments.includes(argument)) {
      throw new Error(`Argument is not allowed for ${name}: ${argument}`);
    }
  }
}

export async function runHook(name, args, options = {}) {
  const allowlistPath = options.allowlistPath ?? defaultAllowlistPath;
  const allowlist = await loadAllowlist(allowlistPath);
  const hook = allowlist.hooks[name];
  if (!hook) throw new Error(`Hook is not allowlisted: ${name}`);
  if (hook.runtime !== 'node' || typeof hook.script !== 'string') {
    throw new Error(`Hook configuration is invalid: ${name}`);
  }

  validateArguments(name, args, hook.allowedArguments ?? []);
  const script = isAbsolute(hook.script)
    ? hook.script
    : resolve(dirname(allowlistPath), hook.script);
  const timeoutMs = Number.isInteger(hook.timeoutMs) ? hook.timeoutMs : 30_000;
  if (timeoutMs < 1 || timeoutMs > 30_000) {
    throw new Error(`Hook timeout is outside the allowed range: ${name}`);
  }

  return await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(process.execPath, [script, ...args], {
      cwd: options.cwd ?? process.cwd(),
      env: { PATH: process.env.PATH },
      shell: false,
      stdio: 'inherit',
    });
    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill('SIGTERM');
      rejectPromise(new Error(`Hook timed out: ${name}`));
    }, timeoutMs);

    child.once('error', (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      rejectPromise(error);
    });
    child.once('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolvePromise({ code: code ?? 1 });
    });
  });
}

async function main() {
  const cliArguments = process.argv.slice(2);
  if (cliArguments[0] === '--') cliArguments.shift();
  const [name, ...args] = cliArguments;
  if (!name) throw new Error('Usage: runner.js <hook-name> [allowed-arguments]');
  const result = await runHook(name, args);
  process.exitCode = result.code;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
