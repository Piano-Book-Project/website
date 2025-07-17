import { useCurrentSong } from '../hooks/useCurrentSong';
import { CoverImage } from './CoverImage';

export default function PlayerBar() {
  const { data, isLoading, error } = useCurrentSong(1);

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
    <div className="player-bar" style={{ height: 65 }}>
      <div className="player-bar__content" style={{ maxWidth: 420 }}>
        <CoverImage src={data.imageUrl ?? undefined} alt={data.title ?? undefined} />
        <div
          className="ml-3"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontWeight: 'bold',
              color: '#fcfcfc',
              fontSize: 13,
              lineHeight: '16px',
              marginBottom: 4,
            }}
          >
            늘 (Ever)
          </span>
          <span
            style={{
              fontWeight: 'bold',
              color: '#fcfcfc',
              fontSize: 16,
              lineHeight: '20px',
              marginBottom: 4,
            }}
          >
            Hebi.
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#fcfcfc',
              letterSpacing: '0.04em',
              lineHeight: '16px',
            }}
          >
            CHU PIANO
          </span>
        </div>
      </div>
    </div>
  );
}
