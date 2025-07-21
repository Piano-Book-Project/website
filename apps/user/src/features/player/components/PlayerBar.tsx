import { trpc } from '../../../lib/trpc';
import { CoverImage } from './CoverImage';
import { FaRandom, FaStepBackward, FaPlay, FaStepForward, FaRedo, FaVolumeUp, FaChromecast, FaBars, FaHeart, FaEllipsisH, FaPause } from 'react-icons/fa';
import YouTube from 'react-youtube';
import { useRef, useState, useEffect } from 'react';

export default function PlayerBar() {
  const userId = 1; // 실제 로그인 유저로 대체 가능
  const { data: initialSong, isLoading, error } = trpc.song.get.useQuery({ id: 1 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentSong, setCurrentSong] = useState<any | null>(null);
  const nextSongQuery = trpc.playlist.next.useQuery(
    { userId, currentSongId: currentSong?.id ?? 1 },
    { enabled: false }
  );
  const prevSongQuery = trpc.playlist.prev.useQuery(
    { userId, currentSongId: currentSong?.id ?? 1 },
    { enabled: false }
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [liked, setLiked] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showVolumeBar, setShowVolumeBar] = useState(false);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onReady = (e: { target: any }) => {
    playerRef.current = e.target;
    setDuration(e.target.getDuration());
    setCurrentTime(e.target.getCurrentTime());
  };
  const onStateChange = (e: { data: number }) => {
    setIsPlaying(e.data === 1);
  };
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        setCurrentTime(playerRef.current!.getCurrentTime());
      }, 300);
    }
    return () => interval && clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo?.();
    } else {
      playerRef.current.playVideo?.();
    }
  };

  const getYoutubeId = (url?: string | null): string | undefined => {
    if (!url) return undefined;
    const match = url.match(/[?&]v=([^&#]+)/);
    return match ? match[1] : undefined;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!playerRef.current || typeof playerRef.current.seekTo !== 'function' || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const seekTime = percent * duration;
    playerRef.current.seekTo(seekTime, true);
    setCurrentTime(seekTime);
  };


  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume?.(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (!showVolumeBar) return;
    const handleClick = (e: MouseEvent) => {
      if (volumeBarRef.current && !volumeBarRef.current.contains(e.target as Node)) {
        setShowVolumeBar(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showVolumeBar]);

  useEffect(() => {
    if (initialSong) setCurrentSong(initialSong);
  }, [initialSong]);

  const handleNext = async () => {
    if (!currentSong) return;
    try {
      const { data: next } = await nextSongQuery.refetch();
      if (next) setCurrentSong(next);
      else setCurrentSong(currentSong); // 다음 곡 없으면 현재 곡 반복
    } catch {
      setCurrentSong(currentSong); // 에러 시 현재 곡 반복
    }
  };

  const handlePrev = async () => {
    if (!currentSong) return;
    try {
      const { data: prev } = await prevSongQuery.refetch();
      if (prev) setCurrentSong(prev);
      else setCurrentSong(currentSong); // 이전 곡 없으면 현재 곡 반복
    } catch {
      setCurrentSong(currentSong); // 에러 시 현재 곡 반복
    }
  };

  if (isLoading || !currentSong) {
    return (
      <div className="player-bar player-bar-loading" style={{ height: 65 }}>
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="player-bar" style={{ height: 65 }}>
        <span className="text-red-400">No song found</span>
      </div>
    );
  }

  const videoId = getYoutubeId(typeof currentSong.youtubeUrl === 'string' ? currentSong.youtubeUrl : undefined);

  return (
    <nav className="player-bar" aria-label="Music Player Controls">
      <div className="youtube-hidden">
        <YouTube
          videoId={videoId}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              controls: 0,
              loop: isRepeating ? 1 : 0,
              playlist: isRepeating ? videoId : undefined,
            },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>
      <div className="player-bar__main">
        <div className="player-bar__info-group">
          <CoverImage src={currentSong.imageUrl ?? undefined} alt={currentSong.title ?? undefined} />
          <div className="player-bar__info-text">
            <div className="player-bar__title-row">
              <span className="player-bar__title">{currentSong.title ?? 'Unknown'}</span>
              <button
                className="player-bar__icon-small player-bar__a11y-btn"
                aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={liked}
                tabIndex={0}
                onClick={() => setLiked((v) => !v)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setLiked((v) => !v)}
                type="button"
              >
                <FaHeart style={{ marginLeft: 8, marginRight: 8, color: liked ? '#EF2F62' : undefined, transition: 'color 0.2s' }} />
                <span className="sr-only">{liked ? 'Remove from favorites' : 'Add to favorites'}</span>
              </button>
              <button className="player-bar__icon-small player-bar__a11y-btn" aria-label="More options" tabIndex={0} type="button">
                <FaEllipsisH />
                <span className="sr-only">More options</span>
              </button>
            </div>
            <div className="player-bar__artist">{currentSong.artist?.name ?? 'Unknown Artist'}</div>
            <div className="player-bar__source">PLAI<span style={{letterSpacing:0}}>N</span>G FROM: CHU PIANO</div>
          </div>
        </div>
        <div className="player-bar__center">
          <div className="player-bar__controls" role="group" aria-label="Playback controls">
            <button
              className={`player-bar__icon player-bar__a11y-btn${isShuffling ? ' active' : ''}`}
              aria-label={isShuffling ? 'Disable shuffle' : 'Enable shuffle'}
              aria-pressed={isShuffling}
              tabIndex={0}
              onClick={() => setIsShuffling((v) => !v)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setIsShuffling((v) => !v)}
              type="button"
            >
              <FaRandom />
              <span className="sr-only">{isShuffling ? 'Disable shuffle' : 'Enable shuffle'}</span>
            </button>
            <button className="player-bar__icon player-bar__a11y-btn" aria-label="Previous" tabIndex={0} type="button" onClick={handlePrev}>
              <FaStepBackward />
              <span className="sr-only">Previous</span>
            </button>
            <button
              className={`player-bar__icon player-bar__a11y-btn${isPlaying ? ' active' : ''}`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              aria-pressed={isPlaying}
              tabIndex={0}
              onClick={handlePlayPause}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handlePlayPause()}
              type="button"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
              <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button className="player-bar__icon player-bar__a11y-btn" aria-label="Next" tabIndex={0} type="button" onClick={handleNext}>
              <FaStepForward />
              <span className="sr-only">Next</span>
            </button>
            <button
              className={`player-bar__icon player-bar__a11y-btn${isRepeating ? ' active' : ''}`}
              aria-label={isRepeating ? 'Disable repeat' : 'Enable repeat'}
              aria-pressed={isRepeating}
              tabIndex={0}
              onClick={() => setIsRepeating((v) => !v)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setIsRepeating((v) => !v)}
              type="button"
            >
              <FaRedo style={{ color: isRepeating ? '#EF2F62' : undefined }} />
              <span className="sr-only">{isRepeating ? 'Disable repeat' : 'Enable repeat'}</span>
            </button>
          </div>
          <div className="player-bar__progress-section progress-section-pt8">
            <div className="player-bar__progress-time">{formatTime(currentTime)}</div>
            <div className="player-bar__progress-bar-wrapper">
              <div
                className="player-bar__progress-bar"
                onClick={handleProgressClick}
                style={{ cursor: 'pointer' }}
                role="slider"
                aria-valuenow={Math.round(currentTime)}
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                aria-label="Seek bar"
                tabIndex={0}
                onKeyDown={e => {
                  if (!playerRef.current || !duration) return;
                  if (e.key === 'ArrowLeft') {
                    const t = Math.max(0, currentTime - 5);
                    playerRef.current.seekTo(t, true);
                    setCurrentTime(t);
                  } else if (e.key === 'ArrowRight') {
                    const t = Math.min(duration, currentTime + 5);
                    playerRef.current.seekTo(t, true);
                    setCurrentTime(t);
                  }
                }}
              >
                <div
                  className="player-bar__progress-bar-fill"
                  style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%', transition: 'width 0.3s cubic-bezier(.4,0,.2,1)' }}
                />
              </div>
            </div>
            <div className="player-bar__progress-time">{formatTime(duration)}</div>
          </div>
        </div>
        <div className="player-bar__right" role="group" aria-label="Other controls">
          {/* 볼륨 버튼+게이지바 (반응형에서 player-bar__right가 숨겨질 때도 보이게) */}
          <div className="volume-btn-wrapper">
            <button
              className="player-bar__icon player-bar__a11y-btn"
              aria-label="Volume"
              tabIndex={0}
              type="button"
              onClick={() => setShowVolumeBar(v => !v)}
            >
              <FaVolumeUp />
              <span className="sr-only">Volume</span>
            </button>
            {showVolumeBar && (
              <div
                ref={volumeBarRef}
                className="volume-bar-floating"
                // position: absolute, bottom: 120% (SCSS에서 적용)
              >
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={e => {
                    const v = Number(e.target.value);
                    setVolume(v);
                    playerRef.current?.setVolume?.(v);
                  }}
                  className="volume-bar-vertical"
                />
                <span className="volume-bar-label">{volume}</span>
              </div>
            )}
          </div>
          <button className="player-bar__icon player-bar__a11y-btn" aria-label="Cast to device" tabIndex={0} type="button">
            <FaChromecast />
            <span className="sr-only">Cast to device</span>
          </button>
          <button className="player-bar__icon player-bar__a11y-btn" aria-label="Show playlist" tabIndex={0} type="button">
            <FaBars />
            <span className="sr-only">Show playlist</span>
          </button>
        </div>
      </div>
    </nav>
  );
} 
