# features/

이 폴더는 도메인/기능별(예: admin, user, song 등)로 코드를 분리하는 공간입니다.

## 예시 구조

```
features/
  user/
    components/
    api/
    hooks/
    types.ts
    index.ts
  song/
    ...
```

- 각 feature 폴더 안에 해당 도메인 관련 컴포넌트, 훅, API, 타입 등을 배치하세요.
- 전역/공통 컴포넌트는 src/components, 전역 훅은 src/hooks에 두세요.
