import { execFile } from 'node:child_process';
import { access, readFile, readdir } from 'node:fs/promises';
import { basename, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const REQUIRED_FILES = [
  'CONTRIBUTING.md',
  'docs/conventions/git.md',
  '.github/ISSUE_TEMPLATE/feature.yml',
  '.github/ISSUE_TEMPLATE/bug.yml',
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/dependabot.yml',
  '.github/workflows/repository.yml',
];

const SECRET_MARKERS = [
  'OPENAI_API_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ACCESS_TOKEN',
  'GITHUB_TOKEN',
  'PRIVATE_KEY',
];

const MEMORY_HEADINGS = {
  'agents/memories/repo.md': [
    '## Product',
    '## Preferences',
    '## Architecture Decisions',
    '## Repository Rules',
    '## Security Boundaries',
  ],
  'agents/memories/session.md': [
    '## Current Goal',
    '## Completed',
    '## In Progress',
    '## Next',
    '## Blockers',
    '## Rulings',
  ],
};

const SKILL_CONTRACT_FILES = ['SKILL.md', 'input.schema.json', 'output.schema.json'];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function trackedFiles(root) {
  const { stdout } = await execFileAsync('git', ['ls-files', '-z'], {
    cwd: root,
    encoding: 'utf8',
  });
  return stdout.split('\0').filter(Boolean);
}

function isForbiddenEnvironmentFile(path) {
  const name = basename(path);
  return name.startsWith('.env') && name !== '.env.example';
}

export async function validateRepository(root) {
  const repositoryRoot = resolve(root);
  const errors = [];

  for (const file of REQUIRED_FILES) {
    if (!(await exists(join(repositoryRoot, file)))) {
      errors.push(`Missing required file: ${file}`);
    }
  }

  try {
    const packageJson = JSON.parse(await readFile(join(repositoryRoot, 'package.json'), 'utf8'));
    if (!/^pnpm@\d+\.\d+\.\d+$/.test(packageJson.packageManager ?? '')) {
      errors.push('package.json must pin pnpm with packageManager');
    }
  } catch {
    errors.push('package.json must be valid JSON');
  }

  for (const [file, headings] of Object.entries(MEMORY_HEADINGS)) {
    try {
      const content = await readFile(join(repositoryRoot, file), 'utf8');
      for (const heading of headings) {
        if (!content.split('\n').includes(heading)) {
          errors.push(`${file} is missing heading: ${heading}`);
        }
      }
    } catch {
      errors.push(`Missing required file: ${file}`);
    }
  }

  try {
    const gitignore = await readFile(join(repositoryRoot, '.gitignore'), 'utf8');
    if (!gitignore.split('\n').includes('agents/memories/session.local.md')) {
      errors.push('agents/memories/session.local.md must be listed in .gitignore');
    }
  } catch {
    errors.push('Missing required file: .gitignore');
  }

  try {
    const skillsRoot = join(repositoryRoot, 'agents/skills');
    const skillEntries = await readdir(skillsRoot, { withFileTypes: true });
    for (const entry of skillEntries.filter((item) => item.isDirectory())) {
      for (const contractFile of SKILL_CONTRACT_FILES) {
        if (!(await exists(join(skillsRoot, entry.name, contractFile)))) {
          errors.push(`Skill ${entry.name} is missing contract file: ${contractFile}`);
        }
      }
    }
  } catch {
    errors.push('Missing required directory: agents/skills');
  }

  let tracked = [];
  try {
    tracked = await trackedFiles(repositoryRoot);
  } catch {
    errors.push('Repository validation requires a Git worktree');
  }

  for (const file of tracked) {
    if (isForbiddenEnvironmentFile(file)) {
      errors.push(`Tracked environment file is forbidden: ${file}`);
    }
  }

  const memoryPrefix = ['agents', 'memories'].join(sep) + sep;
  for (const file of tracked) {
    const normalized = relative(repositoryRoot, join(repositoryRoot, file));
    if (!normalized.startsWith(memoryPrefix) || !normalized.endsWith('.md')) continue;
    const content = await readFile(join(repositoryRoot, file), 'utf8');
    for (const marker of SECRET_MARKERS) {
      if (content.includes(marker)) {
        errors.push(`Potential secret marker found in ${file}: ${marker}`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

async function main() {
  const result = await validateRepository(process.cwd());
  if (result.ok) {
    console.log('Repository validation passed.');
    return;
  }
  for (const error of result.errors) console.error(`- ${error}`);
  process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
