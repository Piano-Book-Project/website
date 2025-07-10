# Piano Book Website

B2C 클라이언트 뷰와 Admin 관리자 뷰를 포함한 Piano Book 웹사이트입니다.

## 프로젝트 구조

```
src/
├── client/          # B2C 클라이언트 뷰
│   ├── components/  # 클라이언트 컴포넌트
│   ├── pages/       # 클라이언트 페이지
│   ├── App.tsx      # 클라이언트 메인 앱
│   ├── main.tsx     # 클라이언트 진입점
│   └── index.html   # 클라이언트 HTML
├── admin/           # Admin 관리자 뷰
│   ├── components/  # 관리자 컴포넌트
│   ├── pages/       # 관리자 페이지
│   ├── App.tsx      # 관리자 메인 앱
│   ├── main.tsx     # 관리자 진입점
│   └── index.html   # 관리자 HTML
├── components/      # 공통 컴포넌트
├── utils/           # 유틸리티 함수
├── types/           # TypeScript 타입 정의
└── assets/          # 정적 자산
```

## 기술 스택

- **Frontend**: React 18, TypeScript, Vite
- **Routing**: React Router DOM
- **Styling**: CSS Modules
- **Testing**: Vitest, React Testing Library
- **Linting**: ESLint
- **Package Manager**: Yarn
- **Database**: Prisma

## 설치 및 실행

### 의존성 설치
```bash
yarn install
```

### 개발 서버 실행

**클라이언트 뷰 (포트 3000)**
```bash
yarn dev
```

**관리자 뷰 (포트 3001)**
```bash
yarn dev:admin
```

### 빌드

**클라이언트 뷰**
```bash
yarn build
```

**관리자 뷰**
```bash
yarn build:admin
```

### 테스트
```bash
yarn test
yarn test:ui
yarn test:coverage
```

### 린팅
```bash
yarn lint
yarn lint:fix
```

## 환경 설정

- 클라이언트 뷰: http://localhost:3000
- 관리자 뷰: http://localhost:3001 