# Neighbor Garden Paths Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 열린 상하좌우 월 정원을 바로 오가는 산책길을 제공한다.

**Architecture:** gardenBridges가 인접 그래프를 만들고 기존 렌더·보행·난간이 공유한다. 공용 배치 값으로 모델과 충돌을 맞추고 연결 방향의 디딤돌을 표시한다.

**Tech Stack:** Next.js 16, React 19, TypeScript, R3F, Vitest, Playwright.

**Spec:** docs/superpowers/specs/2026-11-24-neighbor-paths-design.md

## Global Constraints

- 3열 배치, 현재 월까지의 땅, 월별 기록을 유지한다.
- 대각선·미래 월 연결과 각 땅의 책장은 이번 범위 밖이다.
- 기존 지면·난간 규격을 유지하고 모델/충돌 배치 값을 공유한다.
- codex/ 브랜치, Issue 연결 PR, pnpm check와 전체 E2E를 사용한다.

## Review Focus

- 1월과 불완전한 마지막 줄에서 없는 땅으로 나가는 길이 없는가.
- 새 세로 연결이 책장·나무·화단에 막히지 않는가.
- 같은 출발점의 여러 다리에 React key 충돌이 없는가.
- 책장 이동 후 접근·카메라 확대·귀환을 유지하는가.
- 키보드·모바일 입력을 캡처 전에 정리하고 UI 오류를 수집하는가.

### Task 1: 여러 갈래 산책길과 입구 배치

**Files:** garden-preview/ui의 garden-plots.ts, garden-walk.ts와 테스트, garden-island.tsx, garden-next-plot.tsx, garden-canvas.tsx, garden-scene-view.ts 및 테스트. 공용 배치 garden-layout.ts와 출구 디딤돌 garden-paths.tsx를 만든다. tests/e2e/garden.spec.ts, 개발일지·session memory를 갱신한다.

**Interfaces:** gardenBridges(plots: GardenPlot[]): GardenLink[]는 from/to/vertical/x/z 계약을 유지한다. garden-layout.ts는 모델·충돌이 공유하는 위치/크기를 제공한다. GardenPaths({plot, links})는 실제 이웃 방향의 낮은 디딤돌만 그린다.

- [x] 기존 단위 37개를 실행해 기준 상태를 확인한다.
- [x] 연결 수 0·1·2·3·15·17, 11월 새 연결 [1,4]·[2,3]·[3,8]·[4,7]·[7,10], 대각선·비인접 배제 검사를 작성하고 기존 구현에서 실패를 확인한다.
- [x] 15개 다리 전체 왕복과 양쪽 입구 난간 검사로 확장하고 새 세로 진입이 기존 책장에 막히는 실패를 확인한다.
- [x] 인덱스 쌍을 한 번씩 순회해 맨해튼 거리 8인 땅만 연결한다. key는 from-to 쌍이다.
- [x] 공용 배치로 책장·나무·화단·벤치를 이동하고 카메라의 책장 상대 위치를 유지한다. 연결 방향 디딤돌을 홈·과거 땅 모두에 그린다.
- [x] 단위 전체 통과를 확인한다. 책장 접근 E2E 입력을 새 위치에 맞추고 11월↔8월 지름길의 실제 키보드·터치 왕복을 추가한다.
- [x] pnpm check와 CI=1 pnpm test:e2e --retries=0 실행: 전부 통과해야 한다. 화면 캡처를 확인한다.
- [x] 개발일지에 문제·대안·선택·충돌·검증을 기록하고 세션 상태를 갱신한다. 독립 코드 리뷰 후 Conventional Commit, Issue 연결 PR을 생성한다.
