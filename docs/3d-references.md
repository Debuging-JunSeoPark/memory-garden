# 3D 구현 참고 자료

2026-11-02 사용자가 제공한 자료와 참고 우선순위를 기록한다. 아래 참고 포인트는 사용자가 제시한 탐색 항목이며, 각 저장소의 코드와 현재 API를 분석·검증한 결과는 아니다. 실제 구현 단계에서 관련 예제를 확인한다.

## 참고 순서

Fuble → React Three Fiber Examples → React Three Examples → Three.js Examples → Drei → CandyCrossing

| 순서 | 자료 | 참고 포인트 |
| --- | --- | --- |
| 1 | [Fuble](https://github.com/IsPeG/Fuble) | 3D Room, 가구 배치, Grid 시스템, GLTF 모델, 오브젝트 Interaction |
| 2 | [React Three Fiber 공식 Examples](https://r3f.docs.pmnd.rs/getting-started/examples) | Soft Shadow, GLTF Animation, Camera, Interaction, Instances, Character |
| 3 | [React Three Examples](https://github.com/pmndrs/react-three-examples) | R3F 기반 Three.js 구현 패턴과 그래픽 효과 |
| 4 | [Three.js 공식 Examples](https://threejs.org/examples/) | Toon Material, Lighting, Shadow, Post Processing, GLTF |
| 5 | [React Three Drei](https://drei.docs.pmnd.rs/) | Environment, ContactShadows, Sky, Float, CameraControls |
| 6 | [CandyCrossing](https://github.com/IanHuntress/CandyCrossing) | 3D World, 캐릭터, 맵 구성, 브라우저 게임 구조 |

## 이후 작업에서 사용하기

- Next.js 초기화 다음에 3D 장면 구현을 시작할 때 이 목록을 먼저 읽는다.
- 위 순서를 유지하며 현재 작업과 관련된 예제부터 확인한다.
- 코드나 모델을 가져올 때는 해당 코드·에셋의 라이선스와 출처를 확인한다.
- 검토한 예제의 경로, 적용한 패턴과 선택 이유를 해당 구현 PR에 기록한다.

이 목록은 참고 자료이며, 가구 배치 등 모든 예제 기능을 제품 요구사항으로 추가하는 것은 아니다. 제품 범위는 [제품 설계](superpowers/specs/2026-11-02-memory-garden-design.md)를 따른다.
