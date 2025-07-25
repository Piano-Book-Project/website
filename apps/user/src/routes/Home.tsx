import MainVisualSection from '../features/player/components/MainVisualSection';
import RecentSongsSection from '../features/player/components/RecentSongsSection';

const Home = () => (
  <div>
    <MainVisualSection />
    <RecentSongsSection />
    {/* 이후 전체곡/카테고리별 섹션 등 추가 */}
  </div>
);
export default Home;
