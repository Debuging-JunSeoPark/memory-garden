# Memory Garden Agent Guidance

Read the approved product design and `agents/memories/session.md` before changing product behavior.

## Stack and commands

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4.
- `pnpm dev`: local application at http://127.0.0.1:3000.
- `pnpm check`: source formatting, lint, type-check, all unit tests, repository validation and production build.
- `pnpm test:e2e`: Chromium desktop/mobile smoke tests against a production build; run `pnpm build` first.
- `pnpm format`: write formatting only under `src/`.
- Existing Node agent tests remain in the Node Vitest environment. Browser tests live under `tests/e2e/`.

## FSD

- Layers depend downward: `src/app → widgets → features → entities → shared`.
- App Router files only compose and define routing/server boundaries.
- External slice imports use `@/<layer>/<slice>` and its public `index.ts`; internal slice imports are relative.
- Sibling slices do not import each other. ESLint checks alias imports for direction and deep slice imports; review relative imports for cross-slice violations.
- Do not introduce unused domain types, state stores or placeholder API methods.

## Workflow

- Use a dedicated `codex/` branch, Conventional Commits and a PR linked to the relevant Issue.
- Do not bypass required reviews or push directly to main.
- Pre-commit formats/lints staged source files; commit-msg runs commitlint. CI runs the full checks.
- Never put credentials, personal diary content or user images in committed memories.
- The bootstrap shell requires no environment variables. Add service configuration only when implementing that integration.
