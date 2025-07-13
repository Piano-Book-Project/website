# Backend (Next.js + TypeScript + TailwindCSS)

## 주요 스택
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- ESLint, Prettier

## 개발
```bash
yarn dev
```

## 빌드
```bash
yarn build
```

## 린트/포맷
```bash
yarn lint
prettier --write .
```

## GitHub Pages 연동 안내
- GitHub Pages는 정적 파일만 호스팅하므로, 백엔드(Next.js API)는 별도 서버(예: Render, Vercel, AWS 등)에 배포해야 합니다.
- 프론트엔드(admin)는 gh-pages 환경에서 API baseURL을 자동으로 실제 백엔드 서버 주소로 분기합니다.
- 백엔드 서버 주소는 admin/src/utils/api.ts에서 관리됩니다. 

### 실제 배포 예시
- Render, Vercel, AWS 등에서 backend(Next.js API) 서버 배포
- 환경변수(.env.production 등)로 DATABASE_URL, JWT_SECRET 등 관리
- 배포 후 프론트엔드 .env(.production)에 API 주소 지정

### CI/CD 자동화 개요
- GitHub Actions 등으로 push 시 자동 빌드/배포 파이프라인 구성 가능
- 예시 워크플로우는 .github/workflows/ 디렉토리에 추가 가능 