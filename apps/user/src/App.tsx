import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://84c729f462e111f0b0818e19d62c2ed1@o4507348722321408.ingest.sentry.io/4507348724326400',
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
});

import PlayerBar from './features/player/components/PlayerBar';

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#171719' }}>
      <PlayerBar />
    </div>
  );
}

export default App;
