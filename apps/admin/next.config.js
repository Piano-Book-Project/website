// @ts-check
import { withSentryConfig } from '@sentry/nextjs';

const moduleExports = {
  // 기존 Next.js 설정이 있다면 여기에 추가
  sentry: {
    // Sentry 옵션 (필요시 추가)
  },
};

const sentryWebpackPluginOptions = {
  silent: true, // 빌드 로그 최소화
};

export default withSentryConfig(moduleExports, sentryWebpackPluginOptions); 