# 기억의 정원

기억의 정원은 작은 3D 정원을 직접 걸어 다니며 하루의 글과 사진을 기록하고, 여러 날의 기억을 골라 블로그 글 초안으로 엮는 웹 서비스입니다.

현재는 제품 설계와 저장소 기반을 만드는 단계입니다. 아직 실행 가능한 애플리케이션은 포함되어 있지 않습니다.

## 제품 방향

- 캐릭터를 움직이며 일기장과 기억 오브젝트에 상호작용합니다.
- 기록한 날짜와 정원의 성장을 게임 UI 형태의 달력에서 확인합니다.
- 선택한 글과 이미지를 바탕으로 사실에 충실한 블로그 초안을 생성합니다.
- 기록을 쉬어도 정원이 시들거나 사용자를 벌하지 않습니다.

## 예정 기술 스택

- Next.js 16, React 19, TypeScript
- React Three Fiber, Drei, Three.js
- Supabase Auth, PostgreSQL, Storage
- OpenAI Responses API
- Vercel

## 개발 방식

이 저장소는 GitHub Flow와 Conventional Commits를 사용합니다. 모든 제품 변경은 Issue와 짧은 작업 브랜치, Pull Request, 자동 검사를 거쳐 `main`에 Squash Merge합니다.

- [제품 및 저장소 설계](docs/superpowers/specs/2026-11-02-memory-garden-design.md)
- [저장소 기반 구현 계획](docs/superpowers/plans/2026-11-02-repository-foundation.md)

세부 기여 방법과 로컬 실행 명령은 저장소 기반 작업이 완료되면서 추가됩니다.

