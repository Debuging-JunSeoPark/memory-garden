# Summarize Public Progress

## Purpose

공개된 세션 기억을 읽고 현재 목표, 완료 항목, 다음 작업을 구조화해 반환합니다.

## Input

`input.schema.json`을 만족하는 공개 Markdown 파일 경로를 받습니다.

## Output

`output.schema.json`을 만족하는 JSON 결과를 반환합니다. 파일을 수정하거나 네트워크에 접근하지 않습니다.

## Procedure

1. 경로가 저장소 내부의 Markdown 파일인지 확인합니다.
2. `Current Goal`, `Completed`, `Next` 섹션을 읽습니다.
3. 각 항목을 문자열 배열로 정규화합니다.
4. 누락된 필수 섹션이 있으면 `INVALID_MEMORY_FORMAT`으로 실패합니다.

## Failure States

- `OUTSIDE_REPOSITORY`: 입력 경로가 저장소 밖에 있음
- `UNSUPPORTED_FILE`: Markdown 파일이 아님
- `INVALID_MEMORY_FORMAT`: 필수 섹션이 없음

