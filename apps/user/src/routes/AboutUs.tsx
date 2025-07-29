import { useEffect } from 'react';
import { setPageMeta } from '../utils/meta';

const AboutUs = () => {
  useEffect(() => {
    setPageMeta({
      title: 'Music Player - About Us',
      description:
        'Learn more about our music player service and our mission to provide the best music experience.',
      keywords: ['about', 'mission', 'team', 'music', 'service'],
      openGraph: [
        { property: 'og:title', content: 'Music Player - About Us' },
        { property: 'og:description', content: 'Learn more about our music player service' },
        { property: 'og:type', content: 'website' },
      ],
    });
  }, []);

  return (
    <main className="about-page">
      <div className="about-content">
        <h1>About Us</h1>
        <p>Learn more about our music player service and our mission.</p>
        {/* About us content will be added here */}
      </div>
    </main>
  );
};

export default AboutUs;
