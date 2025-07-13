# Admin (Vite + React + TypeScript)

## 주요 스택
- Vite
- React
- TypeScript
- ESLint, Prettier
- gh-pages (GitHub Pages 배포)

## 개발
```bash
yarn dev
```

## 빌드
```bash
yarn build
```

## 배포 (GitHub Pages)
```bash
yarn deploy
```

## 린트/포맷
```bash
yarn lint
prettier --write .
```

## 실행/배포 자동화

### 전체 개발 서버 동시 실행
```bash
yarn dev:all
```
(admin과 backend가 동시에 dev 모드로 실행)

### 전체 빌드
```bash
yarn build:all
```

### 전체 실행 (프론트 preview + 백엔드)
```bash
yarn start:all
```

### GitHub Pages 배포
```bash
yarn deploy
```

- gh-pages 환경에서는 API baseURL이 자동으로 실제 백엔드 서버 주소로 분기됨
- 404.html → index.html 리다이렉트 등 SPA 라우팅 문제는 Vite 기본 설정으로 대응됨

### GitHub Pages 배포 주의사항
- 배포 시 자동으로 `GITHUB_PAGES=true` 환경변수가 적용되어 Vite base 경로가 `/website/`로 설정됩니다.
- 404.html → index.html 리다이렉트 스크립트가 포함되어 SPA 라우팅 문제를 해결합니다.
- API baseURL은 github.io 환경에서 자동으로 실제 백엔드 서버 주소로 분기됩니다.

### 배포용 백엔드 서버 주소 환경변수화
- .env(.production 등)에 아래와 같이 설정:
  ```env
  VITE_API_BASE_URL=https://your-backend-domain.com/api
  ```
- 환경변수 값이 있으면 자동으로 해당 주소로 API 요청
- gh-pages 환경 등에서도 환경변수로 관리 가능

### 실제 배포 예시
- 백엔드(Next.js API)는 Render, Vercel, AWS 등 별도 서버에 배포
- 프론트엔드(admin)는 GitHub Pages에 배포
- .env.production 파일에 실제 백엔드 주소를 지정하면, 빌드시 자동 반영됨
