export function logError(error: Error | string) {
  try {
    const msg = typeof error === 'string' ? error : error.stack || error.message;
    // 브라우저 환경에서는 파일 저장이 불가하므로, 서버 전송 또는 콘솔 출력
    // (실제 운영에서는 Sentry 등 외부 서비스 연동 권장)
    if (process.env.NODE_ENV === 'development') {
      // 개발환경: 콘솔 출력
      // eslint-disable-next-line no-console
      console.error('[Error]', msg);
    } else {
      // 운영환경: 서버로 전송(예시)
      fetch('/logs/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: msg, time: new Date().toISOString() }),
      });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('logError failed', e);
  }
}
