# 기억의 정원

기억의 정원은 작은 3D 정원을 직접 걸어 다니며 하루의 글과 사진을 기록하고, 여러 날의 기억을 골라 블로그 글 초안으로 엮는 웹 서비스입니다.

현재는 서비스 소개 화면과 첫 3D 정원 미리보기를 실행할 수 있습니다. 로그인, 기록 저장, 캐릭터 이동과 AI 초안 생성은 후속 작업입니다.

## 제품 방향

- 캐릭터를 움직이며 일기장과 기억 오브젝트에 상호작용합니다.
- 기록한 날짜와 정원의 성장을 게임 UI 형태의 달력에서 확인합니다.
- 선택한 글과 이미지를 바탕으로 사실에 충실한 블로그 초안을 생성합니다.
- 기록을 쉬어도 정원이 시들거나 사용자를 벌하지 않습니다.

## 기술 스택

- Next.js 16, React 19, TypeScript
- React Three Fiber, Drei, Three.js
- Supabase Auth, PostgreSQL, Storage
- OpenAI Responses API
- Vercel

## 개발 방식

이 저장소는 GitHub Flow와 Conventional Commits를 사용합니다. 모든 제품 변경은 Issue와 짧은 작업 브랜치, Pull Request, 자동 검사를 거쳐 `main`에 Squash Merge합니다.

- [제품 및 저장소 설계](docs/superpowers/specs/2026-11-02-memory-garden-design.md)
- [저장소 기반 구현 계획](docs/superpowers/plans/2026-11-02-repository-foundation.md)
- [첫 3D 정원 구현 및 참고 기록](docs/3d-implementation-notes.md)

## 로컬 실행

Node.js 20.19 이상과 `packageManager`에 고정된 pnpm 12.1.0을 사용합니다. `.nvmrc`는 Node 20 계열을 선택합니다.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

[로컬 앱](http://127.0.0.1:3000)을 엽니다. 상위 저장소와 의존성이 섞이지 않도록 이 저장소의 `pnpm-workspace.yaml`과 Turbopack 루트를 유지합니다.

소개 화면의 **정원 둘러보기** 또는 [정원 미리보기](http://127.0.0.1:3000/garden)에서 첫 정원을 볼 수 있습니다. 정적 지도 전환을 제공하며 WebGL 초기화 실패·실행 중 context loss에도 정적 지도로 전환합니다. 이번 장면은 고정된 미리보기이며 캐릭터 이동이나 기록 기능은 포함하지 않습니다.

### 환경 변수

현재 소개 화면과 빌드에는 환경 변수가 필요하지 않습니다. Supabase와 AI 통합 시 `.env.example`에 필요한 이름과 설명을 추가할 예정입니다. 별도 로컬 서버 에이전트 설정은 [서버 에이전트 문서](agents/server-agent/README.md)를 참고하세요.

### 검사와 프로덕션 실행

```bash
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
pnpm start
```

- `pnpm check`: 소스 포맷, ESLint, 타입 생성·검사, 전체 단위 테스트, 저장소 검증, 프로덕션 빌드
- `pnpm test:e2e`: 빌드된 앱을 별도 포트 3100에서 실행해 데스크톱·모바일 Chromium에서 홈 이동, 정원·지도 전환, WebGL 불가 및 context loss 검사. 테스트 브라우저에만 소프트웨어 렌더러를 지정하므로 CI에 실제 GPU가 필요하지 않습니다.
- `pnpm format`: `src/` 내부 파일만 포맷
- `pnpm start`: 기본 포트 3000에서 프로덕션 앱 실행 (`pnpm build` 선행)

GitHub Actions에서도 같은 검사를 수행합니다. 커밋 전에는 변경한 소스의 포맷·린트를 검사하고 커밋 메시지에 Conventional Commits를 적용합니다.

## 소스 구조

`src/app`은 라우팅과 조합을 담당하며 `widgets → features → entities → shared` 순서로만 의존합니다. 외부 슬라이스는 공개 `index.ts`로 가져옵니다. 예: `import { Welcome } from '@/widgets/welcome'`.

아직 사용하지 않는 계층에는 설명 문서만 두며, 상태 관리와 API는 실제 기능을 구현할 때 추가합니다. 현재 소개 화면은 서버 컴포넌트로 렌더링하며 외부 폰트나 서비스 호출 없이 빌드됩니다.

