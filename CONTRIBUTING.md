# 기여 가이드

기억의 정원은 작은 Issue와 Pull Request를 반복하며 개발합니다. 구현 전에 관련 설계 문서와 [Git 컨벤션](docs/conventions/git.md)을 확인해 주세요.

## 작업 흐름

1. 하나의 사용자 결과를 설명하는 Issue를 만듭니다.
2. 최신 `main`에서 유형별 브랜치를 만듭니다.
3. Conventional Commits 형식으로 작고 설명 가능한 커밋을 남깁니다.
4. 로컬 검사를 모두 통과시킨 뒤 Pull Request를 엽니다.
5. PR 본문에 `Closes #이슈번호`와 검증 결과를 적습니다.
6. 리뷰와 필수 검사를 통과하면 Squash Merge합니다.

## 브랜치

- `feat/<topic>`: 사용자 기능
- `fix/<topic>`: 버그 수정
- `refactor/<topic>`: 동작을 바꾸지 않는 구조 개선
- `docs/<topic>`: 문서
- `chore/<topic>`: 도구와 저장소 관리

`main`에는 직접 푸시하지 않습니다. 브랜치 이름은 소문자 영문과 하이픈을 사용합니다.

## 로컬 검사

PR을 만들기 전에 다음 명령을 실행합니다.

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

`pnpm check`는 소스 포맷, lint, type-check, 전체 단위 테스트, 저장소 검증, build를 실행합니다. 브라우저 검사는 빌드 후 별도로 실행합니다. 개별 명령도 사용할 수 있습니다.

pre-commit은 lint-staged로 변경된 소스만 포맷·린트하고, commit-msg는 commitlint를 실행합니다. 전체 검사는 CI에서 다시 실행합니다.

## 공개 저장소 주의사항

환경 변수, 인증 토큰, 개인 일기, 사용자 이미지, 로컬 경로를 커밋하지 마세요. 에이전트 기억 파일에는 공개되어도 안전한 결정과 진행 상태만 기록합니다.

