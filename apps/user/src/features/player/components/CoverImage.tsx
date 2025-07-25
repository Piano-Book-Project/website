import { useState } from 'react';

const MusicIcon = () => (
  <svg className="cover-image__placeholder" fill="currentColor" viewBox="0 0 20 20">
    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
  </svg>
);

export function CoverImage({ src, alt }: { src?: string; alt?: string }) {
  const [error, setError] = useState(false);
  return (
    <div className="cover-image">
      {!error && src ? (
        <img src={src} alt={alt} className="cover-image__img" onError={() => setError(true)} />
      ) : (
        <MusicIcon />
      )}
    </div>
  );
}
