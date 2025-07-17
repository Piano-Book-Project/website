# Admin App (Next.js + tRPC + Prisma)

## 개요

- Piano Book Project의 백오피스/관리자 프론트엔드 및 API 서버
- Next.js + tRPC + Prisma 기반, feature-based 구조
- 인증(NextAuth), DB(SQLite), robust error handling, 자동화/문서화 적용

## 폴더 구조

```
apps/admin/
├── src/
│   ├── features/      # 도메인별(playlist, user, song 등) 폴더, 각종 컴포넌트/유틸/타입/테스트 등 포함
│   ├── components/    # 전역 공통 컴포넌트
│   ├── hooks/         # 전역 커스텀 훅
│   ├── services/      # API/비즈니스 로직
│   ├── stores/        # 전역 상태
│   ├── utils/         # 공통 유틸리티 (logger 등)
│   ├── server/        # tRPC, Prisma, 미들웨어, DB
│   ├── styles/        # 전역 스타일
│   └── ...
```

## 주요 스택 및 기능

- Next.js, tRPC, Prisma, NextAuth, TypeScript(strict), ESLint(Airbnb), Husky, lint-staged
- feature-based 구조, 배럴/타입/유틸/샘플테스트 자동 생성
- 모든 tRPC API 요청/응답은 logs/api.log에 기록(winston 기반)
- robust error handling, 자동화, 문서화, seed/test 데이터 자동화

## 실행 방법

```bash
npm install --legacy-peer-deps
npm run dev
```

## API 로깅

- src/utils/logger.ts: winston 기반 logger, logs/api.log에 기록
- src/server/trpc.ts: tRPC 미들웨어로 모든 요청/응답 로깅

## 기타

- 환경 변수(.env)는 apps/admin 폴더에 별도 관리
- 상세 구조/샘플 코드는 features/README.md 참고
