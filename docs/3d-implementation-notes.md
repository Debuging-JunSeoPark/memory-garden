# 첫 3D 정원 구현 참고 기록

## 검토 순서와 결정

사용자가 지정한 순서 중 Fuble을 먼저 읽고 R3F 공식 Examples, Canvas·성능 문서를 확인했다. 구현에 사용한 Drei 도우미의 공식 문서도 추가 확인했다. 나머지 React Three Examples, Three.js Examples, CandyCrossing은 아직 코드 분석하지 않았다.

### 1. Fuble

- 저장소: <https://github.com/IsPeG/Fuble>
- 검토 커밋: `03e94ffe5bf295543eb6956f10ccf40bcd6560a0`
- [src/App.jsx](https://github.com/IsPeG/Fuble/blob/03e94ffe5bf295543eb6956f10ccf40bcd6560a0/src/App.jsx): Canvas 안에서 바닥·벽·오브젝트를 조합하고 고정된 카메라 위치와 조명을 사용하는 구성을 확인했다.
- [src/components/room_elements/Floor.jsx](https://github.com/IsPeG/Fuble/blob/03e94ffe5bf295543eb6956f10ccf40bcd6560a0/src/components/room_elements/Floor.jsx): 바닥 메시를 별도 컴포넌트로 나누고 텍스처를 적용하는 방식을 확인했다.
- 적용: 공간 도형과 카메라·조명을 분리하고, 좌표로 소품을 배치하는 구성 원칙만 참고했다. 그리드 편집·가구 상태·GLTF 로더는 이번 범위에 넣지 않았다.
- 출처·라이선스: 루트 트리에서 명시적인 LICENSE 파일을 확인하지 못했다. 코드·모델·텍스처를 복사하지 않았으며 정원의 도형·SVG 지도는 이 저장소에서 직접 작성했다.

### 2. React Three Fiber

- [공식 Examples](https://r3f.docs.pmnd.rs/getting-started/examples): 게임·그림자·카메라 등 예제 분류를 확인했다. 링크된 개별 샌드박스 코드는 가져오지 않았다.
- [Canvas](https://r3f.docs.pmnd.rs/api/canvas): 직교 카메라, DPR, 그림자, 렌더링 모드와 초기화 실패의 Error Boundary 경계를 참고했다.
- [Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance): 정지 장면은 `frameloop="demand"`로 렌더링하고 DPR을 1~1.5로 제한했다. 자동 움직임은 없다.
- `Canvas.fallback`은 canvas의 DOM 자식으로 마운트된다. 정상 WebGL에서도 그 React 효과가 실행되므로 실패 상태를 변경하는 효과를 fallback에 두지 않는다. 실제 초기화 오류는 Error Boundary에서 처리한다. 정상 렌더링·사용 불가·실행 중 context loss를 각각 브라우저 테스트한다.

### 3. Drei와 Three.js

- [ContactShadows](https://drei.docs.pmnd.rs/staging/contact-shadows): 정지 장면에 맞춰 `frames={1}`, 해상도 256으로 제한했다.
- [OrthographicCamera](https://drei.docs.pmnd.rs/cameras/orthographic-camera): 화면 크기에 따라 선언적으로 zoom을 전달하고 기본 카메라로 사용한다. 카메라는 움직이지 않는다.
- Three.js의 현행 PCF 그림자를 사용한다. 방향광 shadow map은 1024로 제한한다.
- 사용 패키지 R3F, Drei, Three.js의 라이선스는 MIT다. 별도의 외부 에셋은 없다.

## 남은 범위

- 캐릭터 이동, 보행 경계·충돌, 기억 오브젝트 상호작용
- 실제 기록 상태에 따른 정원 변화와 달력 패널
- 모바일 실제 기기의 GPU 성능 확인 (현재는 데스크톱 및 모바일 뷰포트의 Chromium 검사)

현재 R3F 내부의 Three.Clock 사용으로 Three.js의 비치명적인 사용 중단 경고가 발생한다. 렌더링·대체 화면에는 영향을 주지 않으며 의존성 업데이트 시 다시 확인한다.
