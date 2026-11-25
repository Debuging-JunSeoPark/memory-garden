# Monthly Garden Bookshelves Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 어느 월의 땅에서든 책장을 열어 해당 월을 먼저 읽고 다른 월·안내서도 열람한다.

**Architecture:** 기존 책장을 과거 땅에 재사용하고 월의 좌표로 충돌/접근을 판정한다. 여는 콜백이 월 키를 전달하고 viewport가 월별 진입 문맥과 페이지를 소유한다. 순서 계산은 순수 함수로 공유한다.

**Tech Stack:** Next.js16, React19, TypeScript, R3F, Vitest, Playwright.

**Spec:** docs/superpowers/specs/2026-11-25-monthly-bookshelves-design.md

## Global Constraints

- PR #39 병합 main에서 codex/ 브랜치와 Issue 연결 별도 PR로 진행한다.
- 안내서는 최상단 첫 칸, 실제 월 책만 표시, 다른 연도와 페이지 이동을 유지한다.
- 산책의 주변 땅 렌더링, 캐릭터 ref와 안정된 키보드 콜백을 유지한다.
- 저장 형식·개인 데이터·의존성 변경은 없다.

## Review Focus

- 멀리 있는 책장을 클릭해서 열거나 홈 책장만 충돌하는 문제가 없는가.
- 월 변경 시 콜백 재생성으로 누른 이동 키가 초기화되지 않는가.
- 기록 없는 월과 15권 이상·이전 연도에서 누락이나 중복이 없는가.
- 먼 월 선반·안내서·기록을 닫을 때 카메라·캐릭터·초점이 돌아오는가.
- 정적 지도 버튼에 MouseEvent가 월 키로 전달되지 않는가.

### Task 1: 월별 책장 접근과 해당 월 우선 열람

**Files:** garden-preview/ui/garden-walk.ts와 테스트, garden-player.tsx, garden-next-plot.tsx, garden-canvas.tsx, garden-viewport.tsx. garden-shelf.ts와 garden-shelf.test.ts를 추가한다. tests/e2e/garden.spec.ts와 개발일지·세션 문서를 갱신한다.

**Interfaces:** isNearShelf(position: GardenPosition, plot: GardenPosition)는 월 로컬 좌표로 접근 판정한다. prioritizeShelfMonths<T extends { month: string }>(records: T[], preferred: string | null): T[]는 입력을 변경하지 않고 우선 월만 앞으로 이동한다. onOpenShelf(month: string)은 안정된 콜백으로 현재 월을 전달한다. 지도에서는 별도 인자 없는 래퍼로 null 문맥을 연다.

- [x] 기준 단위 45개 통과를 확인한다.
- [x] 월별 책장 앞 접근/원격 거절과 장애물 통과 금지 검사를 작성해 기존 구현에서 실패를 확인한다. 우선 월·없는 월·빈 목록·15권 이상 순서 검사를 작성해 실패를 확인한다.
- [x] 전체 월에 책장 충돌과 접근을 적용하고 기존 15개 다리 왕복을 유지한다. player가 현재 월 키로 선반을 연다.
- [x] 과거 땅 모델에 책장을 재사용하고 가까운 현재 땅만 클릭 가능하게 한다. 원경은 해당 월 책만 표시한다.
- [x] viewport의 안정된 openShelf 콜백이 진입 월과 페이지0을 저장하고 순서를 계산한다. 해당 월 문맥/빈 상태를 표시하고 기존 확대·안내서·지도 경로를 유지한다.
- [x] 전체 단위 통과 후 8월 선반의 안내서와 8월/11월 기록 읽기, 빈 월·페이지와 귀환을 데스크톱/모바일 E2E로 검사한다.
- [x] pnpm check와 CI=1 pnpm test:e2e --retries=0 모두 통과해야 한다. 화면 캡처와 독립 리뷰를 확인한다.
- [x] 개발일지에 설계·대안·실패 원인·검증을 기록하고 커밋·푸시·Issue 연결 PR을 만든다.
