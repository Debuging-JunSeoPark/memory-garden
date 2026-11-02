# Local Server Agent Scaffold

검토된 작업 유형만 localhost에서 위임받는 실험용 API 경계입니다. 외부 네트워크에 배포하거나 공개 포트에 바인딩하지 않습니다.

## 실행

`.env.example`을 참고해 충분히 긴 임시 토큰을 환경 변수에 설정한 뒤 실행합니다. 토큰은 파일에 저장하거나 커밋하지 않습니다.

```bash
SERVER_AGENT_TOKEN="local-development-token" pnpm agent:server
```

기본 주소는 `http://127.0.0.1:4310`입니다.

## API

```http
POST /v1/jobs
Authorization: Bearer <token>
Idempotency-Key: <unique-client-key>
Content-Type: application/json

{"type":"repository.validate","input":{}}
```

성공하면 `202`와 작업 ID를 반환합니다. `GET /v1/jobs/:jobId`도 같은 인증이 필요합니다.

## 경계

- 등록되지 않은 작업 유형은 거부합니다.
- 본문은 64 KiB로 제한합니다.
- 작업 시간은 최대 30초입니다.
- 감사 기록에는 작업 ID, 유형, 상태, 시각만 남깁니다.
- 기본 호스트는 localhost이고 원격 호스트 설정을 거부합니다.
- 현재 레지스트리와 감사 기록은 메모리에만 존재하며 재시작하면 사라집니다.

