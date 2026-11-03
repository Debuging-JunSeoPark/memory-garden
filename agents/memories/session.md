# Session Memory

## Current Goal

저장소 기반을 바탕으로 첫 제품 작업인 Next.js 애플리케이션 초기화를 준비한다.

## Completed

- 제품 및 저장소 설계 승인
- 독립 Git 저장소와 공개 GitHub 저장소 생성
- 저장소 검증, Issue 및 PR 템플릿, 기본 CI 구성
- 에이전트 기억과 재사용 가능한 스킬 계약 구성
- 허용 목록 기반 훅 러너와 예제 훅 구성
- localhost 전용 서버 에이전트 스캐폴드 구성
- 전체 저장소 테스트 25개와 GitHub Actions 검증 통과
- 이전 작업 기록 기준 GitHub 병합 정책, `main` 보호 규칙, 첫 개발 Issue #5 구성 완료
- 사용자가 제공한 3D 참고 자료 6개와 우선순위를 `docs/3d-references.md`에 정리하고 README에 연결

## In Progress

- 제품 구현은 시작 전이며, 참고 자료의 코드 분석은 추후 진행

## Next

- Issue #5에 따라 Next.js 16 App Router, TypeScript strict, Tailwind v4, FSD 폴더와 lint/type-check/test/build 명령 초기화
- 기억 작성 및 달력 흐름의 첫 세로 슬라이스 구현
- 3D 구현 시 `docs/3d-references.md`의 순서대로 관련 예제 검토

## Blockers

- 없음

## Rulings

- 공개 저장소는 MIT 라이선스를 사용한다.
- 상위 팀 저장소와 의존성을 분리하기 위해 로컬 pnpm 워크스페이스 경계를 둔다.
