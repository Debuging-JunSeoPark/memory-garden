import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';

const temporaryRoots = [];

async function loadValidator() {
  try {
    return await import('../../scripts/validate-repository.mjs');
  } catch {
    return {};
  }
}

async function write(root, path, content = '') {
  const target = join(root, path);
  await mkdir(join(target, '..'), { recursive: true });
  await writeFile(target, content, 'utf8');
}

async function createRepository() {
  const root = await mkdtemp(join(tmpdir(), 'memory-garden-validator-'));
  temporaryRoots.push(root);

  const requiredFiles = [
    'CONTRIBUTING.md',
    'docs/conventions/git.md',
    '.github/ISSUE_TEMPLATE/feature.yml',
    '.github/ISSUE_TEMPLATE/bug.yml',
    '.github/ISSUE_TEMPLATE/config.yml',
    '.github/PULL_REQUEST_TEMPLATE.md',
    '.github/dependabot.yml',
    '.github/workflows/repository.yml',
  ];

  await write(
    root,
    'package.json',
    JSON.stringify({ name: 'fixture', packageManager: 'pnpm@12.1.0' }),
  );
  await write(root, '.gitignore', '.env\n.env.*\n!.env.example\n');
  await Promise.all(requiredFiles.map((path) => write(root, path, 'configured\n')));

  execFileSync('git', ['init', '-q'], { cwd: root });
  execFileSync('git', ['add', '.'], { cwd: root });
  return root;
}

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true })));
});

describe('validateRepository', () => {
  test('accepts a repository with all required policy files and pinned pnpm', async () => {
    const { validateRepository } = await loadValidator();
    expect(typeof validateRepository).toBe('function');
    const root = await createRepository();

    await expect(validateRepository(root)).resolves.toEqual({ ok: true, errors: [] });
  });

  test('reports each missing required policy file', async () => {
    const { validateRepository } = await loadValidator();
    expect(typeof validateRepository).toBe('function');
    const root = await createRepository();
    await rm(join(root, '.github/PULL_REQUEST_TEMPLATE.md'));

    const result = await validateRepository(root);

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Missing required file: .github/PULL_REQUEST_TEMPLATE.md');
  });

  test('rejects a package without a pinned pnpm version', async () => {
    const { validateRepository } = await loadValidator();
    expect(typeof validateRepository).toBe('function');
    const root = await createRepository();
    await write(root, 'package.json', JSON.stringify({ name: 'fixture' }));

    const result = await validateRepository(root);

    expect(result.errors).toContain('package.json must pin pnpm with packageManager');
  });

  test('rejects tracked environment files except examples', async () => {
    const { validateRepository } = await loadValidator();
    expect(typeof validateRepository).toBe('function');
    const root = await createRepository();
    await write(root, '.env.production', 'SECRET=value\n');
    execFileSync('git', ['add', '-f', '.env.production'], { cwd: root });

    const result = await validateRepository(root);

    expect(result.errors).toContain('Tracked environment file is forbidden: .env.production');
  });

  test('rejects common secret markers in public agent memories', async () => {
    const { validateRepository } = await loadValidator();
    expect(typeof validateRepository).toBe('function');
    const root = await createRepository();
    await write(root, 'agents/memories/repo.md', 'OPENAI_API_KEY=sk-example-secret\n');
    execFileSync('git', ['add', 'agents/memories/repo.md'], { cwd: root });

    const result = await validateRepository(root);

    expect(result.errors).toContain(
      'Potential secret marker found in agents/memories/repo.md: OPENAI_API_KEY',
    );
  });
});

