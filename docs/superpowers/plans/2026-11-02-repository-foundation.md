# Repository Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the public `memory-garden` GitHub repository with enforceable contribution conventions and a safe, documented agent harness scaffold.

**Architecture:** The empty `sub project` directory becomes an independent Git repository, separate from its parent repository. Repository policy is represented as committed Markdown, GitHub templates, and CI configuration; the agent harness is a small Node.js boundary with explicit schemas and an allowlisted hook runner, while the server agent remains a localhost-only scaffold.

**Tech Stack:** Git, GitHub Actions, pnpm, Node.js 20, JavaScript/JSON/Markdown, Vitest for harness behavior

**Spec:** `docs/superpowers/specs/2026-11-02-memory-garden-design.md`

## Global Constraints

- Repository visibility is public and the repository name is `memory-garden`.
- Default branch is `main`; feature work uses short-lived typed branches and PRs.
- Conventional Commits and Squash Merge are the default history policy.
- No secret, token, personal diary content, or private environment data may be committed to agent memories.
- The hook runner executes only allowlisted executable/argument combinations and never evaluates shell strings.
- The server agent binds to localhost by default and is not deployed in this plan.
- Follow the project FSD rules when application code is added in a later plan.

## Review Focus

- Running an unknown hook name must fail without spawning a process.
- Supplying extra or shell-like arguments must fail before execution.
- Missing or malformed allowlist files must fail closed with a useful error.
- Oversized or unauthenticated delegation requests must be rejected by the server scaffold.
- A clean clone must pass repository validation without local secrets or generated files.

---

### Task 1: Independent Repository and Public GitHub Remote

**Files:**
- Create: `.gitignore`
- Create: `.editorconfig`
- Create: `.nvmrc`
- Create: `README.md`
- Modify: `docs/superpowers/specs/2026-11-02-memory-garden-design.md`
- Create: `docs/superpowers/plans/2026-11-02-repository-foundation.md`

**Interfaces:**
- Consumes: the approved product and repository design
- Produces: independent `main` history and public `origin` remote for later tasks

- [ ] **Step 1: Initialize this directory as an independent Git repository on `main`**

Run: `git init -b main`
Expected: `git rev-parse --show-toplevel` resolves to the `sub project` directory, not its parent.

- [ ] **Step 2: Add repository metadata and ignore rules**

Create `.gitignore` entries for dependencies, Next.js output, coverage, environment files except `.env.example`, generated agent logs, local session memory, and `.superpowers/`. Set Node `20` in `.nvmrc` and consistent UTF-8/LF defaults in `.editorconfig`.

- [ ] **Step 3: Write the initial README**

Describe the game-like diary product, current planning status, chosen stack, repository workflow, and links to the design and contribution documentation without claiming unimplemented features work.

- [ ] **Step 4: Commit the approved design and repository metadata**

Run: `git add .gitignore .editorconfig .nvmrc README.md docs/superpowers && git commit -m "docs: establish project foundation"`
Expected: one root commit on `main` containing only planning and repository metadata.

- [ ] **Step 5: Create and push the public GitHub repository**

Create `memory-garden` under the authenticated GitHub account without generated README/license files, set `origin`, and push `main`.
Expected: the GitHub repository is public and its default branch shows the root commit.

### Task 2: Contribution and GitHub Workflow

**Files:**
- Create: `CONTRIBUTING.md`
- Create: `docs/conventions/git.md`
- Create: `.github/ISSUE_TEMPLATE/feature.yml`
- Create: `.github/ISSUE_TEMPLATE/bug.yml`
- Create: `.github/ISSUE_TEMPLATE/config.yml`
- Create: `.github/PULL_REQUEST_TEMPLATE.md`
- Create: `.github/dependabot.yml`
- Create: `.github/workflows/repository.yml`
- Create: `scripts/validate-repository.mjs`
- Create: `tests/repository/validate-repository.test.mjs`
- Create: `package.json`
- Create: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: independent Git repository from Task 1
- Produces: `pnpm validate:repo` and GitHub templates used by every later PR

