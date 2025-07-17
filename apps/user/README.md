# User App (Vite + React)

## 개요

- Piano Book Project의 사용자 프론트엔드
- Vite + React + TypeScript 기반, feature-based 구조
- Zustand, react-hook-form, zod, clsx, TanStack Query, ShadCN UI 등 최신 스택 적용

## 폴더 구조

```
apps/user/
├── src/
│   ├── features/      # 도메인별(playlist, user 등) 폴더, 각종 컴포넌트/유틸/타입/테스트 등 포함
│   ├── components/    # 전역 공통 컴포넌트
│   ├── hooks/         # 전역 커스텀 훅
│   ├── services/      # API/비즈니스 로직
│   ├── stores/        # 전역 상태(Zustand)
│   ├── utils/         # 공통 유틸리티 (logger 등)
│   ├── styles/        # 전역 스타일(Tailwind)
│   └── ...
```

## 주요 스택 및 기능

- Vite, React 19, TypeScript(strict), Zustand, react-hook-form, zod, clsx, TanStack Query, ShadCN UI, TailwindCSS
- ESLint(Airbnb), Husky, lint-staged, Vitest
- feature-based 구조, 배럴/타입/유틸/샘플테스트 자동 생성
- 모든 에러는 `ErrorBoundary` + `logError`로 logs/error.log(운영: 서버 전송, 개발: 콘솔)에 기록

## 실행 방법

```bash
npm install --legacy-peer-deps
npm run dev
```

## 에러 로깅

- src/components/ErrorBoundary.tsx: 전역 에러 바운더리
- src/utils/logger.ts: logError 함수(개발: 콘솔, 운영: 서버 전송)

## 기타

- 환경 변수(.env)는 apps/user 폴더에 별도 관리
- 상세 구조/샘플 코드는 features/README.md 참고
