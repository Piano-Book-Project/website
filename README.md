# 김츄츄의 피아노책 웹사이트

피아노책 관리 시스템의 어드민 대시보드 및 백엔드 API

## 🚀 프로젝트 구조

```
website/
├── admin/          # React + Vite 프론트엔드 (어드민 대시보드)
├── backend/        # Next.js + Prisma 백엔드 API
├── .husky/         # Git hooks
└── package.json    # 루트 설정
```

## 🛠 기술 스택

### 프론트엔드 (admin/)
- **React 19** + **TypeScript**
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **Material-UI (MUI)** - UI 컴포넌트 라이브러리
- **React Query** - 서버 상태 관리
- **React Router** - 클라이언트 사이드 라우팅
- **Framer Motion** - 애니메이션
- **React Hot Toast** - 알림 시스템

### 백엔드 (backend/)
- **Next.js 14** + **TypeScript**
- **Prisma** - 데이터베이스 ORM
- **SQLite** - 데이터베이스
- **JWT** - 인증
- **bcryptjs** - 비밀번호 해싱

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
yarn install
```

### 2. 환경 변수 설정
```bash
# backend/env.example을 backend/.env로 복사
cp backend/env.example backend/.env
```

### 3. 데이터베이스 설정
```bash
# Prisma 클라이언트 생성
yarn db:generate

# 마이그레이션 실행
yarn db:migrate

# 초기 데이터 시드
yarn db:seed
```

### 4. 개발 서버 실행
```bash
# 전체 서버 실행 (프론트엔드 + 백엔드)
yarn dev

# 개별 실행
yarn dev:admin    # 프론트엔드 (포트 5173)
yarn dev:backend  # 백엔드 (포트 3002)
```

## 🚀 배포

### 프론트엔드 (GitHub Pages)
```bash
yarn deploy
```

### 백엔드 (Vercel/Netlify 등)
```bash
yarn build:backend
```

## 🔧 주요 기능

### 어드민 대시보드
- ✅ 사용자 관리 (CRUD)
- ✅ 카테고리 관리
- ✅ 게시물 관리
- ✅ 문의 관리
- ✅ 요금제 관리
- ✅ 권한 기반 접근 제어
- ✅ 다크 테마
- ✅ 반응형 디자인

### 보안 기능
- ✅ JWT 인증
- ✅ 비밀번호 해싱
- ✅ Rate Limiting
- ✅ CORS 설정
- ✅ 보안 헤더
- ✅ 봇 차단
- ✅ XSS 방지

## 📁 주요 파일 구조

```
admin/src/
├── components/     # 재사용 가능한 컴포넌트
├── pages/         # 페이지 컴포넌트
├── hooks/         # 커스텀 훅
├── utils/         # 유틸리티 함수
├── contexts/      # React Context
└── theme/         # MUI 테마 설정

backend/src/
├── pages/api/     # API 라우트
├── utils/         # 유틸리티 함수
└── types/         # TypeScript 타입 정의
```

## 🔐 환경 변수

### 백엔드 (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
CORS_ORIGIN="http://localhost:5173,https://piano-book-project.github.io"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 테스트

```bash
# 전체 테스트 실행
yarn test

# 개별 테스트
yarn workspace admin test
yarn workspace backend test
```

## 📝 스크립트

### 루트 레벨
- `yarn dev` - 전체 개발 서버 실행
- `yarn build` - 전체 빌드
- `yarn deploy` - 프론트엔드 배포
- `yarn test` - 전체 테스트 실행

### 데이터베이스
- `yarn db:generate` - Prisma 클라이언트 생성
- `yarn db:migrate` - 마이그레이션 실행
- `yarn db:seed` - 초기 데이터 생성

## 🌐 배포 URL

- **프론트엔드**: https://piano-book-project.github.io/website/
- **백엔드**: (별도 배포 필요)

## 🔄 개발 워크플로우

1. **기능 개발**
   ```bash
   yarn dev
   ```

2. **테스트**
   ```bash
   yarn test
   ```

3. **빌드**
   ```bash
   yarn build
   ```

4. **배포**
   ```bash
   yarn deploy
   ```

## 📞 지원

문제가 발생하면 이슈를 생성해주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 