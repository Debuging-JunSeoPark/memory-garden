# Git 및 Pull Request 컨벤션

## 커밋 메시지

형식은 `<type>: <English imperative summary>`입니다.

허용 유형은 `build`, `chore`, `content`, `docs`, `feat`, `fix`, `refactor`, `style`, `test`, `deploy`입니다.

```text
feat: add calendar date selection
fix: keep garden progress after diary deletion
docs: explain agent memory boundaries
```

제목은 한 가지 변경만 설명하고 마침표를 붙이지 않습니다. 동작 변경과 대규모 정리는 같은 커밋에 섞지 않습니다.

## Issue

Issue 하나는 리뷰 가능한 결과 하나를 다룹니다. 해결 조건을 체크박스로 작성하고, 사용자에게 보이는 변화와 범위 밖 항목을 구분합니다.

## Pull Request

- 제목은 Squash Merge 후 남을 Conventional Commit 형태로 작성합니다.
- 본문에 문제, 최종 동작, 검증 방법, 화면 변화, 위험을 기록합니다.
- 관련 Issue는 `Closes #123` 형식으로 연결합니다.
- 자동 생성 파일이나 잠금 파일 변경 이유를 설명합니다.
- 리뷰가 쉬운 크기를 유지하고 관련 없는 정리를 분리합니다.

## 병합

필수 검사가 성공하고 리뷰 대화가 해결된 PR만 Squash Merge합니다. 병합 후 작업 브랜치는 삭제합니다.

