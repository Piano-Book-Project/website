import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://62180c60637811f0b549529f042b0131@o4507388720914432.ingest.sentry.io/4507388722821120', // 실제 운영 시 본인 DSN으로 교체
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
}); 