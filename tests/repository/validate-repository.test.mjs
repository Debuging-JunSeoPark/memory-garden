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
  await write(
    root,
    '.gitignore',
    '.env\n.env.*\n!.env.example\nagents/memories/session.local.md\n',
  );
  await write(
    root,
    'agents/memories/repo.md',
    '# Repository Memory\n\n## Product\n\n## Preferences\n\n## Architecture Decisions\n\n## Repository Rules\n\n## Security Boundaries\n',
  );
  await write(
    root,
    'agents/memories/session.md',
    '# Session Memory\n\n## Current Goal\n\n## Completed\n\n## In Progress\n\n## Next\n\n## Blockers\n\n## Rulings\n',
  );
  await write(root, 'agents/skills/example/SKILL.md', '# Example Skill\n');
  await write(root, 'agents/skills/example/input.schema.json', '{}\n');
  await write(root, 'agents/skills/example/output.schema.json', '{}\n');
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

  test('rejects a repository memory missing a required heading', async () => {
    const { validateRepository } = await loadValidator();
    const root = await createRepository();
    await write(root, 'agents/memories/repo.md', '# Repository Memory\n\n## Product\n');

    const result = await validateRepository(root);

    expect(result.errors).toContain(
      'agents/memories/repo.md is missing heading: ## Security Boundaries',
    );
  });

  test('rejects a session memory missing progress and blocker headings', async () => {
    const { validateRepository } = await loadValidator();
    const root = await createRepository();
    await write(root, 'agents/memories/session.md', '# Session Memory\n\n## Current Goal\n');

    const result = await validateRepository(root);

    expect(result.errors).toContain('agents/memories/session.md is missing heading: ## Completed');
    expect(result.errors).toContain('agents/memories/session.md is missing heading: ## Blockers');
  });

  test('requires local session memory to be ignored', async () => {
    const { validateRepository } = await loadValidator();
    const root = await createRepository();
    await write(root, '.gitignore', '.env\n.env.*\n!.env.example\n');

    const result = await validateRepository(root);

    expect(result.errors).toContain(
      'agents/memories/session.local.md must be listed in .gitignore',
    );
  });

  test('rejects a skill directory without all contract files', async () => {
    const { validateRepository } = await loadValidator();
    const root = await createRepository();
    await write(root, 'agents/skills/incomplete/SKILL.md', '# Incomplete\n');
    await write(root, 'agents/skills/incomplete/input.schema.json', '{}\n');

    const result = await validateRepository(root);

    expect(result.errors).toContain(
      'Skill incomplete is missing contract file: output.schema.json',
    );
  });
});
