# First Garden Scene Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline for the ordered daily scope approved in chat.

**Goal:** Implement Issue #8 as a lightweight, responsive garden preview with resilient static fallback.

**Architecture:** `/garden` composes the public garden widget. The widget keeps navigation and copy in server HTML and lazy-loads a client viewport. The viewport owns display mode and failure recovery; the canvas owns the renderer, lighting and fixed camera; primitive models stay private to the slice.

**Tech Stack:** Existing Next.js 16 / React 19 / strict TypeScript; R3F 9, Drei 10, Three.js; Playwright production browser tests.

**Spec:** `docs/superpowers/specs/2026-11-03-first-garden-scene-design.md` and approved product design; Issue #8.

## Global Constraints

- No external models, textures, fonts, authentication or service keys.
- Follow downward FSD imports and public slice API.
- Keep camera fixed, DPR <= 1.5, shadow map <= 1024, frameloop demand and static contact shadows.
- Avoid motion even without a reduced-motion preference.
- Preserve bootstrap checks and Node tests. Base this branch/PR on `codex/initialize-next-app` while PR #7 awaits review; never bypass protection.

## Review Focus

- Disabled WebGL must yield useful map content with working navigation.
- Context loss after a successful load must replace the canvas and dispose its resources.
- Narrow viewports must fit the full garden without horizontal page scrolling.
- Map/3D mode changes must preserve labels and not leave multiple contexts mounted.
- Server render must not import the heavy scene or depend on browser globals.

### Task 1: Garden scene and recovery

**Files:** `src/app/garden/page.tsx`, `src/widgets/garden-preview/index.ts`, `ui/{garden-preview,garden-viewport,garden-canvas,garden-island,garden-map,scene-error-boundary}.tsx`, `src/widgets/welcome/ui/welcome.tsx`, `tests/e2e/garden.spec.ts`, `package.json`, `pnpm-lock.yaml`, `playwright.config.ts`.

**Interfaces:** public `GardenPreview()`; private `GardenCanvas({ onUnavailable: () => void, onReady: () => void })`; `/garden`; static/3D switch and accessible place descriptions.

- [x] Write production browser tests for navigation, mode switch, WebGL failure, context loss and reduced-motion; observe the missing route failure.
- [x] Add compatible R3F/Drei/Three dependencies and implement route, static map, viewport and renderer boundary.
- [x] Build primitive garden, fixed responsive camera, lighting and limited shadow effects.
- [x] Run full check, all browser tests and visual QA on desktop/mobile. Fix any important findings from an independent review.
- [x] Commit application change.

### Task 2: References, workflow and handoff

**Files:** `docs/3d-implementation-notes.md`, `README.md`, `agents/memories/session.md`, this plan.

**Interfaces:** documented reference decisions and PR resolving Issue #8.

- [x] Record Fuble commit/paths and official R3F/Drei patterns reviewed, license decisions and remaining scope.
- [x] Document preview route and verify reproducible build.
- [ ] Commit and push; create a stacked PR with visual evidence and verify GitHub Actions.

## Execution Notes

- Using the existing dedicated checkout; no worktree mutation is needed.
- Fuble source is read for patterns only. No code/assets are copied from that project.

- Verification: full check and 8 production browser tests pass. The missing home→garden link failed first; normal WebGL tests also caught an unconditional fallback effect, corrected by treating fallback as inert DOM and errors through the boundary.
- Independent review: no Critical/Important findings. Desktop 1280px and mobile 390px visual QA passed; actual device GPU testing is still future work.
