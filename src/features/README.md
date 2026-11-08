# Features

사용자 행동 단위의 슬라이스를 둡니다. 예: `write-diary`.
실제 기능을 구현할 때 UI, 상태, API를 해당 슬라이스 안에 함께 두고 외부에는 `index.ts`로 공개합니다.
같은 계층의 다른 슬라이스나 `widgets`, `app`을 가져오지 않습니다.
