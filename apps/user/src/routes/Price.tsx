import { useEffect } from 'react';
import { setPageMeta } from '../utils/meta';

const Price = () => {
  useEffect(() => {
    setPageMeta({
      title: 'Music Player - Pricing',
      description:
        'Explore our pricing plans for the music player service. Choose the perfect plan for your music needs.',
      keywords: ['pricing', 'plans', 'music', 'subscription'],
      openGraph: [
        { property: 'og:title', content: 'Music Player - Pricing' },
        {
          property: 'og:description',
          content: 'Explore our pricing plans for the music player service',
        },
        { property: 'og:type', content: 'website' },
      ],
    });
  }, []);

  return (
    <main className="price-page">
      <div className="price-content">
        <h1>Pricing Plans</h1>
        <p>Choose the perfect plan for your music needs.</p>
        {/* Pricing content will be added here */}
      </div>
    </main>
  );
};

export default Price;
