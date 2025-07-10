# Piano Book Website

B2C 클라이언트 뷰와 Admin 관리자 뷰를 포함한 Piano Book 웹사이트입니다.

## 🚀 배포된 사이트

- **클라이언트 뷰**: https://piano-book-project.github.io/website/
- **관리자 뷰**: https://piano-book-project.github.io/website/ (관리자 기능은 별도 경로에서 제공)

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
- **Deployment**: GitHub Pages

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

### 배포

**클라이언트 뷰 배포**
```bash
yarn deploy:client
```

**관리자 뷰 배포**
```bash
yarn deploy:admin
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

## 자동 배포

GitHub Actions를 통해 main 브랜치에 푸시할 때마다 자동으로 클라이언트 뷰가 배포됩니다.

- **트리거**: main 브랜치에 push 또는 pull request
- **배포 대상**: GitHub Pages (gh-pages 브랜치)
- **배포 파일**: dist/client 폴더

## 개발 가이드

### 새로운 기능 추가
1. feature 브랜치 생성
2. 개발 및 테스트
3. pull request 생성
4. 코드 리뷰 후 main 브랜치로 병합
5. 자동 배포 실행 