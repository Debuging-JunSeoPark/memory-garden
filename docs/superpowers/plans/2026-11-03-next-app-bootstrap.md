# Next.js Application Bootstrap Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this approved daily scope inline. Steps use checkbox syntax for tracking.

**Goal:** Resolve Issue #5 with an independently runnable Next.js application and reproducible quality checks.

**Architecture:** Add the application to the existing repository without replacing the Node agent harness. App Router composes a server-rendered welcome widget through its public API. Empty FSD layers are documented until real features need slices.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, Tailwind CSS v4, ESLint, Prettier, Vitest, Playwright, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-02-memory-garden-design.md`; GitHub Issue #5. User approved the ordered daily scope in chat on 2026-11-03.

## Global Constraints

- Preserve the existing 25 harness tests and commands.
- Use `src/app → widgets → features → entities → shared`, `@/*` aliases and slice public `index.ts` imports.
- Node must meet the toolchain minimum of 20.19.0; keep pnpm pinned at 12.1.0.
- No credentials or external services are needed to build or open the shell.
- Login, diary persistence, AI generation and 3D are separate follow-up work.

## Review Focus

- Fresh clone: install with frozen lockfile, type-check before first build, then run all quality checks.
- Root shell: Korean document language/title, semantic main heading and working in-page navigation.
- Narrow viewport: no horizontal overflow and usable text.
- Parent workspace: keep pnpm and Turbopack resolution inside this repository.
- Existing agents: full Node tests stay in the Node environment, separate from browser smoke tests.

### Task 1: Runnable application and shell

**Files:** `package.json`, `pnpm-lock.yaml`, `next.config.ts`, `tsconfig.json`, `next-env.d.ts`, `postcss.config.mjs`, `src/app/{layout.tsx,page.tsx,globals.css}`, `src/widgets/welcome/{index.ts,ui/welcome.tsx}`, layer README files, `playwright.config.ts`, `tests/e2e/home.spec.ts`.

**Interfaces:** `Welcome(): React.JSX.Element` through `@/widgets/welcome`; root route `/`; `pnpm dev`, `build`, `start`, `test:e2e`.

- [x] Add application and tooling dependencies without replacing harness dependencies.
- [x] Write browser smoke tests for route accessibility, in-page navigation, and mobile overflow; run before adding the route and observe failure.
- [x] Add strict TypeScript configuration, Tailwind, root boundary, and welcome widget with no inactive product buttons.
- [x] Run production build and browser smoke tests; preserve all 25 existing tests.
- [x] Commit the application foundation.

### Task 2: Quality workflow and handoff

**Files:** `eslint.config.mjs`, `.prettierignore`, `prettier.config.mjs`, `commitlint.config.mjs`, `.husky/*`, `vitest.config.ts`, `.github/workflows/repository.yml`, `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `agents/memories/session.md`.

**Interfaces:** `pnpm lint`, `type-check`, `format`, `format:check`, `test`, `test:e2e`, `build`, `check`; CI retains the existing required `Validate repository` job name.

- [x] Configure lint, formatting, commit hooks and test boundaries; keep format writes scoped to source.
- [x] Connect format check, lint, type-check, full unit suite, build and browser smoke to CI.
- [x] Document installation, environment requirements, FSD imports and follow-up scope.
- [x] Run `pnpm check`, production browser smoke, frozen-lockfile install and diff review.
- [x] Commit and create a PR referencing Issue #5; report review requirements without bypassing branch protection.

## Execution Notes

- Documentation references are separately committed in PR #6, awaiting review. This branch starts from `origin/main` to keep the bootstrap PR independent.
- Work stays on a dedicated `codex/initialize-next-app` branch in the existing checkout; no main mutations or worktree creation are needed.
- Configuration and static shell are verified with the real compiler/build/browser rather than tests that mirror configuration text.

- Review: no Critical/Important findings. Raised Node minimum to 20.19.0 for locked tooling.
- Verification: full check, 25 unit tests, 2 production browser smoke tests, FSD negative import and commitlint positive/negative checks passed.
- Handoff: PR #7 targets main; PR #6 contains the separate reference-document change. Both require an approving GitHub review. Fresh clone verification passed.
