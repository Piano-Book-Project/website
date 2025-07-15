# Piano Book Project Monorepo

**최종 업데이트:** 2025-07-16 02:45:00

---

## 📁 폴더 구조
```
website-1/
├── apps/
│   ├── user/      # Vite + React 프론트엔드 (에러 로깅)
│   └── admin/     # Next.js(백오피스, tRPC, Prisma, Auth 등, API 로깅)
├── packages/
│   ├── schema/    # Zod 스키마, 타입 공유
│   ├── ui/        # 공통 UI 컴포넌트
│   ├── utils/     # 공통 유틸리티
│   └── styles/    # 공통 스타일/테마
├── .github/       # GitHub Actions 등 워크플로우
├── .husky/        # Git hooks (pre-commit, post-commit 등)
├── package.json   # 루트 워크스페이스/스크립트/설정
├── .eslintrc.json # 통합 ESLint 설정
├── tsconfig.json  # 통합 TypeScript 설정
└── ...
```

---

## ⚙️ 개발 환경
- **Node.js 20.x** 이상 권장
- **npm workspaces** 기반 모노레포
- **ESLint** (스타일 규칙: 세미콜론, 작은따옴표 등)
- **TypeScript** (strict)
- **Husky** (pre-commit: lint, post-commit: 자동 push)
- **CI/CD**: GitHub Actions (main 브랜치 push 시 자동 빌드/배포)
- **DB**: SQLite (Prisma)
- **로그 수집**: admin(API 요청/응답 logs/api.log), user(에러 logs/error.log)

---

## 🚀 실행 방법
### 1. 의존성 설치 (루트에서)
```bash
npm install --legacy-peer-deps
```
### 2. 앱 개발 서버 실행
- **프론트엔드(user):**
  ```bash
  cd apps/user
  npm run dev
  ```
- **어드민(admin):**
  ```bash
  cd apps/admin
  npm run dev
  ```
### 3. 전체 Lint 검사
```bash
npm run lint
```
### 4. 전체 자동 고침
```bash
npx eslint . --ext .js,.jsx,.ts,.tsx --fix
```
### 5. 커밋 & 자동 푸시
```bash
git add .
git commit -m "메시지"   # 커밋 시 자동으로 push까지 실행됨
```

---

## 📝 기타
- 각 앱/패키지별 상세 설명은 apps/user/README.md, apps/admin/README.md 등 하위 README 참고
- 환경 변수(.env) 등은 각 앱 폴더에 별도 관리
- 스타일/포맷팅은 Prettier 없이 ESLint 규칙만 사용
- 로그 수집, 자동화, 문서화, seed/test 데이터 자동화 등 엔터프라이즈 수준 적용

---
문의/기여/이슈는 [GitHub Issues](https://github.com/Piano-Book-Project/website/issues) 활용 