import { useState, useEffect } from 'react';
import { FaHeart, FaEllipsisH, FaPlay } from 'react-icons/fa';
import YouTube from 'react-youtube';
import { usePlayerStore } from '../stores/playerStore';
import { getYoutubeThumbnail } from '../utils';

type MainVisualData = {
  id: number;
  code: string;
  category: string;
  artist: string | null;
  song: string | null;
  displayType: 'image' | 'youtube' | 'streaming';
  imageUrl: string | null;
  youtubeUrl: string | null;
  streamingUrl: string | null;
  isLive: boolean;
  liveStatus: 'online' | 'offline';
  artistId?: number;
  songId?: number;
};

type MainVisualResponse = {
  categories: string[];
  mainVisuals: Record<string, MainVisualData[]>;
};

export default function MainVisualSection() {
  const [activeCategory, setActiveCategory] = useState('K-POP');
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [mainVisualData, setMainVisualData] = useState<MainVisualResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { addSong } = usePlayerStore();

  // 메인 비주얼 데이터 fetch
  useEffect(() => {
    const fetchMainVisualData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/main-visual/user');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setMainVisualData(result.data);
          // 첫 번째 카테고리를 기본값으로 설정
          if (result.data.categories && result.data.categories.length > 0) {
            setActiveCategory(result.data.categories[0]);
          }
        }
      } catch (error) {
        // 에러 처리
      } finally {
        setLoading(false);
      }
    };

    fetchMainVisualData();
  }, []);

  // 현재 카테고리의 메인 비주얼 데이터
  const currentMainVisual = mainVisualData?.mainVisuals[activeCategory]?.[0];

  // 표시할 이미지 URL 결정
  const getDisplayImageUrl = () => {
    if (!currentMainVisual) return null;

    switch (currentMainVisual.displayType) {
      case 'image':
        return currentMainVisual.imageUrl;
      case 'youtube':
        if (currentMainVisual.youtubeUrl) {
          const thumbnail = getYoutubeThumbnail(currentMainVisual.youtubeUrl);
          return thumbnail;
        }
        return null;
      case 'streaming':
        return currentMainVisual.isLive
          ? currentMainVisual.streamingUrl
          : currentMainVisual.imageUrl;
      default:
        return null;
    }
  };

  const displayImageUrl = getDisplayImageUrl();

  // YouTube video ID 추출 (youtu.be와 youtube.com 모두 지원)
  const getVideoId = (url?: string | null): string | undefined => {
    if (!url) return undefined;

    // youtu.be/VIDEO_ID 형태 처리
    const youtuBeMatch = url.match(/youtu\.be\/([^?&#]+)/);
    if (youtuBeMatch) {
      return youtuBeMatch[1];
    }

    // youtube.com/watch?v=VIDEO_ID 형태 처리
    const youtubeMatch = url.match(/[?&]v=([^&#]+)/);
    if (youtubeMatch) {
      return youtubeMatch[1];
    }

    return undefined;
  };

  const videoId = getVideoId(currentMainVisual?.youtubeUrl);

  const handlePlay = async () => {
    if (!currentMainVisual) return;

    try {
      // 먼저 아티스트와 곡 정보 조회
      const searchResponse = await fetch('http://localhost:3001/api/songs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artistName: currentMainVisual.artist,
          songName: currentMainVisual.song,
        }),
      });

      const searchResult = await searchResponse.json();

      if (!searchResult.success) {
        return;
      }

      const { songId, artistId, song } = searchResult.data;

      // 플레이리스트에 곡 등록
      const playlistResponse = await fetch('http://localhost:3001/api/playlist/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1,
          artistId,
          songId,
        }),
      });

      const playlistResult = await playlistResponse.json();

      if (playlistResult.success) {
        // 플레이어 스토어에 곡 추가
        addSong(song);

        // 유튜브 영상 재생 시작
        setPlaying(true);
      }
    } catch (error) {
      // 에러 처리
    }
  };

  // 카테고리 변경 시 재생 상태 초기화
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPlaying(false);
  };

  if (loading) {
    return (
      <section className="main-visual-section">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            color: '#fff',
            fontSize: '18px',
          }}
        >
          로딩 중...
        </div>
      </section>
    );
  }

  // 카테고리가 없거나 메인 비주얼 데이터가 없는 경우
  if (!mainVisualData?.categories || mainVisualData.categories.length === 0) {
    return (
      <section className="main-visual-section">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            color: '#fff',
            fontSize: '18px',
          }}
        >
          등록된 메인 비주얼이 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section className={`main-visual-section${playing ? ' playing' : ''}`}>
      <div className="main-visual__category-list">
        {mainVisualData?.categories.map((cat) => (
          <div
            key={cat}
            className={`main-visual__category${activeCategory === cat ? ' active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
            tabIndex={0}
            role="button"
            aria-current={activeCategory === cat ? 'page' : undefined}
          >
            {cat}
          </div>
        )) || []}
      </div>
      <div className="main-visual__image-wrap">
        {/* 메인 비주얼 이미지 */}
        {displayImageUrl && (
          <img
            key={`${activeCategory}-${currentMainVisual?.id}`}
            src={displayImageUrl}
            alt={currentMainVisual?.song || 'Main Visual'}
            className="main-visual__image"
          />
        )}
        {/* Play 버튼 클릭 시 유튜브 영상 자동재생 (음소거) */}
        {playing && videoId && (
          <div className="main-visual__youtube-embed">
            <YouTube
              videoId={videoId}
              opts={{
                width: '100%',
                height: '420',
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  mute: 1,
                  loop: 1,
                  playlist: videoId,
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                  fs: 0,
                  disablekb: 1,
                  playsinline: 1,
                },
              }}
              onEnd={(e) => e.target.playVideo()}
              onReady={(e) => {
                // 영상이 준비되면 음소거 상태로 재생
                e.target.mute();
                e.target.playVideo();
              }}
            />
          </div>
        )}
        <div className="main-visual__gradient" />
      </div>
      <div className="main-visual__info">
        <div className="main-visual__meta">
          <div className="main-visual__meta-label">FEATURED SONGS</div>
          <div className="main-visual__meta-artist">{currentMainVisual?.artist || '-'}</div>
          <div className="main-visual__meta-title">{currentMainVisual?.song || '-'}</div>
        </div>
        <div className="main-visual__meta-actions">
          <button className="main-visual__icon-btn" aria-label="More options">
            <FaEllipsisH />
          </button>
          <button
            className={`main-visual__icon-btn${liked ? ' liked' : ''}`}
            aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={liked}
            onClick={() => setLiked((v) => !v)}
          >
            <FaHeart />
          </button>
          <button className="main-visual__play-btn" onClick={handlePlay}>
            <FaPlay className="main-visual__play-icon" />
            Play
          </button>
        </div>
      </div>
    </section>
  );
}
