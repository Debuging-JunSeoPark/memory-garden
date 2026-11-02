# Session Memory

## Current Goal

공개 저장소의 컨벤션과 안전한 에이전트 하네스 기반을 완성한다.

## Completed

- 제품 및 저장소 설계 승인
- 독립 Git 저장소와 공개 GitHub 저장소 생성
- 저장소 검증, Issue 및 PR 템플릿, 기본 CI 구성
- 에이전트 기억과 재사용 가능한 스킬 계약 구성
- 허용 목록 기반 훅 러너와 예제 훅 구성
- localhost 전용 서버 에이전트 스캐폴드 구성
- 전체 저장소 테스트 25개와 GitHub Actions 검증 통과

## In Progress

- GitHub 병합 정책, `main` 보호 규칙, 첫 개발 Issue 구성

## Next

- Next.js 16 App Router 애플리케이션 초기화
- 기억 작성 및 달력 흐름의 첫 세로 슬라이스 구현

## Blockers

- 없음

## Rulings

- 공개 저장소는 MIT 라이선스를 사용한다.
- 상위 팀 저장소와 의존성을 분리하기 위해 로컬 pnpm 워크스페이스 경계를 둔다.
