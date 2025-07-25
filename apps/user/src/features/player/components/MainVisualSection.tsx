import { createTRPCReact } from '@trpc/react-query';
import React, { useState } from 'react';
import { FaHeart, FaEllipsisH, FaPlay } from 'react-icons/fa';
import YouTube from 'react-youtube';
import type { AppRouter } from 'schema/src/trpc';
import { usePlayerStore } from '../stores/playerStore';
import { getYoutubeThumbnail } from '../utils';
import './MainVisualSection.scss';

const trpc = createTRPCReact<AppRouter>();
const categories = ['K-POP', 'J-POP', 'POP', 'OST'];

export default function MainVisualSection() {
  const [activeCategory, setActiveCategory] = useState('K-POP');
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const { setCurrentSong } = usePlayerStore();

  // 메인비주얼 곡 fetch (isFeaturedMainVisual: true)
  // const { data: featuredSong } = trpc.song.getFeaturedMainVisualSong.useQuery();
  const featuredSong = {
    id: 1,
    title: '더미 곡',
    artist: { id: 1, name: '더미 아티스트', category: { id: 1, name: 'K-POP' } },
    imageUrl: '',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    createdAt: new Date().toISOString(),
    createdBy: 'dummy',
    updatedAt: new Date().toISOString(),
    updatedBy: 'dummy',
    isActive: true,
    isFeaturedMainVisual: true,
    tags: [],
    hasImage: false,
    hasAttachment: false,
    pdfUrl: '',
  };

  // 카테고리 클릭 시 해당 카테고리의 메인비주얼 곡만 노출
  const showSong =
    featuredSong && featuredSong.artist?.category?.name === activeCategory
      ? featuredSong
      : undefined;

  const thumbnail = getYoutubeThumbnail(showSong?.youtubeUrl);
  const videoId = showSong?.youtubeUrl?.match(/[?&]v=([^&#]+)/)?.[1];

  const handlePlay = async () => {
    if (!showSong) return;
    await trpc.playlist.create.useMutation().mutateAsync({
      userId: 1,
      artistId: showSong.artist.id,
      songId: showSong.id,
      createdBy: 'dummy',
    });
    setCurrentSong(showSong);
    setPlaying(true);
  };

  return (
    <section className="main-visual-section">
      <div className="main-visual__category-list">
        {categories.map((cat) => (
          <div
            key={cat}
            className={`main-visual__category${activeCategory === cat ? ' active' : ''}`}
            onClick={() => {
              setActiveCategory(cat);
              setPlaying(false);
            }}
            tabIndex={0}
            role="button"
            aria-current={activeCategory === cat ? 'page' : undefined}
          >
            {cat}
          </div>
        ))}
      </div>
      <div className="main-visual__image-wrap">
        {/* 썸네일 이미지 */}
        {thumbnail && (
          <img
            src={thumbnail}
            alt={showSong?.title}
            className="main-visual__image"
            style={{ opacity: playing ? 0 : 1, transition: 'opacity 0.4s' }}
          />
        )}
        {/* Play 버튼 클릭 시 유튜브 영상 자동재생 (mute, controls X, loop) */}
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
                },
              }}
              onEnd={(e) => e.target.playVideo()}
            />
          </div>
        )}
        <div className="main-visual__gradient" />
      </div>
      <div className="main-visual__info">
        <div className="main-visual__meta">
          <div className="main-visual__meta-label">FEATURED SONGS</div>
          <div className="main-visual__meta-artist">{showSong?.artist?.name ?? '-'}</div>
          <div className="main-visual__meta-title">{showSong?.title ?? '-'}</div>
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
            <FaPlay style={{ marginRight: 8 }} />
            Play
          </button>
        </div>
      </div>
    </section>
  );
}
