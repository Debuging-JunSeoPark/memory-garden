# Session Memory

## Current Goal

Issue #5의 앱 초기화 PR과 CI 결과를 확인하고 첫 3D 장면 작업으로 이어간다.

## Completed

- 제품 및 저장소 설계 승인
- 독립 Git 저장소와 공개 GitHub 저장소 생성
- 저장소 검증, Issue 및 PR 템플릿, 기본 CI 구성
- 에이전트 기억과 재사용 가능한 스킬 계약 구성
- 허용 목록 기반 훅 러너와 예제 훅 구성
- localhost 전용 서버 에이전트 스캐폴드 구성
- 전체 저장소 테스트 25개와 GitHub Actions 검증 통과
- 참고 자료 문서 PR #6을 main에 병합하고 docs/3d-references.md와 README 연결 반영
- Next.js 16, React 19, TypeScript strict, Tailwind v4 및 FSD 구조 구성
- 서비스 소개 화면, 데스크톱·모바일 브라우저 스모크 검사 2개 통과
- 소스 포맷, lint, type-check, 기존 테스트 25개, 저장소 검증, 프로덕션 빌드 통과
- lint-staged 및 commitlint 훅 구성, FSD alias import 위반 차단 확인
- 독립 코드 리뷰 완료: 중요한 발견 사항 없음
- 별도 새 clone에서 frozen-lockfile 설치, 타입 생성·검사, 전체 검사와 브라우저 스모크 통과
- 개발 서버 응답 확인, 생성 파일은 Git에서 제외하고 개발 중 지침 자동 변경 방지

## In Progress

- 앱 초기화 PR #7에 main의 참고 문서를 반영하고 최종 검사 후 병합

## Next

- PR #7 병합 후 첫 3D 정원 PR #9의 base를 main으로 정리하고 병합
- 기억 작성 및 달력 흐름의 첫 세로 슬라이스 구현

## Blockers

- 없음

## Rulings

- 공개 저장소는 MIT 라이선스를 사용한다.
- 상위 팀 저장소와 의존성을 분리하기 위해 로컬 pnpm 워크스페이스 경계를 둔다.
- 사용자 승인에 따라 1인 프로젝트에서는 필수 승인 리뷰를 요구하지 않는다. PR, 필수 CI, 대화 해결, 선형 이력, 강제 푸시 및 main 삭제 차단은 유지한다.
