# Agent Skills

각 하위 디렉터리는 재사용 가능한 작업 하나를 정의합니다.

필수 파일:

- `SKILL.md`: 목적, 허용 범위, 절차, 실패 상태
- `input.schema.json`: JSON Schema로 정의한 입력
- `output.schema.json`: JSON Schema로 정의한 결과

스킬은 네트워크 접근이나 파일 쓰기 권한을 암묵적으로 가정하면 안 됩니다. 필요한 읽기·쓰기 범위와 외부 부작용을 `SKILL.md`에 명시하고, 실패 시 부분 성공을 성공으로 보고하지 않습니다.