- [ ] **Step 1: Write failing repository validation tests**

Test that required templates and docs exist, the package manager is pinned, forbidden tracked environment names are rejected, and memory files contain no common secret key markers.

- [ ] **Step 2: Run the repository tests and confirm failure**

Run: `pnpm test:repo`
Expected: FAIL because the validator and required policy files do not yet exist.

- [ ] **Step 3: Implement the repository validator and policy files**

Expose `validateRepository(root: string): Promise<ValidationResult>` from `scripts/validate-repository.mjs`, where `ValidationResult` is `{ ok: boolean; errors: string[] }`. Add feature/bug Issue forms, the PR checklist, branch/commit examples, Dependabot weekly updates, and a GitHub Actions job running `pnpm test:repo` and `pnpm validate:repo`.

- [ ] **Step 4: Run repository validation**

Run: `pnpm test:repo && pnpm validate:repo`
Expected: both commands exit 0.

- [ ] **Step 5: Commit contribution workflow**

Run: `git add package.json pnpm-lock.yaml CONTRIBUTING.md docs/conventions .github scripts tests && git commit -m "chore: add contribution workflow"`
Expected: the second commit contains only workflow, validation, and contribution files.

### Task 3: Agent Memories and Skill Contract

**Files:**
- Create: `agents/README.md`
- Create: `agents/memories/repo.md`
- Create: `agents/memories/session.md`
- Create: `agents/memories/session.local.example.md`
- Create: `agents/skills/README.md`
- Create: `agents/skills/example/SKILL.md`
- Create: `agents/skills/example/input.schema.json`
- Create: `agents/skills/example/output.schema.json`
- Create: `docs/harness.md`
- Create: `docs/harness-usage.md`
- Modify: `.gitignore`
- Modify: `scripts/validate-repository.mjs`
- Modify: `tests/repository/validate-repository.test.mjs`

**Interfaces:**
- Consumes: repository validator from Task 2
- Produces: versioned public memory format and reusable skill folder contract

- [ ] **Step 1: Add failing validation cases for memory and skill contracts**

Assert that public memory files have their required headings, `session.local.md` is ignored, and every skill directory contains `SKILL.md`, `input.schema.json`, and `output.schema.json`.

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `pnpm test:repo`
Expected: FAIL for missing memory headings and example skill contracts.

- [ ] **Step 3: Implement memory templates, example skill, and harness documentation**

Define stable headings for decisions/preferences and current goal/progress/blockers. Document that secrets, personal data, diary content, and machine-specific paths are forbidden. Define the skill contract as JSON input, deterministic artifact/result output, documented failure states, and no implicit network or write scope.

- [ ] **Step 4: Run validation and tests**

Run: `pnpm test:repo && pnpm validate:repo`
Expected: both commands exit 0.

- [ ] **Step 5: Commit agent memory and skill contract**

Run: `git add .gitignore agents docs/harness.md docs/harness-usage.md scripts tests && git commit -m "feat: add agent memory and skill contracts"`
Expected: the commit excludes `agents/memories/session.local.md`.

### Task 4: Allowlisted Hook Runner

