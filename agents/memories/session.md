# Session Memory

## Current Goal

완성된 첫 3D 정원 미리보기 PR #9를 검토하고 다음 제품 작업 범위를 정한다.

## Completed

- 제품 및 저장소 설계 승인
- 독립 Git 저장소와 공개 GitHub 저장소 생성
- 저장소 검증, Issue 및 PR 템플릿, 기본 CI 구성
- 에이전트 기억과 재사용 가능한 스킬 계약 구성
- 허용 목록 기반 훅 러너와 예제 훅 구성
- localhost 전용 서버 에이전트 스캐폴드 구성
- 전체 저장소 테스트 25개와 GitHub Actions 검증 통과
- 참고 자료 문서 변경을 PR #6으로 제출했으며 승인 리뷰 대기 중
- Next.js 16, React 19, TypeScript strict, Tailwind v4 및 FSD 구조 구성
- 서비스 소개 화면, 데스크톱·모바일 브라우저 스모크 검사 2개 통과
- 소스 포맷, lint, type-check, 기존 테스트 25개, 저장소 검증, 프로덕션 빌드 통과
- lint-staged 및 commitlint 훅 구성, FSD alias import 위반 차단 확인
- 독립 코드 리뷰 완료: 중요한 발견 사항 없음
- 별도 새 clone에서 frozen-lockfile 설치, 타입 생성·검사, 전체 검사와 브라우저 스모크 통과
- 개발 서버 응답 확인, 생성 파일은 Git에서 제외하고 개발 중 지침 자동 변경 방지
- /garden의 첫 3D 정원, 고정 직교 카메라·조명·그림자, 정적 지도 전환 구현
- WebGL 초기화 불가 및 실제 context loss를 포함한 브라우저 테스트 8개 통과
- 전체 품질 검사와 기존 단위 테스트 25개 통과, 데스크톱·모바일 화면 검수
- 3D 변경 독립 리뷰 완료: Critical/Important 발견 사항 없음
- Fuble·R3F·Drei 참고 결정과 출처를 docs/3d-implementation-notes.md에 기록
- 새 clone에서 고정 lockfile 설치·전체 검사·브라우저 테스트 통과
- PR #9의 GitHub Actions는 28c2e6f 커밋에서 전체 검사 통과

## In Progress

- 앱 초기화 PR #7 승인 리뷰 대기 중. 최종 8b4a307 커밋의 GitHub Actions 통과
- 첫 3D 정원 PR #9는 PR #7 브랜치를 기반으로 제출했으며 검토 대기 중

## Next

- PR #7 병합 후 PR #9를 main 기준으로 정리하고 검토
- 캐릭터 이동·보행 경계와 기억 오브젝트 상호작용을 별도 범위로 설계
- 기억 작성 및 달력 흐름의 첫 세로 슬라이스 구현

## Blockers

- PR 병합에는 저장소 보호 규칙에 따른 승인 리뷰 1명이 필요하다.

## Rulings

- 공개 저장소는 MIT 라이선스를 사용한다.
- 상위 팀 저장소와 의존성을 분리하기 위해 로컬 pnpm 워크스페이스 경계를 둔다.
