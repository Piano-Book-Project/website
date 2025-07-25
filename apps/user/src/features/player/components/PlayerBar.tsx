import { createTRPCReact } from '@trpc/react-query';
import { useEffect, useRef, useState } from 'react';
import {
  FaRandom,
  FaStepBackward,
  FaPlay,
  FaStepForward,
  FaRedo,
  FaVolumeUp,
  FaVolumeMute,
  FaChromecast,
  FaBars,
  FaHeart,
  FaEllipsisH,
  FaPause,
} from 'react-icons/fa';
import YouTube from 'react-youtube';
import type { AppRouter } from 'schema/src/trpc';
import { usePlayerStore } from '../stores/playerStore';
import { CoverImage } from './CoverImage';

const trpc = createTRPCReact<AppRouter>();

export default function PlayerBar() {
  const userId = 1; // 실제 로그인 유저로 대체 가능
  const {
    playlist,
    currentSong,
    isPlaying,
    volume,
    currentTime,
    setPlaylist,
    setCurrentSong,
    setIsPlaying,
    setVolume,
    setCurrentTime,
  } = usePlayerStore();

  // 플레이리스트 fetch (API → store)
  const { data: playlistData } = trpc.playlist.list.useQuery();
  useEffect(() => {
    if (playlistData) {
      const userPlaylist = playlistData.filter((item: any) => item.userId === userId);
      setPlaylist(userPlaylist);
    }
  }, [playlistData, userId, setPlaylist]);

  // next/prev API
  // const nextSongQuery = trpc.playlist.next.useQuery(
  //   { userId, currentSongId: currentSong?.id ?? 1 },
  //   { enabled: false },
  // );
  // const prevSongQuery = trpc.playlist.prev.useQuery(
  //   { userId, currentSongId: currentSong?.id ?? 1 },
  //   { enabled: false },
  // );
  const handleNext = async () => {
    if (!currentSong || !playlist || playlist.length === 0) return;
    if (playlist.length === 1) {
      setCurrentSong(playlist[0].song);
      return;
    }
    try {
      // const { data: next } = await nextSongQuery.refetch();
      // if (next) setCurrentSong(next);
      // else setCurrentSong(currentSong);
      setCurrentSong(playlist[1].song); // 더미 데이터
    } catch {
      setCurrentSong(currentSong);
    }
  };
  const handlePrev = async () => {
    if (!currentSong || !playlist || playlist.length === 0) return;
    if (playlist.length === 1) {
      setCurrentSong(playlist[0].song);
      return;
    }
    try {
      // const { data: prev } = await prevSongQuery.refetch();
      // if (prev) setCurrentSong(prev);
      // else setCurrentSong(currentSong);
      setCurrentSong(playlist[playlist.length - 2].song); // 더미 데이터
    } catch {
      setCurrentSong(currentSong);
    }
  };

  // 볼륨/유튜브/재생 관련 로컬 상태
  const [showVolumeBar, setShowVolumeBar] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [liked, setLiked] = useState(false);
  const playerRef = useRef<any | null>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const volumeBtnRef = useRef<HTMLButtonElement>(null);
  const [volumeModalPos, setVolumeModalPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const volumeTrackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);

  // 유튜브 관련
  const getYoutubeId = (url?: string | null): string | undefined => {
    if (!url) return undefined;
    const match = url.match(/[?&]v=([^&#]+)/);
    return match ? match[1] : undefined;
  };
  const videoId = getYoutubeId(currentSong?.youtubeUrl);

  // 유튜브 이벤트 핸들러
  const onReady = (e: { target: any }) => {
    playerRef.current = e.target;
    playerRef.current?.setVolume?.(volume);
    setDuration(e.target.getDuration());
    setCurrentTime(e.target.getCurrentTime());
  };
  const onStateChange = (e: { data: number }) => {
    setIsPlaying(e.data === 1);
  };

  // 볼륨/진행바/컨트롤 핸들러
  useEffect(() => {
    if (playerRef.current) playerRef.current.setVolume?.(volume);
  }, [volume]);
  useEffect(() => {
    if (!showVolumeBar) return;
    const handleClick = (e: MouseEvent) => {
      if (volumeBarRef.current && !volumeBarRef.current.contains(e.target as Node))
        setShowVolumeBar(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showVolumeBar]);
  useEffect(() => {
    if (showVolumeBar && volumeBtnRef.current && volumeBarRef.current) {
      const btnRect = volumeBtnRef.current.getBoundingClientRect();
      const modalRect = volumeBarRef.current.getBoundingClientRect();
      const gap = 8;
      setVolumeModalPos({
        top: btnRect.top - modalRect.height - gap,
        left: btnRect.left + btnRect.width / 2 - modalRect.width / 2,
      });
    }
  }, [showVolumeBar]);
  const handlePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) playerRef.current.pauseVideo?.();
    else playerRef.current.playVideo?.();
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
  const increaseVolume = () => setVolume(Math.min(volume + 10, 100));
  const decreaseVolume = () => setVolume(Math.max(volume - 10, 0));
  const handleVolumeDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (!volumeTrackRef.current) return;
    const rect = volumeTrackRef.current.getBoundingClientRect();
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    let newVolume = 100 - ((y - rect.top) / rect.height) * 100;
    newVolume = Math.round(Math.max(0, Math.min(100, newVolume)));
    setVolume(newVolume);
    playerRef.current?.setVolume?.(newVolume);
  };
  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handleVolumeDrag(e);
    const onMouseMove = (moveEvent: MouseEvent) => handleVolumeDrag(moveEvent as any);
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${sec}`;
  };

  // 예외처리: 플레이리스트 없음
  if (!playlist || playlist.length === 0) {
    return (
      <div
        className="player-bar player-bar-loading"
        style={{ height: 65, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <span style={{ color: '#bcbcbc', fontSize: 16 }}>선택하신 곡이 없습니다.</span>
      </div>
    );
  }
  // 예외처리: 곡 정보 없음
  if (!currentSong) {
    return (
      <div
        className="player-bar player-bar-loading"
        style={{ height: 65, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <span style={{ color: '#bcbcbc', fontSize: 16 }}>곡 정보를 불러올 수 없습니다.</span>
      </div>
    );
  }

  return (
    <nav className="player-bar" aria-label="Music Player Controls">
      <div className="youtube-hidden">
        {currentSong.youtubeUrl && (
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
        )}
      </div>
      <div className="player-bar__main">
        <div className="player-bar__info-group">
          <CoverImage
            src={currentSong.imageUrl ?? undefined}
            alt={currentSong.title ?? undefined}
          />
          <div className="player-bar__info-text">
            <div className="player-bar__title-row">
              <span className="player-bar__title">{currentSong.title ?? 'Unknown'}</span>
              <button
                className="player-bar__icon-small player-bar__a11y-btn"
                aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={liked}
                tabIndex={0}
                onClick={() => setLiked((v) => !v)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setLiked((v) => !v)}
                type="button"
              >
                <FaHeart
                  style={{
                    marginLeft: 8,
                    marginRight: 8,
                    color: liked ? '#EF2F62' : undefined,
                    transition: 'color 0.2s',
                  }}
                />
                <span className="sr-only">
                  {liked ? 'Remove from favorites' : 'Add to favorites'}
                </span>
              </button>
              <button
                className="player-bar__icon-small player-bar__a11y-btn"
                aria-label="More options"
                tabIndex={0}
                type="button"
              >
                <FaEllipsisH />
                <span className="sr-only">More options</span>
              </button>
            </div>
            <div className="player-bar__artist">{currentSong.artist?.name ?? 'Unknown Artist'}</div>
            <div className="player-bar__source">PLAYING FROM: PLAYLIST</div>
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
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsShuffling((v) => !v)}
              type="button"
            >
              <FaRandom />
              <span className="sr-only">{isShuffling ? 'Disable shuffle' : 'Enable shuffle'}</span>
            </button>
            <button
              className="player-bar__icon player-bar__a11y-btn"
              aria-label="Previous"
              tabIndex={0}
              type="button"
              onClick={handlePrev}
            >
              <FaStepBackward />
              <span className="sr-only">Previous</span>
            </button>
            <button
              className={`player-bar__icon player-bar__a11y-btn${isPlaying ? ' active' : ''}`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              aria-pressed={isPlaying}
              tabIndex={0}
              onClick={handlePlayPause}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handlePlayPause()}
              type="button"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
              <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              className="player-bar__icon player-bar__a11y-btn"
              aria-label="Next"
              tabIndex={0}
              type="button"
              onClick={handleNext}
            >
              <FaStepForward />
              <span className="sr-only">Next</span>
            </button>
            <button
              className={`player-bar__icon player-bar__a11y-btn${isRepeating ? ' active' : ''}`}
              aria-label={isRepeating ? 'Disable repeat' : 'Enable repeat'}
              aria-pressed={isRepeating}
              tabIndex={0}
              onClick={() => setIsRepeating((v) => !v)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsRepeating((v) => !v)}
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
                onKeyDown={(e) => {
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
                  style={{
                    width: duration ? `${(currentTime / duration) * 100}%` : '0%',
                    transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
                  }}
                />
              </div>
            </div>
            <div className="player-bar__progress-time">{formatTime(duration)}</div>
          </div>
        </div>
        <div className="player-bar__right" role="group" aria-label="Other controls">
          <div className="volume-btn-wrapper">
            <button
              ref={volumeBtnRef}
              className="player-bar__icon player-bar__a11y-btn"
              aria-label="Volume"
              tabIndex={0}
              type="button"
              onClick={() => setShowVolumeBar((v) => !v)}
            >
              {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
              <span className="sr-only">Volume</span>
            </button>
            {showVolumeBar && (
              <div
                ref={volumeBarRef}
                className="volume-bar-floating"
                style={{ top: volumeModalPos.top, left: volumeModalPos.left }}
              >
                <div className="volume-display">{volume}</div>
                <div
                  ref={volumeTrackRef}
                  className="volume-track"
                  onMouseDown={handleVolumeMouseDown}
                  onTouchMove={handleVolumeDrag}
                  onTouchStart={handleVolumeDrag}
                >
                  <div className="volume-track__fill" style={{ height: `${volume}%` }} />
                </div>
                <div className="volume-controls">
                  <button className="volume-adjust-btn" onClick={increaseVolume}>
                    +
                  </button>
                  <button className="volume-adjust-btn" onClick={decreaseVolume}>
                    -
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            className="player-bar__icon player-bar__a11y-btn"
            aria-label="Cast to device"
            tabIndex={0}
            type="button"
          >
            <FaChromecast />
            <span className="sr-only">Cast to device</span>
          </button>
          <button
            className="player-bar__icon player-bar__a11y-btn"
            aria-label="Show playlist"
            tabIndex={0}
            type="button"
          >
            <FaBars />
            <span className="sr-only">Show playlist</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
