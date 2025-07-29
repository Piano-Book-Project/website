import { useEffect } from 'react';
import MainVisualSection from '../features/player/components/MainVisualSection';
import RecentSongsSection from '../features/player/components/RecentSongsSection';
import { setPageMeta } from '../utils/meta';

const Home = () => {
  useEffect(() => {
    setPageMeta({
      title: 'Music Player - Home',
      description:
        'Listen to your favorite music with our advanced music player. Discover new songs and create your perfect playlist.',
      keywords: ['music', 'player', 'playlist', 'home', 'discover'],
      openGraph: [
        { property: 'og:title', content: 'Music Player - Home' },
        {
          property: 'og:description',
          content: 'Listen to your favorite music with our advanced music player',
        },
        { property: 'og:type', content: 'website' },
      ],
    });
  }, []);

  return (
    <main className="home-page">
      <MainVisualSection />
      <RecentSongsSection />
      {/* 이후 전체곡/카테고리별 섹션 등 추가 */}
    </main>
  );
};

export default Home;
