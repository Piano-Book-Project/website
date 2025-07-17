import { useCurrentSong } from '../hooks/useCurrentSong';
import { CoverImage } from './CoverImage';
import { FaRandom, FaStepBackward, FaPlay, FaStepForward, FaRedo, FaVolumeUp, FaChromecast, FaBars, FaChevronUp, FaHeart, FaEllipsisH, FaPause } from 'react-icons/fa';
import YouTube from 'react-youtube';
import { useRef, useState, useEffect } from 'react';

export default function PlayerBar() {
  const { data, isLoading, error } = useCurrentSong(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [liked, setLiked] = useState(false);

  // Format seconds to mm:ss
  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // YouTube event handlers
  const onReady = (e: any) => {
    playerRef.current = e.target;
    setDuration(e.target.getDuration());
    setCurrentTime(e.target.getCurrentTime());
  };
  const onStateChange = (e: any) => {
    setIsPlaying(e.data === 1);
  };
  // Poll current time for animation
  useEffect(() => {
    let interval: any;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        setCurrentTime(playerRef.current.getCurrentTime());
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo?.();
    } else {
      playerRef.current.playVideo?.();
    }
  };

  // Extract YouTube videoId from URL
  const getYoutubeId = (url?: string | null): string | undefined => {
    if (!url) return undefined;
    const match = url.match(/[?&]v=([^&#]+)/);
    return match ? match[1] : undefined;
  };

  // Seek when clicking the progress bar
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
    <div className="player-bar">
      {/* Hidden YouTube player for audio */}
      <div style={{ position: 'absolute', left: -9999, width: 0, height: 0 }}>
        <YouTube
          videoId={getYoutubeId(typeof data.youtubeUrl === 'string' ? data.youtubeUrl : undefined)}
          opts={{ height: '0', width: '0', playerVars: { controls: 0 } }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>
      <div className="player-bar__main">
        {/* Left: Song Info */}
        <div className="player-bar__info-group">
          <CoverImage src={data.imageUrl ?? undefined} alt={data.title ?? undefined} />
          <div className="player-bar__info-text">
            <div className="player-bar__title-row">
              <span className="player-bar__title">{data.title ?? 'Unknown'}</span>
              <FaHeart
                className="player-bar__icon-small"
                style={{ marginLeft: 8, marginRight: 8, color: liked ? '#EF2F62' : undefined, transition: 'color 0.2s' }}
                onClick={() => setLiked((v) => !v)}
              />
              <FaEllipsisH className="player-bar__icon-small" />
            </div>
            <div className="player-bar__artist">{data.artist?.name ?? 'Unknown Artist'}</div>
            <div className="player-bar__source">PLAI<span style={{letterSpacing:0}}>N</span>G FROM: COEXIST</div>
          </div>
        </div>
        {/* Center: Controls + Progress */}
        <div className="player-bar__center">
          <div className="player-bar__controls">
            <FaRandom
              className={`player-bar__icon${isShuffling ? ' active' : ''}`}
              onClick={() => setIsShuffling((v) => !v)}
            />
            <FaStepBackward className="player-bar__icon" />
            {isPlaying ? (
              <FaPause className="player-bar__icon active" onClick={handlePlayPause} />
            ) : (
              <FaPlay className="player-bar__icon" onClick={handlePlayPause} />
            )}
            <FaStepForward className="player-bar__icon" />
            <FaRedo
              className={`player-bar__icon${isRepeating ? ' active' : ''}`}
              onClick={() => setIsRepeating((v) => !v)}
            />
          </div>
          <div className="player-bar__progress-section" style={{ paddingTop: 8 }}>
            <div className="player-bar__progress-time">{formatTime(currentTime)}</div>
            <div className="player-bar__progress-bar-wrapper">
              <div className="player-bar__progress-bar" onClick={handleProgressClick} style={{ cursor: 'pointer' }}>
                <div
                  className="player-bar__progress-bar-fill"
                  style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%', transition: 'width 0.3s cubic-bezier(.4,0,.2,1)' }}
                />
              </div>
            </div>
            <div className="player-bar__progress-time">{formatTime(duration)}</div>
          </div>
        </div>
        {/* Right: Volume/Cast/Menu/Expand */}
        <div className="player-bar__right">
          <FaVolumeUp className="player-bar__icon" />
          <FaChromecast className="player-bar__icon" />
          <FaBars className="player-bar__icon" />
        </div>
      </div>
    </div>
  );
}