**Files:**
- Create: `agents/hooks/allowlist.json`
- Create: `agents/hooks/runner.js`
- Create: `agents/hooks/examples/check-memory.js`
- Create: `agents/hooks/README.md`
- Create: `agents/hooks/runner.test.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: hook name and JSON-safe argument array from CLI
- Produces: `runHook(name: string, args: string[]): Promise<{ code: number }>` and `pnpm agent:hook -- <name>`

- [ ] **Step 1: Write failing hook runner tests**

Cover an allowed hook, unknown name, extra arguments, shell metacharacters, malformed allowlist, timeout, and non-zero child exit.

- [ ] **Step 2: Run the hook tests and confirm failure**

Run: `pnpm vitest run agents/hooks/runner.test.js`
Expected: FAIL because `runner.js` does not exist.

- [ ] **Step 3: Implement the fail-closed runner**

Export `loadAllowlist(path: string): Promise<HookAllowlist>` and `runHook(name: string, args: string[]): Promise<{ code: number }>`; use `spawn` with `shell: false`, exact executable paths, explicit argument schemas, a 30-second timeout, and inherited stdout/stderr. Never concatenate a command string.

- [ ] **Step 4: Run hook and repository tests**

Run: `pnpm vitest run agents/hooks/runner.test.js && pnpm test:repo && pnpm validate:repo`
Expected: all commands exit 0.

- [ ] **Step 5: Commit the hook runner**

Run: `git add agents/hooks package.json pnpm-lock.yaml && git commit -m "feat: add allowlisted agent hooks"`
Expected: the runner and its allowlist are reviewable in one commit.

### Task 5: Local Server Agent Scaffold

**Files:**
- Create: `agents/server-agent/src/config.js`
- Create: `agents/server-agent/src/job-registry.js`
- Create: `agents/server-agent/src/server.js`
- Create: `agents/server-agent/src/index.js`
- Create: `agents/server-agent/server.test.js`
- Create: `agents/server-agent/README.md`
- Create: `agents/server-agent/.env.example`
- Modify: `package.json`
- Modify: `docs/harness.md`
- Modify: `docs/harness-usage.md`

**Interfaces:**
- Consumes: `POST /v1/jobs` with bearer token and `{ type: AllowedJobType, input: unknown }`
- Produces: `202 { jobId: string, status: "queued" }`, `GET /v1/jobs/:jobId`, and in-memory job/audit interfaces for later replacement

- [ ] **Step 1: Write failing server boundary tests**

Cover localhost as the default host, missing/wrong bearer token, unknown job type, malformed JSON, body larger than 64 KiB, duplicate idempotency key, job timeout, and accepted request audit metadata without secret/input payload logging.

- [ ] **Step 2: Run the server tests and confirm failure**

Run: `pnpm vitest run agents/server-agent/server.test.js`
Expected: FAIL because the server boundary does not exist.

- [ ] **Step 3: Implement the localhost-only scaffold**

Export `createServer(config: ServerAgentConfig): NodeServer`, `createJobRegistry(options): JobRegistry`, and `loadConfig(env): ServerAgentConfig`. Default host to `127.0.0.1`, require an explicit bearer token, limit request bodies to 64 KiB, enforce allowed job types, apply a 30-second task timeout, support idempotency keys, and log only job ID/type/status/timestamps.

- [ ] **Step 4: Run all repository tests**

Run: `pnpm test && pnpm validate:repo`
Expected: all tests pass and validation exits 0.

- [ ] **Step 5: Commit the server scaffold**

Run: `git add agents/server-agent package.json pnpm-lock.yaml docs/harness.md docs/harness-usage.md && git commit -m "feat: scaffold local server agent"`
Expected: no real credentials, deployment config, or remote bind settings are committed.

### Task 6: GitHub Settings and First Issue

**Files:**
- No repository file changes expected

**Interfaces:**
- Consumes: pushed public repository and passing repository workflow
- Produces: protected `main`, Squash Merge defaults, and the first product bootstrap Issue

- [ ] **Step 1: Configure repository merge settings**

Enable Squash Merge and automatic branch deletion; disable merge commits and rebase merges.

- [ ] **Step 2: Configure `main` protection when the GitHub account supports it**

Require a PR, one approval where supported, conversation resolution, and the repository validation status check. If the account/repository tier does not allow a rule, record the exact limitation in `agents/memories/session.md` rather than claiming it is active.

- [ ] **Step 3: Create the first product Issue**

Create `build: initialize Next.js application` with acceptance criteria for Next.js 16, TypeScript strict, Tailwind v4, pnpm, FSD root folders, lint, type-check, test, and build commands.

- [ ] **Step 4: Verify the public repository**

Check visibility, default branch, commits, workflow status, Issue templates, PR template, merge settings, and first Issue from the GitHub UI.
Expected: every supported setting is visibly active and any unsupported protection is documented.

