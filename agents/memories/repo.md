# Repository Memory

## Product

- 서비스 이름은 `기억의 정원`이다.
- 사용자는 작은 3D 정원을 걸어 다니며 글과 사진으로 하루를 기록한다.
- 달력에서 여러 날짜를 선택해 기록과 이미지를 블로그 글 초안으로 엮는다.
- 게임 경험이 홈이고 달력은 게임 안에서 여는 보조 UI다.

## Preferences

- 정원은 생성형 배경 이미지가 아니라 코드와 3D 에셋으로 구성한다.
- 포근하고 손으로 만든 듯한 로우 폴리 질감을 사용한다.
- 기록을 쉬었다는 이유로 정원을 시들게 하거나 사용자를 벌하지 않는다.
- 구현은 작은 Issue와 Pull Request로 나눈다.

## Architecture Decisions

- Next.js App Router와 Feature-Sliced Design을 사용한다.
- Supabase가 Google 로그인, PostgreSQL, 비공개 이미지 저장소를 담당한다.
- React Three Fiber와 Drei가 3D 장면을 담당한다.
- OpenAI API 호출과 데이터 변경은 서버 경계에서만 수행한다.

## Repository Rules

- 기본 브랜치는 `main`이고 GitHub Flow와 Squash Merge를 사용한다.
- Conventional Commits 형식을 따른다.
- 외부 import는 각 FSD 슬라이스의 공개 `index.ts`를 사용한다.
- CI를 통과하지 않은 변경은 병합하지 않는다.

## Security Boundaries

- 비밀값, 인증 토큰, 개인 일기, 사용자 이미지, 개인정보를 기억 파일에 저장하지 않는다.
- 실제 환경 변수는 커밋하지 않고 `.env.example`에는 이름과 설명만 둔다.
- 훅은 허용 목록의 고정 실행 파일과 인자만 실행한다.
- 서버 에이전트는 기본적으로 localhost에만 바인딩한다.

