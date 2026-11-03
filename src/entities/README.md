# Entities

여러 기능이 공유하는 도메인 모델, 쿼리, UI를 슬라이스별로 둡니다. 예: `diary`.
외부에는 각 슬라이스의 `index.ts`를 공개하며 `shared`에만 의존합니다.
