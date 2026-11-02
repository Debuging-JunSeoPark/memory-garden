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

현재 저장소 기반 단계에서는 다음 명령을 실행합니다.

```bash
pnpm install
pnpm test
pnpm validate:repo
```

애플리케이션이 초기화되면 lint, type-check, build 검사가 추가됩니다.

## 공개 저장소 주의사항

환경 변수, 인증 토큰, 개인 일기, 사용자 이미지, 로컬 경로를 커밋하지 마세요. 에이전트 기억 파일에는 공개되어도 안전한 결정과 진행 상태만 기록합니다.

