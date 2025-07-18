import { useCurrentSong } from '../hooks/useCurrentSong';
import { CoverImage } from './CoverImage';
import { FaRandom, FaStepBackward, FaPlay, FaStepForward, FaRedo, FaVolumeUp, FaChromecast, FaBars, FaHeart, FaEllipsisH, FaPause } from 'react-icons/fa';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { useRef, useState, useEffect } from 'react';

export default function PlayerBar() {
  const { data, isLoading, error } = useCurrentSong(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [liked, setLiked] = useState(false);

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const onReady = (e: { target: YouTubePlayer }) => {
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

  if (isLoading) {
    return (
      <div className="player-bar" style={{ height: 65 }}>
        Loading...
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="player-bar" style={{ height: 65 }}>
        <span className="text-red-400">No song found</span>
      </div>
    );
  }

  return (
    <nav className="player-bar" aria-label="Music Player Controls">
      <div style={{ position: 'absolute', left: -9999, width: 0, height: 0 }}>
        <YouTube
          videoId={getYoutubeId(typeof data.youtubeUrl === 'string' ? data.youtubeUrl : undefined)}
          opts={{ height: '0', width: '0', playerVars: { controls: 0 } }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>
      <div className="player-bar__main">
        <div className="player-bar__info-group">
          <CoverImage src={data.imageUrl ?? undefined} alt={data.title ?? undefined} />
          <div className="player-bar__info-text">
            <div className="player-bar__title-row">
              <span className="player-bar__title">{data.title ?? 'Unknown'}</span>
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
            <div className="player-bar__artist">{data.artist?.name ?? 'Unknown Artist'}</div>
            <div className="player-bar__source">PLAI<span style={{letterSpacing:0}}>N</span>G FROM: COEXIST</div>
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
            <button className="player-bar__icon player-bar__a11y-btn" aria-label="Previous" tabIndex={0} type="button">
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
            <button className="player-bar__icon player-bar__a11y-btn" aria-label="Next" tabIndex={0} type="button">
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
              <FaRedo />
              <span className="sr-only">{isRepeating ? 'Disable repeat' : 'Enable repeat'}</span>
            </button>
          </div>
          <div className="player-bar__progress-section" style={{ paddingTop: 8 }}>
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
          <button className="player-bar__icon player-bar__a11y-btn" aria-label="Volume" tabIndex={0} type="button">
            <FaVolumeUp />
            <span className="sr-only">Volume</span>
          </button>
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
