import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { afterEach, describe, expect, test } from 'vitest';

const temporaryRoots = [];
const execFileAsync = promisify(execFile);

async function loadRunner() {
  try {
    return await import('./runner.js');
  } catch {
    return {};
  }
}

async function fixture({ exitCode = 0, delayMs = 0, allowedArguments = [] } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'memory-garden-hook-'));
  temporaryRoots.push(root);
  const scriptPath = join(root, 'hook.js');
  const allowlistPath = join(root, 'allowlist.json');
  await writeFile(
    scriptPath,
    `setTimeout(() => process.exit(${exitCode}), ${delayMs});\n`,
    'utf8',
  );
  await writeFile(
    allowlistPath,
    JSON.stringify({
      version: 1,
      hooks: {
        fixture: {
          runtime: 'node',
          script: scriptPath,
          allowedArguments,
          timeoutMs: delayMs > 0 ? 20 : 1_000,
        },
      },
    }),
    'utf8',
  );
  return allowlistPath;
}

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true })));
});

describe('allowlisted hook runner', () => {
  test('accepts the separator passed through by pnpm scripts', async () => {
    const runnerPath = join(import.meta.dirname, 'runner.js');
    const repositoryRoot = join(import.meta.dirname, '../..');

    await expect(
      execFileAsync(process.execPath, [runnerPath, '--', 'check-memory'], {
        cwd: repositoryRoot,
      }),
    ).resolves.toMatchObject({ stdout: expect.stringContaining('passed validation') });
  });

  test('runs an allowed hook without a shell', async () => {
    const { runHook } = await loadRunner();
    expect(typeof runHook).toBe('function');
    const allowlistPath = await fixture();

    await expect(runHook('fixture', [], { allowlistPath })).resolves.toEqual({ code: 0 });
  });

  test('rejects an unknown hook before spawning', async () => {
    const { runHook } = await loadRunner();
    expect(typeof runHook).toBe('function');
    const allowlistPath = await fixture();

    await expect(runHook('unknown', [], { allowlistPath })).rejects.toThrow(
      'Hook is not allowlisted: unknown',
    );
  });

  test('rejects extra arguments outside the hook schema', async () => {
    const { runHook } = await loadRunner();
    expect(typeof runHook).toBe('function');
    const allowlistPath = await fixture({ allowedArguments: ['--strict'] });

    await expect(runHook('fixture', ['--verbose'], { allowlistPath })).rejects.toThrow(
      'Argument is not allowed for fixture: --verbose',
    );
  });

  test('rejects shell metacharacters even when passed as one argument', async () => {
    const { runHook } = await loadRunner();
    expect(typeof runHook).toBe('function');
    const allowlistPath = await fixture({ allowedArguments: ['safe'] });

    await expect(runHook('fixture', ['safe;whoami'], { allowlistPath })).rejects.toThrow(
      'Unsafe hook argument: safe;whoami',
    );
  });

  test('fails closed when the allowlist is malformed', async () => {
    const { loadAllowlist } = await loadRunner();
    expect(typeof loadAllowlist).toBe('function');
    const root = await mkdtemp(join(tmpdir(), 'memory-garden-hook-'));
    temporaryRoots.push(root);
    const path = join(root, 'allowlist.json');
    await writeFile(path, '{"hooks":', 'utf8');

    await expect(loadAllowlist(path)).rejects.toThrow('Hook allowlist is not valid JSON');
  });

  test('terminates a hook that exceeds its timeout', async () => {
    const { runHook } = await loadRunner();
    expect(typeof runHook).toBe('function');
    const allowlistPath = await fixture({ delayMs: 500 });

    await expect(runHook('fixture', [], { allowlistPath })).rejects.toThrow(
      'Hook timed out: fixture',
    );
  });

  test('returns the non-zero child exit code', async () => {
    const { runHook } = await loadRunner();
    expect(typeof runHook).toBe('function');
    const allowlistPath = await fixture({ exitCode: 7 });

    await expect(runHook('fixture', [], { allowlistPath })).resolves.toEqual({ code: 7 });
  });
});
